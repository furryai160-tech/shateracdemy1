
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('video')
@UseGuards(AuthGuard('jwt'))
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @Get('info')
    async getPlaybackInfo(
        @Query('videoId') videoId: string,
        @Query('provider') provider: 'VDOCIPHER' | 'BUNNY' | 'YOUTUBE' | 'LOCAL'
    ) {
        return this.videoService.getPlaybackInfo(videoId, provider);
    }
}
