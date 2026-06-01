const TABS = [
  { id: 'overview', icon: 'ti-layout-dashboard', label: 'Vue globale' },
  { id: 'trades', icon: 'ti-list', label: 'Trades' },
  { id: 'ftmo', icon: 'ti-shield-check', label: 'FTMO' },
  { id: 'stats', icon: 'ti-chart-bar', label: 'Stats' },
];

export default function Tabs({ active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      marginBottom: '1.5rem',
      background: 'var(--bg2)',
      borderRadius: 'var(--radius)',
      padding: 4,
      width: 'fit-content',
      overflowX: 'auto',
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '7px 16px',
            fontSize: 13,
            fontWeight: 500,
            border: 'none',
            background: active === tab.id ? 'var(--bg3)' : 'none',
            cursor: 'pointer',
            color: active === tab.id ? 'var(--text)' : 'var(--text2)',
            borderRadius: 'var(--radius-sm)',
            transition: 'all .15s',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
          }}
        >
          <i className={`ti ${tab.icon}`} style={{ fontSize: 14 }} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
