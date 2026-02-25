
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    PlusCircle, ChevronLeft,
    BookOpen, Book, Store, Loader2, PlaySquare, FileText, CheckCircle
} from 'lucide-react';
import { fetchAPI } from '../../../lib/api';
import Link from 'next/link';

export default function AdminCoursesPage() {
    const router = useRouter();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
    const [courses, setCourses] = useState<any[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [creating, setCreating] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        title: '',
        gradeLevel: '',
        thumbnail: '',
    });

    useEffect(() => {
        loadTeachers();
    }, []);

    useEffect(() => {
        if (selectedTeacherId) {
            loadTeacherCourses(selectedTeacherId);
        } else {
            setCourses([]);
        }
    }, [selectedTeacherId]);

    async function loadTeachers() {
        setLoadingTeachers(true);
        try {
            const data = await fetchAPI('/admin/tenants');
            setTeachers(data);
        } catch (error) {
            console.error("Failed to load teachers", error);
        } finally {
            setLoadingTeachers(false);
        }
    }

    async function loadTeacherCourses(teacherId: string) {
        setLoadingCourses(true);
        try {
            const data = await fetchAPI(`/admin/tenants/${teacherId}/courses`);
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load courses", error);
        } finally {
            setLoadingCourses(false);
        }
    }

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeacherId) return alert('الرجاء اختيار المعلم أولاً');

        setCreating(true);
        try {
            const newCourse = await fetchAPI('/courses', {
                method: 'POST',
                body: JSON.stringify({
                    title: formData.title,
                    gradeLevel: formData.gradeLevel,
                    thumbnail: formData.thumbnail,
                    tenantId: selectedTeacherId,
                    price: 0, // default
                }),
            });

            // Redirect directly to the course builder to add videos/files/exams
            if (newCourse && newCourse.id) {
                router.push(`/dashboard/courses/${newCourse.id}?adminReturn=true`);
            } else {
                // Fallback if id is not returned directly
                alert('تم إنشاء الكورس بنجاح');
                loadTeacherCourses(selectedTeacherId);
                setFormData({ title: '', gradeLevel: '', thumbnail: '' });
                setCreating(false);
            }
        } catch (error: any) {
            console.error('Failed to create course', error);
            alert(error.message || 'حدث خطأ أثناء إنشاء الكورس');
            setCreating(false);
        }
    };

    if (loadingTeachers) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <BookOpen className="text-blue-600" />
                    إدارة الكورسات والمحتوى
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    اختر المعلم، ثم أضف بيانات الكورس، وابدأ برفع الفيديوهات والامتحانات والملفات.
                </p>
            </div>

            {/* Teacher Selection */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <label className="block text-lg font-bold mb-3 text-slate-800 dark:text-slate-200">
                    ١. اختر المنصة / المعلم
                </label>
                <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full text-lg px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                >
                    <option value="">-- اضغط هنا لاختيار المعلم --</option>
                    {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ( {t.subject || 'بدون مادة'} )</option>
                    ))}
                </select>
            </div>

            {selectedTeacherId && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Course Creation Form */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <PlusCircle />
                            ٢. إضافة كورس جديد للمعلم
                        </h2>

                        <form onSubmit={handleCreateCourse} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold mb-2">اسم الكورس</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                                    placeholder="مثال: لغة عربية - الصف الأول الثانوي"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">الصف الدراسي</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                                    value={formData.gradeLevel}
                                    onChange={e => setFormData({ ...formData, gradeLevel: e.target.value })}
                                >
                                    <option value="">اختر الصف...</option>
                                    <optgroup label="المرحلة الإعدادية">
                                        <option value="PREPARATORY_1">الأول الإعدادي</option>
                                        <option value="PREPARATORY_2">الثاني الإعدادي</option>
                                        <option value="PREPARATORY_3">الثالث الإعدادي</option>
                                    </optgroup>
                                    <optgroup label="المرحلة الثانوية">
                                        <option value="SECONDARY_1">الأول الثانوي</option>
                                        <option value="SECONDARY_2">الثاني الثانوي</option>
                                        <option value="SECONDARY_3">الثالث الثانوي</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">صورة الكورس (رابط)</label>
                                <input
                                    type="url"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                                    placeholder="https://..."
                                    value={formData.thumbnail}
                                    onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center items-center gap-2 text-lg transition-colors disabled:opacity-70"
                            >
                                {creating ? <Loader2 className="animate-spin" /> : <Book />}
                                إنشاء، والبدء في رفع المحتوى
                            </button>
                        </form>
                    </div>

                    {/* Existing Courses List */}
                    <div className="bg-slate-50 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 p-6 rounded-2xl flex flex-col">
                        <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                            كورسات المعلم الحالية
                        </h2>

                        {loadingCourses ? (
                            <div className="flex-1 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
                                <Store size={48} className="mb-4 opacity-50" />
                                <p>هذا المعلم لا يمتلك أي كورسات حتى الآن.</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto space-y-3 pb-2 pr-2 custom-scrollbar max-h-[500px]">
                                {courses.map(course => (
                                    <div key={course.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center shadow-sm">
                                        <div className="w-20 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} className="w-full h-full object-cover" alt={course.title} />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300">
                                                    <BookOpen size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-center md:text-right">
                                            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1 text-lg mb-1">{course.title}</h3>
                                            <div className="flex items-center gap-3 justify-center md:justify-start text-xs text-slate-500 font-bold">
                                                <span className="flex items-center gap-1"><PlaySquare size={14} /> {course._count?.lessons || 0} درس</span>
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md">
                                                    {course.gradeLevel === 'SECONDARY_3' ? 'الثالث الثانوي' :
                                                        course.gradeLevel === 'SECONDARY_2' ? 'الثاني الثانوي' :
                                                            course.gradeLevel === 'SECONDARY_1' ? 'الأول الثانوي' :
                                                                'مرحلة دراسية'}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/dashboard/courses/${course.id}?adminReturn=true`}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-lg transition-colors text-sm w-full md:w-auto text-center shrink-0"
                                        >
                                            إضافة / تعديل المحتوى
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
