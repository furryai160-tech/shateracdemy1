'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ChevronLeft, Eye, EyeOff, Loader2, Phone, Book, Globe, Upload, CheckCircle } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        subject: '',
        domain: '',
        serviceType: 'PLATFORM_ONLY',
    });

    const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const toggleGrade = (grade: string) => {
        if (selectedGrades.includes(grade)) {
            setSelectedGrades(selectedGrades.filter(g => g !== grade));
        } else {
            setSelectedGrades([...selectedGrades, grade]);
        }
    };

    const generateDomain = () => {
        if (!formData.name) return;
        const slug = formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        setFormData({ ...formData, domain: slug });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("كلمات المرور غير متطابقة");
            setIsLoading(false);
            return;
        }

        if (selectedGrades.length === 0) {
            setError("يرجى اختيار مرحلة دراسية واحدة على الأقل");
            setIsLoading(false);
            return;
        }

        try {
            await fetchAPI('/auth/teacher-request', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    subject: formData.subject,
                    grades: selectedGrades,
                    domain: formData.domain,
                    idCardUrl: 'https://placehold.co/600x400', // Default placeholder as field is removed
                    serviceType: formData.serviceType
                }),
            });

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "فشل التسجيل");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4" dir="rtl">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">تم استلام طلبك!</h2>
                    <p className="text-slate-500 mb-8">
                        تم استلام طلبك للانضمام كمعلم. سيقوم فريقنا بمراجعة التفاصيل وتفعيل منصتك قريباً.
                    </p>
                    <Link href="/login" className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                        العودة لتسجيل الدخول
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-slate-950" dir="rtl">
            {/* Visual Side */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 max-w-lg text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-extrabold mb-6">ابني أكاديميتك الرقمية</h1>
                        <p className="text-xl text-slate-300 mb-8">
                            انضم إلى آلاف المعلمين الذين يغيرون تجربة التعليم. احصل على منصتك الخاصة، وتطبيق جوال، وأدوات استوديو متكاملة.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-right">
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <h3 className="font-bold text-lg mb-1">دومين خاص بك</h3>
                                <p className="text-sm text-slate-300">ابدأ بـ your-name.alshateracademy.com فوراً.</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <h3 className="font-bold text-lg mb-1">آمن وخاص</h3>
                                <p className="text-sm text-slate-300">محتواك، طلابك، وقواعدك الخاصة.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-8 overflow-y-auto h-screen">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            طلب انضمام معلم
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">ابدأ رحلتك التعليمية الرقمية في دقائق</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider text-right">المعلومات الشخصية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-right">الاسم الكامل</label>
                                    <div className="relative">
                                        <User className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                                            placeholder="أ. محمد الشاطر"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-right">رقم الهاتف</label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            required
                                            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                                            placeholder="01xxxxxxxxx"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-right">البريد الإلكتروني</label>
                                <div className="relative">
                                    <Mail className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                                        placeholder="teacher@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider text-right">الملف المهني</h3>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-right">المادة الدراسية</label>
                                <div className="relative">
                                    <Book className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                                        placeholder="مثال: الرياضيات، الفيزياء"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-right">المراحل الدراسية</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedGrades.includes('PREPARATORY') ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                                            checked={selectedGrades.includes('PREPARATORY')}
                                            onChange={() => toggleGrade('PREPARATORY')}
                                        />
                                        <span className="font-medium">المرحلة الإعدادية</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedGrades.includes('SECONDARY') ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                                            checked={selectedGrades.includes('SECONDARY')}
                                            onChange={() => toggleGrade('SECONDARY')}
                                        />
                                        <span className="font-medium">المرحلة الثانوية</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider text-right">إعداد المنصة</h3>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-right">رابط منصتك (Subdomain)</label>
                                <div className="flex flex-row-reverse gap-2">
                                    <div className="relative flex-1" dir="ltr">
                                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                                            <span className="pl-4 text-slate-500 font-medium">shater.com/</span>
                                            <input
                                                type="text"
                                                required
                                                className="w-full py-3 px-2 bg-transparent outline-none font-bold text-indigo-600 placeholder-indigo-300"
                                                placeholder="mr-ahmed"
                                                value={formData.domain}
                                                onChange={(e) => setFormData({ ...formData, domain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateDomain}
                                        className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors whitespace-nowrap"
                                    >
                                        اقتراح اسم
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-right">سيكون هذا هو الرابط الذي يشاركه طلابك للوصول إلى محتواك.</p>
                            </div>

                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider text-right">الأمان</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Lock className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full pr-10 pl-12 py-2.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                                        placeholder="كلمة المرور"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                                        placeholder="تأكيد كلمة المرور"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed mt-8 text-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    جاري تقديم الطلب...
                                </>
                            ) : (
                                <>
                                    إرسال الطلب <ChevronLeft size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        <span>لديك حساب بالفعل؟ </span>
                        <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                            تسجيل الدخول
                        </Link>
                    </p>

                </motion.div>
            </div>
        </div>
    );
}
