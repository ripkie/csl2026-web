import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// GET /api/readings/latest — 1 pemeriksaan paling baru buat kartu status dashboard
export async function GET() {
  const { data, error } = await supabase
    .from("milk_readings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
