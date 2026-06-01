export const STARTS = { ftmo: 10000, demo: 10700, tv: 10000 };

export function fmt(val) {
  const sign = val >= 0 ? '+' : '';
  return sign + '$' + Math.abs(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtBalance(val) {
  return '$' + val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function calcAccountStats(trades, acc) {
  const ts = trades.filter(t => t.acc === acc);
  const total = ts.reduce((s, t) => s + t.pnl, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayPnl = ts.filter(t => t.date === today).reduce((s, t) => s + t.pnl, 0);
  const wins = ts.filter(t => t.pnl > 0).length;
  const bal = STARTS[acc] + total;
  let minCumul = 0, cumul = 0;
  ts.forEach(t => { cumul += t.pnl; if (cumul < minCumul) minCumul = cumul; });
  const ddPct = ts.length ? (Math.abs(minCumul) / STARTS[acc] * 100).toFixed(1) + '%' : '0%';
  const winRate = ts.length ? Math.round(wins / ts.length * 100) + '%' : '—';
  return { ts, total, todayPnl, wins, bal, ddPct, winRate };
}
