import { createClient } from "@supabase/supabase-js";

// We check if process.env exists so we don't crash at build time if variables aren't present yet
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "service-key";

// Public client for anonymous operations (reading active items, inserting quotes)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for restricted operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
