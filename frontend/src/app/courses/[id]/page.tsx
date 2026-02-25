'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, BookOpen, User, PlayCircle, CheckCircle, Lock,
    Share2, Loader2, ArrowRight, Wallet, AlertCircle, X,
    ShieldCheck, Zap, ChevronLeft, Star
} from 'lucide-react';
import { fetchAPI } from '../../../lib/api';
import Link from 'next/link';

export default function PublicCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'pay' | 'insufficient' | 'free' | 'success' | 'error'>('pay');
    const [modalError, setModalError] = useState('');

    useEffect(() => {
        async function loadCourse() {
            try {
                const data = await fetchAPI(`/courses/${courseId}`);
                setCourse(data);

                const token = localStorage.getItem('token');
                setIsLoggedIn(!!token);

                if (token) {
                    try {
                        const enrollment = await fetchAPI(`/enrollments/check/${courseId}`);
                        if (enrollment) setEnrolled(true);
                    } catch (e) {
                        console.log("Not enrolled yet");
                    }

                    try {
                        const walletData = await fetchAPI('/wallet/balance');
                        const bal = parseFloat(String(walletData?.balance ?? 0));
                        setWalletBalance(isNaN(bal) ? 0 : bal);
                    } catch (e) {
                        setWalletBalance(0);
                    }
                }
            } catch (error) {
                console.error("Failed to load course", error);
            } finally {
                setLoading(false);
            }
        }
        loadCourse();
    }, [courseId]);

    const handleEnrollClick = () => {
        if (!isLoggedIn) {
            router.push(`/login?redirect=/courses/${courseId}`);
            return;
        }
        const coursePrice = parseFloat(String(course.price ?? 0));
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
        setEnrollLoading(true);
        try {
            const coursePrice = parseFloat(String(course.price ?? 0));
            if (coursePrice > 0) {
                // Paid enrollment via wallet
                await fetchAPI('/wallet/pay', {
                    method: 'POST',
                    body: JSON.stringify({ courseId })
                });
            } else {
                // Free enrollment
                await fetchAPI('/enrollments', {
                    method: 'POST',
                    body: JSON.stringify({ courseId })
                });
            }
            setEnrolled(true);
            setModalType('success');
            // Redirect after 2 seconds
            setTimeout(() => {
                router.push(`/learn/course/${courseId}`);
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
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!course) {
        return <div className="p-8 text-center">الكورس غير موجود</div>;
    }

    const coursePrice = parseFloat(String(course.price ?? 0));
    const needed = Math.max(0, coursePrice - walletBalance).toFixed(2);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
            {/* Back Button */}
            <div className="container mx-auto px-4 pt-6">
                <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                    <ChevronLeft size={18} />
                    <span className="text-sm font-medium">رجوع للوحة التحكم</span>
                </Link>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070')] bg-cover bg-center opacity-5" />
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                أكثر الكورسات طلباً
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">{course.title}</h1>
                            <p className="text-slate-300 text-base mb-8 leading-relaxed">
                                {course.description || "كورس شامل مصمم من قِبَل خبراء لمساعدتك على إتقان المادة."}
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm text-slate-400 mb-8">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={16} className="text-blue-400" />
                                    <span>{course.lessons?.length || 0} درس</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-blue-400" />
                                    <span>وصول مدى الحياة</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-blue-400" />
                                    <span>جميع المستويات</span>
                                </div>
                            </div>

                            {/* Price + CTA */}
                            <div className="flex items-center gap-4 flex-wrap">
                                {enrolled ? (
                                    <Link
                                        href={`/learn/course/${courseId}`}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-600/20"
                                    >
                                        <PlayCircle size={20} />
                                        استكمل التعلم
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleEnrollClick}
                                        disabled={enrollLoading}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                                    >
                                        {coursePrice > 0 ? (
                                            <>
                                                <Wallet size={20} />
                                                اشترك الآن — {coursePrice} ج.م
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={20} />
                                                سجّل مجاناً
                                            </>
                                        )}
                                    </button>
                                )}
                                <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm">
                                    <Share2 size={20} />
                                </button>
                            </div>

                            {/* Wallet balance hint for logged-in users */}
                            {isLoggedIn && !enrolled && coursePrice > 0 && (
                                <div className={`mt-4 flex items-center gap-2 text-sm ${walletBalance >= coursePrice ? 'text-green-400' : 'text-orange-400'}`}>
                                    <Wallet size={16} />
                                    رصيد محفظتك: <strong>{walletBalance} ج.م</strong>
                                    {walletBalance < coursePrice && (
                                        <span className="mr-1">← محتاج {needed} ج.م إضافية</span>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group cursor-pointer" onClick={!enrolled ? handleEnrollClick : undefined}>
                                <img
                                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                        <PlayCircle size={32} className="text-white mr-[-2px]" />
                                    </div>
                                </div>
                                {!enrolled && coursePrice > 0 && (
                                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {coursePrice} ج.م
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Curriculum Section */}
            <div className="container mx-auto px-4 py-14">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Lessons List */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">محتوى الكورس</h2>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            {course.lessons && course.lessons.length > 0 ? (
                                course.lessons.map((lesson: any, index: number) => (
                                    <div
                                        key={lesson.id}
                                        className="p-5 border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-slate-800 dark:text-slate-200">{lesson.title}</h3>
                                                {lesson.description && (
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{lesson.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {lesson.isFree && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium dark:bg-green-900/20 dark:text-green-400">
                                                    مجاني
                                                </span>
                                            )}
                                            {lesson.isFree || enrolled ? (
                                                <PlayCircle size={18} className="text-blue-500" />
                                            ) : (
                                                <Lock size={18} className="text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-slate-500">لم تُضف دروس بعد.</div>
                            )}
                        </div>
                    </div>

                    {/* Sticky Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 sticky top-6 shadow-sm">
                            <div className="text-center mb-6">
                                {coursePrice > 0 ? (
                                    <div className="text-4xl font-extrabold text-blue-600 mb-1">{coursePrice} <span className="text-lg font-bold text-slate-500">ج.م</span></div>
                                ) : (
                                    <div className="text-2xl font-extrabold text-green-600 mb-1">مجاني تماماً</div>
                                )}
                                <p className="text-slate-500 text-sm">دفع مرة واحدة، وصول دائم</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                    <CheckCircle size={18} className="text-green-500 shrink-0" />
                                    <span>{course.lessons?.length || 0} درس تفاعلي</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                    <CheckCircle size={18} className="text-green-500 shrink-0" />
                                    <span>وصول مدى الحياة للمحتوى</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                    <CheckCircle size={18} className="text-green-500 shrink-0" />
                                    <span>اختبارات وتقييمات</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                    <CheckCircle size={18} className="text-green-500 shrink-0" />
                                    <span>شهادة إتمام الكورس</span>
                                </li>
                            </ul>

                            {enrolled ? (
                                <Link
                                    href={`/learn/course/${courseId}`}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/20"
                                >
                                    <PlayCircle size={20} />
                                    استكمل التعلم
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={handleEnrollClick}
                                        disabled={enrollLoading}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 mb-3"
                                    >
                                        {coursePrice > 0 ? `اشترك الآن — ${coursePrice} ج.م` : 'سجّل مجاناً'}
                                    </button>
                                    {isLoggedIn && coursePrice > 0 && (
                                        <div className={`flex items-center justify-center gap-2 text-xs ${walletBalance >= coursePrice ? 'text-green-600' : 'text-orange-500'}`}>
                                            <Wallet size={14} />
                                            رصيد محفظتك: {walletBalance} ج.م
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400">
                                <ShieldCheck size={14} />
                                دفع آمن عبر محفظة الشاطر أكاديمي
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== ENROLLMENT MODAL ===== */}
            <AnimatePresence>
                {showModal && (
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
                                            <h3 className="text-xl font-bold">تأكيد الاشتراك</h3>
                                            <p className="text-blue-100 text-sm mt-1">{course.title}</p>
                                        </>
                                    )}
                                    {modalType === 'free' && (
                                        <>
                                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <Zap size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold">تسجيل مجاني</h3>
                                            <p className="text-blue-100 text-sm mt-1">{course.title}</p>
                                        </>
                                    )}
                                    {modalType === 'insufficient' && (
                                        <>
                                            <div className="w-14 h-14 bg-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <AlertCircle size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold">رصيد غير كافٍ</h3>
                                            <p className="text-blue-100 text-sm mt-1">يجب شحن المحفظة أولاً</p>
                                        </>
                                    )}
                                    {modalType === 'success' && (
                                        <>
                                            <div className="w-14 h-14 bg-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <CheckCircle size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold">تم التسجيل بنجاح! 🎉</h3>
                                            <p className="text-blue-100 text-sm mt-1">جاري تحويلك للكورس...</p>
                                        </>
                                    )}
                                    {modalType === 'error' && (
                                        <>
                                            <div className="w-14 h-14 bg-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <AlertCircle size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold">حدث خطأ</h3>
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
                                                <span className="text-slate-500">سعر الكورس</span>
                                                <span className="font-bold text-slate-800 dark:text-white">{coursePrice} ج.م</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500">رصيد محفظتك</span>
                                                <span className="font-bold text-green-600">{walletBalance} ج.م</span>
                                            </div>
                                            <div className="border-t border-slate-200 dark:border-slate-600 pt-2 flex items-center justify-between">
                                                <span className="text-slate-500 text-sm">الرصيد بعد الدفع</span>
                                                <span className="font-extrabold text-blue-600">{(walletBalance - coursePrice).toFixed(2)} ج.م</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleConfirmEnroll}
                                            disabled={enrollLoading}
                                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70"
                                        >
                                            {enrollLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                                <><Wallet size={20} /> تأكيد الدفع وبدء التعلم</>
                                            )}
                                        </button>
                                    </>
                                )}

                                {modalType === 'free' && (
                                    <>
                                        <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
                                            هذا الكورس مجاني تماماً! اضغط للتسجيل والبدء فوراً.
                                        </p>
                                        <button
                                            onClick={handleConfirmEnroll}
                                            disabled={enrollLoading}
                                            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-70"
                                        >
                                            {enrollLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                                <><Zap size={20} /> ابدأ التعلم الآن</>
                                            )}
                                        </button>
                                    </>
                                )}

                                {modalType === 'insufficient' && (
                                    <>
                                        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 mb-6 space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500">سعر الكورس</span>
                                                <span className="font-bold">{coursePrice} ج.م</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500">رصيدك الحالي</span>
                                                <span className="font-bold text-orange-600">{walletBalance} ج.م</span>
                                            </div>
                                            <div className="border-t border-orange-200 dark:border-orange-800 pt-2 flex items-center justify-between">
                                                <span className="text-slate-500 text-sm">تحتاج إلى</span>
                                                <span className="font-extrabold text-red-600">{needed} ج.م</span>
                                            </div>
                                        </div>
                                        <Link
                                            href="/student/wallet"
                                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 mb-3"
                                        >
                                            <Wallet size={20} />
                                            اشحن المحفظة الآن
                                        </Link>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm"
                                        >
                                            رجوع
                                        </button>
                                    </>
                                )}

                                {modalType === 'success' && (
                                    <div className="text-center py-4">
                                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={24} />
                                        <p className="text-slate-500 text-sm">جاري التحويل لصفحة الكورس...</p>
                                    </div>
                                )}

                                {modalType === 'error' && (
                                    <>
                                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4 text-red-700 dark:text-red-400 text-sm text-center">
                                            {modalError}
                                        </div>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="w-full py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            إغلاق
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
