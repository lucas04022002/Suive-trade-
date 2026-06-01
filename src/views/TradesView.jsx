import { useState } from 'react';
import TradeTable from '../components/TradeTable';

export default function TradesView({ trades, onAdd, onDelete }) {
  const [accFilter, setAccFilter] = useState('all');
  const [resFilter, setResFilter] = useState('all');
  const [form, setForm] = useState({ acc: 'ftmo', date: '', pair: 'XAUUSD', dir: 'BUY', lots: '', entry: '', exit: '', pnl: '', note: '' });

  let filtered = trades.slice().reverse();
  if (accFilter !== 'all') filtered = filtered.filter(t => t.acc === accFilter);
  if (resFilter === 'win') filtered = filtered.filter(t => t.pnl > 0);
  if (resFilter === 'loss') filtered = filtered.filter(t => t.pnl <= 0);

  function submit(e) {
    e.preventDefault();
    const pnl = parseFloat(form.pnl);
    if (isNaN(pnl)) return;
    onAdd({
      acc: form.acc,
      date: form.date || new Date().toISOString().split('T')[0],
      pair: form.pair || 'XAUUSD',
      dir: form.dir,
      lots: parseFloat(form.lots) || 0,
      entry: parseFloat(form.entry) || 0,
      exit: parseFloat(form.exit) || 0,
      pnl,
      note: form.note,
    });
    setForm(f => ({ ...f, lots: '', entry: '', exit: '', pnl: '', note: '' }));
  }

  function field(key) {
    return { value: form[key], onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) };
  }

  return (
    <div>
      {/* Add trade form */}
      <div className="card" style={{ padding: '1.1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div className="section-title">Ajouter un trade</div>
        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 10 }} className="form-grid">
            <div>
              <label className="form-label">Compte</label>
              <select className="form-select" {...field('acc')}>
                <option value="ftmo">FTMO</option>
                <option value="demo">Demo</option>
                <option value="tv">TV</option>
              </select>
            </div>
            <div>
              <label className="form-label">Date</label>
              <input type="date" className="form-input" {...field('date')} />
            </div>
            <div>
              <label className="form-label">Paire</label>
              <input type="text" className="form-input" placeholder="XAUUSD" {...field('pair')} />
            </div>
            <div>
              <label className="form-label">Direction</label>
              <select className="form-select" {...field('dir')}>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
            <div>
              <label className="form-label">Lots</label>
              <input type="number" step="0.01" className="form-input" placeholder="0.10" {...field('lots')} />
            </div>
            <div>
              <label className="form-label">Entrée</label>
              <input type="number" step="0.01" className="form-input" placeholder="3200.00" {...field('entry')} />
            </div>
            <div>
              <label className="form-label">Sortie</label>
              <input type="number" step="0.01" className="form-input" placeholder="3210.00" {...field('exit')} />
            </div>
            <div>
              <label className="form-label">P&L ($) *</label>
              <input type="number" step="0.01" className="form-input" placeholder="50.00" required {...field('pnl')} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Note</label>
              <input type="text" className="form-input" placeholder="Commentaire..." {...field('note')} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginBottom: 0 }}>
              <i className="ti ti-plus" /> Ajouter
            </button>
          </div>
        </form>
      </div>

      {/* Filters + table */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          Historique ({filtered.length} trade{filtered.length > 1 ? 's' : ''})
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '5px 8px' }} value={accFilter} onChange={e => setAccFilter(e.target.value)}>
            <option value="all">Tous les comptes</option>
            <option value="ftmo">FTMO</option>
            <option value="demo">Demo</option>
            <option value="tv">TV</option>
          </select>
          <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '5px 8px' }} value={resFilter} onChange={e => setResFilter(e.target.value)}>
            <option value="all">Tous</option>
            <option value="win">Gains</option>
            <option value="loss">Pertes</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <TradeTable trades={filtered} onDelete={onDelete} />
      </div>
    </div>
  );
}
