import React, { useState, useMemo } from 'react';
import { DailyQuote } from '../types/stock';

interface StockChartProps {
  history: DailyQuote[];
  ticker: string;
  rsLineNewHighBeforePrice: boolean;
}

export const StockChart: React.FC<StockChartProps> = ({
  history,
  ticker,
  rsLineNewHighBeforePrice,
}) => {
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1Y'>('1Y');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Filter history based on range
  const filteredHistory = useMemo(() => {
    if (!history || history.length === 0) return [];
    if (timeRange === '3M') return history.slice(-63);
    if (timeRange === '6M') return history.slice(-126);
    return history;
  }, [history, timeRange]);

  const n = filteredHistory.length;

  // Chart dimensions
  const width = 800;
  const priceHeight = 220;
  const volumeHeight = 50;
  const rsHeight = 110;
  const gap = 16;
  const totalHeight = priceHeight + volumeHeight + gap + rsHeight;

  // Min/Max computations
  const { minPrice, maxPrice, minRs, maxRs, maxVol, rsNewHighIndices } = useMemo(() => {
    if (n === 0) {
      return { minPrice: 0, maxPrice: 100, minRs: 0, maxRs: 100, maxVol: 1, rsNewHighIndices: [] };
    }

    let minP = Infinity;
    let maxP = -Infinity;
    let minR = Infinity;
    let maxR = -Infinity;
    let maxV = 0;

    filteredHistory.forEach((q) => {
      if (q.close < minP) minP = q.close;
      if (q.close > maxP) maxP = q.close;
      if (q.sma50 && q.sma50 < minP) minP = q.sma50;
      if (q.sma50 && q.sma50 > maxP) maxP = q.sma50;
      if (q.sma200 && q.sma200 < minP) minP = q.sma200;
      if (q.sma200 && q.sma200 > maxP) maxP = q.sma200;

      if (q.rsLine < minR) minR = q.rsLine;
      if (q.rsLine > maxR) maxR = q.rsLine;
      if (q.volume > maxV) maxV = q.volume;
    });

    // Detect RS new highs before price new highs
    const newHighs: number[] = [];
    let runningMaxRs = -Infinity;
    let runningMaxPrice = -Infinity;

    filteredHistory.forEach((q, idx) => {
      const isRsRecord = q.rsLine > runningMaxRs;
      const isPriceRecord = q.close > runningMaxPrice;

      if (isRsRecord && !isPriceRecord && idx > 20) {
        newHighs.push(idx);
      }
      if (q.rsLine > runningMaxRs) runningMaxRs = q.rsLine;
      if (q.close > runningMaxPrice) runningMaxPrice = q.close;
    });

    const padP = (maxP - minP) * 0.08 || 5;
    const padR = (maxR - minR) * 0.1 || 2;

    return {
      minPrice: Math.max(1, minP - padP),
      maxPrice: maxP + padP,
      minRs: Math.max(1, minR - padR),
      maxRs: maxR + padR,
      maxVol: maxV * 1.2 || 1000,
      rsNewHighIndices: newHighs,
    };
  }, [filteredHistory, n]);

  // Coordinate scales
  const getX = (index: number) => {
    if (n <= 1) return 0;
    return (index / (n - 1)) * (width - 60) + 10;
  };

  const getYPrice = (price: number) => {
    const range = maxPrice - minPrice || 1;
    return priceHeight - ((price - minPrice) / range) * (priceHeight - 20) - 10;
  };

  const getYVolume = (vol: number) => {
    const vH = (vol / maxVol) * volumeHeight;
    return priceHeight + volumeHeight - vH;
  };

  const getYRs = (rs: number) => {
    const range = maxRs - minRs || 1;
    const baseY = priceHeight + volumeHeight + gap;
    return baseY + rsHeight - ((rs - minRs) / range) * (rsHeight - 20) - 10;
  };

  // Paths
  const pricePath = useMemo(() => {
    if (n === 0) return '';
    return filteredHistory.reduce((acc, q, i) => {
      const x = getX(i);
      const y = getYPrice(q.close);
      return `${acc} ${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');
  }, [filteredHistory, n, minPrice, maxPrice]);

  const sma50Path = useMemo(() => {
    let p = '';
    let started = false;
    filteredHistory.forEach((q, i) => {
      if (q.sma50 !== undefined) {
        const x = getX(i);
        const y = getYPrice(q.sma50);
        p += `${!started ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
        started = true;
      }
    });
    return p;
  }, [filteredHistory, minPrice, maxPrice]);

  const sma200Path = useMemo(() => {
    let p = '';
    let started = false;
    filteredHistory.forEach((q, i) => {
      if (q.sma200 !== undefined) {
        const x = getX(i);
        const y = getYPrice(q.sma200);
        p += `${!started ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
        started = true;
      }
    });
    return p;
  }, [filteredHistory, minPrice, maxPrice]);

  const rsLinePath = useMemo(() => {
    if (n === 0) return '';
    return filteredHistory.reduce((acc, q, i) => {
      const x = getX(i);
      const y = getYRs(q.rsLine);
      return `${acc} ${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');
  }, [filteredHistory, n, minRs, maxRs]);

  const rsSma50Path = useMemo(() => {
    let p = '';
    let started = false;
    filteredHistory.forEach((q, i) => {
      if (q.rsSma50 !== undefined) {
        const x = getX(i);
        const y = getYRs(q.rsSma50);
        p += `${!started ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
        started = true;
      }
    });
    return p;
  }, [filteredHistory, minRs, maxRs]);

  const currentHover = hoverIndex !== null && filteredHistory[hoverIndex] ? filteredHistory[hoverIndex] : filteredHistory[n - 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;
    const idx = Math.min(n - 1, Math.max(0, Math.round(((svgX - 10) / (width - 60)) * (n - 1))));
    setHoverIndex(idx);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-5 relative select-none">
      {/* Chart Top Bar with Time Controls and Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
            <span className="text-slate-300 font-mono">Precio {ticker}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span>
            <span className="text-slate-400 font-mono">SMA 50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-sky-400 inline-block"></span>
            <span className="text-slate-400 font-mono">SMA 200</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-indigo-400 inline-block"></span>
            <span className="text-slate-300 font-mono">Línea RS vs SPY</span>
          </div>
        </div>

        {/* Time Segmented Control */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          {(['3M', '6M', '1Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                timeRange === r
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Hover Data Strip */}
      {currentHover && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-2 px-3 bg-slate-950/70 border border-slate-800/60 rounded-lg text-xs font-mono mb-3">
          <div>
            <span className="text-slate-500 block text-[11px]">Fecha</span>
            <span className="text-slate-200 font-medium tabular-nums">{currentHover.date}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Precio Cierre</span>
            <span className="text-emerald-400 font-bold tabular-nums">${currentHover.close.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Línea RS</span>
            <span className="text-indigo-400 font-semibold tabular-nums">{currentHover.rsLine.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">SMA 50 / 200</span>
            <span className="text-slate-300 tabular-nums">
              ${currentHover.sma50?.toFixed(2) || '—'} / ${currentHover.sma200?.toFixed(2) || '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Benchmark SPY</span>
            <span className="text-slate-400 tabular-nums">${currentHover.spyClose.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* SVG Chart Container */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] max-h-[460px]">
        <svg
          viewBox={`0 0 ${width} ${totalHeight}`}
          className="w-full h-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Price Area Gradient */}
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* RS Line Gradient */}
            <linearGradient id="rsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines Price */}
          {[0.2, 0.5, 0.8].map((ratio) => {
            const y = priceHeight * ratio;
            const priceVal = maxPrice - (maxPrice - minPrice) * ratio;
            return (
              <g key={`grid-p-${ratio}`}>
                <line x1="0" y1={y} x2={width - 50} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                <text x={width - 45} y={y + 3} fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
                  ${priceVal.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Volume bars */}
          {filteredHistory.map((q, i) => {
            const x = getX(i);
            const y = getYVolume(q.volume);
            const h = priceHeight + volumeHeight - y;
            const isUp = i > 0 ? q.close >= filteredHistory[i - 1].close : true;
            return (
              <rect
                key={`vol-${i}`}
                x={x - 1}
                y={y}
                width={Math.max(1.5, (width - 60) / n - 1)}
                height={Math.max(1, h)}
                fill={isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.2)'}
              />
            );
          })}

          {/* Price area fill & lines */}
          <path
            d={`${pricePath} L ${getX(n - 1)} ${priceHeight} L ${getX(0)} ${priceHeight} Z`}
            fill="url(#priceGradient)"
          />
          <path d={pricePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />

          {/* Moving Averages */}
          {sma50Path && <path d={sma50Path} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />}
          {sma200Path && <path d={sma200Path} fill="none" stroke="#38bdf8" strokeWidth="1.5" />}

          {/* Partition Divider Line */}
          <line
            x1="0"
            y1={priceHeight + volumeHeight + gap / 2}
            x2={width}
            y2={priceHeight + volumeHeight + gap / 2}
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Subtitle for RS Line */}
          <text
            x="10"
            y={priceHeight + volumeHeight + gap + 14}
            fill="#94a3b8"
            fontSize="11"
            fontWeight="600"
            fontFamily="Plus Jakarta Sans"
          >
            LÍNEA DE FUERZA RELATIVA (RS LINE vs SPY)
          </text>

          {/* RS Grid Lines */}
          {[0.3, 0.7].map((ratio) => {
            const y = priceHeight + volumeHeight + gap + rsHeight * ratio;
            const rsVal = maxRs - (maxRs - minRs) * ratio;
            return (
              <g key={`grid-rs-${ratio}`}>
                <line x1="0" y1={y} x2={width - 50} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                <text x={width - 45} y={y + 3} fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
                  {rsVal.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* RS Line and SMA */}
          <path
            d={`${rsLinePath} L ${getX(n - 1)} ${priceHeight + volumeHeight + gap + rsHeight} L ${getX(0)} ${priceHeight + volumeHeight + gap + rsHeight} Z`}
            fill="url(#rsGradient)"
          />
          {rsSma50Path && <path d={rsSma50Path} fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" />}
          <path d={rsLinePath} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" />

          {/* Markers: RS New High Ahead Markers */}
          {rsLineNewHighBeforePrice &&
            rsNewHighIndices.slice(-3).map((idx) => {
              const x = getX(idx);
              const y = getYRs(filteredHistory[idx].rsLine);
              return (
                <g key={`rs-high-${idx}`} className="cursor-pointer">
                  <circle cx={x} cy={y} r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                  <line x1={x} y1={y - 6} x2={x} y2={y - 20} stroke="#38bdf8" strokeWidth="1.5" />
                  <rect
                    x={x - 45}
                    y={y - 34}
                    width="90"
                    height="16"
                    rx="3"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y - 23}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="JetBrains Mono"
                  >
                    ★ RS NEW HIGH
                  </text>
                </g>
              );
            })}

          {/* Crosshair on Hover */}
          {hoverIndex !== null && hoverIndex < n && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={0}
                x2={getX(hoverIndex)}
                y2={totalHeight}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getYPrice(filteredHistory[hoverIndex].close)}
                r="4"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getYRs(filteredHistory[hoverIndex].rsLine)}
                r="4"
                fill="#818cf8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
        <span>Fórmula Línea RS = (Precio Acción / Precio SPY) × 100</span>
        {rsLineNewHighBeforePrice && (
          <span className="text-sky-400 font-semibold flex items-center gap-1">
            ★ Señal Detectada: Máximo en Línea RS adelantado a la ruptura de precio
          </span>
        )}
      </div>
    </div>
  );
};
