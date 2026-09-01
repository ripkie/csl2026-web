import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { evaluateMilk, VOLUME_L } from "@/lib/milk-quality";

// GET /api/readings?limit=20 — riwayat pemeriksaan, terbaru dulu
export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 20);

  const { data, error } = await supabase
    .from("milk_readings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/readings — simpan hasil pemeriksaan baru dari device (ESP32)
// Body: { weight, ph, temperature, volume?, deviceId? }
// Wajib header x-device-key sesuai DEVICE_API_KEY. Endpoint ini gak lagi
// nerima data simulasi — semua insert dianggap dari sensor beneran.
export async function POST(req: NextRequest) {
  const key = req.headers.get("x-device-key");
  if (!key || key !== process.env.DEVICE_API_KEY) {
    return NextResponse.json({ error: "Unauthorized device" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  if (
    !body ||
    typeof body.weight !== "number" ||
    typeof body.ph !== "number" ||
    typeof body.temperature !== "number"
  ) {
    return NextResponse.json(
      { error: "Body wajib berisi weight, ph, temperature (number)" },
      { status: 400 }
    );
  }

  const source = "device" as const;

  const volume = typeof body.volume === "number" ? body.volume : VOLUME_L;
  const evaluation = evaluateMilk(body.weight, body.ph, body.temperature, volume);

  const { data, error } = await supabaseAdmin()
    .from("milk_readings")
    .insert({
      weight_kg: evaluation.weight,
      volume_l: evaluation.volume,
      density: evaluation.density,
      ph: evaluation.ph,
      temperature_c: evaluation.temperature,
      status: evaluation.status,
      source,
      device_id: body.deviceId ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, evaluation }, { status: 201 });
}