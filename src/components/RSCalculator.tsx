import React, { useState } from 'react';
import { calculateRSWeightedScore } from '../utils/rsEngine';
import { FAMOUS_HISTORICAL_SUPERPERFORMERS } from '../data/mockMarketData';
import { Calculator, Sparkles, TrendingUp, Info, RefreshCw, CheckCircle2 } from 'lucide-react';

interface RSCalculatorProps {
  onTestInScreener?: (stockData: { symbol: string; q1: number; q2: number; q3: number; q4: number }) => void;
}

export const RSCalculator: React.FC<RSCalculatorProps> = ({ onTestInScreener }) => {
  const [q4, setQ4] = useState<number>(45);
  const [q3, setQ3] = useState<number>(30);
  const [q2, setQ2] = useState<number>(20);
  const [q1, setQ1] = useState<number>(15);
  const [customTicker, setCustomTicker] = useState<string>('CUSTOM');

  const weightedScore = calculateRSWeightedScore(q1, q2, q3, q4);
  const unweightedAverage = Number(((q1 + q2 + q3 + q4) / 4).toFixed(2));

  // Estimate percentile RS Rating (1 to 99) based on empirical US market distribution
  const estimatedRSRating = Math.max(
    1,
    Math.min(
      99,
      weightedScore <= -20
        ? Math.max(1, Math.round(15 + weightedScore * 0.5))
        : weightedScore <= 0
        ? Math.round(20 + weightedScore * 0.6)
        : weightedScore <= 20
        ? Math.round(40 + weightedScore * 1.5)
        : weightedScore <= 40
        ? Math.round(70 + (weightedScore - 20) * 0.7)
        : weightedScore <= 60
        ? Math.round(84 + (weightedScore - 40) * 0.5)
        : Math.min(99, Math.round(94 + (weightedScore - 60) * 0.15))
    )
  );

  const isElite = estimatedRSRating >= 90;
  const isLeader = estimatedRSRating >= 80;

  const loadPreset = (preset: (typeof FAMOUS_HISTORICAL_SUPERPERFORMERS)[0]) => {
    setQ1(preset.q1);
    setQ2(preset.q2);
    setQ3(preset.q3);
    setQ4(preset.q4);
    setCustomTicker(preset.ticker);
  };

  const resetValues = () => {
    setQ4(45);
    setQ3(30);
    setQ2(20);
    setQ1(15);
    setCustomTicker('CUSTOM');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & Introduction */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Calculator className="w-6 h-6 text-emerald-400" />
          <span>Calculadora de la Fórmula RS de William O'Neil</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          El Relative Strength Rating no es un simple promedio del año. William O'Neil diseñó una fórmula
          con <strong>doble ponderación (40%)</strong> en el trimestre más reciente para premiar la aceleración
          institucional inmediata antes de la ruptura de precio.
        </p>
      </div>

      {/* Interactive Sandbox Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Sliders & Quarterly Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Rendimiento por Trimestre (% Retorno)
            </h2>
            <button
              onClick={resetValues}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
          </div>

          {/* Q4 (Most Recent) - Special Highlight */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Q4 (Últimos 3 Meses) — ¡Doble Peso!
                </span>
                <span className="text-[11px] text-slate-400">Ponderación: 40% del RS total</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={q4}
                  onChange={(e) => setQ4(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 text-sm font-bold font-mono text-emerald-400 bg-slate-900 border border-emerald-500/40 rounded-lg text-right focus:outline-none"
                />
                <span className="text-xs font-mono text-slate-400">%</span>
              </div>
            </div>
            <input
              type="range"
              min="-60"
              max="150"
              value={q4}
              onChange={(e) => setQ4(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-60%</span>
              <span>0%</span>
              <span>+75%</span>
              <span>+150%</span>
            </div>
          </div>

          {/* Q3 (3-6 Months Ago) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Q3 (3 a 6 Meses atrás)
                </span>
                <span className="text-[11px] text-slate-400">Ponderación: 20% del RS total</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={q3}
                  onChange={(e) => setQ3(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 text-sm font-mono text-white bg-slate-900 border border-slate-800 rounded-lg text-right focus:outline-none"
                />
                <span className="text-xs font-mono text-slate-400">%</span>
              </div>
            </div>
            <input
              type="range"
              min="-60"
              max="150"
              value={q3}
              onChange={(e) => setQ3(Number(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer"
            />
          </div>

          {/* Q2 (6-9 Months Ago) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Q2 (6 a 9 Meses atrás)
                </span>
                <span className="text-[11px] text-slate-400">Ponderación: 20% del RS total</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={q2}
                  onChange={(e) => setQ2(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 text-sm font-mono text-white bg-slate-900 border border-slate-800 rounded-lg text-right focus:outline-none"
                />
                <span className="text-xs font-mono text-slate-400">%</span>
              </div>
            </div>
            <input
              type="range"
              min="-60"
              max="150"
              value={q2}
              onChange={(e) => setQ2(Number(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer"
            />
          </div>

          {/* Q1 (9-12 Months Ago) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Q1 (9 a 12 Meses atrás)
                </span>
                <span className="text-[11px] text-slate-400">Ponderación: 20% del RS total</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={q1}
                  onChange={(e) => setQ1(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 text-sm font-mono text-white bg-slate-900 border border-slate-800 rounded-lg text-right focus:outline-none"
                />
                <span className="text-xs font-mono text-slate-400">%</span>
              </div>
            </div>
            <input
              type="range"
              min="-60"
              max="150"
              value={q1}
              onChange={(e) => setQ1(Number(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Output: Gauge & Mathematical Comparison (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main RS Result Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              RS Rating Estimado
            </span>
            <div className="my-3 flex items-baseline justify-center gap-2">
              <span
                className={`text-6xl font-black font-mono tracking-tight tabular-nums ${
                  isElite ? 'text-emerald-400' : isLeader ? 'text-teal-300' : 'text-amber-400'
                }`}
              >
                {estimatedRSRating}
              </span>
              <span className="text-sm font-mono text-slate-500">/ 99</span>
            </div>

            <div className="inline-block px-3 py-1 rounded-md text-xs font-semibold mb-4 bg-slate-950 border border-slate-800">
              {isElite
                ? '★ Nivel Élite (Top 10% del mercado)'
                : isLeader
                ? '✓ Líder Institucional CANSLIM'
                : '⚠ Rango Intermedio / No Liderazgo'}
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-3 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Puntaje Ponderado (Score):</span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  +{weightedScore.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Promedio Simple Sin Ponderar:</span>
                <span className="font-mono text-slate-300 tabular-nums">
                  +{unweightedAverage.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Diferencial por Momentum Reciente:</span>
                <span
                  className={`font-mono font-bold tabular-nums ${
                    weightedScore >= unweightedAverage ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {weightedScore >= unweightedAverage ? '+' : ''}
                  {(weightedScore - unweightedAverage).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Educational Insight Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>¿Por qué el 40% en Q4 cambia todo?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Si una acción tuvo un +80% hace 11 meses (Q1) pero en los últimos 3 meses (Q4) cayó un -10%,
              su promedio simple parecerá atractivo, pero su <strong>RS Rating de O'Neil se desplomará</strong>.
              Las instituciones acumulan antes de que el precio despegue, lo que se refleja en una aceleración en Q4.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Superperformer Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Casos Históricos Reales: Cómo detectó el RS Rating a las mayores Superacciones</span>
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Haz clic en cualquiera de estos precedentes históricos para cargar sus rendimientos trimestrales exactos
          y ver cómo su RS Rating 97-99 alertó a los inversores antes de sus movimientos masivos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAMOUS_HISTORICAL_SUPERPERFORMERS.map((hp) => (
            <div
              key={hp.title}
              onClick={() => loadPreset(hp)}
              className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-900/80 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                  {hp.title}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {hp.gain}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{hp.description}</p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
                <span>Q1: +{hp.q1}%</span>
                <span>Q2: +{hp.q2}%</span>
                <span>Q3: +{hp.q3}%</span>
                <span className="text-emerald-400 font-semibold">Q4: +{hp.q4}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
