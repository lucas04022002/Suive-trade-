import { useEffect, useState } from 'react';

export default function Header({ onImport }) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--text2)' }}>{date}</div>
        <button className="btn btn-secondary btn-sm" onClick={onImport}>
          <i className="ti ti-upload" />
          Importer CSV
        </button>
      </div>
    </header>
  );
}
