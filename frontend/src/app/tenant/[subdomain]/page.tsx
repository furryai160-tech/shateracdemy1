import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// تهيئة عميل Supabase من طرف الخادم (Server Component)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// إعداد SEO لكل نطاق فرعي ليتوافق مع محركات البحث
export async function generateMetadata({ params }: { params: { subdomain: string } }) {
    // need to await params in Next.js 15
    const subdomain = (await params).subdomain;

    const { data: tenant } = await supabase
        .from('tenants')
        .select('name')
        .eq('subdomain', subdomain)
        .single();

    if (!tenant) return { title: 'أكاديمية غير موجودة' };

    return {
        title: `${tenant.name} | أكاديمية الشاطر`,
        description: `مرحباً بك في منصة ${tenant.name} التابعة لأكاديمية الشاطر.`,
    };
}

export default async function TenantPage({ params }: { params: { subdomain: string } }) {
    // need to await params in Next.js 15
    const subdomain = (await params).subdomain;

    // جلب بيانات المستأجر
    const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('subdomain', subdomain)
        .single();

    if (error || !tenant) {
        notFound();
    }

    // استخدم الـ theme_color من قاعدة البيانات أو وضع لون افتراضي
    const themeColor = tenant.theme_color || '#ffffff';

    return (
        <div style={{ backgroundColor: themeColor, minHeight: '100vh' }}>
            <header className="flex items-center gap-4 p-6 shadow-md bg-white">
                {tenant.logo_url ? (
                    <Image
                        src={tenant.logo_url}
                        alt={`شعار ${tenant.name}`}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-center text-sm">
                        لا توجد صورة
                    </div>
                )}
                <h1 className="text-3xl font-bold text-gray-800">{tenant.name}</h1>
            </header>

            <main className="p-8">
                <div className="bg-white/80 p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">مرحباً بك في الأكاديمية الخاصة بالمنصة</h2>
                    <p className="text-gray-600">
                        أنت تتصفح الآن النطاق الفرعي:
                        <span className="font-bold text-blue-600 ml-1" dir="ltr">
                            {tenant.subdomain}.alshateracademy.com
                        </span>
                    </p>
                    {/* يمكنك استكمال عرض دروس ومقررات المدرس الخاصة هنا باستخدام subdomain لجلب محتوياته */}
                </div>
            </main>
        </div>
    );
}
