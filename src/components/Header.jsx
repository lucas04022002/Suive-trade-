import { useEffect, useState } from 'react';

export default function Header({ onImportCSV, onExportJSON, onImportJSON }) {
  const [date, setDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  return (
    <header style={{
      padding: '1rem 1.5rem',
      borderBottom: '0.5px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.3px', flexShrink: 0 }}>
        Trading <span style={{ color: 'var(--text2)', fontWeight: 400 }}>Dashboard</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="header-date">{date}</span>

        <button className="btn btn-secondary btn-sm" onClick={onExportJSON} title="Exporter les trades en JSON">
          <i className="ti ti-download" />
          <span className="header-btn-label">Exporter</span>
        </button>

        <button className="btn btn-secondary btn-sm" onClick={onImportJSON} title="Charger un fichier JSON">
          <i className="ti ti-file-import" />
          <span className="header-btn-label">Charger JSON</span>
        </button>

        <button className="btn btn-secondary btn-sm" onClick={onImportCSV} title="Importer un CSV">
          <i className="ti ti-upload" />
          <span className="header-btn-label">Importer CSV</span>
        </button>
      </div>
    </header>
  );
}
