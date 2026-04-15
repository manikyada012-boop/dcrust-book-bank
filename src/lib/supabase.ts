import { createClient } from '@supabase/supabase-js';

// We use the "!" to tell TypeScript we know these exist, 
// but we add a fallback empty string to prevent the "required" crash.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
