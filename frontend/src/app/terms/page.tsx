import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Scale, FileText } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
            <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                            ش
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            المنصة التعليمية
                        </span>
                    </Link>
                    <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors font-medium hover:bg-white/5 px-4 py-2 rounded-lg">
                        العودة للرئيسية <ArrowRight size={16} />
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-20 relative">
                {/* Background decors */}
                <div className="absolute top-0 right-[20%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="text-center mb-20 relative z-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-indigo-500/10 text-indigo-400 mb-8 border border-indigo-500/20 shadow-xl shadow-indigo-500/5 rotate-3 hover:rotate-0 transition-all">
                        <ShieldCheck size={48} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">وثيقة الحقوق والشروط</h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        توضح هذه الوثيقة الشروط الخاصة باستخدام المنصة، وحقوق الملكية الفكرية لحماية المعلمين، والقوانين المنظمة لعملية التعلم الإلكتروني.
                    </p>
                </div>

                <div className="space-y-8 text-slate-300 leading-relaxed relative z-10">
                    <section className="bg-slate-900/50 hover:bg-slate-900/80 transition-colors border border-white/5 hover:border-indigo-500/20 rounded-3xl p-8 md:p-10 backdrop-blur-sm shadow-xl shadow-black/20">
                        <div className="flex items-center gap-4 mb-8 text-indigo-400 pb-6 border-b border-white/5">
                            <div className="p-3 bg-indigo-500/10 rounded-xl">
                                <Scale size={32} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">1. حقوق الملكية الفكرية للمحتوى</h2>
                        </div>
                        <div className="space-y-6 text-lg">
                            <p>
                                يخضع جميع المحتوى التعليمي المعروض على هذه المنصة (من فيديوهات، مذكرات، رسومات، وشروحات) للحماية بموجب القوانين والتشريعات الخاصة بحقوق النشر والملكية الفكرية.
                            </p>
                            <ul className="list-none space-y-4 text-slate-400">
                                <li className="flex gap-3">
                                    <span className="text-red-500 mt-1">⊘</span>
                                    <span><strong>يُمنع منعاً باتاً</strong> تحميل، أو تسجيل الشاشة، أو إعادة توزيع، أو بيع أي مواد تعليمية تخص المنصة أو المعلمين بأي شكل من الأشكال.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-indigo-500 mt-1">⚡</span>
                                    <span>أي محاولة لخرق هذه القوانين تعرّض صاحبها للمساءلة القانونية والحظر النهائي الفوري من المنصة مع عدم الرجوع بالرسوم المالية.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-indigo-500 mt-1">🛡️</span>
                                    <span>يتم وضع علامات مائية مشفرة وغير مرئية تتضمن بيانات رقم هاتف الطالب وحسابه في كل إطار من الفيديو لتتبع مسربي المحتوى وتطبيق العقاب.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-slate-900/50 hover:bg-slate-900/80 transition-colors border border-white/5 hover:border-purple-500/20 rounded-3xl p-8 md:p-10 backdrop-blur-sm shadow-xl shadow-black/20">
                        <div className="flex items-center gap-4 mb-8 text-purple-400 pb-6 border-b border-white/5">
                            <div className="p-3 bg-purple-500/10 rounded-xl">
                                <FileText size={32} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">2. أمان الحسابات وشروط الاستخدام</h2>
                        </div>
                        <div className="space-y-6 text-lg">
                            <p>
                                يلتزم الطالب/المشترك بالحفاظ على سرية بيانات حسابه، ويتحمل المسؤولية الكاملة عن أي نشاط يتم تحت هذا الحساب.
                            </p>
                            <ul className="list-none space-y-4 text-slate-400">
                                <li className="flex gap-3">
                                    <span className="text-purple-500 mt-1">📌</span>
                                    <span>لا يُسمح بمشاركة بيانات الدخول والحساب مع أي شخص آخر، الحساب مخصص لاشتراك فرد واحد فقط.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-purple-500 mt-1">⚙️</span>
                                    <span>سيقوم النظام الأمني تلقائياً بتعليق الحساب عند اكتشاف تسجيل الدخول من أجهزة متعددة أو مواقع جغرافية مختلفة بشكل مريب.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-purple-500 mt-1">💡</span>
                                    <span>المنصة لا تتحمل مسؤولية سرقة بيانات الدخول نتيجة إهمال المستخدم، يرجى دائماً استخدام كلمات مرور قوية.</span>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="border-t border-white/5 py-10 mt-20 text-center text-slate-500 bg-slate-950 flex flex-col items-center gap-4">
                <div>
                    <p className="font-bold text-slate-400 text-lg mb-2">القانون يحمي الإبداع</p>
                    <p>جميع الحقوق محفوظة المعلمين وأكاديميات المنصة &copy; {new Date().getFullYear()}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-sm bg-slate-900 border border-white/5 px-6 py-3 rounded-full">
                    تم التطوير بكل <span className="text-red-500 text-lg animate-pulse">❤</span> بواسطة <span className="text-indigo-400 font-bold ml-1">yaseen sabry alawamy</span>
                </div>
            </footer>
        </div>
    );
}
