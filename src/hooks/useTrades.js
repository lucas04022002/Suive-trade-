import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const LS_KEY = 'trading_dashboard_v2';

function lsLoad() {
  try {
    const s = localStorage.getItem(LS_KEY);
    if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; }
  } catch {}
  return [];
}

export function useTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      supabase.from('trades').select('*').order('date', { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) setTrades(data);
          setLoading(false);
        });
    } else {
      setTrades(lsLoad());
      setLoading(false);
    }
  }, []);

  // localStorage fallback sync
  useEffect(() => {
    if (!supabase) localStorage.setItem(LS_KEY, JSON.stringify(trades));
  }, [trades]);

  async function addTrades(newTrades) {
    const withIds = newTrades.map(t => ({ ...t, id: t.id?.toString() ?? crypto.randomUUID() }));
    if (supabase) {
      const { data, error } = await supabase.from('trades').insert(withIds).select();
      if (!error && data) setTrades(prev => [...prev, ...data]);
    } else {
      setTrades(prev => [...prev, ...withIds]);
    }
  }

  async function addTrade(trade) {
    const t = { ...trade, id: crypto.randomUUID() };
    if (supabase) {
      const { data, error } = await supabase.from('trades').insert([t]).select();
      if (!error && data) setTrades(prev => [...prev, ...data]);
    } else {
      setTrades(prev => [...prev, t]);
    }
  }

  async function deleteTrade(id) {
    if (supabase) {
      const { error } = await supabase.from('trades').delete().eq('id', id);
      if (!error) setTrades(prev => prev.filter(t => t.id !== id));
    } else {
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  }

  return { trades, loading, addTrades, addTrade, deleteTrade };
}
