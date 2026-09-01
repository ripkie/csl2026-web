import { createClient } from "@supabase/supabase-js";

// Client service role — CUMA dipakai di server (API routes), jangan pernah
// diimport dari komponen client. Bypass RLS, dipakai buat INSERT data sensor.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
