import { headers } from 'next/headers';
import MainLandingPage from '../components/MainLandingPage';
import TenantLandingPage from '../components/TenantLandingPage';

export default async function Page() {
  const headersList = await headers();
  const subdomain = headersList.get('x-tenant-subdomain');

  if (subdomain) {
    return <TenantLandingPage subdomain={subdomain} />;
  }

  return <MainLandingPage />;
}
