import { useState } from 'react';
import { fmt } from '../utils/formatters';

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  const barColor = pct > 80 ? 'var(--red)' : pct > 60 ? 'var(--amber)' : (color || 'var(--green)');
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: pct + '%', background: barColor }} />
    </div>
  );
}

function RuleRow({ label, current, max, color, reverse }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: 'var(--text2)' }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{current} <span style={{ color: 'var(--text2)', fontWeight: 400 }}>/ {max}</span></span>
      </div>
      <ProgressBar value={parseFloat(current.replace(/\$|\s/g, '')) || 0} max={parseFloat(max.replace(/\$|\s/g, '')) || 1} color={color} />
    </div>
  );
}

export default function FTMOView({ trades }) {
  const [capital, setCapital] = useState(10000);
  const [phase, setPhase] = useState('1');

  const targetPct = phase === '1' ? 0.10 : phase === '2' ? 0.05 : 0;
  const targetAmt = capital * targetPct;
  const maxDaily = capital * 0.05;
  const maxOverall = capital * 0.10;

  const ts = trades.filter(t => t.acc === 'ftmo');
  const totalPnl = ts.reduce((s, t) => s + t.pnl, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayLoss = Math.abs(Math.min(0, ts.filter(t => t.date === today).reduce((s, t) => s + t.pnl, 0)));
  const activeDays = new Set(ts.map(t => t.date)).size;

  const failed = totalPnl <= -maxOverall || todayLoss >= maxDaily;
  const passed = phase !== 'funded' && totalPnl >= targetAmt && activeDays >= 4;

  const fmt2 = v => '$' + Math.abs(v).toFixed(0);

  return (
    <div>
      {/* Settings */}
      <div className="card" style={{ padding: '1.1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <div>
            <label className="form-label">Capital ($)</label>
            <input type="number" className="form-input" value={capital} onChange={e => setCapital(parseFloat(e.target.value) || 10000)} />
          </div>
          <div>
            <label className="form-label">Phase</label>
            <select className="form-select" value={phase} onChange={e => setPhase(e.target.value)}>
              <option value="1">Phase 1 (10%)</option>
              <option value="2">Phase 2 (5%)</option>
              <option value="funded">Funded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: '1.25rem' }} className="ftmo-rules">
        {phase !== 'funded' && (
          <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
            <div className="section-title">Objectif de profit</div>
            <RuleRow label="Profit réalisé" current={fmt2(Math.max(0, totalPnl))} max={fmt2(targetAmt)} color="var(--green)" />
          </div>
        )}
        <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
          <div className="section-title">Perte journalière max</div>
          <RuleRow label="Perte today" current={fmt2(todayLoss)} max={fmt2(maxDaily)} />
        </div>
        <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
          <div className="section-title">Perte globale max</div>
          <RuleRow label="Perte totale" current={fmt2(Math.abs(Math.min(0, totalPnl)))} max={fmt2(maxOverall)} />
        </div>
        <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
          <div className="section-title">Jours de trading minimum</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
              <span style={{ color: 'var(--text2)' }}>Jours actifs</span>
              <span style={{ fontWeight: 600 }}>{activeDays} <span style={{ color: 'var(--text2)', fontWeight: 400 }}>/ 4</span></span>
            </div>
            <ProgressBar value={activeDays} max={4} color="var(--ftmo)" />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="card" style={{ padding: '1.1rem 1.5rem' }}>
        <div className="section-title">Statut</div>
        {!ts.length ? (
          <span style={{ color: 'var(--text2)', fontSize: 13 }}>Aucun trade enregistré sur le compte FTMO.</span>
        ) : failed ? (
          <span className="status-fail" style={{ fontSize: 13 }}>
            <i className="ti ti-alert-circle" /> Challenge échoué — limite de perte atteinte.
          </span>
        ) : passed ? (
          <span className="status-ok" style={{ fontSize: 13 }}>
            <i className="ti ti-circle-check" /> Objectifs atteints ! Tu peux passer à la phase suivante.
          </span>
        ) : (
          <span style={{ fontSize: 13 }}>
            En cours — P&L : <strong className={totalPnl >= 0 ? 'status-ok' : 'status-fail'}>{fmt(totalPnl)}</strong>
            &nbsp;·&nbsp; Jours actifs : <strong>{activeDays}/4</strong>
            &nbsp;·&nbsp; Daily loss : <strong className={todayLoss > maxDaily * 0.6 ? 'status-warn' : ''}>${todayLoss.toFixed(0)}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
