'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Video, BookOpen, MoreVertical, Loader2, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { fetchAPI } from '../../../lib/api';

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCourses() {
            try {
                // Get tenantId from user session
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const tenantId = user?.tenantId;

                const url = tenantId ? `/courses?tenantId=${tenantId}` : '/courses';
                const data = await fetchAPI(url);
                setCourses(data);
            } catch (error) {
                console.error("Failed to load courses", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadCourses();
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse h-80">
                        <div className="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
                        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">الدورات التدريبية</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">إدارة المحتوى التعليمي والمناهج الدراسية</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                    <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={40} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">لا توجد دورات تدريبية بعد</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                        ابدأ رحلتك التعليمية بإنشاء دورتك الأولى. يمكنك إضافة الدروس، الاختبارات، والمرفقات بكل سهولة.
                    </p>
                    <Link
                        href="/dashboard/courses/new"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30 hover:-translate-y-1"
                    >
                        <Plus size={20} />
                        <span>إضافة دورة جديدة</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">الدورات التدريبية</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">إدارة المحتوى التعليمي والمناهج الدراسية</p>
                </div>
                <Link
                    href="/dashboard/courses/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span>إضافة دورة جديدة</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Thumbnail */}
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                            {course.thumbnail ? (
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                                    <BookOpen size={40} />
                                </div>
                            )}
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className="px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md bg-white/90 text-slate-800 shadow-sm">
                                    {(course.students || 0)} طالب
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold line-clamp-2 leading-snug text-slate-800 dark:text-white min-h-[3rem]">
                                    {course.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-1.5">
                                    <Video size={16} className="text-indigo-500" />
                                    <span>{(course.lessons || []).length} درس</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <BookOpen size={16} className="text-indigo-500" />
                                    <span>فصل دراسي 1</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link href={`/dashboard/courses/${course.id}`} className="flex-1">
                                    <button className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                                        تعديل المحتوى
                                    </button>
                                </Link>
                                <button className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                                    <BarChart3 size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* New Course Card Placeholder */}
                <Link href="/dashboard/courses/new" className="h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 cursor-pointer transition-all gap-4 group min-h-[350px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-all duration-300">
                            <Plus size={32} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">إنشاء دورة جديدة</h3>
                            <p className="text-slate-500 text-sm">ابدأ ببناء منهجك الدراسي الآن</p>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
