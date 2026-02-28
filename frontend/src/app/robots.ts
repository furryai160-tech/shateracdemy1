import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const currentHost = process.env.NODE_ENV === 'production'
        ? 'alshateracademy.com'
        : 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const baseUrl = `${protocol}://${currentHost}`;

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
