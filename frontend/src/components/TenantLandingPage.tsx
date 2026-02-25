'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlayCircle, BookOpen, User, GraduationCap, Loader2, Moon, Sun,
    Monitor, Facebook, Instagram, Twitter, Youtube, Linkedin, Globe,
    ArrowRight, Star, Award, CheckCircle, Zap, Shield, Sparkles, Download
} from 'lucide-react';
import { fetchAPI } from '../lib/api';

interface TenantLandingPageProps {
    subdomain?: string;
    initialTenantData?: any;
}

export default function TenantLandingPage({ subdomain, initialTenantData }: TenantLandingPageProps) {
    const [tenant, setTenant] = useState<any>(initialTenantData || null);
    const [loading, setLoading] = useState(!initialTenantData);
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    // Load Tenant Data
    useEffect(() => {
        if (initialTenantData) {
            setTenant(initialTenantData);
            setLoading(false);
            return;
        }

        const fetchTenant = async () => {
            if (!subdomain) return;
            try {
                const data = await fetchAPI(`/tenants/subdomain/${subdomain}`);
                setTenant(data);
            } catch (error) {
                console.error("Failed to load tenant", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTenant();
    }, [subdomain, initialTenantData]);

    // Handle Scroll for Navbar
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Theme & Config
    const config = tenant?.themeConfig || {};
    const primaryColor = tenant?.primaryColor || '#4f46e5';
    const fontName = config.fontFamily || 'Cairo';
    const heroImage = config.heroImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop";

    // Default Text
    const welcomeTitle = config.welcomeTitle || `أهلاً بك في \n ${tenant?.name || 'أكاديمية المستقبل'}`;
    const introText = config.introText || 'منصتك التعليمية المتكاملة، حيث يجتمع الشغف بالتعلم مع أحدث تقنيات التعليم لبناء مستقبل مشرق.';

    // Font Loading
    useEffect(() => {
        if (typeof document !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@300;400;600;700;800;900&display=swap`;
            document.head.appendChild(link);
        }
    }, [fontName]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!tenant) return <div className="text-center p-20 text-white">Academy Not Found</div>;

    const fadeInUp: any = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans selection:bg-indigo-500/30"
            style={{ fontFamily: `'${fontName}', sans-serif` }} dir="rtl">

            {/* Background Gradients & Noise */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
                <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px] opacity-20"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-lg shadow-indigo-500/5' : 'py-8 bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {tenant.logoUrl ? (
                            <img src={tenant.logoUrl} alt={tenant.name} className="h-12 w-auto object-contain" />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                                {tenant.name.charAt(0)}
                            </div>
                        )}
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
                            {tenant.name}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-10 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-md">
                        {['الرئيسية', 'الدورات', 'تواصل معنا'].map((item, i) => (
                            <a key={i} href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-all hover:scale-105 relative group">
                                {item}
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-400 transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-slate-300 hover:text-white font-medium transition-colors px-4 py-2 hover:bg-white/5 rounded-lg">
                            دخول
                        </Link>
                        <Link href="/register/student" className="group relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-900/20">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center gap-2 z-10">
                                ابدأ رحلتك <ArrowRight size={18} />
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* Visuals (Left on RTL, actually Right in Grid) - Mobile: Order 2, Desktop: Order 2 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative hidden lg:block order-last lg:order-first" // Visuals on Left (RTL)
                    >
                        <div className="relative z-10 w-full aspect-[4/5] max-w-md mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 rounded-[3rem] blur-2xl opacity-20 animate-pulse-slow"></div>
                            <div className="relative h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-900/50 ring-1 ring-white/20">
                                <img src={heroImage} alt={tenant.name} className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex -space-x-3 space-x-reverse">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                                                    <User size={12} />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-white text-sm font-medium">+1000 طالب يثقون بنا</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card 1 */}
                            <motion.div
                                animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 -right-12 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-20 max-w-[180px]"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                        <CheckCircle size={20} />
                                    </div>
                                    <span className="font-bold">معتمد</span>
                                </div>
                                <p className="text-xs text-slate-300">محتوى تعليمي مطابق للمعايير</p>
                            </motion.div>

                            {/* Floating Card 2 */}
                            <motion.div
                                animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-20 -left-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl z-20 flex items-center gap-4"
                            >
                                <div className="text-center">
                                    <div className="text-yellow-400 font-bold text-2xl flex items-center gap-1 justify-center">
                                        4.9 <Star size={16} fill="currentColor" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Rating</p>
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div className="text-center">
                                    <div className="text-indigo-400 font-bold text-2xl">
                                        24/7
                                    </div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Support</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-right lg:pl-10 relative z-20"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold mb-8 backdrop-blur-sm shadow-lg shadow-indigo-500/5">
                            <Sparkles size={16} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                            <span>مستقبل التعليم الرقمي</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-6xl lg:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
                            {welcomeTitle.split('\n').map((line: string, i: number) => (
                                <span key={i} className={`block ${i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 pb-2' : ''}`}>
                                    {line}
                                </span>
                            ))}
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl border-r-4 border-indigo-500/30 pr-6">
                            {introText}
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
                            <Link href="/register/student" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-2xl shadow-indigo-600/30 flex items-center gap-3 group">
                                <Zap size={22} className="group-hover:text-yellow-300 transition-colors" />
                                <span>اشترك الآن</span>
                            </Link>
                            <Link href="#courses" className="px-10 py-5 bg-slate-800/50 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-sm group">
                                <PlayCircle size={22} className="group-hover:text-indigo-400 transition-colors" />
                                <span>تصفح الدورات</span>
                            </Link>
                            {config.showGooglePlay && config.googlePlayLink && (
                                <a href={config.googlePlayLink} target="_blank" rel="noreferrer" className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all hover:scale-105 shadow-2xl flex items-center gap-3 group">
                                    <Download size={22} className="text-emerald-600 transition-transform group-hover:-translate-y-1" />
                                    <div className="text-right leading-tight">
                                        <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">احصل عليه من</span>
                                        <span className="block text-base">Google Play</span>
                                    </div>
                                </a>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Courses Section */}
            <section id="courses" className="py-24 px-6 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">الدورات <span className="text-indigo-500">المتاحة</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">تصفح جميع الدورات التعليمية المتاحة لجميع الصفوف والمراحل الدراسية.</p>
                    </div>

                    {!tenant.courses || tenant.courses.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                            <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">لا توجد دورات متاحة حالياً</h3>
                            <p className="text-slate-500">يرجى العودة لاحقاً للاطلاع على الدورات الجديدة.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tenant.courses.map((course: any) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="group bg-slate-900 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                                        <img
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800"}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 z-20 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            {course.gradeLevel || 'عام'}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                                            {course.description || 'دورة تعليمية شاملة تغطي جميع الجوانب الأساسية للمادة بأسلوب مبسط وشيق.'}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                            <div className="text-white font-bold text-lg">
                                                {course.price > 0 ? `${course.price} ج.م` : 'مجاني'}
                                            </div>
                                            <Link
                                                href={isLoggedIn ? `/student/dashboard?action=auto_handle&courseId=${course.id}` : `/register/student?redirect=/student/dashboard?action=auto_handle%26courseId=${course.id}`}
                                                className="px-5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/5"
                                            >
                                                الاشتراك في الكورس <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* Footer Section */}
            <footer className="border-t border-white/10 bg-slate-950 pt-20 pb-10 relative z-20">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-4 mb-6 group">
                                {tenant.logoUrl ? (
                                    <img src={tenant.logoUrl} alt={tenant.name} className="h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                        {tenant.name.charAt(0)}
                                    </div>
                                )}
                                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-indigo-400 transition-all">
                                    {tenant.name}
                                </span>
                            </div>
                            <p className="text-slate-400 leading-relaxed max-w-sm mb-8">
                                منصتك التعليمية المتكاملة لتقديم أفضل تجربة تعلم رقمية عبر أحدث التقنيات وبأعلى معايير الجودة الأكاديمية.
                            </p>

                            {config.social && (
                                <div className="flex flex-wrap items-center gap-4">
                                    {config.social.facebook && (
                                        <a href={config.social.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-indigo-500/20">
                                            <Facebook size={18} />
                                        </a>
                                    )}
                                    {config.social.twitter && (
                                        <a href={config.social.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-500 hover:border-blue-400 transition-all hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-blue-500/20">
                                            <Twitter size={18} />
                                        </a>
                                    )}
                                    {config.social.instagram && (
                                        <a href={config.social.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 hover:border-pink-500 transition-all hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-pink-500/20">
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                    {config.social.youtube && (
                                        <a href={config.social.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-red-500/20">
                                            <Youtube size={18} />
                                        </a>
                                    )}
                                    {config.social.linkedin && (
                                        <a href={config.social.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-700 hover:border-blue-600 transition-all hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-blue-700/20">
                                            <Linkedin size={18} />
                                        </a>
                                    )}
                                    {config.social.website && (
                                        <a href={config.social.website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 hover:border-teal-500 transition-all hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-teal-500/20">
                                            <Globe size={18} />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                                <Shield size={18} className="text-indigo-500" /> روابط هامة
                            </h4>
                            <ul className="space-y-4 text-slate-400 font-medium">
                                <li>
                                    <Link href="/terms" className="hover:text-indigo-400 hover:translate-x-[-8px] transition-all flex items-center gap-2">
                                        <ArrowRight size={14} className="opacity-0 -ml-4 transition-all" /> حقوق الملكية
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-indigo-400 hover:translate-x-[-8px] transition-all flex items-center gap-2">
                                        <ArrowRight size={14} className="opacity-0 -ml-4 transition-all" /> شروط الاستخدام
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register/student" className="hover:text-indigo-400 hover:translate-x-[-8px] transition-all flex items-center gap-2">
                                        <ArrowRight size={14} className="opacity-0 -ml-4 transition-all" /> إنشاء حساب
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                                <Globe size={18} className="text-indigo-500" /> تواصل و دعم
                            </h4>
                            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                                <p className="text-sm text-slate-400 mb-4 leading-relaxed">فريق الدعم الفني جاهز للرد على استفساراتكم وحل أي مشكلة تقنية تواجهكم.</p>
                                {tenant.mobileNumber ? (
                                    <a href={`https://wa.me/${tenant.mobileNumber.replace(/^0/, '20')}`} target="_blank" rel="noreferrer" className="w-full flex justify-center items-center gap-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl py-2 hover:bg-green-600 hover:text-white transition-all font-bold text-sm">
                                        واتساب
                                    </a>
                                ) : (
                                    <a href="#" className="w-full flex justify-center items-center gap-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl py-2 hover:bg-green-600 hover:text-white transition-all font-bold text-sm">
                                        تواصل معنا
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
                        <p className="flex items-center gap-2 font-medium">
                            &copy; {new Date().getFullYear()} {tenant.name}. جميع الحقوق محفوظة لدى المعلم.
                        </p>
                        <p className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-white/5">
                            تم التطوير بكل <span className="text-red-500 mx-1 text-lg animate-pulse">❤</span> بواسطة <span className="text-indigo-400 font-bold mx-1">yaseen sabry alawamy</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div >
    );
}
