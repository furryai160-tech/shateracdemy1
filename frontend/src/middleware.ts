import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Define the main domain
    const currentHost = process.env.NODE_ENV === 'production'
        ? 'shater.com'
        : 'localhost:3000';

    // Check if subdomain
    // For localhost:3000, hostname is localhost:3000.
    // For foo.localhost:3000, hostname is foo.localhost:3000.
    // We want to detect 'foo'.

    let subdomain = '';

    if (hostname !== currentHost && hostname !== `www.${currentHost}`) {
        // Simple logic for development: split by dot
        const parts = hostname.split('.');
        // If localhost (parts.length > 1 implied by distinction above? no.)
        // localhost:3000 -> parts=['localhost:3000'] -> length 1.
        // foo.localhost:3000 -> parts=['foo', 'localhost:3000'] -> length 2.
        if (parts.length > 1) {
            subdomain = parts[0];
        }
    }

    const response = NextResponse.next();
    if (subdomain && subdomain !== 'www') {
        response.headers.set('x-tenant-subdomain', subdomain);
    }
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
