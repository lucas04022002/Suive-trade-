import { fmt } from '../utils/formatters';

const ACC_LABELS = { ftmo: 'FTMO', demo: 'Demo', tv: 'TV' };

function TradeRow({ trade, onDelete }) {
  return (
    <tr>
      <td style={{ fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{trade.date}</td>
      <td><span className={`badge badge-${trade.acc}`}>{ACC_LABELS[trade.acc] || trade.acc}</span></td>
      <td style={{ fontWeight: 600 }}>{trade.pair}</td>
      <td><span className={`dir-badge dir-${trade.dir.toLowerCase()}`}>{trade.dir}</span></td>
      <td style={{ color: 'var(--text2)' }}>{trade.lots || '—'}</td>
      <td style={{ color: 'var(--text2)' }}>{trade.entry || '—'}</td>
      <td style={{ color: 'var(--text2)' }}>{trade.exit || '—'}</td>
      <td className={trade.pnl >= 0 ? 'pnl-pos' : 'pnl-neg'}>{fmt(trade.pnl)}</td>
      <td style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {trade.note || ''}
      </td>
      {onDelete && (
        <td>
          <button className="btn btn-icon" onClick={() => onDelete(trade.id)} title="Supprimer">
            <i className="ti ti-trash" />
          </button>
        </td>
      )}
    </tr>
  );
}

export default function TradeTable({ trades, onDelete }) {
  if (!trades.length) {
    return <div className="empty-state">Aucun trade correspondant.</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="trade-table">
        <thead>
          <tr>
            <th style={{ width: 80 }}>Date</th>
            <th style={{ width: 80 }}>Compte</th>
            <th style={{ width: 75 }}>Paire</th>
            <th style={{ width: 55 }}>Dir.</th>
            <th style={{ width: 50 }}>Lots</th>
            <th style={{ width: 72 }}>Entrée</th>
            <th style={{ width: 72 }}>Sortie</th>
            <th style={{ width: 85 }}>P&L</th>
            <th>Note</th>
            {onDelete && <th style={{ width: 35 }} />}
          </tr>
        </thead>
        <tbody>
          {trades.map(t => (
            <TradeRow key={t.id} trade={t} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
