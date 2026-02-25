'use client';

import { Construction, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentStreamViewer() {
    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900" dir="rtl">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 text-center shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="bg-amber-100 dark:bg-amber-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction className="w-12 h-12 text-amber-600 dark:text-amber-500" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    404
                </h1>
                <h2 className="text-xl font-semibold px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full inline-block mb-4 border border-indigo-100 dark:border-indigo-500/20">
                    جاري التحديث والتطوير 🚀
                </h2>

                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    نعمل حالياً على تطوير وتحديث نظام استوديو البث المباشر لتقديم تجربة احترافية أفضل لكم. نعتذر عن هذا الإزعاج المؤقت وسنعود قريباً جداً.
                </p>

                <Link
                    href="/student/dashboard/live"
                    className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3.5 px-6 rounded-xl transition-all"
                >
                    العودة إلى الصفحة السابقة
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
