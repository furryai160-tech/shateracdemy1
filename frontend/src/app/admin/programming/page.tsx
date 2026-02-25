'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Pencil, Trash2, X, Save, Code2, Github, Linkedin,
    Eye, EyeOff, ArrowUpDown, User, Star, Loader2, CheckCircle2, AlertCircle,
    GripVertical, Image as ImageIcon, List
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface ProgrammingInstructor {
    id: string;
    name: string;
    title: string;
    specialization: string;
    bio: string;
    photoUrl: string;
    skills: string[];
    githubUrl: string;
    linkedinUrl: string;
    displayOrder: number;
    isActive: boolean;
}

const emptyInstructor: Omit<ProgrammingInstructor, 'id'> = {
    name: '',
    title: '',
    specialization: '',
    bio: '',
    photoUrl: '',
    skills: [],
    githubUrl: '',
    linkedinUrl: '',
    displayOrder: 0,
    isActive: true,
};

export default function ProgrammingAdminPage() {
    const [instructors, setInstructors] = useState<ProgrammingInstructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<ProgrammingInstructor | null>(null);
    const [form, setForm] = useState(emptyInstructor);
    const [skillInput, setSkillInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = async () => {
        setLoading(true);
        try {
            const data = await fetchAPI('/programming-instructors');
            setInstructors(data);
        } catch { showToast('فشل تحميل البيانات', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ ...emptyInstructor, displayOrder: instructors.length });
        setSkillInput('');
        setShowModal(true);
    };

    const openEdit = (ins: ProgrammingInstructor) => {
        setEditing(ins);
        setForm({ ...ins });
        setSkillInput('');
        setShowModal(true);
    };

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !form.skills.includes(s)) {
            setForm(f => ({ ...f, skills: [...f.skills, s] }));
        }
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
    };

    const handleSave = async () => {
        if (!form.name || !form.title || !form.specialization) {
            showToast('الاسم والمسمى الوظيفي والتخصص مطلوبة', 'error');
            return;
        }
        setSaving(true);
        try {
            if (editing) {
                await fetchAPI(`/programming-instructors/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) });
                showToast('تم التحديث بنجاح ✅');
            } else {
                await fetchAPI('/programming-instructors', { method: 'POST', body: JSON.stringify(form) });
                showToast('تم الإضافة بنجاح ✅');
            }
            setShowModal(false);
            load();
        } catch { showToast('حدث خطأ، حاول مرة أخرى', 'error'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetchAPI(`/programming-instructors/${id}`, { method: 'DELETE' });
            showToast('تم الحذف بنجاح');
            load();
        } catch { showToast('فشل الحذف', 'error'); }
        setDeleteConfirm(null);
    };

    const toggleActive = async (ins: ProgrammingInstructor) => {
        try {
            await fetchAPI(`/programming-instructors/${ins.id}`, {
                method: 'PUT',
                body: JSON.stringify({ isActive: !ins.isActive }),
            });
            load();
        } catch { showToast('فشل تغيير الحالة', 'error'); }
    };

    return (
        <div dir="rtl" className="min-h-full" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm
                            ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <Code2 className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">صفحة البرمجة</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">إدارة مهندسي البرمجة المعروضين على الصفحة الرئيسية</p>
                    </div>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
                >
                    <Plus size={20} />
                    إضافة مهندس
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'إجمالي المهندسين', value: instructors.length, icon: User, color: 'violet' },
                    { label: 'نشط', value: instructors.filter(i => i.isActive).length, icon: Eye, color: 'emerald' },
                    { label: 'مخفي', value: instructors.filter(i => !i.isActive).length, icon: EyeOff, color: 'slate' },
                    { label: 'التخصصات', value: new Set(instructors.map(i => i.specialization.split('|')[0].trim())).size, icon: Star, color: 'amber' },
                ].map(s => (
                    <div key={s.label} className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                            ${s.color === 'violet' ? 'bg-violet-100 dark:bg-violet-900/30' :
                                s.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                    s.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
                                        'bg-slate-100 dark:bg-slate-700'}`}>
                            <s.icon size={18} className={
                                s.color === 'violet' ? 'text-violet-600' :
                                    s.color === 'emerald' ? 'text-emerald-600' :
                                        s.color === 'amber' ? 'text-amber-600' :
                                            'text-slate-500'
                            } />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-800 dark:text-white">{s.value}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 size={32} className="animate-spin text-violet-500" />
                </div>
            ) : instructors.length === 0 ? (
                <div className="text-center py-32">
                    <Code2 size={56} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-xl font-bold text-slate-400">لا يوجد مهندسون بعد</p>
                    <p className="text-sm text-slate-400 mt-2">اضغط "إضافة مهندس" لإضافة أول مهندس</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {instructors.map((ins, idx) => (
                        <motion.div
                            key={ins.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`relative bg-white dark:bg-slate-800 rounded-3xl border shadow-sm overflow-hidden transition-all hover:shadow-md
                                ${ins.isActive ? 'border-slate-100 dark:border-slate-700' : 'border-dashed border-slate-300 dark:border-slate-600 opacity-60'}`}
                        >
                            {/* Photo + overlay */}
                            <div className="relative h-48 bg-gradient-to-br from-violet-600 to-purple-900 overflow-hidden">
                                {ins.photoUrl ? (
                                    <img src={ins.photoUrl} alt={ins.name} className="w-full h-full object-cover opacity-80" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Code2 size={64} className="text-white/30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                {/* Order badge */}
                                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-black text-sm">
                                    {ins.displayOrder + 1}
                                </div>

                                {/* Status badge */}
                                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm border
                                    ${ins.isActive ? 'bg-emerald-500/80 border-emerald-400/50 text-white' : 'bg-slate-500/80 border-slate-400/50 text-white'}`}>
                                    {ins.isActive ? 'نشط' : 'مخفي'}
                                </div>

                                {/* Name on photo */}
                                <div className="absolute bottom-3 right-3 left-3">
                                    <p className="text-white font-black text-lg leading-tight">{ins.name}</p>
                                    <p className="text-violet-200 text-xs font-medium">{ins.title}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {/* Spec */}
                                <div className="flex items-center gap-2 mb-3">
                                    <Code2 size={14} className="text-violet-500 shrink-0" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{ins.specialization}</span>
                                </div>

                                {/* Bio */}
                                {ins.bio && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">{ins.bio}</p>
                                )}

                                {/* Skills */}
                                {ins.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {ins.skills.slice(0, 4).map(s => (
                                            <span key={s} className="px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-[10px] font-bold rounded-full border border-violet-100 dark:border-violet-800">
                                                {s}
                                            </span>
                                        ))}
                                        {ins.skills.length > 4 && (
                                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 text-[10px] rounded-full">+{ins.skills.length - 4}</span>
                                        )}
                                    </div>
                                )}

                                {/* Social links */}
                                <div className="flex gap-2 mb-4">
                                    {ins.githubUrl && (
                                        <a href={ins.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors font-medium">
                                            <Github size={12} /> GitHub
                                        </a>
                                    )}
                                    {ins.linkedinUrl && (
                                        <a href={ins.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 transition-colors font-medium">
                                            <Linkedin size={12} /> LinkedIn
                                        </a>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(ins)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-xs font-bold transition-all"
                                    >
                                        <Pencil size={13} /> تعديل
                                    </button>
                                    <button
                                        onClick={() => toggleActive(ins)}
                                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold transition-all"
                                        title={ins.isActive ? 'إخفاء' : 'إظهار'}
                                    >
                                        {ins.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(ins.id)}
                                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 text-xs font-bold transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={28} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">حذف المهندس؟</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">هذا الإجراء لا يمكن التراجع عنه</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 transition-all">
                                    إلغاء
                                </button>
                                <button onClick={() => handleDelete(deleteConfirm!)} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all">
                                    حذف
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-violet-600 to-purple-700">
                                <div className="flex items-center gap-3">
                                    <Code2 size={22} className="text-white" />
                                    <h2 className="text-lg font-black text-white">
                                        {editing ? 'تعديل بيانات المهندس' : 'إضافة مهندس جديد'}
                                    </h2>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

                                {/* Photo Preview + URL */}
                                <div className="flex gap-4 items-start">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center border-2 border-dashed border-violet-300 dark:border-violet-700 shrink-0">
                                        {form.photoUrl ? (
                                            <img src={form.photoUrl} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                                        ) : (
                                            <ImageIcon size={28} className="text-violet-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">🖼️ رابط الصورة</label>
                                        <input
                                            type="url"
                                            value={form.photoUrl}
                                            onChange={e => setForm(f => ({ ...f, photoUrl: e.target.value }))}
                                            placeholder="https://example.com/photo.jpg"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">الصورة الشخصية أو صورة احترافية للمهندس</p>
                                    </div>
                                </div>

                                {/* Name + Title row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">👤 الاسم*</label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            placeholder="م. أحمد محمد"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">💼 المسمى الوظيفي*</label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                            placeholder="Full Stack Developer"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Specialization */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">⚡ التخصص*</label>
                                    <input
                                        type="text"
                                        value={form.specialization}
                                        onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
                                        placeholder="Python | Django | React | PostgreSQL"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">افصل بين التقنيات بـ |</p>
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">📝 وصف قصير (يظهر تحت الصورة)</label>
                                    <textarea
                                        value={form.bio}
                                        onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                        placeholder="مهندس برمجيات متخصص في تطوير تطبيقات الويب وتعليم البرمجة للمبتدئين..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
                                    />
                                </div>

                                {/* Skills */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">🛠️ المهارات والتقنيات</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={e => setSkillInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                            placeholder="اكتب مهارة واضغط Enter أو +"
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                        />
                                        <button onClick={addSkill} className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm transition-all">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {form.skills.map(skill => (
                                            <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold rounded-full border border-violet-200 dark:border-violet-700">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="text-violet-400 hover:text-red-500 transition-colors">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                        {form.skills.length === 0 && <p className="text-xs text-slate-400">لم تُضف مهارات بعد</p>}
                                    </div>
                                </div>

                                {/* Social + Order */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                            <Github size={14} className="inline ml-1" />GitHub
                                        </label>
                                        <input type="url" value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
                                            placeholder="https://github.com/username"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                            <Linkedin size={14} className="inline ml-1" />LinkedIn
                                        </label>
                                        <input type="url" value={form.linkedinUrl} onChange={e => setForm(f => ({ ...f, linkedinUrl: e.target.value }))}
                                            placeholder="https://linkedin.com/in/username"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                            <ArrowUpDown size={14} className="inline ml-1" />ترتيب العرض
                                        </label>
                                        <input type="number" min={0} value={form.displayOrder}
                                            onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-3 cursor-pointer w-full">
                                            <div className="relative">
                                                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="sr-only" />
                                                <div className={`w-12 h-6 rounded-full transition-all ${form.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                                {form.isActive ? '👁️ ظاهر' : '🙈 مخفي'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 transition-all">
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold transition-all"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {saving ? 'جارٍ الحفظ...' : 'حفظ'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
