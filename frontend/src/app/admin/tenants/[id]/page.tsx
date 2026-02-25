'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAPI } from '../../../../lib/api';
import { Loader2, ArrowLeft, Save, Plus, Trash2, Edit, Monitor, BookOpen, Users, Facebook, Twitter, Instagram, Youtube, Linkedin, Globe, Moon, Sun, Settings, AlertTriangle, ShieldAlert } from 'lucide-react';
import TenantLandingPage from '../../../../components/TenantLandingPage';

export default function TenantManagePage() {
    const params = useParams();
    const router = useRouter();
    const tenantId = params.id as string;

    const [tenant, setTenant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'courses' | 'design' | 'users' | 'settings'>('courses');

    useEffect(() => {
        loadTenant();
    }, [tenantId]);

    async function loadTenant() {
        setLoading(true);
        try {
            const data = await fetchAPI(`/tenants/${tenantId}`);
            setTenant(data);
        } catch (error) {
            console.error(error);
            alert('Failed to load tenant');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8" /></div>;
    if (!tenant) return <div className="p-8 text-center">Tenant not found</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8" dir="rtl">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                        {tenant.name}
                        {tenant.isActive ? (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">نشط</span>
                        ) : (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full border border-red-200">غير نشط</span>
                        )}
                    </h1>
                    <p className="text-slate-500 text-sm font-mono mt-1" dir="ltr">{tenant.subdomain}.elshate.com</p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
                <TabButton active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} icon={BookOpen} label="الكورسات" />
                <TabButton active={activeTab === 'design'} onClick={() => setActiveTab('design')} icon={Monitor} label="تصميم المنصة" />
                <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="الإعدادات المتقدمة" />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'courses' && <CoursesManager tenantId={tenantId} />}
                {activeTab === 'design' && <DesignManager tenant={tenant} onUpdate={setTenant} />}
                {activeTab === 'settings' && <SettingsManager tenant={tenant} onUpdate={setTenant} router={router} />}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${active ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

function CoursesManager({ tenantId }: { tenantId: string }) {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', price: 0 });

    useEffect(() => {
        loadCourses();
    }, [tenantId]);

    async function loadCourses() {
        setLoading(true);
        try {
            const data = await fetchAPI(`/courses?tenantId=${tenantId}`);
            setCourses(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateCourse(e: React.FormEvent) {
        e.preventDefault();
        try {
            await fetchAPI('/courses', {
                method: 'POST',
                body: JSON.stringify({ ...formData, tenantId })
            });
            setShowForm(false);
            setFormData({ title: '', description: '', price: 0 });
            loadCourses();
            alert('تم إنشاء الكورس بنجاح');
        } catch (error) {
            alert('فشل إنشاء الكورس');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">الكورسات المتاحة</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    إضافة كورس جديد
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 animate-fade-in">
                    <h3 className="font-bold mb-4">بيانات الكورس الجديد</h3>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">اسم الكورس</label>
                            <input
                                type="text" required
                                className="w-full p-2 border rounded-lg"
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الوصف</label>
                            <textarea
                                className="w-full p-2 border rounded-lg"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">السعر</label>
                            <input
                                type="number" required
                                className="w-full p-2 border rounded-lg"
                                value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500">إلغاء</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">حفظ</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-400">
                            {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" /> : <BookOpen size={32} />}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{course.description || 'لا يوجد وصف'}</p>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-green-600">{course.price > 0 ? `${course.price} EGP` : 'مجاني'}</span>
                            <span className="text-slate-400">{course.lessons?.length || 0} درس</span>
                        </div>
                    </div>
                ))}
                {courses.length === 0 && !loading && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                        لا توجد كورسات مضافة لهذا المعلم
                    </div>
                )}
            </div>
        </div>
    );
}

export function DesignManager({ tenant, onUpdate }: { tenant: any, onUpdate: (t: any) => void }) {
    const [formData, setFormData] = useState({
        name: tenant.name,
        primaryColor: tenant.primaryColor || '#2563eb',
        theme: tenant.theme || 'MODERN',
        logoUrl: tenant.logoUrl || '',

        // Theme Config Flattened for Form
        welcomeTitle: tenant.themeConfig?.welcomeTitle || '',
        welcomeTitleColor: tenant.themeConfig?.welcomeTitleColor || '#1e293b',
        introText: tenant.themeConfig?.introText || '',
        buttonText: tenant.themeConfig?.buttonText || '',
        logoShape: tenant.themeConfig?.logoShape || 'rounded',
        buttonStyle: tenant.themeConfig?.buttonStyle || 'rounded',
        fontFamily: tenant.themeConfig?.fontFamily || 'Cairo',

        // New Hero Fields
        heroImage: tenant.themeConfig?.heroImage || '',
        heroOverlayOpacity: tenant.themeConfig?.heroOverlayOpacity !== undefined ? tenant.themeConfig?.heroOverlayOpacity : 0.9,
        heroAlignment: tenant.themeConfig?.heroAlignment || 'center',
        heroLayout: tenant.themeConfig?.heroLayout || 'centered',

        // Modern Profile Fields
        heroBadge: tenant.themeConfig?.heroBadge || 'Advanced Educational Platform',
        instructorName: tenant.themeConfig?.instructorName || tenant.name,
        instructorTitle: tenant.themeConfig?.instructorTitle || '',
        instructorExperience: tenant.themeConfig?.instructorExperience || '',
        iconColorLight: tenant.themeConfig?.iconColorLight || '#cbd5e1',

        // Visibility & Extras
        showFeatures: tenant.themeConfig?.showFeatures !== false,
        showCourses: tenant.themeConfig?.showCourses !== false,
        showFooter: tenant.themeConfig?.showFooter !== false,
        showSocialLinks: tenant.themeConfig?.showSocialLinks !== false,
        showScrollIndicator: tenant.themeConfig?.showScrollIndicator !== false,
        showGooglePlay: tenant.themeConfig?.showGooglePlay === true,
        googlePlayLink: tenant.themeConfig?.googlePlayLink || '',

        // Custom Body
        showCustomBody: tenant.themeConfig?.showCustomBody === true,
        customBodyTitle: tenant.themeConfig?.customBodyTitle || '',
        customBodyText: tenant.themeConfig?.customBodyText || '',

        // Theme Mode
        themeMode: tenant.themeConfig?.themeMode || 'light',
        enableThemeToggle: tenant.themeConfig?.enableThemeToggle !== false,
        animationPreset: tenant.themeConfig?.animationPreset || 'dynamic',

        // Social Links
        facebook: tenant.themeConfig?.social?.facebook || '',
        twitter: tenant.themeConfig?.social?.twitter || '',
        instagram: tenant.themeConfig?.social?.instagram || '',
        youtube: tenant.themeConfig?.social?.youtube || '',
        linkedin: tenant.themeConfig?.social?.linkedin || '',
        website: tenant.themeConfig?.social?.website || '',

        id: tenant.id,
        subdomain: tenant.subdomain,
        subject: tenant.subject,
        grades: tenant.grades
    });

    const [saving, setSaving] = useState(false);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const themeConfig = {
                welcomeTitle: formData.welcomeTitle,
                welcomeTitleColor: formData.welcomeTitleColor,
                introText: formData.introText,
                buttonText: formData.buttonText,
                logoShape: formData.logoShape,
                buttonStyle: formData.buttonStyle,
                fontFamily: formData.fontFamily,
                heroImage: formData.heroImage,
                heroOverlayOpacity: formData.heroOverlayOpacity,
                heroAlignment: formData.heroAlignment,
                heroLayout: formData.heroLayout,
                heroBadge: formData.heroBadge,
                instructorName: formData.instructorName,
                instructorTitle: formData.instructorTitle,
                instructorExperience: formData.instructorExperience,
                iconColorLight: formData.iconColorLight,
                showFeatures: formData.showFeatures,
                showCourses: formData.showCourses,
                showFooter: formData.showFooter,
                showSocialLinks: formData.showSocialLinks,
                showScrollIndicator: formData.showScrollIndicator,
                showGooglePlay: formData.showGooglePlay,
                googlePlayLink: formData.googlePlayLink,
                showCustomBody: formData.showCustomBody,
                customBodyTitle: formData.customBodyTitle,
                customBodyText: formData.customBodyText,
                themeMode: formData.themeMode,
                enableThemeToggle: formData.enableThemeToggle,
                animationPreset: formData.animationPreset,
                social: {
                    facebook: formData.facebook,
                    twitter: formData.twitter,
                    instagram: formData.instagram,
                    youtube: formData.youtube,
                    linkedin: formData.linkedin,
                    website: formData.website
                }
            };

            const updated = await fetchAPI(`/tenants/${tenant.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: formData.name,
                    primaryColor: formData.primaryColor,
                    theme: formData.theme,
                    logoUrl: formData.logoUrl,
                    themeConfig
                })
            });
            onUpdate(updated);
            alert('تم تحديث التصميم بنجاح');
        } catch (error) {
            alert('فشل تحديث التصميم');
        } finally {
            setSaving(false);
        }
    }

    // Prepare preview data by restructuring state back to nested object
    const previewData = {
        ...formData,
        themeConfig: {
            welcomeTitle: formData.welcomeTitle,
            welcomeTitleColor: formData.welcomeTitleColor,
            introText: formData.introText,
            buttonText: formData.buttonText,
            logoShape: formData.logoShape,
            buttonStyle: formData.buttonStyle,
            fontFamily: formData.fontFamily,
            heroImage: formData.heroImage,
            heroOverlayOpacity: formData.heroOverlayOpacity,
            heroAlignment: formData.heroAlignment,
            heroLayout: formData.heroLayout,
            heroBadge: formData.heroBadge,
            instructorName: formData.instructorName,
            instructorTitle: formData.instructorTitle,
            instructorExperience: formData.instructorExperience,
            iconColorLight: formData.iconColorLight,
            showFeatures: formData.showFeatures,
            showCourses: formData.showCourses,
            showFooter: formData.showFooter,
            showSocialLinks: formData.showSocialLinks,
            showScrollIndicator: formData.showScrollIndicator,
            showGooglePlay: formData.showGooglePlay,
            googlePlayLink: formData.googlePlayLink,
            showCustomBody: formData.showCustomBody,
            customBodyTitle: formData.customBodyTitle,
            customBodyText: formData.customBodyText,
            themeMode: formData.themeMode,
            enableThemeToggle: formData.enableThemeToggle,
            animationPreset: formData.animationPreset,
            social: {
                facebook: formData.facebook,
                twitter: formData.twitter,
                instagram: formData.instagram,
                youtube: formData.youtube,
                linkedin: formData.linkedin,
                website: formData.website
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 sticky top-8 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
                <div>
                    <h2 className="text-xl font-bold mb-1">تخصيص مظهر المنصة</h2>
                    <p className="text-slate-500 text-sm">تحكم في هوية منصة المعلم الخاصة</p>
                </div>

                {/* 1. Basic Identity */}
                <div className="space-y-4 pb-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">1</span>
                        الهوية والنصوص
                    </h3>
                    <div>
                        <label className="block text-sm font-medium mb-1">اسم المنصة</label>
                        <input
                            type="text" required
                            className="w-full p-2 border rounded-lg"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">عنوان الترحيب</label>
                        <textarea
                            placeholder="مثال: أهلاً بكم في أكاديمية التفوق"
                            className="w-full p-2 border rounded-lg font-bold text-lg"
                            rows={2}
                            value={formData.welcomeTitle} onChange={e => setFormData({ ...formData, welcomeTitle: e.target.value })}
                        />
                        <p className="text-xs text-slate-400 mt-1">يظهر بخط كبير في واجهة الموقع</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">لون العنوان</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                className="w-10 h-10 p-1 rounded cursor-pointer border shadow-sm"
                                value={formData.welcomeTitleColor} onChange={e => setFormData({ ...formData, welcomeTitleColor: e.target.value })}
                            />
                            <div className="text-xs font-mono bg-slate-50 p-2 rounded flex-1 text-center">
                                {formData.welcomeTitleColor}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">نص المقدمة</label>
                        <textarea
                            placeholder="وصف قصير يظهر تحت العنوان..."
                            className="w-full p-2 border rounded-lg min-h-[80px]"
                            value={formData.introText} onChange={e => setFormData({ ...formData, introText: e.target.value })}
                        />
                    </div>
                </div>

                {/* 2. Style & Colors */}
                <div className="space-y-4 pb-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">2</span>
                        الألوان والخطوط
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">اللون الرئيسي</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    className="w-10 h-10 p-1 rounded cursor-pointer border shadow-sm"
                                    value={formData.primaryColor} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                                />
                                <div className="text-xs font-mono bg-slate-50 p-2 rounded flex-1 text-center">
                                    {formData.primaryColor}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">نوع الخط</label>
                            <select
                                className="w-full p-2 border rounded-lg bg-white h-10"
                                value={formData.fontFamily} onChange={e => setFormData({ ...formData, fontFamily: e.target.value })}
                            >
                                <option value="Cairo">Cairo (الافتراضي)</option>
                                <option value="Tajawal">Tajawal</option>
                                <option value="Almarai">Almarai</option>
                                <option value="IBM Plex Sans Arabic">IBM Plex Sans</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">رابط الشعار</label>
                            <input
                                type="url" placeholder="https://..."
                                className="w-full p-2 border rounded-lg text-sm"
                                value={formData.logoUrl} onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">نص الزر</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg text-sm"
                                value={formData.buttonText} onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">حواف الشعار</label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {['rounded', 'circle', 'square'].map(s => (
                                    <button
                                        type="button"
                                        key={s}
                                        onClick={() => setFormData({ ...formData, logoShape: s })}
                                        className={`flex-1 py-1 text-xs rounded-md capitalize ${formData.logoShape === s ? 'bg-white shadow-sm font-bold text-indigo-600' : 'text-slate-500'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">حواف الأزرار</label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {['rounded', 'pill', 'sharp'].map(s => (
                                    <button
                                        type="button"
                                        key={s}
                                        onClick={() => setFormData({ ...formData, buttonStyle: s })}
                                        className={`flex-1 py-1 text-xs rounded-md capitalize ${formData.buttonStyle === s ? 'bg-white shadow-sm font-bold text-indigo-600' : 'text-slate-500'}`}
                                    >
                                        {s.substring(0, 4)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Display, Theme & Layout */}
                <div className="space-y-4 pb-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">4</span>
                        الثيم والتخطيط
                    </h3>

                    {/* Dark/Light Mode Config */}
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl space-y-3 mb-4">
                        <h4 className="font-bold text-indigo-900 text-sm mb-2">الوضع الليلي (Dark Mode)</h4>

                        <div className="flex gap-2 bg-white p-1 rounded-lg mb-2">
                            {[{ id: 'light', label: 'فاتح', icon: Sun }, { id: 'dark', label: 'داكن', icon: Moon }, { id: 'system', label: 'تلقائي', icon: Monitor }].map(t => (
                                <button
                                    type="button"
                                    key={t.id}
                                    onClick={() => setFormData({ ...formData, themeMode: t.id })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-md capitalize ${formData.themeMode === t.id ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <t.icon size={16} />
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                            <h4 className="font-bold text-slate-700 text-sm">أيقونات وعناصر الواجهة</h4>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">عرض مؤشر السكرول (Scroll Down)</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, showScrollIndicator: !formData.showScrollIndicator })}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${formData.showScrollIndicator ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'}`}
                                >
                                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">عرض زر Google Play</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, showGooglePlay: !formData.showGooglePlay })}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${formData.showGooglePlay ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'}`}
                                >
                                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                </button>
                            </div>

                            {formData.showGooglePlay && (
                                <div className="animate-fade-in">
                                    <label className="block text-xs font-medium mb-1">رابط تطبيق Google Play</label>
                                    <input
                                        type="url"
                                        placeholder="https://play.google.com/store/apps/..."
                                        className="w-full p-2 border rounded-lg text-sm dir-ltr"
                                        value={formData.googlePlayLink} onChange={e => setFormData({ ...formData, googlePlayLink: e.target.value })}
                                    />
                                </div>
                            )}

                            {formData.heroLayout === 'modern_profile' && (
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                                    <div>
                                        <label className="block text-xs font-medium mb-1">لون الأيقونات (فاتح)</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                className="w-8 h-8 p-0.5 rounded cursor-pointer border shadow-sm"
                                                value={formData.iconColorLight} onChange={e => setFormData({ ...formData, iconColorLight: e.target.value })}
                                            />
                                            <span className="text-xs font-mono text-slate-500">{formData.iconColorLight}</span>
                                        </div>
                                    </div>
                                    {/* Placeholder for Dark Mode Icon Color if needed later, currently using one for simplicity or we can add iconColorDark */}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">عرض التذييل (Footer)</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, showFooter: !formData.showFooter })}
                                className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${formData.showFooter ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'}`}
                            >
                                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">عرض أيقونات التواصل الاجتماعي</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, showSocialLinks: !formData.showSocialLinks })}
                                className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${formData.showSocialLinks ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'}`}
                            >
                                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 6. Social Media */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">6</span>
                        التواصل الاجتماعي
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SocialInput icon={Facebook} placeholder="رابط فيسبوك" value={formData.facebook} onChange={v => setFormData({ ...formData, facebook: v })} />
                        <SocialInput icon={Twitter} placeholder="رابط تويتر (X)" value={formData.twitter} onChange={v => setFormData({ ...formData, twitter: v })} />
                        <SocialInput icon={Instagram} placeholder="رابط انستجرام" value={formData.instagram} onChange={v => setFormData({ ...formData, instagram: v })} />
                        <SocialInput icon={Youtube} placeholder="رابط يوتيوب" value={formData.youtube} onChange={v => setFormData({ ...formData, youtube: v })} />
                        <SocialInput icon={Linkedin} placeholder="رابط لينكد إن" value={formData.linkedin} onChange={v => setFormData({ ...formData, linkedin: v })} />
                        <SocialInput icon={Globe} placeholder="رابط الموقع الإلكتروني" value={formData.website} onChange={v => setFormData({ ...formData, website: v })} />
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end sticky bottom-0 bg-white pb-2 z-10 transition-all">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        حفظ ونشر التغييرات
                    </button>
                </div>
            </form >

            <div className="space-y-4 sticky top-8">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-700">معاينة حية</h3>
                    <div className="flex gap-2">
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Desktop Preview</span>
                    </div>
                </div>
                <div className="border-4 border-slate-900 rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-xl h-[650px] relative flex flex-col">
                    {/* Fake Browser Toolbar */}
                    <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 shrink-0">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <div className="ml-4 flex-1 bg-slate-800 rounded-md h-6 w-full max-w-[200px] mx-auto opacity-50 text-[10px] text-center text-slate-400 flex items-center justify-center font-mono">
                            {formData.subdomain}.elshate.com
                        </div>
                    </div>
                    {/* Preview Content (Scaled) */}
                    <div className="flex-1 bg-white relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-[153.8%] h-[153.8%] origin-top-left scale-[0.65] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                            <TenantLandingPage initialTenantData={previewData} />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

function SocialInput({ icon: Icon, placeholder, value, onChange }: { icon: any, placeholder: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Icon size={16} />
            </div>
            <input
                type="url"
                placeholder={placeholder}
                className="w-full pr-10 pl-3 py-2 border rounded-lg text-sm"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}

function SettingsManager({ tenant, onUpdate, router }: { tenant: any, onUpdate: any, router: any }) {
    const [loading, setLoading] = useState(false);

    const toggleStatus = async () => {
        if (!confirm(`هل أنت متأكد من أنك تريد ${tenant.isActive ? 'إيقاف' : 'تفعيل'} هذه المنصة؟`)) return;
        setLoading(true);
        try {
            const endpoint = tenant.isActive ? `/admin/tenants/${tenant.id}/deactivate` : `/admin/tenants/${tenant.id}/activate`;
            const body = tenant.isActive ? undefined : {
                start: new Date().toISOString(),
                end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year default
            };

            await fetchAPI(endpoint, {
                method: 'POST',
                body: body ? JSON.stringify(body) : undefined
            });
            onUpdate({ ...tenant, isActive: !tenant.isActive });
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء تغيير الحالة.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`تحذير خطير جداً!\nهل أنت متأكد من رغبتك في حذف منصة '${tenant.name}' نهائياً بالكامل؟\nسيتم مسح الكورسات، والطلاب، ونتائج الامتحانات وكل البيانات ولن يمكن استرجاعها.`)) return;

        const verification = prompt(`لحذف المنصة، يرجى كتابة اسم المنصة لتأكيد الحذف: ${tenant.name}`);
        if (verification !== tenant.name) {
            alert('لم يتم الحذف: اسم المنصة غير متطابق.');
            return;
        }

        setLoading(true);
        try {
            await fetchAPI(`/admin/tenants/${tenant.id}/delete`, {
                method: 'POST'
            });
            alert('تم حذف المنصة بنجاح.');
            router.push('/admin');
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء حذف المنصة.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">إعدادات المنصة المتقدمة</h2>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-white">
                            <ShieldAlert className="text-orange-500" size={20} />
                            حالة تشغيل المنصة
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            عند إيقاف المنصة، لن يتمكن المعلم أو طلابه من الدخول إليها أو التفاعل مع محتواها.
                        </p>
                    </div>
                    <button
                        onClick={toggleStatus}
                        disabled={loading}
                        className={`px-6 py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center min-w-[150px]
                            ${tenant.isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-500 hover:bg-emerald-600'}
                        `}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : (
                            tenant.isActive ? 'إيقاف المنصة' : 'تشغيل المنصة'
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                            <AlertTriangle size={20} />
                            حذف المنصة نهائياً
                        </h3>
                        <p className="text-red-600/80 dark:text-red-400/80 text-sm mt-1 max-w-xl">
                            سيؤدي هذا الإجراء إلى مسح كافة بيانات المعلم، وكورساته، وتسجيلات الطلاب، وجميع الملفات المرتبطة بشكل دائم. هذا الإجراء لا يمكن التراجع عنه!
                        </p>
                    </div>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-6 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 min-w-[150px]"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : (
                            <>
                                <Trash2 size={18} />
                                حذف نهائي
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
