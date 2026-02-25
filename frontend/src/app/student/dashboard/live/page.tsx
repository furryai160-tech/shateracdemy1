'use client';

import { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Play } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LiveSession {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    course: { title: string };
    teacher: { name: string };
    status: 'SCHEDULED' | 'LIVE' | 'ENDED';
}

export default function StudentLiveSessions() {
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/live-sessions', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok) throw new Error('Failed to fetch sessions');
            const data = await res.json();
            setSessions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-50/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-indigo-100 dark:border-slate-700/50">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        البث المباشر (حصص الأونلاين)
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
                        تابع الحصص التفاعلية مع معلميك وانضم إليها في موعدها.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">جاري تحميل الجلسات...</div>
            ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                    <div className="bg-indigo-50 dark:bg-slate-700/50 p-6 rounded-full mb-4">
                        <Video className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">لا توجد حصص مجدولة حالياً</h3>
                    <p className="text-center text-slate-500 dark:text-slate-400 max-w-sm">
                        يمكنك متابعة باقي الدورات لحين توفير المعلمين لحصص بث مباشر.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions.map((session) => (
                        <div key={session.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${session.status === 'LIVE' ? 'bg-red-100 text-red-600 ring-1 ring-red-500/30 shadow-sm' : session.status === 'ENDED' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {session.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>}
                                    {session.status === 'LIVE' ? 'البث جاري الآن' : session.status === 'ENDED' ? 'منتهية' : 'مجدولة'}
                                </span>
                            </div>

                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{session.title}</h3>
                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">{session.teacher?.name}</p>

                            <div className="space-y-2 mt-auto text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> التاريخ:</span>
                                    <span className="font-medium">{new Date(session.scheduledAt).toLocaleDateString('ar-EG', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4" /> الوقت:</span>
                                    <span className="font-medium">{new Date(session.scheduledAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex">
                                <button
                                    onClick={() => router.push(`/student/dashboard/live/${session.id}`)}
                                    disabled={session.status === 'ENDED'}
                                    className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${session.status === 'LIVE'
                                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 ring-4 ring-white dark:ring-slate-900 border border-red-700'
                                            : session.status === 'SCHEDULED'
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {session.status === 'LIVE' ? (
                                        <>
                                            <Video className="w-5 h-5" />
                                            انضم للبث الآن
                                        </>
                                    ) : session.status === 'SCHEDULED' ? (
                                        <>
                                            <Calendar className="w-5 h-5" />
                                            دخول غرفة الانتظار
                                        </>
                                    ) : (
                                        'الجلسة منتهية'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
