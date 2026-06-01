import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function PnLChart({ trades }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const dates = [...new Set(trades.map(t => t.date))].sort();
    if (!dates.length) {
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      return;
    }

    const buildCumul = acc => {
      let c = 0;
      return dates.map(d => {
        c += trades.filter(t => t.acc === acc && t.date === d).reduce((s, t) => s + t.pnl, 0);
        return parseFloat(c.toFixed(2));
      });
    };

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          { label: 'FTMO', data: buildCumul('ftmo'), borderColor: '#4a90d9', backgroundColor: 'rgba(74,144,217,0.06)', borderWidth: 2, tension: 0.3, pointRadius: 3, fill: true },
          { label: 'Demo', data: buildCumul('demo'), borderColor: '#2db57a', backgroundColor: 'rgba(45,181,122,0.06)', borderWidth: 2, tension: 0.3, pointRadius: 3, fill: true },
          { label: 'TV', data: buildCumul('tv'), borderColor: '#9b6dff', backgroundColor: 'rgba(155,109,255,0.06)', borderWidth: 2, tension: 0.3, pointRadius: 3, fill: true },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888', callback: v => '$' + v } },
          x: { grid: { display: false }, ticks: { color: '#888', maxRotation: 45, autoSkip: true } },
        },
      },
    });

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [trades]);

  if (!trades.length) {
    return (
      <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 13 }}>
        Importe des trades pour voir le graphique
      </div>
    );
  }

  return <canvas ref={canvasRef} style={{ height: 180, width: '100%' }} />;
}
