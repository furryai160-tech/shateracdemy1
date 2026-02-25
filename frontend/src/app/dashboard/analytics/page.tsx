'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { fetchAPI } from '../../../lib/api';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await fetchAPI('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'إجمالي الطلاب',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/40'
        },
        {
            title: 'الكورسات المتاحة',
            value: stats?.totalCourses || 0,
            icon: BookOpen,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100 dark:bg-indigo-900/40'
        },
        {
            title: 'إجمالي الاشتراكات',
            value: stats?.totalEnrollments || 0,
            icon: GraduationCap,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/40'
        },
        {
            title: 'الإيرادات المقدرة',
            value: `${stats?.revenue || 0} ج.م`,
            icon: DollarSign,
            color: 'text-amber-600',
            bg: 'bg-amber-100 dark:bg-amber-900/40'
        }
    ];

    return (
        <div dir="rtl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white flex items-center gap-3">
                    <BarChart3 className="text-indigo-600" size={32} />
                    التحليلات والتقارير
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    نظرة شاملة على أداء ومبيعات الأكاديمية
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
                            <card.icon size={26} className={card.color} />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-1">{card.title}</p>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state for detailed charts */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <TrendingUp size={36} className="text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                    المخططات البيانية التفصيلية قيد التطوير
                </h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                    نحن نعمل على إضافة رسوم بيانية تفصيلية توضح نمو الأكاديمية والمبيعات على مدار الزمن. ستتوفر هذه الميزة قريباً!
                </p>
            </div>
        </div>
    );
}
