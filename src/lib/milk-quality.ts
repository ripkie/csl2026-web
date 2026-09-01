export const VOLUME_L = 15; // volume jarigen tetap 15 L

export type MilkStatus = "SEGAR" | "PERLU DIPERHATIKAN" | "TIDAK SEGAR";

export type ParamCheck = {
  key: "density" | "ph" | "temperature";
  title: string;
  ok: boolean;
  okText: string;
  warnText: string;
};

export type MilkEvaluation = {
  weight: number;
  volume: number;
  density: number;
  ph: number;
  temperature: number;
  status: MilkStatus;
  statusDescription: string;
  checks: ParamCheck[];
};

// Satu-satunya tempat logic threshold kualitas susu — dipakai di frontend
// (simulasi lokal) dan API route (nyimpen ke DB), biar gak dobel logic.
export function evaluateMilk(
  weight: number,
  ph: number,
  temperature: number,
  volume: number = VOLUME_L
): MilkEvaluation {
  const density = weight / volume;

  const densityOk = density >= 1.025 && density <= 1.035;
  const phOk = ph >= 6.5 && ph <= 6.7;
  const tempOk = temperature <= 10;

  const checks: ParamCheck[] = [
    {
      key: "density",
      title: "Densitas",
      ok: densityOk,
      okText: "Densitas normal, karakteristik fisik susu dalam rentang wajar.",
      warnText: "Densitas di luar rentang 1.025–1.035 g/mL, cek berat & volume.",
    },
    {
      key: "ph",
      title: "pH",
      ok: phOk,
      okText: "pH normal, tingkat keasaman susu masih baik.",
      warnText: "pH di luar rentang 6.5–6.7, susu berpotensi mulai asam/rusak.",
    },
    {
      key: "temperature",
      title: "Suhu",
      ok: tempOk,
      okText: "Suhu susu berada pada kondisi penyimpanan yang sesuai.",
      warnText: "Suhu di atas 10°C, rantai dingin susu perlu diperhatikan.",
    },
  ];

  const issues = checks.filter((c) => !c.ok).length;
  const status: MilkStatus =
    issues === 0 ? "SEGAR" : issues === 1 ? "PERLU DIPERHATIKAN" : "TIDAK SEGAR";

  const statusDescription =
    issues === 0
      ? "Semua parameter susu berada dalam kondisi normal."
      : issues === 1
      ? "Ada 1 parameter yang perlu diperhatikan."
      : "Beberapa parameter di luar batas normal, segera periksa susu.";

  return { weight, volume, density, ph, temperature, status, statusDescription, checks };
}
