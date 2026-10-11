import React, { useState, useMemo } from 'react';
import { FilterPreset, StockData } from '../types/stock';
import {
  Search,
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface ScreenerTableProps {
  stocks: StockData[];
  selectedSymbol: string | null;
  onSelectStock: (stock: StockData) => void;
  favorites: string[];
  onToggleFavorite: (symbol: string) => void;
}

type SortField = 'rsRating' | 'currentPrice' | 'change1DPercent' | 'change1YPercent' | 'criteriaScore';

export const ScreenerTable: React.FC<ScreenerTableProps> = ({
  stocks,
  selectedSymbol,
  onSelectStock,
  favorites,
  onToggleFavorite,
}) => {
  const [search, setSearch] = useState('');
  const [filterPreset, setFilterPreset] = useState<FilterPreset>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('rsRating');
  const [sortAsc, setSortAsc] = useState(false);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Available unique sectors
  const sectors = useMemo(() => {
    const list = Array.from(new Set(stocks.map((s) => s.sector))).sort();
    return list;
  }, [stocks]);

  // Filtered & sorted stocks
  const processedStocks = useMemo(() => {
    return stocks
      .filter((s) => {
        // Sector filter
        if (selectedSector !== 'all' && s.sector !== selectedSector) {
          return false;
        }

        // Search term
        const matchSearch =
          s.symbol.toLowerCase().includes(search.toLowerCase()) ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.sector.toLowerCase().includes(search.toLowerCase());

        if (!matchSearch) return false;

        // Presets
        if (filterPreset === 'elite') return s.rsRating >= 90;
        if (filterPreset === 'leaders') return s.rsRating >= 80;
        if (filterPreset === 'rsNewHigh') return s.rsLineNewHighBeforePrice;
        if (filterPreset === 'trendTemplate') return s.criteriaResults.find((r) => r.id === 'rule_trend_template')?.status === 'pass';
        if (filterPreset === 'pullbackResilient') return s.spyCorrelationInCorrection >= 1.5;
        if (filterPreset === 'watchlist') return favorites.includes(s.symbol);

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [stocks, search, filterPreset, selectedSector, sortField, sortAsc, favorites]);

  // Pagination logic
  const totalItems = processedStocks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedStocks = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return processedStocks.slice(start, start + pageSize);
  }, [processedStocks, validCurrentPage, pageSize]);

  // Aggregate stats for whole universe
  const stats = useMemo(() => {
    const total = stocks.length;
    const eliteCount = stocks.filter((s) => s.rsRating >= 90).length;
    const leadersCount = stocks.filter((s) => s.rsRating >= 80).length;
    const rsNewHighCount = stocks.filter((s) => s.rsLineNewHighBeforePrice).length;
    const avgRs = Math.round(stocks.reduce((acc, s) => acc + s.rsRating, 0) / (total || 1));

    return { total, eliteCount, leadersCount, rsNewHighCount, avgRs };
  }, [stocks]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getRSColorClass = (rs: number) => {
    if (rs >= 90) return 'text-emerald-400 font-extrabold';
    if (rs >= 80) return 'text-teal-300 font-bold';
    if (rs >= 70) return 'text-amber-300 font-semibold';
    return 'text-rose-400 font-medium';
  };

  const getVerdictBadge = (verdict: StockData['verdict']) => {
    switch (verdict) {
      case 'Elite Leader':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Strong Leader':
        return 'text-teal-300 bg-teal-500/10 border-teal-500/30';
      case 'Watchlist Setup':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-800/80 border-slate-700/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Overview KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Top 100 Mayor Rendimiento S&P 500</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {stats.total} <span className="text-xs font-normal text-slate-500">líderes analizadas</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Percentiles 1 a 99 calculados</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-emerald-400 font-medium block">Élite Institucional (RS ≥ 90)</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {stats.eliteCount}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Líderes de momentum superior</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-teal-300 font-medium block">Líderes de Mercado (RS ≥ 80)</span>
          <div className="text-2xl font-bold font-mono text-teal-300 mt-1 tabular-nums">
            {stats.leadersCount}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Umbral mínimo CANSLIM / Minervini</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-sky-400 font-medium block">Línea RS New High</span>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
            {stats.rsNewHighCount}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Máximo de RS previo al precio</span>
        </div>
      </div>

      {/* Control Bar: Search, Sector Selector & Filter Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar entre las 100 acciones (ej. NVDA, AAPL, Financials)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Sector Filter & Result count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSector}
                onChange={(e) => {
                  setSelectedSector(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">Todos los Sectores</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec} className="bg-slate-900">
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-400 font-mono text-right shrink-0">
              Mostrando <span className="text-white font-semibold tabular-nums">{processedStocks.length}</span> de{' '}
              <span className="tabular-nums">{stocks.length}</span>
            </div>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'elite', label: 'Élite (RS ≥ 90)' },
            { id: 'leaders', label: 'Líderes (RS ≥ 80)' },
            { id: 'rsNewHigh', label: '★ RS Line New High' },
            { id: 'trendTemplate', label: 'Trend Template OK' },
            { id: 'pullbackResilient', label: 'Resiliencia SPY' },
            { id: 'watchlist', label: `Watchlist (${favorites.length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFilterPreset(f.id as FilterPreset);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterPreset === f.id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main High-Density Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">Fav</th>
                <th className="py-3 px-4">Acción</th>
                <th
                  onClick={() => toggleSort('currentPrice')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Precio</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('change1DPercent')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>1D %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('rsRating')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center justify-center gap-1 text-emerald-400">
                    <span>RS Rating</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('criteriaScore')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Criterios (0-7)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right font-mono">Q4 (40%)</th>
                <th
                  onClick={() => toggleSort('change1YPercent')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>1A Perf</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Línea RS</th>
                <th className="py-3 px-4">Veredicto</th>
                <th className="py-3 px-3 w-12 text-center">Ver</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {paginatedStocks.map((stock) => {
                const isFav = favorites.includes(stock.symbol);
                const isSelected = selectedSymbol === stock.symbol;

                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-500/10'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Star Favorite */}
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(stock.symbol);
                      }}
                    >
                      <button className="text-slate-500 hover:text-amber-400 transition-colors p-1">
                        <Star
                          className={`w-4 h-4 ${
                            isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Symbol & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {stock.symbol}
                        </span>
                        {stock.rsLineNewHighBeforePrice && (
                          <span
                            title="Línea RS marcando nuevo máximo antes que el precio"
                            className="text-[10px] text-sky-400 font-mono font-semibold"
                          >
                            ★
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {stock.name}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-mono text-slate-200 tabular-nums font-medium">
                      ${stock.currentPrice.toFixed(2)}
                    </td>

                    {/* 1D % */}
                    <td
                      className={`py-3 px-4 text-right font-mono tabular-nums font-semibold ${
                        stock.change1DPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {stock.change1DPercent >= 0 ? '+' : ''}
                      {stock.change1DPercent.toFixed(2)}%
                    </td>

                    {/* RS Rating */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800">
                        <span className={`font-mono text-base tabular-nums ${getRSColorClass(stock.rsRating)}`}>
                          {stock.rsRating}
                        </span>
                      </div>
                    </td>

                    {/* Criteria Score */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-white tabular-nums">
                        {stock.criteriaScore}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">/7</span>
                    </td>

                    {/* Q4 Performance */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                      {stock.quarterly.q4 >= 0 ? '+' : ''}
                      {stock.quarterly.q4.toFixed(1)}%
                    </td>

                    {/* 1 Year Performance */}
                    <td
                      className={`py-3 px-4 text-right font-mono tabular-nums font-semibold ${
                        stock.change1YPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {stock.change1YPercent >= 0 ? '+' : ''}
                      {stock.change1YPercent.toFixed(1)}%
                    </td>

                    {/* RS Line Status */}
                    <td className="py-3 px-4">
                      <div className="text-[11px] font-mono">
                        {stock.rsLineAbove50SMA ? (
                          <span className="text-emerald-400 font-medium">Alcista {'>'} 50MA</span>
                        ) : (
                          <span className="text-rose-400">Bajo 50MA</span>
                        )}
                      </div>
                      {stock.rsLineNewHighBeforePrice && (
                        <span className="text-[10px] text-sky-400 font-medium block">
                          New High Adelantado
                        </span>
                      )}
                    </td>

                    {/* Verdict */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border whitespace-nowrap ${getVerdictBadge(
                          stock.verdict
                        )}`}
                      >
                        {stock.verdict}
                      </span>
                    </td>

                    {/* Action Arrow */}
                    <td className="py-3 px-3 text-center text-slate-500 group-hover:text-emerald-400">
                      <ChevronRight className="w-4 h-4 mx-auto group-hover:translate-x-0.5 transition-transform" />
                    </td>
                  </tr>
                );
              })}

              {processedStocks.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <p className="text-sm">No se encontraron acciones que cumplan los filtros seleccionados.</p>
                    <button
                      onClick={() => {
                        setSearch('');
                        setFilterPreset('all');
                        setSelectedSector('all');
                      }}
                      className="mt-3 px-3 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
                    >
                      Restablecer filtros
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {processedStocks.length > 0 && (
          <div className="bg-slate-950/70 border-t border-slate-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Mostrar por página:</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                {[25, 50, 100].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setPageSize(sz);
                      setCurrentPage(1);
                    }}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                      pageSize === sz
                        ? 'bg-slate-800 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <span className="text-slate-500 ml-2">
                (Mostrando {(validCurrentPage - 1) * pageSize + 1} -{' '}
                {Math.min(validCurrentPage * pageSize, totalItems)} de {totalItems})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={validCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              <span className="font-mono text-slate-400 px-2">
                Página <span className="text-white font-bold">{validCurrentPage}</span> de{' '}
                <span className="text-white font-bold">{totalPages}</span>
              </span>

              <button
                disabled={validCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
