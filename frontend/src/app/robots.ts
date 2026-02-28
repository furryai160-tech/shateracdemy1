import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const headersList = await headers();
    const host = headersList.get('host') || 'alshateracademy.com';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const baseUrl = `${protocol}://${host}`;

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/admin/',
                '/teacher/',
                '/student/dashboard/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
