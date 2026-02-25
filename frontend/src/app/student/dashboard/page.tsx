'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, PlayCircle, Loader2, Award, Calendar, Wallet, CheckCircle, AlertCircle, Zap, ShieldCheck, X, ShoppingCart } from 'lucide-react';
import { fetchAPI } from '../../../lib/api';

export default function StudentDashboard() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    // Purchase Modal State
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'pay' | 'insufficient' | 'free' | 'success' | 'error'>('pay');
    const [modalError, setModalError] = useState('');
    const [enrollLoading, setEnrollLoading] = useState(false);
    useEffect(() => {
        async function loadData() {
            try {
                // 1. Load Enrollments
                const enrollmentsData = await fetchAPI('/enrollments/my');
                setEnrollments(enrollmentsData);

                // 2. Load Wallet Balance
                try {
                    const walletData = await fetchAPI('/wallet/balance');
                    setWalletBalance(parseFloat(String(walletData?.balance ?? 0)) || 0);
                } catch (e) {
                    console.error("Failed to load wallet", e);
                }

                // 3. Load Available Courses for the student's tenant
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const tenantId = user?.tenantId;

                if (tenantId) {
                    const coursesData = await fetchAPI(`/courses?tenantId=${tenantId}`);
                    const enrolledCourseIds = enrollmentsData.map((e: any) => e.courseId);
                    const notEnrolled = coursesData.filter((c: any) => !enrolledCourseIds.includes(c.id));
                    setAvailableCourses(notEnrolled);
                } else {
                    const coursesData = await fetchAPI('/courses');
                    const enrolledCourseIds = enrollmentsData.map((e: any) => e.courseId);
                    const notEnrolled = coursesData.filter((c: any) => !enrolledCourseIds.includes(c.id));
                    setAvailableCourses(notEnrolled);
                }

                // Auto-handle course subscription/redirection from Landing Page using URL search query
                const params = new URLSearchParams(window.location.search);
                if (params.get('action') === 'auto_handle' && params.get('courseId')) {
                    const targetId = params.get('courseId');
                    const enrolledCourseIds = enrollmentsData.map((e: any) => e.courseId);

                    if (enrolledCourseIds.includes(targetId)) {
                        // Already enrolled? Go straight to learning dashboard!
                        window.location.href = `/learn/course/${targetId}`;
                        return;
                    } else {
                        // Not enrolled? Find the course and trigger purchase modal automatically
                        // Use tenant courses if present or base it on all courses
                        const allCoursesData = await fetchAPI(tenantId ? `/courses?tenantId=${tenantId}` : '/courses');
                        const courseToBuy = allCoursesData.find((c: any) => c.id === targetId);

                        if (courseToBuy) {
                            const coursePrice = parseFloat(String(courseToBuy.price ?? 0));
                            setSelectedCourse(courseToBuy);

                            // Re-fetch wallet locally to be safe 
                            const currentBalReq = await fetchAPI('/wallet/balance').catch(() => null);
                            const currentBal = parseFloat(String(currentBalReq?.balance ?? 0)) || 0;

                            if (coursePrice <= 0) {
                                setModalType('free');
                            } else if (currentBal >= coursePrice) {
                                setModalType('pay');
                            } else {
                                setModalType('insufficient');
                            }
                            setShowModal(true);

                            // Clean up URL visually
                            window.history.replaceState({}, document.title, window.location.pathname);
                        }
                    }
                }

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleEnrollClick = (course: any) => {
        const coursePrice = parseFloat(String(course.price ?? 0));
        setSelectedCourse(course);
        if (coursePrice <= 0) {
            setModalType('free');
        } else if (walletBalance >= coursePrice) {
            setModalType('pay');
        } else {
            setModalType('insufficient');
        }
        setShowModal(true);
    };

    const handleConfirmEnroll = async () => {
        if (!selectedCourse) return;
        setEnrollLoading(true);
        try {
            const coursePrice = parseFloat(String(selectedCourse.price ?? 0));
            if (coursePrice > 0) {
                // Paid enrollment via wallet
                await fetchAPI('/wallet/pay', {
                    method: 'POST',
                    body: JSON.stringify({ courseId: selectedCourse.id })
                });

                // Deduct from local wallet balance
                setWalletBalance(prev => prev - coursePrice);
            } else {
                // Free enrollment
                await fetchAPI('/enrollments', {
                    method: 'POST',
                    body: JSON.stringify({ courseId: selectedCourse.id })
                });
            }

            // Add to enrollments list and remove from available courses
            setEnrollments(prev => [...prev, { course: selectedCourse, progress: 0 }]);
            setAvailableCourses(prev => prev.filter(c => c.id !== selectedCourse.id));

            setModalType('success');
            setTimeout(() => {
                setShowModal(false);
                setSelectedCourse(null);
            }, 2000);
        } catch (error: any) {
            setModalError(error.message || 'حدث خطأ أثناء التسجيل');
            setModalType('error');
        } finally {
            setEnrollLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 max-w-7xl" dir="rtl">
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
                <p className="text-slate-500">تابع تقدمك الدراسي واستكمل دوراتك.</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-600/20">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm font-medium">الدورات المسجلة</p>
                            <h3 className="text-3xl font-bold">{enrollments.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-xl">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">رصيد المحفظة</p>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{walletBalance} ج.م</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-xl">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">الشهادات</p>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">0</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrolled Courses Grid */}
            <h2 className="text-xl font-bold mb-6">دوراتي الحالية</h2>

            {enrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {enrollments.map((enrollment: any, index: number) => {
                        const course = enrollment.course;
                        const progress = enrollment.progress || 0;

                        return (
                            <Link href={`/learn/course/${course.id}`} key={enrollment.id || course.id || index}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all group h-full flex flex-col"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <PlayCircle className="text-white w-12 h-12 drop-shadow-lg" />
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </h3>

                                        <div className="mt-auto pt-4">
                                            <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                                                <span>{progress}% مكتمل</span>
                                                <span>{enrollment.lastAccessed ? new Date(enrollment.lastAccessed).toLocaleDateString('ar-EG') : 'بدأ للتو'}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 mb-12">
                    <BookOpen className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">لم تقم بالتسجيل في أي دورة بعد</h3>
                    <p className="text-slate-500 max-w-md mx-auto text-sm">ابدأ رحلتك التعليمية باختيار دورة من القائمة أدناه.</p>
                </div>
            )}

            {/* Available Courses Section */}
            {availableCourses.length > 0 && (
                <>
                    <h2 className="text-xl font-bold mb-6">دورات متاحة لك</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {availableCourses.map((course: any) => (
                            <motion.div
                                key={course.id}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all group h-full flex flex-col relative"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        {course.price > 0 ? `${course.price} ج.م` : 'مجاني'}
                                    </div>
                                    <img
                                        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <Link href={`/courses/${course.id}`}>
                                        <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </h3>
                                    </Link>

                                    <div className="flex-1">
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                            {course.description || "لا يوجد وصف للدورة."}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 mt-2">
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Clock size={14} />
                                            <span>{(course.lessons || []).length} درس</span>
                                        </div>
                                        <button
                                            onClick={() => handleEnrollClick(course)}
                                            className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors dark:bg-blue-900/30 dark:hover:bg-blue-600"
                                        >
                                            <ShoppingCart size={16} />
                                            شراء الآن
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {/* ===== ENROLLMENT MODAL ===== */}
            <AnimatePresence>
                {showModal && selectedCourse && (
                    <motion.div
                        key="enrollment-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget && !enrollLoading) setShowModal(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                            dir="rtl"
                        >
                            {/* Modal Header */}
                            <div className="relative p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                                {!enrollLoading && modalType !== 'success' && (
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="absolute top-4 left-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                                <div className="text-center">
                                    {modalType === 'pay' && (
                                        <>
                                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <Wallet size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold">شراء الدورة</h3>
                                            <p className="text-blue-100 text-sm mt-1">{selectedCourse.title}</p>
                                        </>
                                    )}
                                    {modalType === 'free' && (
                                        <>
                                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <Zap size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold">تسجيل مجاني</h3>
                                            <p className="text-blue-100 text-sm mt-1">{selectedCourse.title}</p>
                                        </>
                                    )}
                                    {modalType === 'insufficient' && (
                                        <>
                                            <div className="w-14 h-14 bg-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <AlertCircle size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold">رصيد محفظتك لا يكفي</h3>
                                            <p className="text-blue-100 text-sm mt-1">يجب شحن المحفظة لإتمام الشراء</p>
                                        </>
                                    )}
                                    {modalType === 'success' && (
                                        <>
                                            <div className="w-14 h-14 bg-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <CheckCircle size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold">عملية ناجحة 🎉</h3>
                                            <p className="text-blue-100 text-sm mt-1">تمت إضافة الدورة بنجاح</p>
                                        </>
                                    )}
                                    {modalType === 'error' && (
                                        <>
                                            <div className="w-14 h-14 bg-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <AlertCircle size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold">فشل عملية الشراء</h3>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                {modalType === 'pay' && (
                                    <>
                                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-6 space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500">مطلوب للدفع</span>
                                                <span className="font-bold text-slate-800 dark:text-white">{parseFloat(String(selectedCourse.price)).toFixed(2)} ج.م</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500">الرصيد المتاح من المحفظة</span>
                                                <span className="font-bold text-green-600">{walletBalance.toFixed(2)} ج.م</span>
                                            </div>
                                            <div className="border-t border-slate-200 dark:border-slate-600 pt-3 mt-1 flex items-center justify-between">
                                                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">متبقي بعد الشراء</span>
                                                <span className="font-extrabold text-blue-600">{(walletBalance - parseFloat(String(selectedCourse.price))).toFixed(2)} ج.م</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleConfirmEnroll}
                                            disabled={enrollLoading}
                                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70"
                                        >
                                            {enrollLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                                <><Wallet size={20} /> خصم من المحفظة وبدء التعلم</>
                                            )}
                                        </button>
                                        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400">
                                            <ShieldCheck size={14} />
                                            دفع آمن وفوري من المحفظة
                                        </div>
                                    </>
                                )}

                                {modalType === 'free' && (
                                    <>
                                        <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
                                            هذه الدورة مجانية بالكامل. يمكنك التسجيل والبدء فوراً!
                                        </p>
                                        <button
                                            onClick={handleConfirmEnroll}
                                            disabled={enrollLoading}
                                            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-70"
                                        >
                                            {enrollLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                                <><Zap size={20} /> ضف إلى دوراتي الآن</>
                                            )}
                                        </button>
                                    </>
                                )}

                                {modalType === 'insufficient' && (
                                    <>
                                        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 mb-6 space-y-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">سعر الدورة</span>
                                                <span className="font-bold">{parseFloat(String(selectedCourse.price)).toFixed(2)} ج.م</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">رصيد المحفظة</span>
                                                <span className="font-bold text-orange-600">{walletBalance.toFixed(2)} ج.م</span>
                                            </div>
                                            <div className="border-t border-orange-200 dark:border-orange-800 pt-2 flex items-center justify-between">
                                                <span className="text-slate-500">تحتاج لشحن المحفظة بـ</span>
                                                <span className="font-extrabold text-red-600">{(parseFloat(String(selectedCourse.price)) - walletBalance).toFixed(2)} ج.م</span>
                                            </div>
                                        </div>
                                        <Link
                                            href="/student/wallet"
                                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 mb-3"
                                        >
                                            <Wallet size={20} />
                                            شحن المحفظة الآن
                                        </Link>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
                                        >
                                            إلغاء
                                        </button>
                                    </>
                                )}

                                {modalType === 'success' && (
                                    <div className="text-center py-4">
                                        <Loader2 className="animate-spin text-green-600 mx-auto mb-2" size={32} />
                                    </div>
                                )}

                                {modalType === 'error' && (
                                    <>
                                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4 text-red-700 dark:text-red-400 text-sm text-center">
                                            {modalError}
                                        </div>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20"
                                        >
                                            حسناً
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
