import { useState, useEffect } from 'react';

const STORAGE_KEY = 'trading_dashboard_v2';

export function useTrades() {
  const [trades, setTrades] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  }, [trades]);

  function addTrades(newTrades) {
    setTrades(prev => [...prev, ...newTrades]);
  }

  function addTrade(trade) {
    setTrades(prev => [...prev, { ...trade, id: Date.now() }]);
  }

  function deleteTrade(id) {
    setTrades(prev => prev.filter(t => t.id !== id));
  }

  function clearAll() {
    setTrades([]);
  }

  return { trades, addTrades, addTrade, deleteTrade, clearAll };
}
