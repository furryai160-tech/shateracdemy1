'use client';

import { useState } from 'react';
import { Settings, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { fetchAPI } from '../../../../src/lib/api';

export default function AdminSettingsPage() {
    const [deleteText, setDeleteText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleFactoryReset = async () => {
        if (deleteText !== 'DELETE_ALL') return;

        if (!confirm('هل أنت متأكد بنسبة 100% أنك تريد مسح كل المنصة؟ هذا الإجراء لا يمكن التراجع عنه أبداً.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await fetchAPI('/admin/factory-reset', { method: 'DELETE' });
            alert('تم مسح جميع بيانات المنصة وعادت كأنها جديدة بنجاح!');
            setDeleteText('');
            window.location.reload();
        } catch (error: any) {
            console.error('Failed to factory reset', error);
            alert(error.message || 'حدث خطأ أثناء مسح المنصة');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6" dir="rtl">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <Settings size={32} className="text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">إعدادات المنصة</h1>
                    <p className="text-slate-500">إدارة الإعدادات العامة والنظام الداخلي.</p>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-3xl p-8 mt-12">
                <div className="flex items-center gap-3 mb-4 text-red-600">
                    <AlertTriangle size={24} />
                    <h2 className="text-xl font-bold">منطقة الخطر (إعادة ضبط المصنع)</h2>
                </div>
                <p className="text-red-800/80 dark:text-red-300 text-sm mb-6 leading-relaxed">
                    تحذير: هذا الإجراء سيقوم بحذف <strong className="font-bold underline">كافة بيانات المنصة بالكامل</strong> (المعلمين، الطلاب، الكورسات، الدروس، الاختبارات، الدفعات، الاشتراك) باستثناء حسابك الحالي (الإدارة العليا). لا يمكن التراجع عن هذا الإجراء أبداً.
                </p>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-red-100 dark:border-red-900/20">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                        لتأكيد الحذف النهائي، يرجى كتابة <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-red-600 font-bold select-all">DELETE_ALL</span> في الخانة بالأسفل:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            type="text"
                            placeholder="اكتب DELETE_ALL للتأكيد"
                            dir="ltr"
                            value={deleteText}
                            onChange={(e) => setDeleteText(e.target.value)}
                            className="flex-1 w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-mono placeholder:font-sans"
                        />
                        <button
                            onClick={handleFactoryReset}
                            disabled={deleteText !== 'DELETE_ALL' || isDeleting}
                            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${deleteText === 'DELETE_ALL'
                                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 active:scale-95 cursor-pointer'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {isDeleting ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Trash2 size={20} />
                            )}
                            احذف جميع بيانات المنصة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
