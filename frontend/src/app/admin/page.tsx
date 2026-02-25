'use client';

import { useEffect, useState } from 'react';
import {
    Users, BookOpen, DollarSign, TrendingUp,
    Activity, Check, X, Calendar, Server, MoreHorizontal, Loader2, Search
} from 'lucide-react';
import { fetchAPI } from '../../lib/api';
import { format } from 'date-fns';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'instructors'>('overview');
    const [stats, setStats] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [activatingTenant, setActivatingTenant] = useState<any>(null); // For modal
    const [activationDates, setActivationDates] = useState({ start: '', end: '' });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [statsData, requestsData] = await Promise.all([
                fetchAPI('/admin/stats'),
                fetchAPI('/admin/teacher-requests'),
            ]);
            setStats(statsData);
            setRequests(requestsData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = async (requestId: string) => {
        try {
            await fetchAPI(`/admin/teacher-requests/${requestId}/approve`, { method: 'POST' });
            loadData();
        } catch (error) {
            console.error(error);
            alert("Failed to approve");
        }
    };

    const handleReject = async (requestId: string) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;
        try {
            await fetchAPI(`/admin/teacher-requests/${requestId}/reject`, {
                method: 'POST',
                body: JSON.stringify({ reason })
            });
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    // Placeholder for activation
    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Activating tenant ${activatingTenant.id} from ${activationDates.start} to ${activationDates.end}`);
        setActivatingTenant(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20" dir="rtl">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">لوحة تحكم الإدارة</h1>
                    <p className="text-slate-500">إدارة المعلمين، الاشتراكات، وحالة المنصة.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                        نظرة عامة
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'applications' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                        طلبات الانضمام
                        {requests.filter(r => r.status === 'PENDING').length > 0 && (
                            <span className="mr-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {requests.filter(r => r.status === 'PENDING').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('instructors')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'instructors' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                        المعلمين
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="إجمالي المعلمين" value={stats?.totalUsers || 0} icon={Users} color="bg-blue-500" />
                        <StatCard title="الكورسات النشطة" value={stats?.totalCourses || 0} icon={BookOpen} color="bg-violet-500" />
                        <StatCard title="إجمالي الطلاب" value={stats?.totalEnrollments || 0} icon={Activity} color="bg-orange-500" />
                        <StatCard title="الأرباح المتوقعة" value={`${(stats?.revenue || 0).toLocaleString()} ج.م`} icon={DollarSign} color="bg-emerald-500" />
                    </div>
                </>
            )}

            {activeTab === 'applications' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg">طلبات الانضمام للمعلمين</h3>
                        <div className="relative">
                            <Search className="absolute right-3 top-2.5 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="بحث في الطلبات..."
                                className="pr-9 pl-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-sm outline-none w-64 text-right"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-medium">مقدم الطلب</th>
                                    <th className="px-6 py-4 font-medium">المادة والمراحل</th>
                                    <th className="px-6 py-4 font-medium">رابط المنصة</th>
                                    <th className="px-6 py-4 font-medium">تاريخ الطلب</th>
                                    <th className="px-6 py-4 font-medium">الحالة</th>
                                    <th className="px-6 py-4 font-medium text-left">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">لا توجد طلبات جديدة.</td>
                                    </tr>
                                ) : requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                                    {req.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{req.name}</div>
                                                    <div className="text-slate-500 text-xs">{req.email}</div>
                                                    <div className="text-slate-500 text-xs">{req.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{req.subject}</div>
                                            <div className="flex gap-1 mt-1">
                                                {Array.isArray(req.grades) && req.grades.map((g: string) => (
                                                    <span key={g} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400 font-medium">
                                                        {g === 'PREPARATORY' ? 'إعدادي' : g === 'SECONDARY' ? 'ثانوي' : g}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`http://${req.domain}.${process.env.NODE_ENV === 'production' ? 'alshateracademy.com' : 'localhost:3000'}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-mono text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                                            >
                                                {req.domain}.{process.env.NODE_ENV === 'production' ? 'alshateracademy.com' : 'localhost:3000'}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {format(new Date(req.createdAt), 'yyyy/MM/dd')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {req.status === 'PENDING' ? 'قيد الانتظار' : req.status === 'APPROVED' ? 'مقبول' : 'مرفوض'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            {req.status === 'PENDING' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req.id)}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="قبول">
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req.id)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="رفض">
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'instructors' && (
                <InstructorsTab />
            )}
        </div>
    );
}

function InstructorsTab() {
    const [instructors, setInstructors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        subject: '',
        domain: '',
        grades: [] as string[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadInstructors();
    }, []);

    async function loadInstructors() {
        try {
            const data = await fetchAPI('/admin/tenants');
            setInstructors(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await fetchAPI('/admin/instructors', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', password: '', subject: '', domain: '', grades: [] });
            loadInstructors();
            alert('تم إضافة المعلم بنجاح');
        } catch (error: any) {
            alert(error.message || 'فشل إضافة المعلم');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleGrade = (grade: string) => {
        if (formData.grades.includes(grade)) {
            setFormData({ ...formData, grades: formData.grades.filter(g => g !== grade) });
        } else {
            setFormData({ ...formData, grades: [...formData.grades, grade] });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">إدارة المعلمين</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                >
                    <Users size={20} />
                    إضافة معلم جديد
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-medium text-right">المعلم</th>
                            <th className="px-6 py-4 font-medium text-right">المادة</th>
                            <th className="px-6 py-4 font-medium text-right">الرابط (Subdomain)</th>
                            <th className="px-6 py-4 font-medium text-right">مشترك منذ</th>
                            <th className="px-6 py-4 font-medium text-right">الحالة</th>
                            <th className="px-6 py-4 font-medium text-left">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {instructors.map((instructor) => (
                            <tr key={instructor.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                <td className="px-6 py-4 text-right">
                                    <div className="font-bold text-slate-800 dark:text-slate-200">{instructor.name}</div>
                                    <div className="text-xs text-slate-500">{instructor.mobileNumber}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {instructor.subject || '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href={`http://${instructor.subdomain}.${process.env.NODE_ENV === 'production' ? 'alshateracademy.com' : 'localhost:3000'}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-mono text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                                    >
                                        {instructor.subdomain}.{process.env.NODE_ENV === 'production' ? 'alshateracademy.com' : 'localhost:3000'}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-500">
                                    {new Date(instructor.createdAt).toLocaleDateString('en-US')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${instructor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {instructor.isActive ? 'نشط' : 'غير نشط'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-left">
                                    <a
                                        href={`/admin/tenants/${instructor.id}`}
                                        className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                    >
                                        إدارة
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {instructors.length === 0 && !isLoading && (
                    <div className="p-12 text-center text-slate-500">لا يوجد معلمين حالياً</div>
                )}
            </div>

            {/* Add Instructor Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in" dir="rtl">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                            <h3 className="text-lg font-bold">إضافة معلم جديد</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">الاسم</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">رقم الهاتف</label>
                                    <input
                                        type="tel" required
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
                                <input
                                    type="email" required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">كلمة المرور</label>
                                    <input
                                        type="password" required
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">المادة</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                                        value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">الرابط الفرعي (Subdomain)</label>
                                <div className="flex gap-2 items-center" dir="ltr">
                                    <span className="text-slate-500 text-sm font-medium">shater.com/</span>
                                    <input
                                        type="text" required
                                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                                        placeholder="mr-ahmed"
                                        value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">المراحل الدراسية</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.grades.includes('PREPARATORY')}
                                            onChange={() => toggleGrade('PREPARATORY')}
                                            className="w-4 h-4 rounded text-indigo-600"
                                        />
                                        <span>إعدادي</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.grades.includes('SECONDARY')}
                                            onChange={() => toggleGrade('SECONDARY')}
                                            className="w-4 h-4 rounded text-indigo-600"
                                        />
                                        <span>ثانوي</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'إنشاء الحساب'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Keeping StatCard for use elsewhere in file if needed, but not in this component */}
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={64} />
            </div>
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 text-${color.split('-')[1]}-600`}>
                    <Icon size={24} className={`text-${color.split('-')[1]}-600`} />
                </div>
            </div>
            <div className="relative z-10">
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
            </div>
        </div>
    );
}
