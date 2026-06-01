import { calcAccountStats, fmt, fmtBalance } from '../utils/formatters';

const LABELS = { ftmo: 'FTMO Challenge', demo: 'Pepperstone Demo', tv: 'Pepperstone TV' };
const SUBS = { ftmo: 'Prop firm · Phase 1', demo: 'Compte démo · MT5', tv: 'Compte live · TradingView' };

export default function AccountCard({ acc, trades }) {
  const { todayPnl, wins, bal, ddPct, winRate, ts } = calcAccountStats(trades, acc);

  return (
    <div className="card" style={{ padding: '1.1rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `var(--${acc})`,
      }} />
      <span className={`badge badge-${acc}`} style={{ marginBottom: 10 }}>{LABELS[acc]}</span>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{LABELS[acc]}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>{SUBS[acc]}</div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.5px', marginBottom: 3 }}>
        {fmtBalance(bal)}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: todayPnl > 0 ? 'var(--green)' : todayPnl < 0 ? 'var(--red)' : 'var(--text2)' }}>
        {fmt(todayPnl)} aujourd'hui
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
        marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--border)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{winRate}</div>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 1 }}>Win rate</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{ddPct}</div>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 1 }}>Drawdown</div>
        </div>
      </div>
    </div>
  );
}
