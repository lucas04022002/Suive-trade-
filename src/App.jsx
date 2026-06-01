import { useState, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ImportModal from './components/ImportModal';
import OverviewView from './views/OverviewView';
import TradesView from './views/TradesView';
import FTMOView from './views/FTMOView';
import StatsView from './views/StatsView';
import { useTrades } from './hooks/useTrades';

export default function App() {
  const [tab, setTab] = useState('overview');
  const [showImport, setShowImport] = useState(false);
  const { trades, loading, addTrades, addTrade, deleteTrade } = useTrades();
  const jsonInputRef = useRef(null);

  function handleDelete(id) {
    if (window.confirm('Supprimer ce trade ?')) deleteTrade(id);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(trades, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error();
        if (window.confirm(`Remplacer les ${trades.length} trades actuels par les ${data.length} trades du fichier ?`)) {
          addTrades(data, true);
        }
      } catch {
        alert('Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <>
      <Header
        onImportCSV={() => setShowImport(true)}
        onExportJSON={exportJSON}
        onImportJSON={() => jsonInputRef.current.click()}
      />
      <input ref={jsonInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importJSON} />
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)', fontSize: 13 }}>
          Chargement des trades…
        </div>
      )}
      {!loading && <div className="container">
        <Tabs active={tab} onChange={setTab} />
        {tab === 'overview' && <OverviewView trades={trades} />}
        {tab === 'trades' && <TradesView trades={trades} onAdd={addTrade} onDelete={handleDelete} />}
        {tab === 'ftmo' && <FTMOView trades={trades} />}
        {tab === 'stats' && <StatsView trades={trades} />}
      </div>}
      {showImport && (
        <ImportModal
          onImport={newTrades => addTrades(newTrades)}
          onClose={() => setShowImport(false)}
        />
      )}
    </>
  );
}
