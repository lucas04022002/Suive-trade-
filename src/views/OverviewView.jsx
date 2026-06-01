import AccountCard from '../components/AccountCard';
import TradeTable from '../components/TradeTable';
import PnLChart from '../components/PnLChart';
import { fmt } from '../utils/formatters';

export default function OverviewView({ trades }) {
  const allPnl = trades.reduce((s, t) => s + t.pnl, 0);
  const wins = trades.filter(t => t.pnl > 0).length;
  const winRate = trades.length ? Math.round(wins / trades.length * 100) + '%' : '—';
  let bestAcc = '—';
  if (trades.length) {
    bestAcc = ['ftmo', 'demo', 'tv'].reduce((b, a) =>
      trades.filter(t => t.acc === a).reduce((s, t) => s + t.pnl, 0) >
      trades.filter(t => t.acc === b).reduce((s, t) => s + t.pnl, 0) ? a : b
    , 'ftmo');
    bestAcc = bestAcc === 'ftmo' ? 'FTMO' : bestAcc === 'demo' ? 'Demo' : 'TV';
  }

  const recent = trades.slice(-5).reverse();

  const metrics = [
    { label: 'P&L Total', value: fmt(allPnl), color: allPnl > 0 ? 'var(--green)' : allPnl < 0 ? 'var(--red)' : 'var(--text)' },
    { label: 'Trades', value: trades.length },
    { label: 'Win rate global', value: winRate },
    { label: 'Meilleur compte', value: bestAcc },
  ];

  return (
    <div>
      <div className="accounts-grid">
        <AccountCard acc="ftmo" trades={trades} />
        <AccountCard acc="demo" trades={trades} />
        <AccountCard acc="tv" trades={trades} />
      </div>

      <div className="metrics-row">
        {metrics.map(m => (
          <div key={m.label} className="card" style={{ padding: '1rem 1.1rem' }}>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.4px', color: m.color || 'var(--text)' }}>
              {m.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1rem 1.1rem', marginBottom: '1.25rem' }}>
        <div className="section-title">Courbe P&L cumulée</div>
        <div style={{ height: 180, position: 'relative' }}>
          <PnLChart trades={trades} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: 'var(--text2)' }}>
          {[['FTMO', '#4a90d9'], ['Demo', '#2db57a'], ['TV', '#9b6dff']].map(([lbl, color]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              {lbl}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-title">Trades récents</div>
        <div className="card" style={{ overflow: 'hidden' }}>
          {recent.length ? (
            <TradeTable trades={recent} />
          ) : (
            <div className="empty-state">Aucun trade — va dans l'onglet Trades pour commencer.</div>
          )}
        </div>
      </div>
    </div>
  );
}
