
'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import { fetchAPI } from '../../../lib/api';

export default function TeacherWalletRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [vodafoneNumber, setVodafoneNumber] = useState('');
    const [savingNumber, setSavingNumber] = useState(false);
    const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED

    const filteredRequests = requests.filter(req => {
        if (filter === 'ALL') return true;
        return req.status === filter;
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Load requests independent of settings to prevent total failure
            try {
                const requestsData = await fetchAPI('/wallet/requests');
                console.log('Requests loaded:', requestsData); // Debug log
                setRequests(requestsData || []);
            } catch (e: any) {
                console.error("Failed to load requests", e);
                setError(e.message || 'Failed to load requests');
            }


            try {
                const numberData = await fetchAPI('/wallet/settings/vodafone/me');
                setVodafoneNumber(numberData.number || '');
            } catch (e) {
                console.error("Failed to load vodafone settings", e);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNumber = async () => {
        setSavingNumber(true);
        try {
            await fetchAPI('/wallet/settings/vodafone', {
                method: 'POST',
                body: JSON.stringify({ number: vodafoneNumber })
            });
            alert('تم حفظ الرقم بنجاح');
        } catch (error) {
            console.error("Failed to save number", error);
            alert('فشل حفظ الرقم');
        } finally {
            setSavingNumber(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        if (!confirm(action === 'approve' ? 'هل أنت متأكد من قبول هذا الطلب؟' : 'هل أنت متأكد من رفض هذا الطلب؟')) return;

        setProcessing(id);
        try {
            await fetchAPI(`/wallet/${action}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(action === 'reject' ? { reason: 'رفض من قبل المدرس' } : {})
            });
            // Update status in list instead of removing (so history remains visible)
            setRequests(requests.map(r =>
                r.id === id
                    ? { ...r, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
                    : r
            ));
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء تنفيذ العملية');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    if (error) return (
        <div className="p-6 max-w-6xl mx-auto" dir="rtl">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <XCircle size={20} />
                <span>فشل في تحميل البيانات: {error}</span>
                <button onClick={loadData} className="mr-auto underline">إعادة المحاولة</button>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto" dir="rtl">
            <h1 className="text-2xl font-bold mb-6">إعدادات المحفظة والطلبات</h1>

            {/* Vodafone Cash Number Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">رقم فودافون كاش للاستقبال</h3>
                <div className="flex gap-4 max-w-md">
                    <input
                        type="text"
                        value={vodafoneNumber}
                        onChange={(e) => setVodafoneNumber(e.target.value)}
                        placeholder="أدخل رقم فودافون كاش"
                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSaveNumber}
                        disabled={savingNumber}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {savingNumber ? 'جاري الحفظ...' : 'حفظ الرقم'}
                    </button>
                </div>
                <p className="text-sm text-slate-500 mt-2">سيظهر هذا الرقم للطلاب عند الدخول لصفحة شحن المحفظة.</p>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">طلبات شحن رصيد الطلاب</h2>
                <div className="flex gap-2">
                    <span className="text-xs text-slate-400 self-center">
                        Total: {requests.length}, Filtered: {filteredRequests.length}
                    </span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="ALL">الكل</option>
                        <option value="PENDING">طلبات معلقة</option>
                        <option value="APPROVED">تم قبولها</option>
                        <option value="REJECTED">مرفوضة</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                {filteredRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-sm">
                                <tr>
                                    <th className="p-4 font-medium">اسم الطالب</th>
                                    <th className="p-4 font-medium">المبلغ</th>
                                    <th className="p-4 font-medium">تاريخ الطلب</th>
                                    <th className="p-4 font-medium">الإيصال</th>
                                    <th className="p-4 font-medium">القرار</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-800 dark:text-white">{req.user?.name || 'غير معروف'}</p>
                                            <p className="text-xs text-slate-500">{req.user?.phone}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-green-600">+{req.amount} ج.م</span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(req.createdAt).toLocaleString('ar-EG')}
                                        </td>
                                        <td className="p-4">
                                            {req.proofUrl ? (
                                                <a
                                                    href={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').endsWith('/') ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').slice(0, -1) : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')}${req.proofUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                                                >
                                                    <Eye size={16} /> عرض الصورة
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 text-sm">لا يوجد صورة</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {req.status === 'PENDING' ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(req.id, 'approve')}
                                                        disabled={!!processing}
                                                        className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        {processing === req.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                        قبول
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(req.id, 'reject')}
                                                        disabled={!!processing}
                                                        className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        <XCircle size={16} />
                                                        رفض
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {req.status === 'APPROVED' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                    {req.status === 'APPROVED' ? 'تم القبول' : 'مرفوض'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">لا توجد طلبات</h3>
                        <p className="text-slate-500">سجل طلبات الشحن فارغ.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
