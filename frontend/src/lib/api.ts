
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        cache: 'no-store', // Disable caching globally for better data freshness
        ...options,
        headers,
    });

    let data;
    try {
        data = await res.json();
    } catch (error) {
        // If JSON parse fails, it might be an empty success or non-JSON error
        if (res.ok) return {}; // Assume empty success
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    if (!res.ok) {
        const err: any = new Error(data.message || `Error ${res.status}: ${res.statusText}`);
        err.status = res.status;
        throw err;
    }

    return data;
}
