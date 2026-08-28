"use client";

import { useRef, useState } from "react";
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
  Minus,
  Plus,
  PlayCircle,
} from "lucide-react";

const VOLUME_L = 15; // volume jarr/jerrycan tetap 15 L

type ParamCheck = {
  key: "density" | "ph" | "temperature";
  title: string;
  ok: boolean;
  okText: string;
  warnText: string;
};

type SimResult = {
  weight: number;
  density: number;
  ph: number;
  temperature: number;
  status: "SEGAR" | "PERLU DIPERHATIKAN" | "TIDAK SEGAR";
  statusDescription: string;
  checks: ParamCheck[];
  timestamp: string;
};

function evaluate(weight: number, ph: number, temperature: number): SimResult {
  const density = weight / VOLUME_L;

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
  const status: SimResult["status"] =
    issues === 0 ? "SEGAR" : issues === 1 ? "PERLU DIPERHATIKAN" : "TIDAK SEGAR";

  const statusDescription =
    issues === 0
      ? "Semua parameter susu berada dalam kondisi normal."
      : issues === 1
        ? "Ada 1 parameter yang perlu diperhatikan."
        : "Beberapa parameter di luar batas normal, segera periksa susu.";

  return {
    weight,
    density,
    ph,
    temperature,
    status,
    statusDescription,
    checks,
    timestamp: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function SensorField({
  label,
  unit,
  value,
  step,
  min,
  max,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  step: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <div className="sim-field">
      <label>
        {label}
        {unit ? <span className="sim-unit"> ({unit})</span> : null}
      </label>

      <div className="sim-input-wrap">
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(clamp(parseFloat(e.target.value) || 0))}
        />

        <div className="sim-stepper">
          <button
            type="button"
            aria-label={`Kurangi ${label}`}
            onClick={() => onChange(clamp(+(value - step).toFixed(2)))}
          >
            <Minus size={16} />
          </button>

          <button
            type="button"
            aria-label={`Tambah ${label}`}
            onClick={() => onChange(clamp(+(value + step).toFixed(2)))}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
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

export default function Home() {
  const [weight, setWeight] = useState(15.2);
  const [ph, setPh] = useState(6.7);
  const [temperature, setTemperature] = useState(8.5);
  const [result, setResult] = useState<SimResult>(() => evaluate(15.2, 6.7, 8.5));
  const [history, setHistory] = useState<SimResult[]>([]);

  const dashboardRef = useRef<HTMLDivElement>(null);

  function handleShowResult() {
    const r = evaluate(weight, ph, temperature);
    setResult(r);
    setHistory((prev) => [r, ...prev].slice(0, 6));
    dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const statusIcon = result.status === "SEGAR" ? CheckCircle2 : AlertTriangle;
  const StatusIcon = statusIcon;
  const warnings = result.checks.filter((c) => !c.ok);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand-icon">
            <Milk size={20} />
          </div>

          <div>
            <p className="eyebrow">Milk Quality Analyzer - Bakone</p>
            <h2>Selamat pagi, Peternak</h2>
          </div>
        </div>

        <div className="device-status">
          <Wifi size={14} />
          <span>Mode Simulasi</span>
        </div>
      </header>

      <p className="topbar-description">
        Simulasi input data sensor manual - dipakai buat demo produk selama
        komponen (loadcell, HX711, pH sensor, sensor suhu) belum terpasang.
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

      <section className="simulation-section">
        <div className="section-heading">
          <div>
            <h3>Data Sensor (Simulasi)</h3>
            <p>Isi manual nilai sensor untuk lihat hasil analisis kualitas susu</p>
          </div>
        </div>

        <div className="sim-grid">
          <SensorField
            label="Berat Susu"
            unit="kg"
            value={weight}
            step={0.1}
            min={0}
            max={30}
            onChange={setWeight}
          />

          <SensorField
            label="pH Susu"
            unit=""
            value={ph}
            step={0.05}
            min={3}
            max={9}
            onChange={setPh}
          />

          <SensorField
            label="Suhu"
            unit="°C"
            value={temperature}
            step={0.1}
            min={-5}
            max={40}
            onChange={setTemperature}
          />
        </div>

        <p className="sim-note">
          Volume jarigen dipakai tetap {VOLUME_L} L — densitas dihitung
          otomatis dari berat / volume.
        </p>

        <button className="sim-submit-btn" type="button" onClick={handleShowResult}>
          <PlayCircle size={18} />
          Tampilkan Hasil
        </button>
      </section>

      <div className="dashboard-content" ref={dashboardRef}>
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
            <strong>{result.timestamp} WIB (simulasi)</strong>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <h3>Hasil Pemeriksaan</h3>
              <p>Parameter susu dari input simulasi</p>
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

        <section className="section">
          <div className="section-heading">
            <div>
              <h3>Pemeriksaan Terakhir</h3>
              <p>Riwayat hasil simulasi di sesi ini</p>
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
                  <small>Belum ada simulasi</small>
                </div>
                <span>—</span>
                <span>—</span>
                <span>—</span>
                <span>—</span>
              </div>
            ) : (
              history.map((item, i) => (
                <div className="history-row" key={`${item.timestamp}-${i}`}>
                  <div>
                    <strong>{item.timestamp}</strong>
                    <small>Simulasi</small>
                  </div>

                  <span
                    className={
                      item.status === "SEGAR"
                        ? "history-status good"
                        : "history-status warning"
                    }
                  >
                    <span />
                    {item.status}
                  </span>

                  <span>{item.ph.toFixed(2)}</span>
                  <span>{item.temperature.toFixed(1)}°C</span>
                  <span>{item.density.toFixed(3)} g/mL</span>
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
