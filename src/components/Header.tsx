import React from 'react';
import { TrendingUp, BarChart3, Calculator, BookOpen, Star, Plus, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'screener' | 'calculator' | 'guide';
  setActiveTab: (tab: 'screener' | 'calculator' | 'guide') => void;
  watchlistCount: number;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  onOpenAddModal,
  onExportCSV,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Strictly single line, display face) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <button
            onClick={() => setActiveTab('screener')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
              RS Rating Screener
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean unboxed typography) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('screener')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer pb-0.5 ${
              activeTab === 'screener'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Screener & Criterios</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer pb-0.5 ${
              activeTab === 'calculator'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculadora O'Neil</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer pb-0.5 ${
              activeTab === 'guide'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Guía de Criterios RS</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onExportCSV}
            title="Exportar datos a CSV"
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Evaluar Acción</span>
          </button>
        </div>
      </div>
    </header>
  );
};
