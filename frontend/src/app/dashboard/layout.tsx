

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    BarChart3,
    Video,
    Globe,
    Moon,
    Sun,
    ChevronDown,
    Wallet,
    Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Hydration fix & user load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Check system preference or stored preference for theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const menuItems = [
        { icon: LayoutDashboard, label: 'نظرة عامة', href: '/dashboard' },
        { icon: BookOpen, label: 'الدورات التدريبية', href: '/dashboard/courses' },
        { icon: Users, label: 'الطلاب', href: '/dashboard/students' },
        { icon: Wallet, label: 'المحفظة والطلبات', href: '/dashboard/wallet' },
        { icon: Video, label: 'جلسات مباشرة', href: '/dashboard/live' },
        { icon: BarChart3, label: 'التحليلات', href: '/dashboard/analytics' },
        { icon: Settings, label: 'الإعدادات', href: '/dashboard/settings' },
    ];

    return (
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200`} dir="rtl">
            {/* Sidebar */}
            <AnimatePresence mode='wait'>
                {(sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 relative z-30 shadow-xl md:shadow-none h-full md:relative absolute right-0"
                    >
                        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
                                <span className="text-xl">ش</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg tracking-tight">الشاطر أكاديمي</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">لوحة المعلم</p>
                            </div>
                        </div>

                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                                            ${isActive
                                                ? 'bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 font-bold'
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute right-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-full"
                                            />
                                        )}
                                        <item.icon size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors'} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                }}
                                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium mb-4"
                            >
                                <LogOut size={20} />
                                <span>تسجيل الخروج</span>
                            </button>
                            <div className="text-xs text-center text-slate-400 dark:text-slate-500 flex flex-col items-center gap-1 justify-center">
                                <span>تم التطوير بكل <span className="text-red-500 animate-pulse text-sm">❤</span> بواسطة</span>
                                <span className="text-indigo-500 dark:text-indigo-400 font-bold">yaseen sabry alawamy</span>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50 dark:bg-slate-950">
                {/* Top Header */}
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors md:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold hidden md:block text-slate-800 dark:text-white">
                            {menuItems.find(i => i.href === pathname)?.label || 'لوحة التحكم'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <button className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-100 dark:border-slate-800"></span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-700">
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user?.name || 'المعلم'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.subject || 'معلم أكاديمي'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px]">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                        {user?.name?.[0]?.toUpperCase() || 'A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth hover:scroll-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
