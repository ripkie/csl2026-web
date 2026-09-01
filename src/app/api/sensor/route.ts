import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        // Cek API key dari ESP32
        const deviceKey = request.headers.get("x-device-api-key");

        if (
            !deviceKey ||
            deviceKey !== process.env.DEVICE_API_KEY
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        // Ambil JSON dari ESP32
        const body = await request.json();

        const {
            weight_kg,
            volume_l,
            density,
            ph,
            temperature_c,
            status,
            device_id,
        } = body;

        // Validasi data
        if (
            typeof weight_kg !== "number" ||
            typeof volume_l !== "number" ||
            typeof density !== "number" ||
            typeof ph !== "number" ||
            typeof temperature_c !== "number"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid sensor data",
                },
                { status: 400 }
            );
        }

        // Insert ke Supabase
        const { data, error } = await supabase
            .from("milk_readings")
            .insert({
                weight_kg,
                volume_l,
                density,
                ph,
                temperature_c,
                status,
                source: "device",
                device_id,
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);

            return NextResponse.json(
                {
                    success: false,
                    message: "Database error",
                    error: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Data saved",
            data,
        });

    } catch (error) {
        console.error("API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Server error",
            },
            { status: 500 }
        );
    }
}
