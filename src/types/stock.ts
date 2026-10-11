export interface DailyQuote {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  spyClose: number;
  rsLine: number; // close / spyClose scaled
  sma50?: number;
  sma200?: number;
  rsSma21?: number;
  rsSma50?: number;
}

export interface QuarterlyPerformance {
  q1: number; // 9-12 months ago (%)
  q2: number; // 6-9 months ago (%)
  q3: number; // 3-6 months ago (%)
  q4: number; // Most recent 3 months (%)
  weightedScore: number; // 0.40*q4 + 0.20*q3 + 0.20*q2 + 0.20*q1
}

export interface RSCriterionResult {
  id: string;
  name: string;
  category: 'Rating' | 'RS Line' | 'Trend Template' | 'Volume/Inst' | 'Price Base';
  status: 'pass' | 'warning' | 'fail';
  value: string;
  threshold: string;
  description: string;
  authoritativeRule: string;
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  currentPrice: number;
  change1D: number;
  change1DPercent: number;
  change1YPercent: number;
  high52W: number;
  low52W: number;
  sma50: number;
  sma150: number;
  sma200: number;
  sma200SlopePositive: boolean;
  rsRating: number; // 1-99
  previousRsRating?: number; // RS rating 1 month ago
  rsWeightedScore: number;
  quarterly: QuarterlyPerformance;
  rsLineNewHighBeforePrice: boolean;
  rsLineSlopePositive: boolean;
  rsLineAbove50SMA: boolean;
  spyCorrelationInCorrection: number; // Relative gain during SPY pullbacks
  volumeAverage50D: number;
  recentVolume: number;
  upDownVolumeRatio: number; // Accumulation/Distribution indicator
  criteriaScore: number; // 0-7
  criteriaResults: RSCriterionResult[];
  verdict: 'Elite Leader' | 'Strong Leader' | 'Watchlist Setup' | 'Lagging / Avoid';
  history: DailyQuote[];
  isCustom?: boolean;
}

export type FilterPreset = 'all' | 'elite' | 'leaders' | 'rsNewHigh' | 'trendTemplate' | 'pullbackResilient' | 'watchlist';
