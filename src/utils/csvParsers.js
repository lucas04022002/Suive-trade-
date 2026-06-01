function splitCSV(line, sep = ',') {
  const result = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; continue; }
    if (c === sep && !inQ) { result.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  result.push(cur.trim());
  return result;
}

function cleanNum(s) {
  if (!s) return NaN;
  return parseFloat(String(s).replace(/\s/g, '').replace(',', '.'));
}

export function parseMT5(allLines, acc) {
  const result = [];
  let headerIdx = -1;
  let sep = ',';

  for (let i = 0; i < allLines.length; i++) {
    const l = allLines[i];
    if ((l.includes('Heure') || l.includes('Time')) && (l.includes('Profit') || l.includes('profit'))) {
      sep = l.includes('\t') ? '\t' : l.includes(';') ? ';' : ',';
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) return [];

  for (let i = headerIdx + 1; i < allLines.length; i++) {
    const line = allLines[i].trim();
    if (!line) break;
    if (line.startsWith('Orders') || line.startsWith('Ordres') || line.startsWith('Résultats') || line.startsWith('Results')) break;

    const cols = splitCSV(allLines[i], sep);
    if (cols.length < 5) continue;

    const rawDate = cols[0].trim();
    if (!rawDate || !rawDate.match(/\d{4}[.\-]\d{2}/)) continue;
    const date = rawDate.split(' ')[0].replace(/\./g, '-');

    let symbol = 'XAUUSD';
    let dir = 'BUY';
    let lots = 0;
    let entry = 0;
    let exitPrice = 0;
    let profit = NaN;
    let note = '';

    for (let c = 1; c < Math.min(cols.length, 6); c++) {
      const v = cols[c].trim();
      if (v.match(/^[A-Z]{2,10}(USD|EUR|GBP|JPY|CAD|CHF|AUD|NZD|XAU|NAS|SPX|US30)?$/i) && v.length >= 3 && v.length <= 12) {
        symbol = v.toUpperCase();
        break;
      }
    }

    for (let c = 1; c < Math.min(cols.length, 6); c++) {
      const v = cols[c].trim().toLowerCase();
      if (v === 'buy' || v === 'sell') { dir = v.toUpperCase(); break; }
    }

    for (let c = cols.length - 1; c >= 5; c--) {
      const v = cleanNum(cols[c]);
      if (!isNaN(v) && cols[c].trim() !== '') { profit = v; break; }
    }
    if (isNaN(profit)) continue;

    for (let c = 3; c < Math.min(cols.length, 8); c++) {
      const v = cleanNum(cols[c]);
      if (!isNaN(v) && v > 0 && v < 100 && cols[c].trim().match(/^\d+\.?\d*$/)) { lots = v; break; }
    }

    for (let c = 4; c < Math.min(cols.length, 10); c++) {
      const v = cleanNum(cols[c]);
      if (!isNaN(v) && v > 10) { entry = v; break; }
    }

    let foundFirst = false;
    for (let c = 4; c < Math.min(cols.length, 14); c++) {
      const v = cleanNum(cols[c]);
      if (!isNaN(v) && v > 10) {
        if (!foundFirst) { foundFirst = true; continue; }
        exitPrice = v; break;
      }
    }

    for (let c = 3; c < Math.min(cols.length, 7); c++) {
      const v = cols[c].trim();
      if (v && !v.match(/^[\d.,\-\s]+$/) && v.toLowerCase() !== 'buy' && v.toLowerCase() !== 'sell' && v !== symbol) {
        note = v; break;
      }
    }

    result.push({ id: Date.now() + i + Math.random(), acc, date, pair: symbol, dir, lots, entry, exit: exitPrice, pnl: profit, note: note || 'Import MT5' });
  }

  return result;
}

export function parsePepperstoneTV(allLines, acc) {
  const sep = ',';
  if (!allLines[0]) return [];
  const headers = splitCSV(allLines[0], sep).map(h => h.trim().toLowerCase());

  const iSymbol = headers.indexOf('symbol');
  const iSide = headers.indexOf('side');
  const iQty = headers.indexOf('filled qty');
  const iPrice = headers.indexOf('avg fill price');
  const iStatus = headers.indexOf('status');
  const iTime = headers.indexOf('update time');
  const iProfit = headers.indexOf('profit');
  const iComm = headers.indexOf('commission');

  if (iProfit === -1 || iStatus === -1) return [];

  const result = [];

  for (let i = 1; i < allLines.length; i++) {
    const line = allLines[i].trim();
    if (!line) continue;
    const cols = splitCSV(line, sep);

    const status = (cols[iStatus] || '').trim();
    if (status !== 'Filled') continue;

    const profitRaw = cols[iProfit] ? cols[iProfit].trim() : '';
    if (!profitRaw) continue;
    const profit = cleanNum(profitRaw);
    if (isNaN(profit)) continue;

    const orderId = cols[cols.length - 1] ? cols[cols.length - 1].trim() : '';
    if (orderId.startsWith('TP:') || orderId.startsWith('SL:') || orderId.startsWith('PTP:') || orderId.startsWith('PSL:')) continue;

    const rawTime = iTime !== -1 ? cols[iTime].trim() : '';
    const date = rawTime ? rawTime.split(' ')[0] : new Date().toISOString().split('T')[0];
    const symbol = iSymbol !== -1 ? cols[iSymbol].trim() : 'XAUUSD';
    const side = iSide !== -1 ? cols[iSide].trim() : 'Buy';
    const dir = side.toLowerCase() === 'sell' ? 'SELL' : 'BUY';
    const lots = iQty !== -1 ? cleanNum(cols[iQty]) || 0 : 0;
    const price = iPrice !== -1 ? cleanNum(cols[iPrice]) || 0 : 0;

    result.push({ id: Date.now() + i + Math.random(), acc, date, pair: symbol, dir, lots, entry: price, exit: 0, pnl: profit, note: 'Import TV' });
  }

  return result;
}

export function parseCSVFile(text, source, acc) {
  const clean = text.replace(/^﻿/, '').trim();
  const allLines = clean.split(/\r?\n/);
  if (source === 'mt5') return parseMT5(allLines, acc);
  return parsePepperstoneTV(allLines, acc);
}
