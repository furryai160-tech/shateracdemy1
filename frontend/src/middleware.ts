import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// تهيئة عميل Supabase بمتغيرات البيئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ملاحظة: يُفضل استخدام Supabase في الـ middleware بدون صلاحيات الإداري (Anon Key) للاستعلام فقط
const supabase = createClient(supabaseUrl, supabaseKey);

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();

    // استخراج اسم المضيف (Hostname)
    const hostname = req.headers.get('host') || '';

    // تحديد النطاق الفرعي. في بيئة التطوير نستخدم localhost:3000، وفي الإنتاج نستخدم النطاق الحقيقي.
    const currentHost = process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
        ? hostname.replace(`.alshateracademy.com`, '')
        : hostname.replace(`.localhost:3000`, '');

    // 1. إذا كان النطاق هو النطاق الرئيسي أو www نعرض الصفحة الرئيسية العادية
    if (currentHost === 'alshateracademy.com' || currentHost === 'www' || currentHost === 'localhost:3000' || currentHost === '') {
        return NextResponse.next();
    }

    // النطاق المتبقي الآن هو النطاق الفرعي (Subdomain)
    const subdomain = currentHost;

    // 2. استعلام من Supabase للتحقق من وجود النطاق الفرعي في جدول tenants
    const { data: tenant, error } = await supabase
        .from('tenants')
        .select('subdomain')
        .eq('subdomain', subdomain)
        .single();

    // 3. آلية احتياطية: إذا لم يتم العثور على النطاق الفرعي في الداتا بيس، أعد التوجيه لصفحة 404
    if (error || !tenant) {
        url.pathname = '/404'; // مسار صفحة الخطأ المخصصة "لم يتم العثور على الأكاديمية"
        return NextResponse.rewrite(url);
    }

    // 4. إعادة كتابة الرابط (Rewrite) إلى مسار المستأجر الديناميكي دون تغيير الرابط في المتصفح
    const response = NextResponse.rewrite(
        new URL(`/tenant/${subdomain}${url.pathname}`, req.url)
    );

    // 5. معالجة مشكلات CORS للنطاقات الفرعية
    response.headers.set('Access-Control-Allow-Origin', '*'); // يمكنك تحديد النطاقات المسموحة بدلاً من *
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
