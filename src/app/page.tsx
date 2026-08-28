import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Droplets,
  Scale,
  Thermometer,
} from "lucide-react";

const milkData = {
  weight: "15.2",
  density: "1.032",
  ph: "6.7",
  temperature: "8.5",
};

const analysis = [
  {
    title: "Densitas normal",
    description: "Karakteristik fisik susu berada dalam rentang normal.",
  },
  {
    title: "pH normal",
    description: "Tingkat keasaman susu masih dalam kondisi baik.",
  },
  {
    title: "Suhu baik",
    description: "Suhu susu berada pada kondisi yang sesuai.",
  },
];

const history = [
  {
    time: "10:32",
    status: "Segar",
    ph: "6.7",
    temperature: "8.5 °C",
    density: "1.032 g/mL",
  },
  {
    time: "09:15",
    status: "Segar",
    ph: "6.7",
    temperature: "8.8 °C",
    density: "1.031 g/mL",
  },
  {
    time: "07:20",
    status: "Perlu diperhatikan",
    ph: "6.5",
    temperature: "12.4 °C",
    density: "1.029 g/mL",
  },
];

function ParameterCard({
  icon: Icon,
  title,
  value,
  unit,
  description,
}: {
  icon: typeof Scale;
  title: string;
  value: string;
  unit?: string;
  description: string;
}) {
  return (
    <div className="parameter-card">
      <div className="parameter-top">
        <div className="icon-box">
          <Icon size={19} strokeWidth={2} />
        </div>
        <span className="normal-badge">
          <CheckCircle2 size={12} />
          Normal
        </span>
      </div>

      <p className="parameter-title">{title}</p>

      <div className="parameter-value">
        {value}
        {unit && <span>{unit}</span>}
      </div>

      <p className="parameter-description">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Milk Quality Analyzer</p>
          <h1>Good Morning, Peternak!</h1>
          <p className="subtitle">
            Berikut ringkasan kualitas susu sapi segar hari ini.
          </p>
        </div>

        <div className="date-box">
          <CalendarDays size={17} />
          <div>
            <span>Hari ini</span>
            <strong>29 Agustus 2026</strong>
          </div>
        </div>
      </header>

      <div className="header-line" />

      <section className="toolbar">
        <button className="primary-button">
          <ClipboardCheck size={17} />
          Pemeriksaan Baru
        </button>

        <div className="device-status">
          <span className="online-dot" />
          Perangkat Online
        </div>
      </section>

      <section className="summary-grid">
        <div className="summary-card">
          <div className="card-icon">
            <Scale size={19} />
          </div>
          <p>Total Susu</p>
          <h2>{milkData.weight} <span>kg</span></h2>
          <small>Hasil pemeriksaan terakhir</small>
        </div>

        <div className="summary-card quality-card">
          <div className="card-icon">
            <CheckCircle2 size={19} />
          </div>
          <p>Status Kualitas</p>
          <h2>Segar</h2>
          <small>Semua parameter dalam kondisi normal</small>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <Activity size={19} />
          </div>
          <p>Pemeriksaan Hari Ini</p>
          <h2>12</h2>
          <small>Pemeriksaan tercatat hari ini</small>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Hasil Pemeriksaan</h3>
              <p>Parameter susu terakhir</p>
            </div>
            <ClipboardCheck size={19} />
          </div>

          <div className="parameter-grid">
            <ParameterCard
              icon={Droplets}
              title="Densitas"
              value={milkData.density}
              unit="g/mL"
              description="Hasil perhitungan massa dan volume"
            />
            <ParameterCard
              icon={Activity}
              title="pH"
              value={milkData.ph}
              description="Tingkat keasaman susu"
            />
            <ParameterCard
              icon={Thermometer}
              title="Suhu"
              value={milkData.temperature}
              unit="°C"
              description="Temperatur susu saat diperiksa"
            />
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Analisis Kualitas</h3>
              <p>Ringkasan kondisi susu</p>
            </div>
            <CheckCircle2 className="success-icon" size={20} />
          </div>

          <div className="analysis-list">
            {analysis.map((item) => (
              <div className="analysis-item" key={item.title}>
                <div className="analysis-check">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel warning-section">
        <div className="panel-heading">
          <div>
            <h3>Peringatan</h3>
            <p>Peringatan aktif dari hasil pemeriksaan</p>
          </div>
          <AlertTriangle className="warning-icon" size={20} />
        </div>

        <div className="no-warning">
          <div className="no-warning-icon">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <strong>Tidak ada peringatan</strong>
            <p>Semua parameter susu berada dalam batas normal.</p>
          </div>
        </div>
      </section>

      <section className="panel history-section">
        <div className="panel-heading">
          <div>
            <h3>Pemeriksaan Terakhir</h3>
            <p>Riwayat pemeriksaan susu terbaru</p>
          </div>
          <button className="text-button">Lihat semua</button>
        </div>

        <div className="history-table">
          <div className="history-header">
            <span>Waktu</span>
            <span>Status</span>
            <span>pH</span>
            <span>Suhu</span>
            <span>Densitas</span>
          </div>

          {history.map((item) => (
            <div className="history-row" key={item.time}>
              <strong>{item.time}</strong>

              <span
                className={
                  item.status === "Segar"
                    ? "history-status good"
                    : "history-status warning"
                }
              >
                <span />
                {item.status}
              </span>

              <span>{item.ph}</span>
              <span>{item.temperature}</span>
              <span>{item.density}</span>
            </div>
          ))}
        </div>
      </section>

      <footer>Manage by Bakone</footer>
    </main>
  );
}
