'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../lib/api';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const [vodafoneNumber, setVodafoneNumber] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await fetchAPI('/wallet/settings/vodafone');
            setVodafoneNumber(data.number || '');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetchAPI('/wallet/settings/vodafone', {
                method: 'POST',
                body: JSON.stringify({ number: vodafoneNumber })
            });
            alert('Settings saved successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div dir="rtl">
            <h1 className="text-3xl font-bold mb-6">إعدادات المنصة</h1>
            <div className="grid gap-6 max-w-4xl">

                {/* Payment Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        💳 إعدادات الدفع
                    </h2>
                    <p className="text-slate-500 mb-6 text-sm">حدد طرق الدفع التي ستظهر للطلاب عند شحن المحفظة.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">رقم فودافون كاش (Vodafone Cash)</label>
                            <input
                                type="text"
                                value={vodafoneNumber}
                                onChange={(e) => setVodafoneNumber(e.target.value)}
                                placeholder="010xxxxxxxx"
                                className="w-full md:w-1/2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            <p className="text-xs text-slate-400 mt-2">
                                هذا الرقم سيظهر للطلاب في صفحة شحن المحفظة ليقوموا بالتحويل عليه.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Branding & Theme (Existing) */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 opacity-60 pointer-events-none">
                    <h2 className="text-xl font-bold mb-4">المظهر والألوان</h2>
                    <p className="text-slate-500 mb-4">قريباً..</p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">Modern Blue</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
