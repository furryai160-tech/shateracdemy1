'use client';

import { useState, useEffect } from 'react';
import {
    Users, Loader2, Search, BookOpen, GraduationCap, Mail, Phone,
    Wallet, Plus, X, CheckCircle, UserPlus
} from 'lucide-react';
import { fetchAPI } from '../../../lib/api';

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Credit wallet modal
    const [creditModal, setCreditModal] = useState<{ open: boolean; student: any | null }>({ open: false, student: null });
    const [creditAmount, setCreditAmount] = useState('');
    const [crediting, setCrediting] = useState(false);
    const [creditResult, setCreditResult] = useState<{ ok: boolean; msg: string } | null>(null);

    // Direct enroll modal
    const [enrollModal, setEnrollModal] = useState<{ open: boolean; student: any | null }>({ open: false, student: null });
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [enrolling, setEnrolling] = useState(false);
    const [enrollResult, setEnrollResult] = useState<{ ok: boolean; msg: string } | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [studentsData, coursesData] = await Promise.all([
                fetchAPI('/admin/users'),
                fetchAPI('/courses'),
            ]);
            setStudents(studentsData || []);
            setCourses(coursesData || []);
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    }

    const filtered = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    const gradeLabel: Record<string, string> = {
        PREPARATORY_1: 'أول إعدادي', PREPARATORY_2: 'ثاني إعدادي', PREPARATORY_3: 'ثالث إعدادي',
        SECONDARY_1: 'أول ثانوي', SECONDARY_2: 'ثاني ثانوي', SECONDARY_3: 'ثالث ثانوي',
    };

    // ── Wallet Credit ──────────────────────────────────────────────────────────
    const handleCredit = async () => {
        const amount = parseFloat(creditAmount);
        if (!amount || amount <= 0 || !creditModal.student) return;
        setCrediting(true);
        setCreditResult(null);
        try {
            const result = await fetchAPI('/wallet/admin-credit', {
                method: 'POST',
                body: JSON.stringify({ userId: creditModal.student.id, amount }),
            });
            setCreditResult({ ok: true, msg: result.message || 'تم الشحن بنجاح!' });
            setCreditAmount('');
        } catch (err: any) {
            setCreditResult({ ok: false, msg: err.message || 'فشل الشحن' });
        } finally {
            setCrediting(false);
        }
    };

    // ── Direct Enroll ──────────────────────────────────────────────────────────
    const handleEnroll = async () => {
        if (!selectedCourseId || !enrollModal.student) return;
        setEnrolling(true);
        setEnrollResult(null);
        try {
            const result = await fetchAPI('/enrollments/admin-enroll', {
                method: 'POST',
                body: JSON.stringify({ userId: enrollModal.student.id, courseId: selectedCourseId }),
            });
            setEnrollResult({ ok: true, msg: 'تم تسجيل الطالب في الكورس بنجاح! ✅' });
            setSelectedCourseId('');
        } catch (err: any) {
            const msg = err.message || 'فشل التسجيل';
            // "Already enrolled" is not a real error
            if (msg.includes('already')) {
                setEnrollResult({ ok: true, msg: 'الطالب مسجّل بالفعل في هذا الكورس ✅' });
            } else {
                setEnrollResult({ ok: false, msg });
            }
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-slate-800 dark:text-white">إدارة الطلاب</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {students.length} طالب مسجل في أكاديميتك
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute right-3 top-2.5 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ابحث باسم الطالب أو الإيميل..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
                        <Users size={36} className="text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {search ? 'لم يتم العثور على نتائج' : 'لا يوجد طلاب بعد'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {search ? 'جرّب بحثاً مختلفاً' : 'شارك رابط التسجيل مع طلابك للبدء'}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">الطالب</th>
                                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">المرحلة</th>
                                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden lg:table-cell">الهاتف</th>
                                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">الكورسات</th>
                                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">الانضمام</th>
                                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">تسجيل مباشر</th>
                                    <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">شحن رصيد</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.map(student => (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                    {student.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{student.name || 'بدون اسم'}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <Mail size={10} />{student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                                                <GraduationCap size={12} />
                                                {gradeLabel[student.gradeLevel] || student.gradeLevel || 'غير محدد'}
                                            </span>
                                        </td>
                                        <td className="p-4 hidden lg:table-cell text-sm text-slate-500">
                                            {student.phone ? (
                                                <span className="flex items-center gap-1"><Phone size={14} />{student.phone}</span>
                                            ) : '—'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                                                <BookOpen size={12} />{student._count?.enrollments || 0}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-500 hidden md:table-cell">
                                            {new Date(student.createdAt).toLocaleDateString('ar-EG')}
                                        </td>
                                        {/* Direct Enroll */}
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => { setEnrollModal({ open: true, student }); setEnrollResult(null); setSelectedCourseId(''); }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                <UserPlus size={14} />
                                                تسجيل
                                            </button>
                                        </td>
                                        {/* Credit Wallet */}
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => { setCreditModal({ open: true, student }); setCreditResult(null); setCreditAmount(''); }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                <Plus size={14} />
                                                شحن
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Direct Enroll Modal ───────────────────────────────────────────── */}
            {enrollModal.open && enrollModal.student && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-200 dark:border-slate-700" dir="rtl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <UserPlus size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">تسجيل مباشر في كورس</h3>
                                    <p className="text-xs text-slate-500">{enrollModal.student.name || enrollModal.student.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEnrollModal({ open: false, student: null })}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {enrollResult && (
                            <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 ${enrollResult.ok ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                                <CheckCircle size={20} />
                                <p className="text-sm font-medium">{enrollResult.msg}</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                اختر الكورس
                            </label>
                            <select
                                value={selectedCourseId}
                                onChange={e => setSelectedCourseId(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                            >
                                <option value="">-- اختر الكورس --</option>
                                {courses.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title} {c.price > 0 ? `(${c.price} ج.م)` : '(مجاني)'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleEnroll}
                            disabled={!selectedCourseId || enrolling}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {enrolling ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                            {enrolling ? 'جاري التسجيل...' : 'تسجيل الطالب مباشرةً'}
                        </button>

                        <p className="text-xs text-slate-400 text-center mt-3">
                            التسجيل المباشر لا يتطلب دفع — للاستخدام من قِبل الإدارة فقط
                        </p>
                    </div>
                </div>
            )}

            {/* ── Credit Wallet Modal ───────────────────────────────────────────── */}
            {creditModal.open && creditModal.student && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-200 dark:border-slate-700" dir="rtl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Wallet size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">شحن رصيد مباشر</h3>
                                    <p className="text-xs text-slate-500">{creditModal.student.name || creditModal.student.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setCreditModal({ open: false, student: null })}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {creditResult && (
                            <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 ${creditResult.ok ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                                <CheckCircle size={20} />
                                <p className="text-sm font-medium">{creditResult.msg}</p>
                            </div>
                        )}

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">المبلغ (ج.م)</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="مثال: 200"
                                value={creditAmount}
                                onChange={e => setCreditAmount(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-2xl font-bold focus:ring-2 focus:ring-green-500 focus:outline-none"
                                onKeyDown={e => e.key === 'Enter' && handleCredit()}
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {[50, 100, 200, 500].map(amt => (
                                <button
                                    key={amt}
                                    onClick={() => setCreditAmount(String(amt))}
                                    className={`py-2 rounded-lg text-sm font-bold transition-colors ${creditAmount === String(amt) ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                >
                                    {amt}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleCredit}
                            disabled={!creditAmount || parseFloat(creditAmount) <= 0 || crediting}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {crediting ? <Loader2 size={18} className="animate-spin" /> : <Wallet size={18} />}
                            {crediting ? 'جاري الشحن...' : `شحن ${creditAmount || 0} ج.م`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
