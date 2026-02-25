'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Save, Plus, Loader2
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { fetchAPI } from '../../../../lib/api';
import { SortableLessonItem } from './SortableLessonItem';
import { EditLessonModal } from './EditLessonModal';

export default function CourseEditorPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Lesson Form State
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [newLessonTitle, setNewLessonTitle] = useState('');

    // Edit Modal State
    const [editingLesson, setEditingLesson] = useState<any>(null);
    const [adminReturn, setAdminReturn] = useState(false);

    // Read URL params
    useState(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            setAdminReturn(searchParams.get('adminReturn') === 'true');
        }
    });

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        async function loadData() {
            try {
                const courseData = await fetchAPI(`/courses/${courseId}`);
                setCourse(courseData);
                if (courseData.lessons) {
                    // Sort by order if available
                    const sorted = [...courseData.lessons].sort((a, b) => (a.order || 0) - (b.order || 0));
                    setLessons(sorted);
                }
            } catch (error) {
                console.error('Failed to load course', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [courseId]);

    const handleAddLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLessonTitle.trim()) return;

        try {
            const newLesson = await fetchAPI('/lessons', {
                method: 'POST',
                body: JSON.stringify({
                    title: newLessonTitle,
                    courseId: courseId,
                    order: lessons.length
                })
            });

            setLessons([...lessons, newLesson]);
            setNewLessonTitle('');
            setShowLessonForm(false);
            // Auto-open the editor for the new lesson
            setEditingLesson(newLesson);
        } catch (error) {
            console.error('Failed to create lesson', error);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
        try {
            await fetchAPI(`/lessons/${lessonId}`, { method: 'DELETE' });
            setLessons(lessons.filter(l => l.id !== lessonId));
        } catch (error) {
            console.error('Failed to delete lesson', error);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setLessons((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // TODO: Sync order with backend
                return newItems;
            });
        }
    };

    const handleLessonUpdate = (updatedLesson: any) => {
        setLessons(lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l));
        // Also update editingLesson if it's currently open (though usually this closes modal)
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!course) {
        return <div>الكورس غير موجود</div>;
    }

    return (
        <div className="pb-20" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => adminReturn ? router.push('/admin/courses') : router.back()}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} className="rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{course.title}</h1>
                        <p className="text-slate-500 text-sm">إدارة المحتوى والمنهج الدراسي</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors">
                        معاينة
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2">
                        <Save size={18} />
                        حفظ التغييرات
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content - Curriculum */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">محتوى الدورة</h2>
                            <button
                                onClick={() => setShowLessonForm(true)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <Plus size={16} />
                                إضافة درس جديد
                            </button>
                        </div>

                        {/* Add Lesson Form */}
                        {showLessonForm && (
                            <motion.form
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onSubmit={handleAddLesson}
                                className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-blue-100 dark:border-blue-900/30"
                            >
                                <label className="block text-sm font-medium mb-2">عنوان الدرس</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        autoFocus
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="مثال: مقدمة في الفيزياء الحديثة"
                                        value={newLessonTitle}
                                        onChange={(e) => setNewLessonTitle(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                    >
                                        إضافة
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowLessonForm(false)}
                                        className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {/* Lessons List with Drag and Drop */}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={lessons.map(l => l.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {lessons.length === 0 ? (
                                        <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                            <p>لا توجد دروس بعد. ابدأ بإضافة المحتوى!</p>
                                        </div>
                                    ) : (
                                        lessons.map((lesson, index) => (
                                            <SortableLessonItem
                                                key={lesson.id}
                                                lesson={lesson}
                                                index={index}
                                                onEdit={setEditingLesson}
                                                onDelete={handleDeleteLesson}
                                            />
                                        ))
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>

                {/* Sidebar - Settings */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="font-bold mb-4">إعدادات الدورة</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-500">رابط صورة الغلاف</label>
                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative group mb-2">
                                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'} alt="Thumbnail" className="w-full h-full object-cover" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-sm"
                                    value={course.thumbnail || ''}
                                    onChange={(e) => setCourse({ ...course, thumbnail: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-500">المرحلة الدراسية</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-sm"
                                    value={course.gradeLevel || ''}
                                    onChange={(e) => setCourse({ ...course, gradeLevel: e.target.value })}
                                >
                                    <option value="">اختر المرحلة</option>
                                    <option value="PRIMARY_1">الابتدائية 1</option>
                                    <option value="PRIMARY_2">الابتدائية 2</option>
                                    <option value="PRIMARY_3">الابتدائية 3</option>
                                    <option value="PRIMARY_4">الابتدائية 4</option>
                                    <option value="PRIMARY_5">الابتدائية 5</option>
                                    <option value="PRIMARY_6">الابتدائية 6</option>
                                    <option value="PREPARATORY_1">الإعدادية 1</option>
                                    <option value="PREPARATORY_2">الإعدادية 2</option>
                                    <option value="PREPARATORY_3">الإعدادية 3</option>
                                    <option value="SECONDARY_1">الثانوية 1</option>
                                    <option value="SECONDARY_2">الثانوية 2</option>
                                    <option value="SECONDARY_3">الثانوية 3</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-500">السعر (ج.م)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                                        value={course.price || 0}
                                        onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={course.isPublished || false}
                                        onChange={(e) => setCourse({ ...course, isPublished: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium">نشر الدورة</span>
                                </label>
                            </div>

                            <button
                                onClick={async () => {
                                    try {
                                        await fetchAPI(`/courses/${courseId}`, {
                                            method: 'PATCH',
                                            body: JSON.stringify({
                                                title: course.title,
                                                thumbnail: course.thumbnail,
                                                gradeLevel: course.gradeLevel,
                                                price: course.price,
                                                isPublished: course.isPublished
                                            })
                                        });
                                        alert('تم حفظ إعدادات الدورة!');
                                    } catch (err) {
                                        alert('فشل حفظ الإعدادات');
                                    }
                                }}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                            >
                                تحديث الإعدادات
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <EditLessonModal
                isOpen={!!editingLesson}
                lesson={editingLesson}
                onClose={() => setEditingLesson(null)}
                onUpdate={handleLessonUpdate}
            />
        </div>
    );
}
