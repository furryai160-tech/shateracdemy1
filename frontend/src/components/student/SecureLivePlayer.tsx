'use client';

import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { supabase } from '@/lib/supabase';
import { Loader2, Maximize, Minimize, AlertCircle } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

interface SecureLivePlayerProps {
    sessionId: string;
    youtubeId: string;
}

export function SecureLivePlayer({ sessionId, youtubeId }: SecureLivePlayerProps) {
    const [user, setUser] = useState<any>(null);
    const [watermarkPos, setWatermarkPos] = useState({ top: '10%', left: '10%' });
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockReason, setBlockReason] = useState<string | null>(null);

    // Fetch User
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await fetchAPI('/auth/profile');
                setUser(userData);
            } catch (err) {
                console.error('Failed to load user', err);
            }
        };
        loadUser();
    }, []);

    // Ping System - Single Device
    useEffect(() => {
        if (!user || isBlocked) return;

        let intervalId: NodeJS.Timeout;
        const currentDeviceId = Math.random().toString(36).substring(7);

        const pingPresence = async () => {
            try {
                // Update User's last ping and device id in Supabase
                const { data, error } = await supabase
                    .from('live_session_presence')
                    .upsert({
                        session_id: sessionId,
                        user_id: user.id,
                        device_id: currentDeviceId,
                        last_ping: new Date().toISOString()
                    }, { onConflict: 'session_id, user_id' })
                    .select();

                if (error) throw error;
            } catch (err) {
                console.error("Ping failed:", err);
            }
        };

        const checkMultiplePhones = async () => {
            try {
                const { data, error } = await supabase
                    .from('live_session_presence')
                    .select('device_id')
                    .eq('session_id', sessionId)
                    .eq('user_id', user.id)
                    .single();

                if (data && data.device_id !== currentDeviceId) {
                    setIsBlocked(true);
                    setBlockReason("تم اكتشاف تسجيل دخول من جهاز آخر. تم إيقاف البث.");
                    clearInterval(intervalId);
                }
            } catch (e) {
                console.error("Check failed:", e);
            }
        };

        // Initial Ping
        pingPresence();

        // Setup Interval
        intervalId = setInterval(() => {
            pingPresence();
            checkMultiplePhones();
        }, 10000); // 10 seconds ping

        return () => clearInterval(intervalId);
    }, [user, sessionId, isBlocked]);

    // Watermark - Moves every 7 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const top = Math.floor(Math.random() * 80) + 10 + '%';
            const left = Math.floor(Math.random() * 80) + 10 + '%';
            setWatermarkPos({ top, left });
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    };

    if (isBlocked) {
        return (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center text-red-500 p-6 text-center rounded-2xl">
                <AlertCircle size={64} className="mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold mb-2">تنبيه أمني</h2>
                <p className="text-white/80">{blockReason}</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-black relative group overflow-hidden rounded-2xl flex items-center justify-center"
            onContextMenu={(e) => e.preventDefault()} // Prevent Right Click
        >
            {/* React Player */}
            <div className="absolute inset-0 pointer-events-none">
                {(() => {
                    const Player: any = ReactPlayer;
                    return (
                        <Player
                            url={`https://www.youtube.com/watch?v=${youtubeId}`}
                            width="100%"
                            height="100%"
                            playing={true}
                            controls={false} // Disable Controls completely
                            config={{
                                youtube: {
                                    playerVars: {
                                        disablekb: 1, // Disable keyboard controls
                                        modestbranding: 1,
                                        rel: 0,
                                        fs: 0 // Disable full screen button
                                    }
                                } as any
                            }}
                        />
                    );
                })()}
            </div>

            {/* Protection Overlay to disable interactions with video */}
            <div className="absolute inset-0 z-10 w-full h-full opacity-0" onContextMenu={(e) => e.preventDefault()} />

            {/* Dynamic Watermark Overlay */}
            {user && (
                <div
                    className="absolute text-white/50 bg-black/30 px-3 py-1 rounded-xl text-lg font-bold pointer-events-none select-none z-50 font-sans tracking-widest drop-shadow-md transition-all duration-1000 ease-in-out"
                    style={{ top: watermarkPos.top, left: watermarkPos.left }}
                >
                    {user.name} <br /> {user.phone}
                </div>
            )}

            {/* Custom Fullscreen Button */}
            <button
                onClick={toggleFullscreen}
                className="absolute bottom-4 right-4 z-[60] bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-xl border border-white/10 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-0 group-hover:opacity-100"
                title={isFullscreen ? 'تصغير الشاشة' : 'تكبير الشاشة'}
            >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
        </div>
    );
}
