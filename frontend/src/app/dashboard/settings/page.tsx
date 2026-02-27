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
            const data = await fetchAPI('/wallet/settings/vodafone/me');
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

            </div>
        </div>
    );
}
