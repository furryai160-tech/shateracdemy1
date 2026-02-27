'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    BookOpen,
    Award,
    Settings,
    LogOut,
    UserCircle,
    Menu,
    X,
    Wallet
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function StudentDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden" dir="rtl">
            {/* Sidebar */}
            <aside className={`fixed md:relative inset-y-0 right-0 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
                            <Image
                                src="/logo.jpg"
                                alt="شاطر أكاديمي"
                                width={36}
                                height={36}
                                className="object-cover mix-blend-multiply dark:mix-blend-normal"
                            />
                        </div>
                        <span className="font-bold text-lg dark:text-white">الشاطر أكاديمي</span>
                    </Link>
                    <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-1 text-slate-500">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <Link
                        href="/student/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive('/student/dashboard') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <LayoutDashboard size={20} />
                        لوحة التحكم
                    </Link>
                    <Link
                        href="/student/wallet"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive('/student/wallet') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <Wallet size={20} />
                        محفظتي
                    </Link>
                    <Link
                        href="/student/certificates"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive('/student/certificates') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <Award size={20} />
                        الشهادات
                    </Link>
                    <Link
                        href="/student/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive('/student/settings') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <Settings size={20} />
                        الإعدادات
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mb-4"
                    >
                        <LogOut size={20} />
                        تسجيل الخروج
                    </button>
                    <div className="text-xs text-center text-slate-400 dark:text-slate-500 flex flex-col items-center gap-1 justify-center">
                        <span>تم التطوير بكل <span className="text-red-500 animate-pulse text-sm">❤</span> بواسطة</span>
                        <span className="text-blue-500 dark:text-blue-400 font-bold">yaseen sabry alawamy</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
                {/* Mobile Header */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 md:hidden">
                    <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold">الشاطر أكاديمي</span>
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <UserCircle size={20} />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}
