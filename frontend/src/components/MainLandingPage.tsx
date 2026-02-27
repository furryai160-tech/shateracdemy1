'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    PlayCircle,
    ShieldCheck,
    CreditCard,
    LayoutDashboard,
    Rocket,
    Users,
    ChevronLeft,
    CheckCircle,
    Facebook,
    Phone,
    Code2,
    Github,
    Linkedin,
    Terminal,
    Cpu,
    Braces
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';

export default function MainLandingPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [progInstructors, setProgInstructors] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeStage, setActiveStage] = useState('all');

    useEffect(() => {
        fetchAPI('/plans/public').then(data => setPlans(data)).catch(console.error);
        fetchAPI('/tenants/public/teachers').then(data => setTeachers(data)).catch(console.error);
        fetchAPI('/programming-instructors/public').then(data => setProgInstructors(data)).catch(() => setProgInstructors([]));
    }, []);
    const features = [
        {
            icon: <PlayCircle className="w-8 h-8 text-orange-500" />,
            title: "مشغل فيديو متطور",
            description: "استضافة آمنة للفيديوهات مع حماية متقدمة، علامات مائية ديناميكية، وجودة بث فائقة تتناسب مع سرعة الإنترنت."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
            title: "حماية ضد القرصنة",
            description: "نظام أمني صارم يمنع تسجيل الشاشة والتحميل غير المصرح به لضمان حماية محتواك الفكري بنسبة 100٪."
        },
        {
            icon: <LayoutDashboard className="w-8 h-8 text-orange-500" />,
            title: "منصة بهويتك الخاصة",
            description: "أكاديمية كاملة باسمك وشعارك. خصص الألوان والتصميم ليعكس هويتك التجارية بلمسة احترافية."
        },
        {
            icon: <CreditCard className="w-8 h-8 text-orange-500" />,
            title: "بوابات دفع مدمجة",
            description: "استقبل مدفوعاتك بسهولة عبر المحافظ الإلكترونية، البطاقات البنكية، وفوري، لتسهيل الاشتراك على طلابك."
        },
        {
            icon: <Users className="w-8 h-8 text-orange-500" />,
            title: "إدارة شاملة للطلاب",
            description: "تابع تفاعل طلابك، تقدمهم في الكورسات، ونتائج اختباراتهم من خلال لوحة تحكم إحصائية متكاملة."
        },
        {
            icon: <Rocket className="w-8 h-8 text-orange-500" />,
            title: "نظام امتحانات ذكي",
            description: "أنشئ اختبارات واختبارات قصيرة مع نظام التركيز لمنع التشتت والغش، وتقديم تقارير أداء دقيقة."
        }
    ];

    return (
        <div dir="rtl" className="min-h-screen flex flex-col font-sans bg-[#0B1120] text-slate-200 overflow-hidden" style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
            {/* Background elements */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13283f] via-[#0B1120] to-[#0B1120]"></div>
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10 pointer-events-none"></div>

            {/* Navigation */}
            <nav className="border-b border-white/5 bg-[#0B1120]/60 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center">
                            <Image src="/logo.jpg" alt="الشاطر أكاديمي" width={48} height={48} className="object-cover" />
                        </div>
                        <span className="text-2xl font-extrabold text-white tracking-tight">
                            الشاطر <span className="text-orange-500">أكاديمي</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-slate-300 hover:text-orange-500 font-medium transition-colors">
                            المميزات
                        </Link>
                        <Link href="#demo" className="text-slate-300 hover:text-orange-500 font-medium transition-colors">
                            كيف تعمل
                        </Link>
                        <Link href="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                            تسجيل الدخول
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transform hover:-translate-y-0.5"
                        >
                            ابدأ الآن مجاناً
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        <motion.div
                            className="w-full lg:w-5/12 z-10"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-orange-500/10 text-orange-400 text-sm font-bold mb-8 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] backdrop-blur-md">
                                <span className="text-lg">💡</span>
                                لأن الشطارة فهم مش حفظ
                            </span>

                            <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight text-white drop-shadow-lg">
                                منصتك الشاملة لتفوق طلاب <span className="text-orange-500 block mt-2">الإعدادية والثانوية</span>
                            </h1>

                            <div className="space-y-4 mb-10 border-r-4 border-orange-500 pr-5">
                                <p className="text-xl md:text-2xl font-bold text-slate-300">
                                    شرح جميع المواد الدراسية بأسلوب مبسط واحترافي
                                </p>
                                <p className="text-lg md:text-xl font-bold text-slate-400">
                                    قسم برمجة لتأسيس مهارات المستقبل
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mb-12 text-sm md:text-base font-bold text-orange-200">
                                <span className="bg-white/5 py-1.5 px-3 rounded-md border border-white/10">📚 شرح مبسط</span>
                                <span className="text-orange-500">|</span>
                                <span className="bg-white/5 py-1.5 px-3 rounded-md border border-white/10">📈 متابعة مستمرة</span>
                                <span className="text-orange-500">|</span>
                                <span className="bg-white/5 py-1.5 px-3 rounded-md border border-white/10">🔥 مراجعات قوية</span>
                                <span className="text-orange-500">|</span>
                                <span className="bg-white/5 py-1.5 px-3 rounded-md border border-white/10">💡 تأسيس سليم</span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    انضم دلوقتي واستفيد مجاناً
                                    <ChevronLeft className="w-6 h-6" />
                                </Link>
                                <Link
                                    href="#features"
                                    className="w-full sm:w-auto px-8 py-4 bg-[#1e293b]/80 hover:bg-[#334155] border border-white/10 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                                >
                                    ابدأ صح
                                </Link>
                            </div>
                        </motion.div>

                        {/* Video Mockup */}
                        <motion.div
                            className="w-full lg:w-7/12 z-10 relative"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-blue-500/20 rounded-[2.5rem] blur-3xl transform rotate-3"></div>

                            <div className="relative rounded-[2rem] bg-[#0f172a] border border-white/10 p-2 shadow-2xl backdrop-blur-xl">
                                <div className="absolute top-0 right-10 w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>

                                <div className="relative rounded-[1.5rem] overflow-hidden bg-black flex items-center justify-center group h-[500px] lg:h-[800px] w-full">
                                    <img
                                        src="/hero-student-glow.png"
                                        alt="طالب أكاديمية الشاطر"
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-30 pointer-events-none rounded-[1.5rem]"></div>
                                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.5rem] pointer-events-none"></div>
                                </div>
                            </div>

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -left-6 top-10 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4 hidden sm:flex"
                            >
                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300">نظام الحماية</p>
                                    <p className="text-sm font-bold text-white">نشط 100%</p>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="absolute -right-8 bottom-20 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4 hidden sm:flex"
                            >
                                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300">الطلاب المسجلين</p>
                                    <p className="text-sm font-bold text-white">+10,000 طالب</p>
                                </div>
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Teachers Section */}
            {teachers.length > 0 && (
                <section id="teachers" className="py-24 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6"
                            >
                                نخبة المدرسين على المنصة
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
                            >
                                اختر المدرس المناسب لك من بين أفضل الكوادر التعليمية في مختلف المواد
                            </motion.p>

                            {/* Stage & Subject Filter */}
                            <div className="mb-14 space-y-5">

                                {/* Stage Tabs */}
                                <div className="flex flex-wrap justify-center gap-3">
                                    {[
                                        { key: 'all', label: '🎓 الكل' },
                                        { key: 'إعدادي', label: '🏫 إعدادي' },
                                        { key: 'ثانوي-علمي', label: '🔬 ثانوي علمي' },
                                        { key: 'ثانوي-أدبي', label: '📚 ثانوي أدبي' },
                                        { key: 'ثانوي-لغات', label: '🌍 ثانوي لغات' },
                                        { key: 'أزهر-إعدادي', label: '🕌 أزهر إعدادي' },
                                        { key: 'أزهر-ثانوي', label: '📿 أزهر ثانوي' },
                                    ].map(stage => (
                                        <button
                                            key={stage.key}
                                            onClick={() => { setActiveStage(stage.key); setActiveCategory('all'); }}
                                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${activeStage === stage.key
                                                ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                                                : 'bg-white/5 border-white/10 text-slate-300 hover:border-orange-500/50 hover:text-orange-400'
                                                }`}
                                        >
                                            {stage.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Subject Pills per Stage */}
                                {activeStage !== 'all' && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {/* All subjects for the selected stage */}
                                        {[
                                            {
                                                stage: 'إعدادي', subjects: [
                                                    { key: 'all', label: '📋 كل المواد' },
                                                    { key: 'رياضيات', label: '📐 رياضيات' },
                                                    { key: 'علوم', label: '🔬 علوم' },
                                                    { key: 'عربي', label: '📖 لغة عربية' },
                                                    { key: 'إنجليزي', label: '🇬🇧 لغة إنجليزية' },
                                                    { key: 'فرنساوي', label: '🇫🇷 لغة فرنسية' },
                                                    { key: 'دراسات', label: '🗺️ دراسات اجتماعية' },
                                                    { key: 'دين', label: '☪️ تربية دينية' },
                                                    { key: 'كمبيوتر', label: '� كمبيوتر' },
                                                ]
                                            },
                                            {
                                                stage: 'ثانوي-علمي', subjects: [
                                                    { key: 'all', label: '📋 كل المواد' },
                                                    { key: 'رياضيات', label: '📐 رياضيات' },
                                                    { key: 'فيزياء', label: '⚡ فيزياء' },
                                                    { key: 'كيمياء', label: '🧪 كيمياء' },
                                                    { key: 'أحياء', label: '🧬 أحياء' },
                                                    { key: 'جيولوجيا', label: '🪨 جيولوجيا' },
                                                    { key: 'عربي', label: '📖 لغة عربية' },
                                                    { key: 'إنجليزي', label: '🇬🇧 لغة إنجليزية' },
                                                    { key: 'دين', label: '☪️ تربية دينية' },
                                                    { key: 'كمبيوتر', label: '� تكنولوجيا' },
                                                ]
                                            },
                                            {
                                                stage: 'ثانوي-أدبي', subjects: [
                                                    { key: 'all', label: '📋 كل المواد' },
                                                    { key: 'رياضيات', label: '📐 رياضيات' },
                                                    { key: 'عربي', label: '📖 لغة عربية' },
                                                    { key: 'إنجليزي', label: '🇬🇧 لغة إنجليزية' },
                                                    { key: 'فرنساوي', label: '🇫� لغة فرنسية' },
                                                    { key: 'تاريخ', label: '📜 تاريخ' },
                                                    { key: 'جغرافيا', label: '🗺️ جغرافيا' },
                                                    { key: 'فلسفة', label: '🧠 فلسفة ومنطق' },
                                                    { key: 'علم نفس', label: '💡 علم نفس' },
                                                    { key: 'دين', label: '☪️ تربية دينية' },
                                                    { key: 'كمبيوتر', label: '💻 تكنولوجيا' },
                                                ]
                                            },
                                            {
                                                stage: 'ثانوي-لغات', subjects: [
                                                    { key: 'all', label: '� كل المواد' },
                                                    { key: 'عربي', label: '�📖 لغة عربية' },
                                                    { key: 'إنجليزي', label: '🇬🇧 لغة إنجليزية' },
                                                    { key: 'فرنساوي', label: '🇫🇷 لغة فرنسية' },
                                                    { key: 'ألماني', label: '🇩🇪 لغة ألمانية' },
                                                    { key: 'إيطالي', label: '🇮🇹 لغة إيطالية' },
                                                    { key: 'إسباني', label: '🇪🇸 لغة إسبانية' },
                                                    { key: 'رياضيات', label: '📐 رياضيات' },
                                                    { key: 'تاريخ', label: '📜 تاريخ' },
                                                    { key: 'دين', label: '☪️ تربية دينية' },
                                                ]
                                            },
                                            {
                                                stage: 'أزهر-إعدادي', subjects: [
                                                    { key: 'all', label: '📋 كل المواد' },
                                                    { key: 'قرآن', label: '📗 القرآن الكريم وتجويده' },
                                                    { key: 'تفسير', label: '✨ تفسير' },
                                                    { key: 'حديث', label: '📜 حديث شريف' },
                                                    { key: 'فقه', label: '⚖️ فقه' },
                                                    { key: 'عقيدة', label: '🌙 عقيدة' },
                                                    { key: 'سيرة', label: '🕌 سيرة نبوية' },
                                                    { key: 'نحو', label: '✍️ نحو وصرف' },
                                                    { key: 'عربي', label: '📖 لغة عربية' },
                                                    { key: 'إنجليزي', label: '🇬🇧 لغة إنجليزية' },
                                                    { key: 'رياضيات', label: '📐 رياضيات' },
                                                    { key: 'علوم', label: '🔬 علوم' },
                                                    { key: 'دراسات', label: '🗺️ دراسات اجتماعية' },
                                                ]
                                            },
                                            {
                                                stage: 'أزهر-ثانوي', subjects: [
                                                    { key: 'all', label: '📋 كل المواد' },
                                                    { key: 'قرآن', label: '📗 القرآن الكريم وعلومه' },
                                                    { key: 'تفسير', label: '✨ تفسير وعلوم القرآن' },
                                                    { key: 'حديث', label: '📜 حديث ومصطلحه' },
                                                    { key: 'فقه', label: '⚖️ فقه وأصوله' },
                                                    { key: 'عقيدة', label: '🌙 عقيدة وفرق' },
                                                    { key: 'سيرة', label: '🕌 سيرة وتاريخ إسلامي' },
                                                    { key: 'نحو', label: '✍️ نحو' },
                                                    { key: 'صرف', label: '🔤 صرف' },
                                                    { key: 'بلاغة', label: '🎭 بلاغة' },
                                                    { key: 'منطق', label: '🧠 منطق وفلسفة' },
                                                    { key: 'عربي', label: '📖 لغة عربية' },
                                                    { key: 'إنجليزي', label: '🇬🇧 لغة إنجليزية' },
                                                    { key: 'رياضيات', label: '📐 رياضيات' },
                                                    { key: 'فيزياء', label: '⚡ فيزياء' },
                                                    { key: 'كيمياء', label: '🧪 كيمياء' },
                                                    { key: 'أحياء', label: '🧬 أحياء' },
                                                    { key: 'تاريخ', label: '📜 تاريخ وجغرافيا' },
                                                ]
                                            },
                                        ].find(s => s.stage === activeStage)?.subjects.map(sub => (
                                            <button
                                                key={sub.key}
                                                onClick={() => setActiveCategory(sub.key)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeCategory === sub.key
                                                    ? 'bg-orange-500/90 border-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.35)]'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-orange-500/40 hover:text-orange-400'
                                                    }`}
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Simple subject filter when stage = all */}
                                {activeStage === 'all' && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {[
                                            { key: 'all', label: '📋 كل المواد' },
                                            { key: 'رياضيات', label: '📐 رياضيات' },
                                            { key: 'علوم', label: '🔬 علوم' },
                                            { key: 'فيزياء', label: '⚡ فيزياء' },
                                            { key: 'كيمياء', label: '🧪 كيمياء' },
                                            { key: 'أحياء', label: '🧬 أحياء' },
                                            { key: 'عربي', label: '📖 عربي' },
                                            { key: 'إنجليزي', label: '🇬🇧 إنجليزي' },
                                            { key: 'فرنساوي', label: '🇫🇷 فرنساوي' },
                                            { key: 'تاريخ', label: '📜 تاريخ' },
                                            { key: 'جغرافيا', label: '🗺️ جغرافيا' },
                                            { key: 'فلسفة', label: '🧠 فلسفة' },
                                            { key: 'دين', label: '☪️ دين' },
                                            { key: 'قرآن', label: '📗 قرآن' },
                                            { key: 'فقه', label: '⚖️ فقه' },
                                            { key: 'حديث', label: '📜 حديث' },
                                            { key: 'كمبيوتر', label: '💻 كمبيوتر' },
                                        ].map(cat => (
                                            <button
                                                key={cat.key}
                                                onClick={() => setActiveCategory(cat.key)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeCategory === cat.key
                                                    ? 'bg-orange-500/90 border-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.35)]'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-orange-500/40 hover:text-orange-400'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                            {teachers
                                .filter(t => {
                                    const subj = (t.subject || '').toLowerCase().trim();
                                    const gradesArr: string[] = Array.isArray(t.grades) ? t.grades.map((g: string) => g.toLowerCase()) : [];

                                    // ── Stage filter ───────────────────────────────────────────────
                                    if (activeStage !== 'all') {
                                        const stageGradeMap: { [key: string]: string[] } = {
                                            'إعدادي': ['preparatory', 'إعدادي', 'middle'],
                                            'ثانوي-علمي': ['secondary', 'ثانوي', 'علمي'],
                                            'ثانوي-أدبي': ['secondary', 'ثانوي', 'أدبي'],
                                            'ثانوي-لغات': ['secondary', 'ثانوي', 'لغات', 'languages'],
                                            'أزهر-إعدادي': ['azhar', 'أزهر'],
                                            'أزهر-ثانوي': ['azhar', 'أزهر'],
                                        };
                                        // also match inside subject text (e.g. teacher put "ثانوي علمي" in subject)
                                        const stageTextMap: { [key: string]: string[] } = {
                                            'إعدادي': ['إعدادي', 'preparatory', 'middle'],
                                            'ثانوي-علمي': ['ثانوي علمي', 'علمي', 'science'],
                                            'ثانوي-أدبي': ['ثانوي أدبي', 'أدبي', 'arts'],
                                            'ثانوي-لغات': ['ثانوي لغات', 'لغات', 'languages'],
                                            'أزهر-إعدادي': ['أزهر إعدادي', 'إعدادي أزهر', 'azhar prep'],
                                            'أزهر-ثانوي': ['أزهر ثانوي', 'ثانوي أزهر', 'azhar sec'],
                                        };
                                        const gradeKeywords = stageGradeMap[activeStage] || [];
                                        const textKeywords = stageTextMap[activeStage] || [];
                                        const matchByGrades = gradesArr.length > 0 && gradeKeywords.some(k => gradesArr.some(g => g.includes(k)));
                                        const matchByText = textKeywords.some(k => subj.includes(k));
                                        // If teacher has grades info → use it; else fall back to subject text
                                        if (gradesArr.length > 0 && !matchByGrades) return false;
                                        if (gradesArr.length === 0 && !matchByText && subj.length > 0) {
                                            // still show teacher — we can't be sure which stage they teach
                                        }
                                    }

                                    // ── Subject filter ─────────────────────────────────────────────
                                    if (activeCategory === 'all') return true;

                                    // Synonym map: filter key → possible words in teacher's subject field
                                    const synonyms: { [key: string]: string[] } = {
                                        'رياضيات': ['رياضيات', 'ماث', 'math', 'رياضة'],
                                        'فيزياء': ['فيزياء', 'فيزيا', 'physics', 'الفيزياء'],
                                        'كيمياء': ['كيمياء', 'كيميا', 'chemistry', 'الكيمياء'],
                                        'أحياء': ['أحياء', 'احياء', 'biology', 'الأحياء', 'بيولوجي'],
                                        'جيولوجيا': ['جيولوجيا', 'geology', 'الجيولوجيا'],
                                        'علوم': ['علوم', 'science', 'العلوم'],
                                        'عربي': ['عربي', 'عربية', 'عربى', 'arabic', 'اللغة العربية', 'لغة عربية', 'لغه عربيه'],
                                        'إنجليزي': ['إنجليزي', 'انجليزي', 'إنجليزية', 'english', 'لغة إنجليزية', 'لغه انجليزيه'],
                                        'فرنساوي': ['فرنساوي', 'فرنسي', 'فرنسية', 'french', 'لغة فرنسية'],
                                        'ألماني': ['ألماني', 'الماني', 'german', 'لغة ألمانية'],
                                        'إيطالي': ['إيطالي', 'ايطالي', 'italian', 'لغة إيطالية'],
                                        'إسباني': ['إسباني', 'اسباني', 'spanish', 'لغة إسبانية'],
                                        'تاريخ': ['تاريخ', 'history', 'التاريخ'],
                                        'جغرافيا': ['جغرافيا', 'جغرافيا', 'geography', 'الجغرافيا', 'جغرافية'],
                                        'فلسفة': ['فلسفة', 'منطق', 'philosophy', 'الفلسفة', 'فلسفه'],
                                        'علم نفس': ['علم نفس', 'نفس', 'psychology', 'سيكولوجي'],
                                        'دراسات': ['دراسات', 'اجتماعية', 'social', 'دراسات اجتماعية'],
                                        'دين': ['دين', 'تربية دينية', 'دينية', 'religion', 'ديني', 'ديناميكا'],
                                        'قرآن': ['قرآن', 'قران', 'تجويد', 'quran', 'تلاوة'],
                                        'تفسير': ['تفسير', 'علوم القرآن', 'tafsir'],
                                        'حديث': ['حديث', 'مصطلح الحديث', 'hadith'],
                                        'فقه': ['فقه', 'أصول', 'اصول فقه', 'fiqh'],
                                        'عقيدة': ['عقيدة', 'عقيده', 'توحيد', 'aqeedah', 'فرق'],
                                        'سيرة': ['سيرة', 'سيره', 'history islam', 'تاريخ إسلامي'],
                                        'نحو': ['نحو', 'الن​حو', 'nahw', 'نحو وصرف'],
                                        'صرف': ['صرف', 'الصرف', 'sarf'],
                                        'بلاغة': ['بلاغة', 'بلاغه', 'balaghah'],
                                        'منطق': ['منطق', 'فلسفة ومنطق', 'logic'],
                                        'كمبيوتر': ['كمبيوتر', 'تكنولوجيا', 'computer', 'tech', 'برمجة', 'programming'],
                                    };

                                    const terms = synonyms[activeCategory] ?? [activeCategory];
                                    return terms.some(term => subj.includes(term.toLowerCase()));
                                })
                                .map((teacher, idx) => (
                                    <motion.a
                                        key={teacher.id}
                                        href={`http://${teacher.subdomain}.${typeof window !== 'undefined' ? window.location.hostname : 'localhost:3000'}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.07 }}
                                        className="group relative overflow-hidden rounded-[2rem] cursor-pointer block"
                                        style={{ height: '420px' }}
                                    >
                                        {/* Full Image Background */}
                                        {teacher.logoUrl ? (
                                            <img
                                                src={teacher.logoUrl}
                                                alt={teacher.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 w-full h-full flex items-center justify-center text-8xl font-extrabold text-white/30"
                                                style={{ background: `linear-gradient(135deg, ${teacher.primaryColor || '#1a2744'} 0%, #0B1120 100%)` }}
                                            >
                                                {teacher.name?.charAt(0)}
                                            </div>
                                        )}

                                        {/* Top subject badge */}
                                        {teacher.subject && (
                                            <div className="absolute top-4 right-4 z-20">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/90 backdrop-blur-sm text-white shadow-lg">
                                                    {teacher.subject}
                                                </span>
                                            </div>
                                        )}

                                        {/* Bottom Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

                                        {/* Bottom Content */}
                                        <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                                            <h3 className="text-xl font-extrabold text-white mb-2 leading-tight group-hover:text-orange-300 transition-colors duration-300">
                                                {teacher.name}
                                            </h3>

                                            {/* Divider line */}
                                            <div className="w-10 h-0.5 bg-orange-500 mb-3 transition-all duration-300 group-hover:w-20" />

                                            {/* Visit button */}
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 group-hover:text-orange-300 transition-colors">
                                                <span>زيارة المنصة</span>
                                                <svg className="w-3 h-3 -rotate-45 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>

                                        {/* Hover border glow */}
                                        <div className="absolute inset-0 rounded-[2rem] ring-2 ring-transparent group-hover:ring-orange-500/60 transition-all duration-300 z-30 pointer-events-none" />
                                    </motion.a>
                                ))}
                        </div>

                        {teachers.filter(t => {
                            if (activeCategory === 'all') return true;
                            const subj = (t.subject || '').toLowerCase();
                            const synonyms: { [key: string]: string[] } = {
                                'رياضيات': ['رياضيات', 'math'], 'فيزياء': ['فيزياء', 'فيزيا', 'physics'],
                                'كيمياء': ['كيمياء', 'chemistry'], 'أحياء': ['أحياء', 'biology', 'احياء'],
                                'علوم': ['علوم', 'science'], 'عربي': ['عربي', 'عربية', 'arabic'],
                                'إنجليزي': ['إنجليزي', 'انجليزي', 'english'], 'فرنساوي': ['فرنساوي', 'french'],
                                'تاريخ': ['تاريخ', 'history'], 'جغرافيا': ['جغرافيا', 'geography'],
                                'فلسفة': ['فلسفة', 'منطق'], 'دين': ['دين', 'دينية'],
                                'قرآن': ['قرآن', 'قران', 'تجويد'], 'فقه': ['فقه'],
                                'حديث': ['حديث'], 'كمبيوتر': ['كمبيوتر', 'تكنولوجيا'],
                            };
                            const terms = synonyms[activeCategory] ?? [activeCategory];
                            return terms.some(term => subj.includes(term.toLowerCase()));
                        }).length === 0 && (
                                <div className="text-center py-16 text-slate-400">
                                    <p className="text-4xl mb-4">🔍</p>
                                    <p className="text-lg font-bold text-slate-300">لا يوجد مدرسون في هذه الفئة حالياً</p>
                                    <p className="text-sm mt-2">جرب تصفية مختلفة أو اختر "كل المواد"</p>
                                </div>
                            )}
                    </div>
                </section>
            )}

            {/* ════════════════════════════════════════════════════
                  PROGRAMMING SECTION
            ════════════════════════════════════════════════════ */}
            {progInstructors.length > 0 && (
                <section id="programming" className="py-28 relative overflow-hidden">
                    {/* Dark bg layer */}
                    <div className="absolute inset-0 bg-[#050d1a]" />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                    {/* Glow orbs */}
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />

                    {/* Floating code snippets decoration */}
                    {['const ', 'def ', '</>', 'npm i', '{}', '=>', '[]', '01'].map((t, i) => (
                        <motion.div
                            key={t}
                            animate={{ y: [0, -15, 0], opacity: [0.05, 0.12, 0.05] }}
                            transition={{ repeat: Infinity, duration: 4 + i, delay: i * 0.7, ease: 'easeInOut' }}
                            className="absolute text-green-400 font-mono font-bold pointer-events-none select-none"
                            style={{
                                fontSize: `${14 + (i % 3) * 6}px`,
                                right: `${5 + (i * 13) % 90}%`,
                                top: `${10 + (i * 17) % 80}%`,
                            }}
                        >{t}</motion.div>
                    ))}

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Section Header */}
                        <div className="text-center mb-20">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold mb-6"
                            >
                                <Terminal size={14} />
                                <span className="font-mono">$ cd /programming-courses</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight"
                            >
                                قسم{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-violet-400">
                                    البرمجة
                                </span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-slate-400 max-w-2xl mx-auto font-mono"
                            >
                                تعلم البرمجة على يد نخبة من المهندسين المحترفين 🚀
                            </motion.p>

                            {/* Tech icons row */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex justify-center items-center gap-3 mt-8 flex-wrap"
                            >
                                {['Python', 'JavaScript', 'React', 'Node.js', 'Django', 'Flutter', 'C++', 'SQL'].map(tech => (
                                    <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-mono rounded-lg hover:border-green-500/40 hover:text-green-400 transition-all cursor-default">
                                        {tech}
                                    </span>
                                ))}
                            </motion.div>
                        </div>

                        {/* Instructors Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {progInstructors.map((ins, idx) => (
                                <motion.div
                                    key={ins.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative bg-[#0a1628] border border-white/8 rounded-[2rem] overflow-hidden hover:border-green-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)]"
                                >
                                    {/* Card top glow line */}
                                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Photo */}
                                    <div className="relative h-56 bg-gradient-to-br from-[#0d1f3c] to-[#050d1a] overflow-hidden">
                                        {ins.photoUrl ? (
                                            <img src={ins.photoUrl} alt={ins.name} className="w-full h-full object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Code2 size={72} className="text-green-500/20" />
                                            </div>
                                        )}
                                        {/* Bottom fade */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />

                                        {/* Corner badge */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full">
                                            <Cpu size={11} className="text-green-400" />
                                            <span className="text-green-400 text-[10px] font-bold font-mono">Engineer</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Name */}
                                        <h3 className="text-xl font-black text-white mb-1 group-hover:text-green-400 transition-colors duration-300">
                                            {ins.name}
                                        </h3>
                                        {/* Title */}
                                        <p className="text-cyan-400 text-sm font-mono font-medium mb-3">{ins.title}</p>

                                        {/* Specialization */}
                                        <div className="flex items-start gap-2 mb-4 p-3 bg-white/3 border border-white/5 rounded-xl">
                                            <Braces size={14} className="text-green-400 mt-0.5 shrink-0" />
                                            <p className="text-slate-400 text-xs font-mono leading-relaxed">{ins.specialization}</p>
                                        </div>

                                        {/* Bio */}
                                        {ins.bio && (
                                            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{ins.bio}</p>
                                        )}

                                        {/* Skills */}
                                        {ins.skills && ins.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-5">
                                                {ins.skills.slice(0, 5).map((skill: string) => (
                                                    <span key={skill} className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold rounded-lg font-mono hover:bg-green-500/20 transition-colors">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {ins.skills.length > 5 && (
                                                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-500 text-[10px] rounded-lg">+{ins.skills.length - 5}</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Divider */}
                                        <div className="h-px bg-white/5 mb-4" />

                                        {/* Social links */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-3">
                                                {ins.githubUrl && (
                                                    <a href={ins.githubUrl} target="_blank" rel="noreferrer"
                                                        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs font-medium group/link">
                                                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover/link:border-white/20 transition-all">
                                                            <Github size={13} />
                                                        </div>
                                                        <span className="hidden sm:inline">GitHub</span>
                                                    </a>
                                                )}
                                                {ins.linkedinUrl && (
                                                    <a href={ins.linkedinUrl} target="_blank" rel="noreferrer"
                                                        className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors text-xs font-medium group/link">
                                                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover/link:border-blue-400/40 transition-all">
                                                            <Linkedin size={13} />
                                                        </div>
                                                        <span className="hidden sm:inline">LinkedIn</span>
                                                    </a>
                                                )}
                                            </div>
                                            {/* Hover arrow */}
                                            <div className="w-8 h-8 rounded-xl bg-green-500/0 group-hover:bg-green-500/10 border border-transparent group-hover:border-green-500/20 flex items-center justify-center transition-all duration-300">
                                                <ChevronLeft size={16} className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mt-16"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 font-mono text-sm">
                                <Terminal size={16} />
                                <span>هتشرح Python · Web · Mobile · AI · Database</span>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section id="features" className="py-24 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6"
                        >
                            لماذا تختار الشاطر أكاديمي؟
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-400 max-w-2xl mx-auto"
                        >
                            نقدم لك أحدث التقنيات وأقوى أنظمة الحماية لضمان تجربة تعليمية سلسة لك ولطلابك.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.4 }}
                                className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 group backdrop-blur-sm"
                            >
                                <div className="mb-6 w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform duration-300 group-hover:bg-orange-500/20">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-400 transition-colors">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            {plans.length > 0 && (
                <section id="pricing" className="py-24 relative overflow-hidden bg-white/5">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-20">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6"
                            >
                                خطط أسعار تناسب الجميع
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-slate-400 max-w-2xl mx-auto"
                            >
                                اختر الباقة الأنسب لاحتياجاتك وابدأ في بناء منصتك التعليمية اليوم.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {plans.map((plan, idx) => (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                                    className={`relative p-8 rounded-[2rem] bg-white/5 border ${plan.isPopular ? 'border-orange-500 bg-orange-500/5' : 'border-white/10'} hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex flex-col`}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                                            الأكثر طلباً
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                                    {plan.description && <p className="text-slate-400 mb-6 min-h-[48px]">{plan.description}</p>}
                                    <div className="mb-8 flex items-end gap-2">
                                        <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{plan.price}</span>
                                        <span className="text-slate-500 mb-2">جنيه / {plan.duration} يوم</span>
                                    </div>
                                    <ul className="space-y-4 mb-8 flex-1">
                                        {(Array.isArray(plan.features) ? plan.features as string[] : []).map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                                <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/register"
                                        className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.isPopular ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_5px_20px_-5px_rgba(249,115,22,0.5)]' : 'bg-white/10 hover:bg-white/20 text-white border border-white/5'}`}
                                    >
                                        اشترك الآن
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-orange-600 to-orange-900 border border-orange-500/30 p-12 text-center shadow-2xl">
                        <div className="absolute inset-0 bg-black/20" style={{ backgroundImage: "linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)", backgroundSize: "100px 100px" }}></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">هل أنت مستعد لبدء رحلتك؟</h2>
                            <p className="text-orange-100 text-xl mb-10 max-w-2xl mx-auto">
                                انضم إلى آلاف المعلمين الذين يثقون في الشاطر أكاديمي لإدارة وتنمية كورساتهم بنجاح.
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-orange-600 hover:bg-slate-50 rounded-2xl font-bold text-xl transition-all shadow-xl transform hover:-translate-y-1"
                            >
                                أنشئ حسابك مجاناً
                                <ChevronLeft className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pt-16 pb-8 border-t border-white/10 bg-[#0B1120] relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500 overflow-hidden flex items-center justify-center border border-orange-400">
                                    <Image src="/logo.jpg" alt="الشاطر أكاديمي" width={40} height={40} className="object-cover" />
                                </div>
                                <span className="text-2xl font-bold text-white">الشاطر <span className="text-orange-500">أكاديمي</span></span>
                            </div>
                            <p className="text-slate-400 max-w-sm">منصتك الشاملة لتفوق الطلاب وإدارة الكورسات باحترافية.</p>

                            {/* Social Media & Contact */}
                            <div className="flex items-center gap-4">
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all hover:scale-110 shadow-xl">
                                    <Facebook size={18} />
                                </a>
                                <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-green-600 hover:border-green-500 transition-all hover:scale-110 shadow-xl">
                                    <Phone size={18} />
                                </a>
                                <span className="text-slate-400 text-sm font-medium mr-2" dir="ltr">+20 100 000 0000</span>
                            </div>
                        </div>

                        <div className="flex gap-6 text-slate-400 font-medium">
                            <Link href="#" className="hover:text-orange-500 transition-colors">الشروط والأحكام</Link>
                            <Link href="#" className="hover:text-orange-500 transition-colors">سياسة الخصوصية</Link>
                            <Link href="#" className="hover:text-orange-500 transition-colors">تواصل معنا</Link>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm border-t border-white/5 pt-8">
                        <div>
                            © {new Date().getFullYear()} الشاطر أكاديمي. جميع الحقوق محفوظة.
                        </div>
                        <div className="flex items-center gap-1.5">
                            تم التطوير بكل <span className="text-red-500 text-lg animate-pulse">❤</span> بواسطة <span className="text-orange-400 font-bold ml-1">yaseen sabry alawamy</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

