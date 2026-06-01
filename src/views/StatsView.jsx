import { fmt } from '../utils/formatters';

const ACC_NAMES = { ftmo: 'FTMO Challenge', demo: 'Pepperstone Demo', tv: 'Pepperstone TV' };

export default function StatsView({ trades }) {
  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl < 0);
  const wr = trades.length ? Math.round(wins.length / trades.length * 100) + '%' : '—';
  const avgWin = wins.length ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : null;
  const avgLoss = losses.length ? losses.reduce((s, t) => s + t.pnl, 0) / losses.length : null;
  const rr = avgWin !== null && avgLoss !== null ? (Math.abs(avgWin) / Math.abs(avgLoss)).toFixed(2) : '—';
  let maxStreak = 0, cur = 0;
  trades.forEach(t => { if (t.pnl > 0) { cur++; maxStreak = Math.max(maxStreak, cur); } else cur = 0; });
  const pairs = {};
  trades.forEach(t => { pairs[t.pair] = (pairs[t.pair] || 0) + t.pnl; });
  const bestPair = Object.keys(pairs).length ? Object.keys(pairs).reduce((a, b) => pairs[a] > pairs[b] ? a : b) : '—';

  const stats = [
    { label: 'Win Rate', value: wr },
    { label: 'Risk/Reward', value: rr },
    { label: 'Gain moyen', value: avgWin !== null ? '+$' + avgWin.toFixed(2) : '—' },
    { label: 'Perte moyenne', value: avgLoss !== null ? '-$' + Math.abs(avgLoss).toFixed(2) : '—' },
    { label: 'Série win max', value: maxStreak || '—' },
    { label: 'Meilleure paire', value: bestPair },
  ];

  return (
    <div>
      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginBottom: '1.25rem',
      }} className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: '1rem 1.1rem' }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.4px' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-account breakdown */}
      <div className="section-title">Par compte</div>
      <div className="card" style={{ overflow: 'hidden' }}>
        {!trades.length ? (
          <div className="empty-state">Ajoutez des trades pour voir les statistiques.</div>
        ) : (
          ['ftmo', 'demo', 'tv'].map(acc => {
            const ts = trades.filter(t => t.acc === acc);
            if (!ts.length) return null;
            const w = ts.filter(t => t.pnl > 0);
            const pnl = ts.reduce((s, t) => s + t.pnl, 0);
            return (
              <div key={acc} style={{
                display: 'flex',
                gap: 24,
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '0.5px solid var(--border)',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontWeight: 600, fontSize: 13, minWidth: 120 }}>{ACC_NAMES[acc]}</span>
                <span style={{ fontSize: 13 }}>
                  P&L : <strong className={pnl >= 0 ? 'pnl-pos' : 'pnl-neg'}>{fmt(pnl)}</strong>
                </span>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{ts.length} trade{ts.length > 1 ? 's' : ''}</span>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>
                  Win rate : <strong style={{ color: 'var(--text)' }}>{ts.length ? Math.round(w.length / ts.length * 100) + '%' : '—'}</strong>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
