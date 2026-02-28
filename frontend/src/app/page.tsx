import { Metadata } from 'next';
import { headers } from 'next/headers';
import MainLandingPage from '../components/MainLandingPage';
import TenantLandingPage from '../components/TenantLandingPage';
import { fetchAPI } from '../lib/api';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const subdomain = headersList.get('x-tenant-subdomain');

  if (subdomain) {
    try {
      const tenant = await fetchAPI(`/tenants/subdomain/${subdomain}`);
      if (tenant && tenant.name) {
        // Teacher name and specialization
        const title = `${tenant.name} | ${tenant.subject || 'أكاديمية'}`;
        const description = tenant.themeConfig?.introText || `تعلم مع ${tenant.name} - ${tenant.subject || 'أفضل الدورات التعليمية'}`;

        // Ensure hostname and protocol is retrieved dynamically or fixed domain is used
        const currentHost = process.env.NODE_ENV === 'production'
          ? 'alshateracademy.com'
          : 'localhost:3000';
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

        const canonicalUrl = `${protocol}://${subdomain}.${currentHost}`;

        return {
          title,
          description,
          alternates: {
            canonical: canonicalUrl,
          },
          openGraph: {
            title,
            description,
            url: canonicalUrl,
            images: tenant.themeConfig?.heroImage ? [tenant.themeConfig.heroImage] : undefined,
          }
        };
      }
    } catch (error) {
      console.error('Failed to fetch tenant metadata', error);
    }
  }

  // Fallback for main domain or error
  const defaultHost = process.env.NODE_ENV === 'production'
    ? 'https://alshateracademy.com'
    : 'http://localhost:3000';

  return {
    title: 'أكاديمية الشاطر',
    description: 'المنصة التعليمية الأولى',
    alternates: {
      canonical: defaultHost,
    },
  };
}

export default async function Page() {
  const headersList = await headers();
  const subdomain = headersList.get('x-tenant-subdomain');

  if (subdomain) {
    return <TenantLandingPage subdomain={subdomain} />;
  }

  return <MainLandingPage />;
}
