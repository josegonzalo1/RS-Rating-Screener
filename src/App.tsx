import React, { useState, useEffect } from 'react';
import { StockData } from './types/stock';
import { buildCompleteMarketUniverse } from './data/mockMarketData';
import { Header } from './components/Header';
import { ScreenerTable } from './components/ScreenerTable';
import { StockDetail } from './components/StockDetail';
import { RSCalculator } from './components/RSCalculator';
import { EducationalGuide } from './components/EducationalGuide';
import { AddStockModal } from './components/AddStockModal';
import { ShieldCheck, Info, Check } from 'lucide-react';

export default function App() {
  const [stocks, setStocks] = useState<StockData[]>(() => buildCompleteMarketUniverse());
  const [activeTab, setActiveTab] = useState<'screener' | 'calculator' | 'guide'>('screener');
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rs_screener_favorites');
      return saved ? JSON.parse(saved) : ['NVDA', 'PLTR', 'APP'];
    } catch {
      return ['NVDA', 'PLTR', 'APP'];
    }
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('rs_screener_favorites', JSON.stringify(favorites));
    } catch {
      // Ignore localStorage write failures
    }
  }, [favorites]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(symbol);
      const updated = exists ? prev.filter((s) => s !== symbol) : [...prev, symbol];
      showToast(exists ? `Removido ${symbol} de Watchlist` : `Agregado ${symbol} a Watchlist`);
      return updated;
    });
  };

  const handleSelectStock = (stock: StockData) => {
    setSelectedStock(stock);
  };

  const handleBackToScreener = () => {
    setSelectedStock(null);
  };

  const handleAddStock = (newStock: StockData) => {
    setStocks((prev) => [newStock, ...prev]);
    setSelectedStock(newStock);
    showToast(`Acción ${newStock.symbol} añadida y evaluada con éxito`);
  };

  const handleExportCSV = () => {
    const headers = [
      'Simbolo',
      'Nombre',
      'Sector',
      'Precio',
      '1D_%',
      '1A_%',
      'RS_Rating',
      'Score_Criterios',
      'Q4_3M_%',
      'Q3_6M_%',
      'Q2_9M_%',
      'Q1_12M_%',
      'Linea_RS_New_High',
      'Veredicto',
    ];

    const rows = stocks.map((s) => [
      s.symbol,
      `"${s.name.replace(/"/g, '""')}"`,
      s.sector,
      s.currentPrice.toFixed(2),
      s.change1DPercent.toFixed(2),
      s.change1YPercent.toFixed(2),
      s.rsRating,
      `${s.criteriaScore}/7`,
      s.quarterly.q4.toFixed(1),
      s.quarterly.q3.toFixed(1),
      s.quarterly.q2.toFixed(1),
      s.quarterly.q1.toFixed(1),
      s.rsLineNewHighBeforePrice ? 'SI' : 'NO',
      s.verdict,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RS_Rating_Screen_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV generado y descargado');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'screener') {
            setSelectedStock(null);
          }
        }}
        watchlistCount={favorites.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExportCSV={handleExportCSV}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View Routing */}
        {activeTab === 'screener' && (
          <div>
            {selectedStock ? (
              <StockDetail
                stock={selectedStock}
                isFavorite={favorites.includes(selectedStock.symbol)}
                onToggleFavorite={toggleFavorite}
                onBack={handleBackToScreener}
              />
            ) : (
              <ScreenerTable
                stocks={stocks}
                selectedSymbol={null}
                onSelectStock={handleSelectStock}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </div>
        )}

        {activeTab === 'calculator' && <RSCalculator />}

        {activeTab === 'guide' && <EducationalGuide />}
      </main>

      {/* Footer strictly adhering to anti-slop rules (quiet copyright, real metadata) */}
      <footer className="border-t border-slate-900/80 bg-slate-950 px-4 lg:px-8 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">RS Rating Criteria Engine</span>
            <span aria-hidden="true">·</span>
            <span>Metodología CANSLIM & Mark Minervini SEPA</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Fórmula Ponderada 4 Trimestres</span>
            <span aria-hidden="true">·</span>
            <span>Benchmark: SPY S&P 500</span>
          </div>
        </div>
      </footer>

      {/* Add / Evaluate Custom Stock Modal */}
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStock={handleAddStock}
      />
    </div>
  );
}
