import Link from 'next/link';

export default function NotFoundAcademy() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-4xl font-bold text-red-600 mb-4">404 - لم يتم العثور على الأكاديمية</h1>
            <p className="text-lg text-gray-600 mb-8">
                عذراً، النطاق الفرعي الذي تبحث عنه غير مسجل في أكاديمية الشاطر.
            </p>
            <Link
                href="https://alshateracademy.com"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                العودة إلى الصفحة الرئيسية
            </Link>
        </div>
    );
}
