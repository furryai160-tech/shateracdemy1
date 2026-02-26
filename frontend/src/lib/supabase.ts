import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase client for direct DB access (auth, realtime, storage, etc.)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
