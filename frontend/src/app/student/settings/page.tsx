'use client';

import { Settings, User, Bell, Lock, Globe } from 'lucide-react';

export default function StudentSettingsPage() {
    return (
        <div className="container mx-auto p-8 max-w-7xl">
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-slate-500">Manage your account preferences and settings.</p>
            </header>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="grid md:grid-cols-4 min-h-[500px]">
                    {/* Settings Sidebar */}
                    <div className="border-l border-slate-200 dark:border-slate-800 p-4">
                        <nav className="space-y-1">
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl font-medium transition-colors text-right">
                                <User size={20} />
                                Profile
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-right">
                                <Lock size={20} />
                                Security
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-right">
                                <Bell size={20} />
                                Notifications
                            </button>
                        </nav>
                    </div>

                    {/* Settings Content */}
                    <div className="md:col-span-3 p-8">
                        <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                        <form className="space-y-6 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="Student Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="student@example.com" disabled />
                                <p className="text-xs text-slate-500 mt-2">Contact support to change your email.</p>
                            </div>

                            <div className="pt-4">
                                <button type="button" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
