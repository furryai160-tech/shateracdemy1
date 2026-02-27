'use client';

import { useState, useEffect } from 'react';
import { Video, Plus, Calendar, Clock, Trash2, Tag, Play } from 'lucide-react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';

// Types for Live Session
interface LiveSession {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    course: { title: string };
    teacher: { name: string };
    status: 'SCHEDULED' | 'LIVE' | 'ENDED';
}

interface Course {
    id: string;
    title: string;
}

export default function LiveSessionsPage() {
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSession, setNewSession] = useState({ title: '', description: '', courseId: '', scheduledAt: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchSessions = async () => {
        try {
            const data = await fetchAPI('/live-sessions');
            setSessions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const data = await fetchAPI('/courses/teacher');
            setCourses(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSessions();
        fetchCourses();
    }, []);

    const handleAddSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await fetchAPI('/live-sessions', {
                method: 'POST',
                body: JSON.stringify(newSession)
            });

            await fetchSessions();
            setShowAddModal(false);
            setNewSession({ title: '', description: '', courseId: '', scheduledAt: '' });
        } catch (err: any) {
            setError(err.message || 'Error creating session');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-50/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-indigo-100 dark:border-slate-700/50">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        البث المباشر (الجلسات التفاعلية)
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
                        قم بجدولة حصص تفاعلية مباشرة مع طلابك.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    جدولة بث جديد
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">جاري تحميل الجلسات...</div>
            ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                    <div className="bg-indigo-50 dark:bg-slate-700/50 p-6 rounded-full mb-4">
                        <Video className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">لا توجد جلسات مجدولة</h3>
                    <p className="text-center text-slate-500 dark:text-slate-400 max-w-sm">
                        يمكنك جدولة بث مباشر للتفاعل مع الطلاب من خلال الضغط على زر الإضافة
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions.map((session) => (
                        <div key={session.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${session.status === 'LIVE' ? 'bg-red-100 text-red-600' : session.status === 'ENDED' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {session.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>}
                                    {session.status === 'LIVE' ? 'خارج الآن' : session.status === 'ENDED' ? 'منتهي' : 'مجدول'}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{session.title}</h3>
                            {session.description && <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{session.description}</p>}

                            <div className="space-y-2 mt-auto text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    <span>الدورة: {session.course?.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(session.scheduledAt).toLocaleDateString('ar-EG')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(session.scheduledAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                                <Link href={`/dashboard/live/${session.id}`} className="flex-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                    <Play className="w-4 h-4" />
                                    استوديو البث
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Session Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">جدولة جلسة جديدة</h2>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl mb-4 border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAddSession} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    عنوان الجلسة
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newSession.title}
                                    onChange={e => setNewSession({ ...newSession, title: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="مثال: مراجعة الفصل الأول"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    الدورة المرتبطة
                                </label>
                                <select
                                    required
                                    value={newSession.courseId}
                                    onChange={e => setNewSession({ ...newSession, courseId: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">-- اختر الدورة --</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    موعد الجلسة
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={newSession.scheduledAt}
                                    onChange={e => setNewSession({ ...newSession, scheduledAt: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    dir="ltr"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    الوصف (اختياري)
                                </label>
                                <textarea
                                    value={newSession.description}
                                    onChange={e => setNewSession({ ...newSession, description: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    rows={3}
                                    placeholder="تفاصيل إضافية للطلاب..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2.5 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium rounded-xl transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex justify-center items-center"
                                >
                                    {submitting ? 'جاري الحفظ...' : 'جدولة البث'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
