import { createClient } from "@supabase/supabase-js";

// Client anon — dipakai buat baca data (SELECT), aman dipanggil dari mana aja
// karena RLS di tabel milk_readings cuma izinin SELECT publik.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
