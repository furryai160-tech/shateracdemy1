'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, CreditCard, TrendingUp, Activity, UserPlus, FileCheck, Loader2 } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                // Reuse admin stats endpoint which adapts to the user's role (TEACHER)
                const data = await fetchAPI('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="mb-4">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">لوحة التحكم</h1>
                <p className="text-slate-500 dark:text-slate-400">مرحباً بك في لوحة تحكم المعلم، هنا نظرة عامة على أدائك.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="إجمالي الطلاب"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="text-blue-600"
                    bg="bg-blue-50 dark:bg-blue-900/20"
                />
                <StatCard
                    title="الكورسات النشطة"
                    value={stats?.totalCourses || 0}
                    icon={BookOpen}
                    color="text-indigo-600"
                    bg="bg-indigo-50 dark:bg-indigo-900/20"
                    unit="دورة"
                />
                <StatCard
                    title="إجمالي الأرباح"
                    value={`${stats?.revenue?.toLocaleString() || 0} ج.م`}
                    icon={CreditCard}
                    color="text-emerald-600"
                    bg="bg-emerald-50 dark:bg-emerald-900/20"
                />
                <StatCard
                    title="إجمالي التسجيلات"
                    value={stats?.totalEnrollments || 0}
                    icon={Activity}
                    color="text-orange-600"
                    bg="bg-orange-50 dark:bg-orange-900/20"
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Activity size={20} className="text-indigo-500" />
                            النشاطات الأخيرة
                        </h2>
                    </div>
                    <div className="space-y-6">
                        <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <FileCheck size={32} />
                            </div>
                            <p className="font-medium">لا توجد نشاطات حديثة لعرضها حالياً</p>
                            <p className="text-sm text-slate-400 mt-1">ستظهر هنا آخر التحديثات والتسجيلات الجديدة</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg, trend, unit }: any) {
    return (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={80} className={color.replace('text-', 'text-')} />
            </div>
            <div className="relative z-10">
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center ${color} mb-4`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
                    {unit && <span className="text-slate-400 text-xs font-bold mb-1">{unit}</span>}
                    {trend && (
                        <span className="text-slate-400 text-xs font-bold mb-1 flex items-center">
                            <TrendingUp size={12} className="mr-1" />
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
