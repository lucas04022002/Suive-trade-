import { useState } from 'react';
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
  const { trades, addTrades, addTrade, deleteTrade } = useTrades();

  function handleDelete(id) {
    if (window.confirm('Supprimer ce trade ?')) deleteTrade(id);
  }

  return (
    <>
      <Header onImport={() => setShowImport(true)} />
      <div className="container">
        <Tabs active={tab} onChange={setTab} />
        {tab === 'overview' && <OverviewView trades={trades} />}
        {tab === 'trades' && <TradesView trades={trades} onAdd={addTrade} onDelete={handleDelete} />}
        {tab === 'ftmo' && <FTMOView trades={trades} />}
        {tab === 'stats' && <StatsView trades={trades} />}
      </div>
      {showImport && (
        <ImportModal
          onImport={newTrades => addTrades(newTrades)}
          onClose={() => setShowImport(false)}
        />
      )}
    </>
  );
}
