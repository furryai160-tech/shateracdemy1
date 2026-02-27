'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { Video, Settings, Play, Link as LinkIcon, Save, ArrowRight, Activity, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export default function StreamStudio({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Live Setting States
    const [youtubeId, setYoutubeId] = useState('');
    const [isLive, setIsLive] = useState(false);

    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const loadLesson = async () => {
            try {
                // Fetch existing lesson data
                const data = await fetchAPI(`/live-sessions/${id}`);
                setLesson(data);
                // Also fetch youtube stream status if exists from a separate endpoint or it comes with lesson
                // We'll mock it for now based on previous lesson data
                const yId = data.youtubeId || '';
                setYoutubeId(yId);
                setIsLive(data.status === 'LIVE');
            } catch (err) {
                console.error(err);
                setMessage({ text: 'حدث خطأ في تحميل البيانات', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        loadLesson();
    }, [id]);

    const handleSaveStream = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            // Extract ID if user pastes full Youtube URL
            let finalYoutubeId = youtubeId;
            if (youtubeId.includes('youtube.com') || youtubeId.includes('youtu.be')) {
                const match = youtubeId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
                if (match && match[1]) {
                    finalYoutubeId = match[1];
                    setYoutubeId(finalYoutubeId);
                } else {
                    throw new Error('رابط يوتيوب غير صالح.');
                }
            }

            if (!finalYoutubeId) throw new Error('يرجى إدخال الرابط أو ID الفيديو.');

            // Update backend (Assumption: API supports PATCH /live-sessions/:id)
            await fetchAPI(`/live-sessions/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ youtubeId: finalYoutubeId, status: isLive ? 'LIVE' : 'SCHEDULED' })
            });

            setMessage({ text: 'تم تحديث الرابط بنجاح!', type: 'success' });

        } catch (err: any) {
            setMessage({ text: err.message || 'حدث خطأ أثناء الحفظ', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const toggleLiveStatus = async () => {
        const newStatus = !isLive;
        setSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            await fetchAPI(`/live-sessions/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus ? 'LIVE' : 'ENDED' })
            });
            setIsLive(newStatus);
            setMessage({ text: newStatus ? 'تم تشغيل البث للطلاب!' : 'تم إنهاء البث.', type: 'success' });
        } catch (err: any) {
            setMessage({ text: err.message || 'حدث خطأ أثناء تغيير الحالة', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] p-6 bg-slate-50 dark:bg-slate-900" dir="rtl">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Nav */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/live" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        استوديو البث: {lesson?.title || 'جاري التحميل...'}
                    </h1>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Stream Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                                <Settings className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">إعدادات البث (Youtube Unlisted)</h2>
                            </div>

                            <form onSubmit={handleSaveStream} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        رابط البث أو ID الفيديو (من استوديو منشئي المحتوى)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={youtubeId}
                                            onChange={(e) => setYoutubeId(e.target.value)}
                                            placeholder="مثال: https://youtu.be/aqz-KE-bpKQ"
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-left focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all disabled:opacity-50"
                                            dir="ltr"
                                            disabled={isLive}
                                        />
                                        <LinkIcon className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        قم بإنشاء بث "غير مدرج" على يوتيوب، ثم انسخ الرابط والصقه هنا. لا تقم بتعديل الرابط أثناء البث لمنع انقطاعه عن الطلاب.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || isLive || !youtubeId}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    حفظ رابط البث
                                </button>
                            </form>
                        </div>

                        {/* Preview / Controls */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Play className="w-5 h-5 text-indigo-500" />
                                    التحكم الرئيسي
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">الحالة:</span>
                                    {isLive ? (
                                        <span className="flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50/50 dark:bg-red-500/10 px-3 py-1 rounded-full border border-red-200 dark:border-red-500/20">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                            بث مباشر (للطلاب)
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                                            متوقف / مجدول
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {isLive ? (
                                    <button
                                        onClick={toggleLiveStatus}
                                        disabled={submitting}
                                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 py-4 rounded-xl font-bold flex flex-col items-center gap-2 transition-colors border border-red-200 dark:border-red-500/30"
                                    >
                                        إيقاف البث فوراً
                                        <span className="text-xs font-normal opacity-80">ستنقطع الصورة عن جميع الطلاب</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={toggleLiveStatus}
                                        disabled={submitting || !youtubeId}
                                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-500/20 dark:hover:bg-green-500/30 dark:text-green-400 py-4 rounded-xl font-bold flex flex-col items-center gap-2 transition-colors border border-green-200 dark:border-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Go Live - تشغيل البث للطلاب
                                        <span className="text-xs font-normal opacity-80">تأكد من بدء البث من يوتيوب/OBS أولاً</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Activity className="w-32 h-32" />
                            </div>
                            <h3 className="font-bold text-xl mb-6 relative">معلومات البث</h3>

                            <div className="space-y-6 relative">
                                <div>
                                    <div className="text-indigo-200 text-sm mb-1 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        الطلاب المتصلين حالياً
                                    </div>
                                    <div className="text-4xl font-black tabular-nums">
                                        {/* Mock Number, you can replace with Supabase Realtime presence count */}
                                        {isLive ? Math.floor(Math.random() * 50) + 10 : 0}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 leading-relaxed shadow-sm">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                <Eye className="w-4 h-4 text-amber-500" />
                                ملاحظة هامة جداً
                            </h4>
                            <p>
                                النظام يعتمد على إخفاء أزرار اليوتيوب ووضع طبقة حماية شفافة. الطالب سيشاهد الفيديو بملء الشاشة ولا يمكنه النقر أو تسريعه.
                                كما أن هناك تتبعاً تلقائياً للأجهزة لضمان عدم دخول الطالب من جهازين في نفس الوقت.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
