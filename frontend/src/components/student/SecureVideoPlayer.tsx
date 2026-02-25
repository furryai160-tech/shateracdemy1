
import { useState, useEffect, useRef } from 'react';
import { Loader2, PlayCircle, AlertCircle, Maximize, Minimize } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

interface SecureVideoPlayerProps {
    videoId: string;
    provider: 'VDOCIPHER' | 'BUNNY' | 'YOUTUBE' | 'LOCAL';
    title: string;
}

export function SecureVideoPlayer({ videoId, provider, title }: SecureVideoPlayerProps) {
    const [playbackInfo, setPlaybackInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [watermarkPosition, setWatermarkPosition] = useState({ top: '10%', left: '10%' });

    // Hooks must be called before conditional returns
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isObscured, setIsObscured] = useState(false);

    useEffect(() => {
        // Anti-Screen Record & Anti-Screenshot Logic (Software Level)
        const handleBlur = () => setIsObscured(true);
        const handleFocus = () => setIsObscured(false);

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block PrintScreen or typical screenshot shortcuts (Cmd+Shift+3/4 on Mac, Win+Shift+S)
            if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey) || (e.ctrlKey && e.key === 'p')) {
                setIsObscured(true);
                // Clear the copied data and return to normal after short delay
                setTimeout(() => setIsObscured(false), 2000);
            }
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);
    useEffect(() => {
        if (!videoId) {
            setLoading(false);
            return;
        }

        const loadUserAndPlayback = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch secure playback info and user profile in parallel
                const [playbackData, userData] = await Promise.all([
                    fetchAPI(`/video/info?videoId=${encodeURIComponent(videoId)}&provider=${provider}`),
                    fetchAPI('/auth/profile')
                ]);

                setPlaybackInfo(playbackData);
                setUser(userData);
            } catch (err) {
                console.error("Failed to load video data", err);
                setError("Failed to load video player. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadUserAndPlayback();
    }, [videoId, provider]);

    // Randomize watermark position every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const top = Math.floor(Math.random() * 80) + 10 + '%';
            const left = Math.floor(Math.random() * 80) + 10 + '%';
            setWatermarkPosition({ top, left });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!videoId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white/50 gap-4 bg-black">
                <PlayCircle size={64} className="opacity-50" />
                <p className="text-lg font-medium">No video content available</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-black text-white">
                <Loader2 size={40} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-black text-white gap-3">
                <AlertCircle size={40} className="text-red-500" />
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };
    const WatermarkOverlay = () => (
        user ? (
            <div
                className="absolute text-red-500/80 text-sm font-bold pointer-events-none select-none z-50 font-mono tracking-widest drop-shadow-md"
                style={{ top: watermarkPosition.top, left: watermarkPosition.left }}
            >
                {user.phone || user.email} <br /> {user.userId}
            </div>
        ) : null
    );

    const FullscreenButton = () => (
        <button
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 z-[60] bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-xl border border-white/10 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={isFullscreen ? 'تصغير الشاشة' : 'تكبير الشاشة'}
        >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
    );

    const activeProvider = playbackInfo?.provider || provider;
    const activeVideoId = playbackInfo?.videoId || videoId;

    return (
        <div ref={containerRef} className="w-full h-full bg-black relative group overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
            <WatermarkOverlay />

            {/* Anti-Recording Blackout Layer */}
            {isObscured && (
                <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center text-red-500">
                    <AlertCircle size={48} className="mb-4" />
                    <h2 className="text-xl font-bold">تنبيه أمني</h2>
                    <p className="mt-2 text-white/70 text-sm max-w-sm text-center">
                        لأسباب تتعلق بحقوق الملكية، يتم إيقاف عرض الفيديو عند محاولة تصوير الشاشة أو مغادرة النافذة.
                    </p>
                </div>
            )}

            {/* Show custom fullscreen button only for iframe providers or on hover for local*/}
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isObscured ? 'hidden' : ''}`}>
                <FullscreenButton />
            </div>

            {activeProvider === 'VDOCIPHER' && (
                <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                        <p className="font-mono text-xs text-green-400 mb-2">SECURE PLAYBACK ACTIVE</p>
                        <p>Vdocipher Player Stub</p>
                        <p className="text-xs text-slate-500 mt-1">OTP: {playbackInfo?.otp}</p>
                    </div>
                </div>
            )}

            {activeProvider === 'BUNNY' && (
                <iframe
                    src={playbackInfo?.url}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                // Note: allowFullScreen is removed so user clicks our custom button to fullscreen the container!
                />
            )}

            {activeProvider === 'YOUTUBE' && (
                <iframe
                    src={playbackInfo?.url || `https://www.youtube.com/embed/${activeVideoId}?rel=0&fs=0`} // fs=0 disables standard YT fullscreen
                    className="w-full h-full"
                    title={title}
                // allowFullScreen removed
                />
            )}

            {activeProvider === 'LOCAL' && (
                <video
                    controls
                    controlsList="nodownload nofullscreen" // Disables standard HTML5 fullscreen
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-contain"
                    src={playbackInfo?.url}
                >
                    Your browser does not support the video tag.
                </video>
            )}

            {!['VDOCIPHER', 'BUNNY', 'YOUTUBE', 'LOCAL'].includes(activeProvider) && (
                <div className="bg-black text-white p-4 h-full flex justify-center items-center">Unknown Provider</div>
            )}
        </div>
    );
}
