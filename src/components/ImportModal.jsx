import { useState, useRef } from 'react';
import { parseCSVFile } from '../utils/csvParsers';

const INSTRUCTIONS = {
  mt5: (
    <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '1rem', fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
      <strong style={{ color: 'var(--text)' }}>MT5 — Pepperstone Demo ou FTMO :</strong><br />
      1. MT5 → bas → <strong style={{ color: 'var(--text)' }}>Toolbox</strong> (Ctrl+T) → onglet <strong style={{ color: 'var(--text)' }}>History</strong><br />
      2. Clic droit → <strong style={{ color: 'var(--text)' }}>Save as Report</strong> → sauvegarde en <strong style={{ color: 'var(--text)' }}>.htm</strong><br />
      3. Ouvre dans <strong style={{ color: 'var(--text)' }}>Google Sheets</strong> → Fichier → Télécharger → <strong style={{ color: 'var(--text)' }}>CSV</strong><br /><br />
      <strong style={{ color: 'var(--text)' }}>Fichier attendu :</strong> ReportHistory-XXXXXXX.csv
    </div>
  ),
  tv: (
    <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '1rem', fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
      <strong style={{ color: 'var(--text)' }}>Pepperstone TradingView :</strong><br />
      1. TradingView → panneau trading en bas → onglet <strong style={{ color: 'var(--text)' }}>Historique</strong><br />
      2. Icône <strong style={{ color: 'var(--text)' }}>télécharger</strong> (flèche bas) en haut à droite du tableau<br /><br />
      <strong style={{ color: 'var(--text)' }}>Fichier attendu :</strong> pepperstone-order-history-all-XXXX.csv
    </div>
  ),
};

export default function ImportModal({ onImport, onClose }) {
  const [source, setSource] = useState('mt5');
  const [account, setAccount] = useState('ftmo');
  const [pending, setPending] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      const result = parseCSVFile(text, source, account);
      if (!result.length) {
        setError('Aucun trade valide trouvé. Vérifiez que le bon onglet est sélectionné (MT5 ou TradingView).');
        setPending(null);
      } else {
        setError('');
        setPending(result);
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function confirm() {
    if (!pending) return;
    onImport(pending);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ padding: '1.5rem', width: '100%', maxWidth: 560 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Importer des trades</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: '1.25rem' }}>
          Supporte les exports MT5 (Positions) et TradingView (Strategy Tester CSV)
        </div>

        {/* Source tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem' }}>
          {[['mt5', 'ti-brand-docker', 'MT5'], ['tv', 'ti-chart-candle', 'TradingView']].map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => { setSource(id); setError(''); setPending(null); }}
              className="btn"
              style={{
                flex: 1,
                justifyContent: 'center',
                padding: '8px',
                border: '0.5px solid var(--border2)',
                background: source === id ? 'var(--bg)' : 'var(--bg3)',
                color: source === id ? 'var(--text)' : 'var(--text2)',
                borderColor: source === id ? 'rgba(255,255,255,.3)' : 'var(--border2)',
              }}
            >
              <i className={`ti ${icon}`} /> {label}
            </button>
          ))}
        </div>

        {INSTRUCTIONS[source]}

        {/* Drop zone */}
        <div
          style={{
            border: `1.5px dashed ${isDragging ? 'rgba(255,255,255,.4)' : 'var(--border2)'}`,
            borderRadius: 'var(--radius)',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            margin: '1rem 0',
            transition: 'border-color .15s',
            background: isDragging ? 'rgba(255,255,255,.02)' : 'transparent',
          }}
          onClick={() => fileRef.current.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <i className="ti ti-upload" style={{ fontSize: 28, color: 'var(--text3)', display: 'block', marginBottom: 8 }} />
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Glisse ton fichier CSV ici</p>
          <small style={{ fontSize: 11, color: 'var(--text3)' }}>ou clique pour choisir</small>
        </div>
        <input ref={fileRef} type="file" accept=".csv,.htm,.html" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

        {/* Account selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
          <label className="form-label" style={{ whiteSpace: 'nowrap', marginBottom: 0 }}>Importer sur :</label>
          <select className="form-select" value={account} onChange={e => setAccount(e.target.value)}>
            <option value="ftmo">FTMO Challenge</option>
            <option value="demo">Pepperstone Demo</option>
            <option value="tv">Pepperstone TV</option>
          </select>
        </div>

        {error && (
          <div style={{ background: 'rgba(224,90,78,.1)', border: '0.5px solid rgba(224,90,78,.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: 12, color: 'var(--red)' }}>
            {error}
          </div>
        )}
        {pending && (
          <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: 12, color: 'var(--green)' }}>
            ✓ {pending.length} trade(s) détecté(s) — prêt à importer
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={confirm} disabled={!pending}>Importer</button>
        </div>
      </div>
    </div>
  );
}
