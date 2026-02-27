import { notFound } from 'next/navigation';

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

async function getTenant(subdomain: string) {
    try {
        const res = await fetch(`${API_URL}/tenants/subdomain/${subdomain}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export default async function TenantPage({
    params,
}: {
    params: { subdomain: string };
}) {
    const tenant = await getTenant(params.subdomain);

    if (!tenant) {
        notFound();
    }

    return (
        <div
            dir="rtl"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
                color: 'white',
                fontFamily: 'sans-serif',
                padding: '2rem',
            }}
        >
            <div
                style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '1.5rem',
                    padding: '3rem',
                    textAlign: 'center',
                    maxWidth: '600px',
                    width: '100%',
                    border: '1px solid rgba(255,255,255,0.15)',
                }}
            >
                {tenant.logo && (
                    <img
                        src={tenant.logo}
                        alt={tenant.name}
                        style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: '1.5rem', objectFit: 'cover' }}
                    />
                )}
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {tenant.name || params.subdomain}
                </h1>
                {tenant.description && (
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: 1.7 }}>
                        {tenant.description}
                    </p>
                )}
                <a
                    href="/courses"
                    style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        color: 'white',
                        padding: '0.85rem 2.5rem',
                        borderRadius: '0.75rem',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        fontSize: '1rem',
                    }}
                >
                    استعرض الكورسات
                </a>
            </div>
        </div>
    );
}

export async function generateMetadata({
    params,
}: {
    params: { subdomain: string };
}) {
    const tenant = await getTenant(params.subdomain);
    return {
        title: tenant?.name || params.subdomain,
        description: tenant?.description || '',
    };
}
