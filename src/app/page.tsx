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

const milkData = {
  status: "SEGAR",
  statusDescription: "Semua parameter susu berada dalam kondisi normal.",
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
    date: "29 Agu 2026",
    status: "Segar",
    ph: "6.7",
    temperature: "8.5°C",
    density: "1.032 g/mL",
  },
  {
    time: "09:15",
    date: "29 Agu 2026",
    status: "Segar",
    ph: "6.7",
    temperature: "8.8°C",
    density: "1.031 g/mL",
  },
  {
    time: "07:20",
    date: "29 Agu 2026",
    status: "Perlu diperhatikan",
    ph: "6.5",
    temperature: "12.4°C",
    density: "1.029 g/mL",
  },
];

function ParameterCard({
  icon,
  title,
  value,
  unit,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  description: string;
}) {
  return (
    <div className="parameter-card">
      <div className="parameter-header">
        <div className="parameter-icon">{icon}</div>
        <span className="normal-badge">Normal</span>
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
          <span>Perangkat Online</span>
        </div>
      </header>

      <p className="topbar-description">
        Pantau kualitas susu sapi segar dengan mudah.
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
        <section className="quality-status">
          <div className="quality-icon">
            <CheckCircle2 size={26} />
          </div>

          <div className="quality-info">
            <span className="quality-label">STATUS SUSU</span>
            <h3>{milkData.status}</h3>
            <p>{milkData.statusDescription}</p>
          </div>

          <div className="quality-time">
            Pemeriksaan terakhir
            <strong>29 Agustus 2026, 10:32 WIB</strong>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <h3>Hasil Pemeriksaan</h3>
              <p>Parameter susu yang sedang dipantau</p>
            </div>
          </div>

          <div className="parameter-grid">
            <ParameterCard
              icon={<Scale size={18} />}
              title="Berat Susu"
              value={milkData.weight}
              unit="kg"
              description="Massa susu yang terukur"
            />

            <ParameterCard
              icon={<Droplet size={18} />}
              title="Densitas"
              value={milkData.density}
              unit="g/mL"
              description="Hasil perhitungan massa dan volume"
            />

            <ParameterCard
              icon={<FlaskConical size={18} />}
              title="pH"
              value={milkData.ph}
              unit=""
              description="Tingkat keasaman susu"
            />

            <ParameterCard
              icon={<Thermometer size={18} />}
              title="Suhu"
              value={milkData.temperature}
              unit="°C"
              description="Temperatur susu saat diperiksa"
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
              {analysis.map((item) => (
                <div className="analysis-item" key={item.title}>
                  <div className="analysis-icon">
                    <CheckCircle2 size={14} />
                  </div>

                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
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

            <div className="no-warning">
              <div>
                <CheckCircle2 size={18} />
              </div>

              <strong>Tidak ada peringatan</strong>

              <p>Semua parameter susu berada dalam batas normal.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <h3>Pemeriksaan Terakhir</h3>
              <p>Riwayat pemeriksaan susu terbaru</p>
            </div>

            <a href="#" className="view-all">
              Lihat semua →
            </a>
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
              <div className="history-row" key={`${item.date}-${item.time}`}>
                <div>
                  <strong>{item.time}</strong>
                  <small>{item.date}</small>
                </div>

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
      </div>

      <footer className="mobile-footer">Manage by Bakone</footer>
    </main>
  );
}
