import { MetadataRoute } from 'next';
import { fetchAPI } from '../lib/api';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const currentHost = process.env.NODE_ENV === 'production'
        ? 'alshateracademy.com'
        : 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const baseUrl = `${protocol}://${currentHost}`;

    const defaultUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];

    try {
        const tenants = await fetchAPI('/tenants/public/teachers');

        if (Array.isArray(tenants)) {
            const tenantUrls: MetadataRoute.Sitemap = tenants.map((tenant: any) => ({
                url: `${protocol}://${tenant.subdomain}.${currentHost}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            }));

            return [...defaultUrls, ...tenantUrls];
        }
    } catch (error) {
        console.error('Failed to generate sitemap for tenants', error);
    }

    return defaultUrls;
}
