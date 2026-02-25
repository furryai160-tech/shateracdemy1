'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ChevronLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        // TODO: Call API
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800"
            >
                <Link href="/login" className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors">
                    <ChevronLeft size={20} className="mr-1" />
                    Back to Login
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                    <p className="text-slate-500 dark:text-slate-400">Enter your email to receive recovery instructions.</p>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                        >
                            Send Reset Link
                        </button>
                    </form>
                ) : (
                    <div className="text-center bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                        <h3 className="text-green-800 dark:text-green-200 font-bold mb-2">Check your inbox</h3>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                            We've sent a password reset link to <span className="font-semibold">{email}</span>.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
