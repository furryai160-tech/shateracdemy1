'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, PlayCircle, CheckCircle, Lock, Menu, X,
    BookOpen, MessageSquare, Award, Loader2, ArrowRight
} from 'lucide-react';
import { fetchAPI } from '../../../../lib/api';
import { QuizPlayer } from '../../../../components/student/QuizPlayer';
import { SecureVideoPlayer } from '../../../../components/student/SecureVideoPlayer';
import Link from 'next/link';

export default function CoursePlayerPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;

    const [course, setCourse] = useState<any>(null);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'quiz'>('overview');
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [notEnrolled, setNotEnrolled] = useState(false);

    const [enrollmentDate, setEnrollmentDate] = useState<Date | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function loadCourseAndEnrollment() {
            try {
                // Check login first
                const token = localStorage.getItem('token');
                if (!token) {
                    router.replace(`/login?redirect=/learn/course/${courseId}`);
                    return;
                }

                // ✅ SECURED endpoint: Backend checks enrollment and returns videoIds
                //    only if the student is enrolled (or course is free)
                let courseData: any;
                try {
                    courseData = await fetchAPI(`/courses/${courseId}/player`);
                } catch (e: any) {
                    console.error('[Player] API error:', e?.status, e?.message);
                    // 403 Forbidden = not enrolled in paid course
                    // 401 Unauthorized = not logged in
                    if (e?.status === 401) {
                        router.replace(`/login?redirect=/learn/course/${courseId}`);
                        return;
                    }
                    if (e?.status === 403) {
                        setErrorMessage(e?.message || 'غير مشترك في الكورس');
                        setNotEnrolled(true);
                        setLoading(false);
                        // Auto-redirect to purchase page after 1.5s
                        setTimeout(() => router.replace(`/courses/${courseId}`), 1500);
                        return;
                    }
                    // Other errors
                    setErrorMessage(e?.message || 'فشل تحميل الكورس');
                    setNotEnrolled(true);
                    setLoading(false);
                    setTimeout(() => router.replace(`/courses/${courseId}`), 1500);
                    return;
                }

                // Fetch enrollment date (for drip delay display)
                let enrollmentData = null;
                try {
                    enrollmentData = await fetchAPI(`/enrollments/check/${courseId}`);
                } catch (e) {
                    console.warn('Enrollment date fetch failed:', e);
                }

                // Fetch progress - non-fatal if fails
                let progressData: any[] = [];
                try {
                    progressData = await fetchAPI(`/courses/${courseId}/progress`);
                    if (!Array.isArray(progressData)) progressData = [];
                } catch (e) {
                    console.warn('Progress fetch failed:', e);
                }

                // Merge progress into lessons
                if (courseData.lessons) {
                    const completedSet = new Set(progressData.map((p: any) => p.lessonId));
                    courseData.lessons = courseData.lessons.map((l: any) => ({
                        ...l,
                        isCompleted: completedSet.has(l.id)
                    }));
                }

                setCourse(courseData);
                if (enrollmentData) {
                    setEnrollmentDate(new Date(enrollmentData.createdAt));
                }

                // Sort lessons and set first uncompleted
                if (courseData.lessons && courseData.lessons.length > 0) {
                    const sorted = [...courseData.lessons].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
                    courseData.lessons = sorted;
                    const firstUncompleted = sorted.find((l: any) => !l.isCompleted) || sorted[0];
                    setActiveLesson(firstUncompleted);
                }
            } catch (error) {
                console.error("Failed to load course", error);
            } finally {
                setLoading(false);
            }
        }
        loadCourseAndEnrollment();
    }, [courseId]);

    const isLessonLocked = (lesson: any, index: number) => {
        // 1. Drip Delay check
        if (enrollmentDate && lesson.dripDelay) {
            const unlockDate = new Date(enrollmentDate);
            unlockDate.setDate(unlockDate.getDate() + lesson.dripDelay);
            if (new Date() < unlockDate) return true;
        }

        // 2. Sequential Check
        if (course?.gradeLevel) { // Optional: strict sequential only if configured, or always? 
            // The user wanted "drip system... can't open... until finishes previous".
            // Let's enforce it always for now as requested.
        }

        if (index > 0) {
            const prevLesson = course.lessons[index - 1];
            if (!prevLesson.isCompleted) return true;
        }

        return false;
    };

    const getUnlockDate = (lesson: any) => {
        if (!enrollmentDate) return null;
        const unlockDate = new Date(enrollmentDate);
        unlockDate.setDate(unlockDate.getDate() + lesson.dripDelay);
        return unlockDate;
    };

    // Load quizzes when active lesson changes
    useEffect(() => {
        if (activeLesson?.id && activeTab === 'quiz') {
            loadQuizzes();
        }
    }, [activeLesson, activeTab]);

    const loadQuizzes = async () => {
        try {
            // In a real app, this should be an endpoint like /lessons/:id/quizzes
            const allQuizzes = await fetchAPI('/quizzes');
            const lessonQuizzes = allQuizzes.filter((q: any) => q.lessonId === activeLesson.id);
            setQuizzes(lessonQuizzes);
        } catch (error) {
            console.error("Failed to load quizzes", error);
        }
    };

    const handleCompleteLesson = async () => {
        if (!activeLesson) return;
        try {
            await fetchAPI(`/lessons/${activeLesson.id}/complete`, { method: 'POST' });

            // Update local state
            const updatedLessons = course.lessons.map((l: any) =>
                l.id === activeLesson.id ? { ...l, isCompleted: true } : l
            );
            setCourse({ ...course, lessons: updatedLessons });

            // Also update activeLesson to reflect completion immediately
            setActiveLesson({ ...activeLesson, isCompleted: true });

            // Optional: Move to next lesson?
            const currentIndex = updatedLessons.findIndex((l: any) => l.id === activeLesson.id);
            if (currentIndex < updatedLessons.length - 1) {
                // Determine if next lesson is locked by other means (drip delay)
                // If strictly sequential, completing this one unlocks the next one (unless time locked)
                // setActiveLesson(updatedLessons[currentIndex + 1]); 
            }
        } catch (error) {
            console.error("Failed to complete lesson", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    // Student is not enrolled — redirect them to the course purchase page
    if (notEnrolled) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 gap-5 text-center px-6" dir="rtl">
                <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <Lock size={40} className="text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        لازم تشترك في الكورس أولاً
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                        جاري تحويلك لصفحة الكورس للاشتراك والدفع...
                    </p>
                </div>
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <button
                    onClick={() => router.push(`/courses/${courseId}`)}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                >
                    اذهب لصفحة الاشتراك الآن
                </button>
            </div>
        );
    }


    if (!course) {
        return <div className="p-8 text-center">Course not found</div>;
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Sidebar (Curriculum) */}
            <AnimatePresence mode='wait'>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 relative z-20"
                    >
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="font-bold truncate pr-2" title={course.title}>{course.title}</h2>
                            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {course.lessons.map((lesson: any, index: number) => {
                                const locked = isLessonLocked(lesson, index);
                                return (
                                    <button
                                        key={lesson.id}
                                        disabled={locked}
                                        onClick={() => setActiveLesson(lesson)}
                                        className={`w-full text-left p-4 border-b border-slate-100 dark:border-slate-800 transition-colors flex gap-3 
                                        ${activeLesson?.id === lesson.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}
                                        ${locked ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                                    `}
                                    >
                                        <div className="mt-0.5">
                                            {locked ? (
                                                <Lock size={18} className="text-slate-400" />
                                            ) : lesson.isCompleted ? (
                                                <CheckCircle size={18} className="text-green-500" />
                                            ) : activeLesson?.id === lesson.id ? (
                                                <PlayCircle size={18} className="text-blue-600" />
                                            ) : (
                                                <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${activeLesson?.id === lesson.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {index + 1}. {lesson.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                <span>10m</span>
                                                {lesson.isFree && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Free</span>}
                                                {locked && (
                                                    <span className="text-orange-500 flex items-center gap-1">
                                                        <Lock size={10} /> Available {getUnlockDate(lesson)?.toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                <Menu size={20} />
                            </button>
                        )}
                        <Link href="/student/dashboard" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800">
                            <ChevronLeft size={16} /> رجوع
                        </Link>
                    </div>
                    {/* Progress Bar (Dynamic) */}
                    {course && course.lessons && course.lessons.length > 0 && (() => {
                        const total = course.lessons.length;
                        const completed = course.lessons.filter((l: any) => l.isCompleted).length;
                        const progressPercent = Math.round((completed / total) * 100);
                        return (
                            <div className="flex items-center gap-3">
                                <div className="hidden md:block w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-1000"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{progressPercent}%</span>
                            </div>
                        );
                    })()}
                </header>

                {/* Lesson Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        {activeLesson ? (
                            <div className="space-y-6">
                                {/* Video Player Placeholder */}
                                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
                                    {isLessonLocked(activeLesson, course.lessons.findIndex((l: any) => l.id === activeLesson.id)) ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 gap-4 bg-slate-900">
                                            <Lock size={64} className="text-orange-500 opacity-80" />
                                            <div className="text-center">
                                                <h3 className="text-xl font-bold text-white mb-2">Content Locked</h3>
                                                <p className="text-slate-400">
                                                    Complete previous lessons to unlock this content.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <SecureVideoPlayer
                                            videoId={activeLesson.videoId}
                                            provider={activeLesson.videoProvider}
                                            title={activeLesson.title}
                                        />
                                    )}
                                </div>

                                {activeLesson.pdfUrl && (
                                    <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6" dir="rtl">
                                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-300 shadow-inner">
                                                <BookOpen size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800 dark:text-white">ملف الشرح (PDF)</h3>
                                                <p className="text-slate-500 text-sm hidden sm:block">
                                                    {activeLesson.pdfTitle || 'قم بتحميل أو استعراض ملزمة الدرس'}
                                                </p>
                                            </div>
                                        </div>

                                        <a href={activeLesson.pdfUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2 whitespace-nowrap">
                                            استعراض / تحميل الملف
                                        </a>
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-2">{activeLesson.title}</h1>
                                        <p className="text-slate-500">Lesson {activeLesson.order || 1} of {course.lessons.length}</p>
                                    </div>
                                    <button
                                        onClick={handleCompleteLesson}
                                        disabled={activeLesson.isCompleted}
                                        className={`px-6 py-3 font-medium rounded-xl flex items-center gap-2 shadow-lg transition-all
                                        ${activeLesson.isCompleted ? 'bg-green-100 text-green-700 cursor-default shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'}`}
                                    >
                                        {activeLesson.isCompleted ? (
                                            <>Completed <CheckCircle size={18} /></>
                                        ) : (
                                            <>Mark as Complete <ArrowRight size={18} /></>
                                        )}
                                    </button>
                                </div>


                                {/* Tabs for Description, Resources, Quiz */}
                                <div className="mt-8">
                                    <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
                                        <button
                                            onClick={() => setActiveTab('overview')}
                                            className={`pb-3 border-b-2 font-medium transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Overview
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('qa')}
                                            className={`pb-3 border-b-2 font-medium transition-colors ${activeTab === 'qa' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'} flex items-center gap-2`}
                                        >
                                            <MessageSquare size={16} /> Q&A
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('quiz')}
                                            className={`pb-3 border-b-2 font-medium transition-colors ${activeTab === 'quiz' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'} flex items-center gap-2`}
                                        >
                                            <Award size={16} /> Quiz
                                        </button>
                                    </div>

                                    <div className="py-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {activeTab === 'overview' && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                {activeLesson.description || "No description provided for this lesson."}
                                            </motion.div>
                                        )}

                                        {activeTab === 'qa' && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <div className="text-center py-10 text-slate-400">
                                                    <MessageSquare className="mx-auto h-10 w-10 mb-2 opacity-50" />
                                                    <p>Q&A feature coming soon.</p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'quiz' && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                {quizzes.length > 0 ? (
                                                    <div className="space-y-8">
                                                        {quizzes.map((quiz) => (
                                                            <div key={quiz.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                                                                <h3 className="text-xl font-bold mb-4">{quiz.title}</h3>
                                                                <QuizPlayer quiz={quiz} onComplete={(score) => alert(`Quiz completed! Score: ${score}%`)} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-10 text-slate-400">
                                                        <Award className="mx-auto h-10 w-10 mb-2 opacity-50" />
                                                        <p>No quizzes available for this lesson.</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-500">
                                Select a lesson to start learning
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
