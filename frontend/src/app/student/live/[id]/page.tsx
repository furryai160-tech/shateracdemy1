'use client';

import { use, useState, useEffect } from 'react';
import { SecureLivePlayer } from '../../../../components/student/SecureLivePlayer';
import { LiveChat } from '../../../../components/LiveChat/LiveChat';
import { fetchAPI } from '../../../../lib/api';
import { Loader2 } from 'lucide-react';

export default function LiveRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLesson = async () => {
            try {
                // Here you would fetch from your backend that connects to Prisma LiveLesson
                // const data = await fetchAPI(\`/live-lessons/\${id}\`);
                // For now, mocking data assuming it uses Youtube
                const data = { id, title: 'حصة البث المباشر (تجريبي)', youtube_id: 'aqz-KE-bpKQ', is_live: true };
                setLesson(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadLesson();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-bold text-2xl">
                البث غير متاح
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 p-4 gap-4" dir="rtl">
            {/* Main Video Section */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
                    <SecureLivePlayer sessionId={lesson.id} youtubeId={lesson.youtube_id} />
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h1 className="text-2xl font-bold text-white mb-2">{lesson.title}</h1>
                    <div className="flex items-center gap-3 text-sm font-medium">
                        {lesson.is_live ? (
                            <span className="flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                مباشر الآن
                            </span>
                        ) : (
                            <span className="text-slate-400 bg-slate-800 px-3 py-1 rounded-full">منتهي</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Section */}
            <div className="w-full md:w-96 h-[500px] md:h-auto flex-shrink-0">
                <LiveChat sessionId={lesson.id} />
            </div>
        </div>
    );
}
