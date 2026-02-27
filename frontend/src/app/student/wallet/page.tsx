
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Upload, History, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { fetchAPI } from '../../../lib/api';

export default function StudentWalletPage() {
    const [balance, setBalance] = useState({ balance: 0, transactions: [] });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [amount, setAmount] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [mounted, setMounted] = useState(false);
    const [vodafoneNumber, setVodafoneNumber] = useState('');

    useEffect(() => {
        setMounted(true);
        loadWalletData();
    }, []);

    const loadWalletData = async () => {
        try {
            const data = await fetchAPI('/wallet/balance');
            const history = await fetchAPI('/wallet/transactions');
            const numberData = await fetchAPI('/wallet/settings/vodafone/me');
            setBalance({ balance: data.balance, transactions: history });
            setVodafoneNumber(numberData.number);
        } catch (error) {
            console.error("Failed to load wallet", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('proof', file);

        try {
            // Need to use fetch directly or update fetchAPI to handle FormData
            const token = localStorage.getItem('token');
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            const response = await fetch(`${apiUrl}/wallet/deposit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setMessage('تم إرسال طلب الشحن بنجاح. سيتم مراجعة الطلب قريباً.');
                setAmount('');
                setFile(null);
                loadWalletData(); // Refresh history
            } else {
                setMessage('فشل في إرسال الطلب. حاول مرة أخرى.');
            }
        } catch (error) {
            console.error(error);
            setMessage('حدث خطأ أثناء الرفع.');
        } finally {
            setUploading(false);
        }
    };

    if (!mounted) return null;
    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="container mx-auto p-8 max-w-4xl" dir="rtl">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Wallet className="text-blue-600" />
                محفظتي
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
                    <p className="text-blue-100 mb-2">الرصيد الحالي</p>
                    <h2 className="text-5xl font-bold mb-6">{balance.balance} ج.م</h2>
                    <div className="bg-white/10 rounded-xl p-4 text-sm">
                        <p className="mb-1">يمكنك استخدام الرصيد لدفع ثمن الكورسات.</p>
                        <p>للشحن: حول المبلغ فودافون كاش على رقم <span className="font-bold text-yellow-300">{vodafoneNumber || '...'}</span> وارفع صورة التحويل هنا.</p>
                    </div>
                </div>

                {/* Deposit Form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Upload size={20} className="text-green-600" />
                        شحن المحفظة
                    </h3>

                    {message && (
                        <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('نجاح') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleDeposit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">المبلغ (ج.م)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                                placeholder="مثال: 100"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">صورة التحويل (Screenshot)</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {uploading ? <Loader2 className="animate-spin" /> : 'إرسال طلب الشحن'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Transaction History */}
            <div className="mt-12">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <History className="text-slate-500" />
                    سجل العمليات
                </h3>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {balance.transactions.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {balance.transactions.map((tx: any) => (
                                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${tx.type === 'DEPOSIT'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {tx.type === 'DEPOSIT' ? <Upload size={20} /> : <Wallet size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">
                                                {tx.type === 'DEPOSIT' ? 'شحن رصيد' : 'شراء كورس'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(tx.createdAt).toLocaleDateString('ar-EG')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-left">
                                        <p className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-slate-800 dark:text-white'}`}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount} ج.م
                                        </p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            {tx.status === 'APPROVED' && <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle size={12} /> مكتمل</span>}
                                            {tx.status === 'PENDING' && <span className="flex items-center gap-1 text-xs text-yellow-600 font-medium"><Loader2 size={12} /> قيد المراجعة</span>}
                                            {tx.status === 'REJECTED' && <span className="flex items-center gap-1 text-xs text-red-600 font-medium"><XCircle size={12} /> مرفوض</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            لا توجد عمليات سابقة.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
