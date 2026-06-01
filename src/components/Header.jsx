import { useEffect, useState } from 'react';

export default function Header({ onImportCSV, onExportJSON, onImportJSON }) {
  const [date, setDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  return (
    <header style={{
      padding: '1.25rem 2rem',
      borderBottom: '0.5px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.3px' }}>
        Trading <span style={{ color: 'var(--text2)', fontWeight: 400 }}>Dashboard</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 12, color: 'var(--text2)' }}>{date}</div>
        <button className="btn btn-secondary btn-sm" onClick={onExportJSON} title="Sauvegarder tous les trades en JSON">
          <i className="ti ti-download" />
          Exporter
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onImportJSON} title="Charger un fichier JSON exporté">
          <i className="ti ti-file-import" />
          Charger JSON
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onImportCSV}>
          <i className="ti ti-upload" />
          Importer CSV
        </button>
      </div>
    </header>
  );
}
