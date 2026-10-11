import React from 'react';
import { StockData } from '../types/stock';
import { StockChart } from './StockChart';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Star,
  Zap,
  TrendingUp,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface StockDetailProps {
  stock: StockData;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
  onBack: () => void;
}

export const StockDetail: React.FC<StockDetailProps> = ({
  stock,
  isFavorite,
  onToggleFavorite,
  onBack,
}) => {
  const isElite = stock.rsRating >= 90;
  const isLeader = stock.rsRating >= 80;

  // 52-week position indicator
  const range52w = stock.high52W - stock.low52W || 1;
  const pos52wPct = Math.max(0, Math.min(100, ((stock.currentPrice - stock.low52W) / range52w) * 100));

  const statusIcons = {
    pass: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    fail: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  const statusBg = {
    pass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    fail: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="space-y-6">
      {/* Top action bar: Back button & Watchlist toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver al Screener</span>
        </button>

        <button
          onClick={() => onToggleFavorite(stock.symbol)}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
            isFavorite
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
              : 'bg-slate-900 text-slate-300 border-slate-700/70 hover:bg-slate-800'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{isFavorite ? 'En Watchlist' : 'Agregar a Watchlist'}</span>
        </button>
      </div>

      {/* Hero Stock Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Company Title & Info */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">{stock.symbol}</h1>
              <span className="text-xs font-medium text-slate-400">·</span>
              <span className="text-sm font-medium text-slate-300">{stock.name}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-2">
              <span>{stock.sector}</span>
              <span aria-hidden="true">·</span>
              <span>{stock.industry}</span>
              <span aria-hidden="true">·</span>
              <span>Volumen 50D: {(stock.volumeAverage50D / 1_000_000).toFixed(1)}M</span>
            </div>
          </div>

          {/* Pricing & Key Gauges */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-8">
            {/* Price Box */}
            <div className="text-left lg:text-right">
              <span className="text-xs text-slate-500 block">Precio Actual</span>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                ${stock.currentPrice.toFixed(2)}
              </div>
              <div
                className={`text-xs font-semibold font-mono tabular-nums ${
                  stock.change1DPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {stock.change1DPercent >= 0 ? '+' : ''}
                {stock.change1DPercent.toFixed(2)}% ({stock.change1D >= 0 ? '+' : ''}${stock.change1D.toFixed(2)})
              </div>
            </div>

            {/* RS Rating Big Badge */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-center min-w-[130px]">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                RS Rating
              </span>
              <div className="flex items-baseline justify-center gap-1 my-0.5">
                <span
                  className={`text-3xl font-black font-mono tabular-nums ${
                    isElite ? 'text-emerald-400' : isLeader ? 'text-teal-300' : 'text-amber-400'
                  }`}
                >
                  {stock.rsRating}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 99</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">
                {isElite ? 'Percentil Élite (Top 10%)' : isLeader ? 'Líder Institucional' : 'Neutro / Seguimiento'}
              </span>
            </div>

            {/* Criteria Evaluation Badge */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-center min-w-[130px]">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                Criterios RS
              </span>
              <div className="flex items-baseline justify-center gap-1 my-0.5">
                <span
                  className={`text-3xl font-black font-mono tabular-nums ${
                    stock.criteriaScore >= 6
                      ? 'text-emerald-400'
                      : stock.criteriaScore >= 4
                      ? 'text-teal-400'
                      : 'text-amber-400'
                  }`}
                >
                  {stock.criteriaScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 7</span>
              </div>
              <span className="text-[10px] text-emerald-400 block font-medium">
                {stock.verdict}
              </span>
            </div>
          </div>
        </div>

        {/* 52-Week Range Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>52W Mín: ${stock.low52W.toFixed(2)}</span>
            <span className="text-slate-300 font-medium">Rango Anual ({pos52wPct.toFixed(0)}%)</span>
            <span>52W Máx: ${stock.high52W.toFixed(2)}</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${pos52wPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4-Quarter RS Weighted Formula Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Desglose de la Fórmula Ponderada de 4 Trimestres (William O'Neil)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fórmula: <code className="text-emerald-300 font-mono">Score = (40% × Q4) + (20% × Q3) + (20% × Q2) + (20% × Q1)</code>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Score Compuesto</span>
            <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              +{stock.rsWeightedScore.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Q4 (Últimos 3M)</span>
              <span className="font-semibold text-emerald-400">Ponderación: 40%</span>
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {stock.quarterly.q4 >= 0 ? '+' : ''}
              {stock.quarterly.q4.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Aporte: +{(stock.quarterly.q4 * 0.4).toFixed(1)} pts</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Q3 (3-6M atrás)</span>
              <span className="text-slate-400">Ponderación: 20%</span>
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {stock.quarterly.q3 >= 0 ? '+' : ''}
              {stock.quarterly.q3.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Aporte: +{(stock.quarterly.q3 * 0.2).toFixed(1)} pts</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Q2 (6-9M atrás)</span>
              <span className="text-slate-400">Ponderación: 20%</span>
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {stock.quarterly.q2 >= 0 ? '+' : ''}
              {stock.quarterly.q2.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Aporte: +{(stock.quarterly.q2 * 0.2).toFixed(1)} pts</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Q1 (9-12M atrás)</span>
              <span className="text-slate-400">Ponderación: 20%</span>
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {stock.quarterly.q1 >= 0 ? '+' : ''}
              {stock.quarterly.q1.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Aporte: +{(stock.quarterly.q1 * 0.2).toFixed(1)} pts</span>
          </div>
        </div>
      </div>

      {/* Dual Interactive Chart: Price + Moving Averages + Synchronized RS Line */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Gráfico Técnico Dual y Línea de Fuerza Relativa (RS vs SPY)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {stock.history.length} sesiones diarias
          </span>
        </div>
        <StockChart
          history={stock.history}
          ticker={stock.symbol}
          rsLineNewHighBeforePrice={stock.rsLineNewHighBeforePrice}
        />
      </div>

      {/* The 7 Core RS Rating Criteria Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Evaluación de los 7 Criterios de RS Rating (O'Neil & Minervini)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verificación automatizada de reglas cuantitativas de fuerza relativa y patrocinio institucional.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stock.criteriaResults.filter((r) => r.status === 'pass').length} Aprobados</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{stock.criteriaResults.filter((r) => r.status === 'warning').length} Alertas</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-md border border-rose-500/20">
              <XCircle className="w-3.5 h-3.5" />
              <span>{stock.criteriaResults.filter((r) => r.status === 'fail').length} No Cumple</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {stock.criteriaResults.map((criterion, index) => (
            <div
              key={criterion.id}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{statusIcons[criterion.status]}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-500">0{index + 1}.</span>
                      <h3 className="text-sm font-semibold text-white">{criterion.name}</h3>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-md border uppercase font-medium ${
                          statusBg[criterion.status]
                        }`}
                      >
                        {criterion.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{criterion.description}</p>
                    <p className="text-[11px] text-slate-500 mt-1 italic font-sans">
                      "{criterion.authoritativeRule}"
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                  <span className="text-xs text-slate-500 block">Medido vs Regla</span>
                  <div className="text-sm font-bold font-mono text-white tabular-nums">
                    {criterion.value}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    Regla: {criterion.threshold}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
