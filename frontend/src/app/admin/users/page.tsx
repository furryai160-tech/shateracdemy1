
'use client';

import { useState, useEffect } from 'react';
import {
    Search, UserPlus, Filter, MoreVertical,
    Trash, Edit, Shield, Mail, Loader2, ChevronDown
} from 'lucide-react';
import { fetchAPI } from '../../../lib/api';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'TEACHER'>('ALL');

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await fetchAPI('/admin/users');
                setUsers(data);
            } catch (error) {
                console.error("Failed to load users", error);
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const groupedUsers = filteredUsers.reduce((acc, user) => {
        const key = user.tenant?.name || (user.role === 'SUPER_ADMIN' ? 'الإدارة العامة' : 'الطلاب غير المرتبطين بمنصة (مباشر)');
        if (!acc[key]) acc[key] = [];
        acc[key].push(user);
        return acc;
    }, {} as Record<string, any[]>);

    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]);
    };

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'STUDENT',
        gradeLevel: 'SECONDARY'
    });
    const [submitting, setSubmitting] = useState(false);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await fetchAPI('/admin/users', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', phone: '', role: 'STUDENT', gradeLevel: 'SECONDARY' });
            // Reload users
            const data = await fetchAPI('/admin/users');
            setUsers(data);
            alert('تم إنشاء المستخدم بنجاح');
        } catch (error: any) {
            alert(error.message || 'فشل إنشاء المستخدم');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة المستخدمين</h1>
                    <p className="text-slate-500">إدارة حسابات الطلاب والمعلمين.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <UserPlus size={18} />
                    <span>إضافة مستخدم</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="بحث عن مستخدم..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 bg-slate-50 dark:bg-slate-700 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer text-slate-700 dark:text-slate-300"
                >
                    <option value="ALL">الجميع</option>
                    <option value="STUDENT">الطلاب</option>
                    <option value="TEACHER">المعلمين</option>
                </select>
                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                    <Filter size={20} />
                </button>
            </div>

            {/* Users Display (Grouped) */}
            <div className="space-y-4">
                {Object.keys(groupedUsers).length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500">
                        لا يوجد مستخدمين لعرضهم
                    </div>
                ) : (
                    Object.entries(groupedUsers).map(([groupName, groupUsers]: [string, any]) => (
                        <div key={groupName} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all">
                            <button
                                onClick={() => toggleGroup(groupName)}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-slate-800 dark:text-white text-lg">{groupName}</span>
                                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2.5 py-1 rounded-full font-bold">
                                        {groupUsers.length} مستخدم
                                    </span>
                                </div>
                                <div className={`p-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${expandedGroups.includes(groupName) ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={20} />
                                </div>
                            </button>

                            {expandedGroups.includes(groupName) && (
                                <div className="border-t border-slate-200 dark:border-slate-700 overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">الاسم والدور</th>
                                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">التواصل</th>
                                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">الصف الدراسي</th>
                                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-center">الكورسات</th>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {groupUsers.map((user: any) => (
                                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                                                {user.name?.[0] || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 dark:text-white mb-1">{user.name || 'مستخدم بدون اسم'}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border
                                                                        ${user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900' :
                                                                            user.role === 'TEACHER' ? 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-900' :
                                                                                'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900'}
                                                                    `}>
                                                                        {user.role === 'SUPER_ADMIN' ? 'مسؤول' : user.role === 'TEACHER' ? 'معلم' : 'طالب'}
                                                                    </span>
                                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-slate-400 w-16">الطالب:</span>
                                                                <span dir="ltr" className="font-mono text-xs">{user.phone || '—'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-slate-400 w-16">ولي الأمر:</span>
                                                                <span dir="ltr" className="font-mono text-xs">{user.parentPhone || '—'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                                                        {user.gradeLevel || '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                                                            {user._count?.enrollments || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-left">
                                                        <div className="flex items-center justify-end gap-2" dir="ltr">
                                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                                <Trash size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Create User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in" dir="rtl">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">إضافة مستخدم جديد</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="sr-only">إغلاق</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">الاسم بالكامل</label>
                                <input
                                    type="text" required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">البريد الإلكتروني</label>
                                <input
                                    type="email" required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">كلمة المرور</label>
                                <input
                                    type="password" required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">الهاتف</label>
                                    <input
                                        type="tel"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">المرحلة الدراسية</label>
                                    <select
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.gradeLevel} onChange={e => setFormData({ ...formData, gradeLevel: e.target.value })}
                                    >
                                        <option value="PREPARATORY">إعدادي</option>
                                        <option value="SECONDARY">ثانوي</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center gap-2 transition-colors disabled:opacity-70"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={18} /> : 'إنشاء المستخدم'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
