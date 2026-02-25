import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoService {
    constructor(private configService: ConfigService) { }

    async getPlaybackInfo(videoId: string, provider: 'VDOCIPHER' | 'BUNNY' | 'YOUTUBE' | 'LOCAL') {
        const isYoutubeUrl = typeof videoId === 'string' && (videoId.includes('youtube.com') || videoId.includes('youtu.be'));
        if (isYoutubeUrl) {
            provider = 'YOUTUBE';
        }

        const isGoogleDrive = typeof videoId === 'string' && videoId.includes('drive.google.com');
        if (isGoogleDrive) {
            // Convert to preview link
            const previewUrl = videoId.replace(/\/view.*$/, '/preview');
            return {
                url: previewUrl,
                provider: 'BUNNY' // We use BUNNY provider in frontend as a generic iframe renderer for now
            };
        }

        switch (provider) {
            case 'VDOCIPHER':
                return this.getVdocipherOtp(videoId);
            case 'BUNNY':
                return this.getBunnySignature(videoId);
            case 'LOCAL':
                return {
                    url: `${this.configService.get('API_URL') || 'http://localhost:4000'}/uploads/${videoId.split('/').pop()}`,
                    provider: 'LOCAL'
                };
            case 'YOUTUBE':
                let ytId = videoId;
                if (typeof videoId === 'string' && videoId.includes('http')) {
                    // Extract exactly 11 characters ID from various YT formats including shorts
                    const match = videoId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
                    if (match && match[1]) {
                        ytId = match[1];
                    }
                }
                return {
                    videoId: ytId,
                    url: `https://www.youtube.com/embed/${ytId}?rel=0`,
                    provider: 'YOUTUBE'
                };
            default:
                throw new Error('Invalid video provider');
        }
    }

    private async getVdocipherOtp(videoId: string) {
        const secret = this.configService.get('VDOCIPHER_SECRET');
        if (!secret) {
            console.warn('VDOCIPHER_SECRET not configured');
            return { error: 'Vdocipher not configured' };
        }

        return {
            otp: 'mock_otp_' + Date.now(),
            playbackInfo: 'mock_playback_info_' + videoId,
            provider: 'VDOCIPHER'
        };
    }

    private async getBunnySignature(videoId: string) {
        const key = this.configService.get('BUNNY_API_KEY');
        if (!key) {
            console.warn('BUNNY_API_KEY not configured, using fallback video');
            return {
                url: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
                provider: 'LOCAL'
            };
        }

        const libraryId = this.configService.get('BUNNY_LIBRARY_ID') || '12345';
        return {
            url: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=mock_token`,
            provider: 'BUNNY'
        };
    }
}
