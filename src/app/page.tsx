"use client";

import { useEffect, useState } from "react";
import {
  Milk,
  LayoutDashboard,
  History,
  AlertTriangle,
  Wifi,
  CheckCircle2,
  Scale,
  Droplet,
  FlaskConical,
  Thermometer,
  Download,
} from "lucide-react";
import { evaluateMilk, type MilkEvaluation } from "@/lib/milk-quality";

type ReadingRow = {
  id: string;
  weight_kg: number;
  volume_l: number;
  density: number;
  ph: number;
  temperature_c: number;
  status: MilkEvaluation["status"];
  source: "device" | "simulasi";
  created_at: string;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function rowToEvaluation(row: ReadingRow): MilkEvaluation {
  return evaluateMilk(Number(row.weight_kg), Number(row.ph), Number(row.temperature_c), Number(row.volume_l));
}

function ParameterCard({
  icon,
  title,
  value,
  unit,
  description,
  ok,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  description: string;
  ok: boolean;
}) {
  return (
    <div className="parameter-card">
      <div className="parameter-header">
        <div className="parameter-icon">{icon}</div>
        <span className={ok ? "normal-badge" : "normal-badge warn"}>
          {ok ? "Normal" : "Perhatian"}
        </span>
      </div>

      <p className="parameter-title">{title}</p>

      <div className="parameter-value">
        {value}
        <span>{unit}</span>
      </div>

      <p className="parameter-description">{description}</p>
    </div>
  );
}

const REFRESH_MS = 5000; // polling data sensor terbaru tiap 5 detik

export default function Home() {
  const [result, setResult] = useState<MilkEvaluation | null>(null);
  const [resultTime, setResultTime] = useState<string>("—");
  const [history, setHistory] = useState<ReadingRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      const res = await fetch("/api/readings?limit=6");
      const json = await res.json();
      const rows: ReadingRow[] = json.data ?? [];
      setHistory(rows);

      if (rows.length > 0) {
        setResult(rowToEvaluation(rows[0]));
        setResultTime(formatTime(rows[0].created_at));
      }
    } catch {
      // koneksi ke DB gagal, biarin state lama tetap tampil
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const hasData = result !== null;
  const StatusIcon = result?.status === "SEGAR" ? CheckCircle2 : AlertTriangle;
  const warnings = result?.checks.filter((c) => !c.ok) ?? [];

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand-icon">
            <Milk size={20} />
          </div>

          <div>
            <p className="eyebrow">Milk Quality Analyzer</p>
            <h2>Selamat pagi, Peternak</h2>
          </div>
        </div>

        <div className="device-status">
          <Wifi size={14} />
          <span>{loading ? "Memuat..." : "Terhubung ke database"}</span>
        </div>
      </header>

      <p className="topbar-description">
        Data sensor langsung dari perangkat (loadcell, HX711, pH sensor, sensor
        suhu) — dashboard ini otomatis refresh tiap beberapa detik, gak ada
        input manual lagi.
      </p>

      <nav className="tab-nav">
        <a href="#" className="tab-item active">
          <LayoutDashboard size={16} />
          Dashboard
        </a>

        <a href="#" className="tab-item">
          <History size={16} />
          Riwayat
        </a>

        <a href="#" className="tab-item">
          <AlertTriangle size={16} />
          Peringatan
        </a>

        <button className="download-btn" type="button">
          <Download size={16} />
          Download Data
        </button>
      </nav>

      <div className="dashboard-content">
        {!hasData && (
          <section className="quality-status">
            <div className="quality-icon">
              <Wifi size={26} />
            </div>

            <div className="quality-info">
              <span className="quality-label">STATUS SUSU</span>
              <h3>MENUNGGU DATA SENSOR</h3>
              <p>
                {loading
                  ? "Memuat data dari database..."
                  : "Belum ada data masuk dari perangkat sensor."}
              </p>
            </div>
          </section>
        )}

        {result && (
          <>
            <section
              className={
                result.status === "SEGAR"
                  ? "quality-status"
                  : "quality-status quality-status-warn"
              }
            >
              <div className="quality-icon">
                <StatusIcon size={26} />
              </div>

              <div className="quality-info">
                <span className="quality-label">STATUS SUSU</span>
                <h3>{result.status}</h3>
                <p>{result.statusDescription}</p>
              </div>

              <div className="quality-time">
                Pemeriksaan terakhir
                <strong>{resultTime}</strong>
              </div>
            </section>

            <section className="section">
              <div className="section-heading">
                <div>
                  <h3>Hasil Pemeriksaan</h3>
                  <p>Parameter susu dari data terbaru</p>
                </div>
              </div>

              <div className="parameter-grid">
                <ParameterCard
                  icon={<Scale size={18} />}
                  title="Berat Susu"
                  value={result.weight.toFixed(1)}
                  unit="kg"
                  description="Massa susu yang terukur"
                  ok
                />

                <ParameterCard
                  icon={<Droplet size={18} />}
                  title="Densitas"
                  value={result.density.toFixed(3)}
                  unit="g/mL"
                  description="Hasil perhitungan massa dan volume"
                  ok={result.checks[0].ok}
                />

                <ParameterCard
                  icon={<FlaskConical size={18} />}
                  title="pH"
                  value={result.ph.toFixed(2)}
                  unit=""
                  description="Tingkat keasaman susu"
                  ok={result.checks[1].ok}
                />

                <ParameterCard
                  icon={<Thermometer size={18} />}
                  title="Suhu"
                  value={result.temperature.toFixed(1)}
                  unit="°C"
                  description="Temperatur susu saat diperiksa"
                  ok={result.checks[2].ok}
                />
              </div>
            </section>

            <section className="section-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Analisis Kualitas</h3>
                    <p>Ringkasan kondisi susu saat ini</p>
                  </div>

                  <span className="check-icon">
                    <CheckCircle2 size={16} />
                  </span>
                </div>

                <div className="analysis-list">
                  {result.checks.map((item) => (
                    <div className="analysis-item" key={item.key}>
                      <div
                        className={
                          item.ok ? "analysis-icon" : "analysis-icon warn"
                        }
                      >
                        {item.ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                      </div>

                      <div>
                        <strong>{item.title} {item.ok ? "normal" : "perlu diperhatikan"}</strong>
                        <p>{item.ok ? item.okText : item.warnText}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel warning-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Peringatan</h3>
                    <p>Informasi yang perlu diperhatikan</p>
                  </div>

                  <span className="warning-icon">
                    <AlertTriangle size={16} />
                  </span>
                </div>

                {warnings.length === 0 ? (
                  <div className="no-warning">
                    <div>
                      <CheckCircle2 size={18} />
                    </div>

                    <strong>Tidak ada peringatan</strong>

                    <p>Semua parameter susu berada dalam batas normal.</p>
                  </div>
                ) : (
                  <div className="analysis-list">
                    {warnings.map((item) => (
                      <div className="analysis-item" key={item.key}>
                        <div className="analysis-icon warn">
                          <AlertTriangle size={14} />
                        </div>

                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.warnText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        <section className="section">
          <div className="section-heading">
            <div>
              <h3>Pemeriksaan Terakhir</h3>
              <p>Riwayat data dari database</p>
            </div>
          </div>

          <div className="history-table">
            <div className="history-header">
              <span>Waktu</span>
              <span>Status</span>
              <span>pH</span>
              <span>Suhu</span>
              <span>Densitas</span>
            </div>

            {history.length === 0 ? (
              <div className="history-row">
                <div>
                  <strong>—</strong>
                  <small>{loading ? "Memuat..." : "Belum ada data"}</small>
                </div>
                <span>—</span>
                <span>—</span>
                <span>—</span>
                <span>—</span>
              </div>
            ) : (
              history.map((row) => (
                <div className="history-row" key={row.id}>
                  <div>
                    <strong>{formatTime(row.created_at)}</strong>
                    <small>{row.source === "device" ? "Sensor" : "Simulasi"}</small>
                  </div>

                  <span
                    className={
                      row.status === "SEGAR"
                        ? "history-status good"
                        : "history-status warning"
                    }
                  >
                    <span />
                    {row.status}
                  </span>

                  <span>{Number(row.ph).toFixed(2)}</span>
                  <span>{Number(row.temperature_c).toFixed(1)}°C</span>
                  <span>{Number(row.density).toFixed(3)} g/mL</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <footer className="mobile-footer">Manage by Bakone</footer>
    </main>
  );
}