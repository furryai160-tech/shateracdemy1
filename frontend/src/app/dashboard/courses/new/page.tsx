'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronLeft, Upload } from 'lucide-react';
import { fetchAPI } from '../../../../lib/api';
import Link from 'next/link';

export default function CreateCoursePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        thumbnail: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [adminReturn, setAdminReturn] = useState(false);

    // Get searchParams using standard web API if not using next/navigation hooks for search params
    // But since it's a client component we can just read window.location
    useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setTenantId(params.get('tenantId'));
            setAdminReturn(params.get('adminReturn') === 'true');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Mock tenantId for now, in a real app this comes from user session or context
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            // If no user/tenant found, we might need to handle that, 
            // but for now let's assume the user has a tenantId or we use a fallback/placeholder
            // The schema requires tenantId. 
            // Important: The backend should ideally infer tenantId from the logged-in user if they are a teacher.
            // For this MVP step let's ensure we send something valid if possible, or update backend to handle it.

            // Let's assume the user object has a tenantId (if seeded) or we might need to create a tenant first.
            // For simplicity in this step, let's just send the data.
            // Note: Backend DTO expects tenantId.

            const payload = {
                ...formData,
                price: Number(formData.price),
                tenantId: tenantId || user?.tenantId || '968eee94-351d-4fd6-8819-ba5f86b9612d' // Fallback for dev
            };

            await fetchAPI('/courses', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (adminReturn) {
                router.push('/admin/courses');
            } else {
                router.push('/dashboard/courses');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create course');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto" dir="rtl">
            <div className="mb-6">
                <button
                    onClick={() => adminReturn ? router.push('/admin/courses') : router.push('/dashboard/courses')}
                    className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-4 gap-1"
                >
                    <ChevronLeft size={20} className="rotate-180" />
                    العودة للكورسات
                </button>
                <h1 className="text-3xl font-bold">إنشاء كورس جديد</h1>
                <p className="text-slate-500 mt-2">ابدأ بإعداد التفاصيل الأساسية للكورس.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">اسم الكورس</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            placeholder="مثال: لغة عربية الصف الأول"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">الوصف</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                            placeholder="ما الذي سيتعلمه الطلاب في هذا الكورس؟"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">السعر (ج.م)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">رابط صورة الغلاف</label>
                            <input
                                type="url"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                placeholder="https://..."
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    جاري الإنشاء...
                                </>
                            ) : (
                                'إنشاء الكورس'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
