'use client';

import { Award } from 'lucide-react';

export default function StudentCertificatesPage() {
    return (
        <div className="container mx-auto p-8 max-w-7xl">
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
                <p className="text-slate-500">View and download your earned certificates.</p>
            </header>

            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Award size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Certificates Yet</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    Complete courses and pass the final exams to earn certificates. They will appear here once you've achieved them.
                </p>
            </div>
        </div>
    );
}
