import React, { useState } from 'react';
import { StockData, DailyQuote, QuarterlyPerformance } from '../types/stock';
import { calculatePercentileRanks, calculateRSWeightedScore, evaluateRSCriteria } from '../utils/rsEngine';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (newStock: StockData) => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onAddStock }) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('Technology');
  const [currentPrice, setCurrentPrice] = useState('150.00');
  const [high52W, setHigh52W] = useState('160.00');
  const [low52W, setLow52W] = useState('80.00');
  const [q4, setQ4] = useState('42.0');
  const [q3, setQ3] = useState('28.0');
  const [q2, setQ2] = useState('18.0');
  const [q1, setQ1] = useState('12.0');
  const [rsLineNewHigh, setRsLineNewHigh] = useState(true);
  const [upDownRatio, setUpDownRatio] = useState('1.35');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    const price = Math.max(1, parseFloat(currentPrice) || 100);
    const h52 = Math.max(price, parseFloat(high52W) || price * 1.1);
    const l52 = Math.min(price, parseFloat(low52W) || price * 0.6);
    const valQ4 = parseFloat(q4) || 0;
    const valQ3 = parseFloat(q3) || 0;
    const valQ2 = parseFloat(q2) || 0;
    const valQ1 = parseFloat(q1) || 0;
    const ratioUD = parseFloat(upDownRatio) || 1.2;

    const weightedScore = calculateRSWeightedScore(valQ1, valQ2, valQ3, valQ4);

    // Approximate percentile RS rating from weighted score
    const rsRating = Math.max(
      1,
      Math.min(
        99,
        weightedScore <= 0
          ? Math.round(25 + weightedScore * 0.5)
          : weightedScore <= 30
          ? Math.round(55 + weightedScore * 0.9)
          : weightedScore <= 60
          ? Math.round(82 + (weightedScore - 30) * 0.4)
          : Math.min(99, Math.round(94 + (weightedScore - 60) * 0.15))
      )
    );

    const sma50 = price * 0.94;
    const sma150 = price * 0.88;
    const sma200 = price * 0.82;

    const criteriaEval = evaluateRSCriteria({
      currentPrice: price,
      high52W: h52,
      low52W: l52,
      sma50,
      sma150,
      sma200,
      sma200SlopePositive: true,
      rsRating,
      rsLineSlopePositive: true,
      rsLineAbove50SMA: true,
      rsLineNewHighBeforePrice: rsLineNewHigh,
      spyCorrelationInCorrection: 1.8,
      upDownVolumeRatio: ratioUD,
    });

    // Generate mock history for chart
    const history: DailyQuote[] = [];
    let cur = l52 * 1.1;
    let spy = 500;
    for (let i = 0; i < 252; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (252 - i));
      const drift = (price - l52) / 252;
      cur = Math.max(l52 * 0.9, cur + drift + (Math.random() - 0.48) * (price * 0.02));
      spy = spy * (1 + 0.12 / 252 + (Math.random() - 0.49) * 0.006);

      history.push({
        date: d.toISOString().split('T')[0],
        close: Number(cur.toFixed(2)),
        open: Number((cur * 0.995).toFixed(2)),
        high: Number((cur * 1.01).toFixed(2)),
        low: Number((cur * 0.99).toFixed(2)),
        volume: 2500000,
        spyClose: Number(spy.toFixed(2)),
        rsLine: Number(((cur / spy) * 100).toFixed(2)),
        sma50: Number((cur * 0.95).toFixed(2)),
        sma200: Number((cur * 0.85).toFixed(2)),
        rsSma50: Number(((cur / spy) * 96).toFixed(2)),
      });
    }

    const newStock: StockData = {
      symbol: symbol.toUpperCase().trim(),
      name: name.trim() || `${symbol.toUpperCase()} Inc.`,
      sector,
      industry: 'Growth Industry',
      currentPrice: price,
      change1D: Number((price * 0.015).toFixed(2)),
      change1DPercent: 1.5,
      change1YPercent: Number((((price - l52) / l52) * 100).toFixed(1)),
      high52W: h52,
      low52W: l52,
      sma50,
      sma150,
      sma200,
      sma200SlopePositive: true,
      rsRating,
      rsWeightedScore: weightedScore,
      quarterly: {
        q1: valQ1,
        q2: valQ2,
        q3: valQ3,
        q4: valQ4,
        weightedScore,
      },
      rsLineNewHighBeforePrice: rsLineNewHigh,
      rsLineSlopePositive: true,
      rsLineAbove50SMA: true,
      spyCorrelationInCorrection: 1.8,
      volumeAverage50D: 2500000,
      recentVolume: 3200000,
      upDownVolumeRatio: ratioUD,
      criteriaScore: criteriaEval.criteriaScore,
      criteriaResults: criteriaEval.criteriaResults,
      verdict: criteriaEval.verdict,
      history,
      isCustom: true,
    };

    onAddStock(newStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            <span>Evaluar Nueva Acción / Ticker Personalizado</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Ticker / Símbolo</label>
              <input
                type="text"
                required
                placeholder="ej. MELI"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Nombre de Empresa</label>
              <input
                type="text"
                placeholder="ej. MercadoLibre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Precio Actual ($)</label>
              <input
                type="number"
                step="0.01"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">52W Máx ($)</label>
              <input
                type="number"
                step="0.01"
                value={high52W}
                onChange={(e) => setHigh52W(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">52W Mín ($)</label>
              <input
                type="number"
                step="0.01"
                value={low52W}
                onChange={(e) => setLow52W(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Quarterly performance */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
            <span className="font-semibold text-slate-300 block">Rendimiento por Trimestre (%)</span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[11px] text-emerald-400 font-bold block mb-1">Q4 (40%)</label>
                <input
                  type="number"
                  value={q4}
                  onChange={(e) => setQ4(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-emerald-500/40 rounded text-emerald-300 font-mono text-center"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Q3 (20%)</label>
                <input
                  type="number"
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-center"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Q2 (20%)</label>
                <input
                  type="number"
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-center"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Q1 (20%)</label>
                <input
                  type="number"
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-center"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800/80 rounded-xl">
            <div>
              <span className="font-medium text-slate-200 block">Línea RS marcando New High adelantado</span>
              <span className="text-[11px] text-slate-500">¿La línea RS rompió a máximos antes que el precio?</span>
            </div>
            <input
              type="checkbox"
              checked={rsLineNewHigh}
              onChange={(e) => setRsLineNewHigh(e.target.checked)}
              className="w-4 h-4 accent-emerald-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Calcular y Añadir al Screener
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
