import { useState, useEffect } from 'react';

const LS_KEY = 'trading_dashboard_v2';

export function useTrades() {
  const [trades, setTrades] = useState(() => {
    try {
      const s = localStorage.getItem(LS_KEY);
      if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; }
    } catch {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(trades));
  }, [trades]);

  // replace=true remplace tout (import JSON), replace=false ajoute (import CSV)
  function addTrades(newTrades, replace = false) {
    const withIds = newTrades.map(t => ({ ...t, id: t.id?.toString() ?? crypto.randomUUID() }));
    if (replace) setTrades(withIds);
    else setTrades(prev => [...prev, ...withIds]);
  }

  function addTrade(trade) {
    setTrades(prev => [...prev, { ...trade, id: crypto.randomUUID() }]);
  }

  function deleteTrade(id) {
    setTrades(prev => prev.filter(t => t.id !== id));
  }

  return { trades, loading: false, addTrades, addTrade, deleteTrade };
}
