import { DailyQuote, QuarterlyPerformance, RSCriterionResult, StockData } from '../types/stock';

/**
 * William O'Neil 4-Quarter Weighted RS Performance Formula:
 * RS Score = 0.40 * Q4 + 0.20 * Q3 + 0.20 * Q2 + 0.20 * Q1
 * Where Q4 is the most recent quarter (past 3 months), weighted double.
 */
export function calculateRSWeightedScore(q1: number, q2: number, q3: number, q4: number): number {
  return Number((0.40 * q4 + 0.20 * q3 + 0.20 * q2 + 0.20 * q1).toFixed(2));
}

/**
 * Calculates percentile ranking (1 to 99) of scores within a market universe.
 */
export function calculatePercentileRanks(scores: number[]): number[] {
  const n = scores.length;
  if (n === 0) return [];
  if (n === 1) return [90];

  // Map original indices with values
  const indexed = scores.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => a.val - b.val);

  const ranks = new Array<number>(n);
  for (let rankIndex = 0; rankIndex < n; rankIndex++) {
    // Percentile rank strictly from 1 to 99
    const pct = Math.max(1, Math.min(99, Math.round(((rankIndex + 1) / n) * 99)));
    ranks[indexed[rankIndex].idx] = pct;
  }

  return ranks;
}

/**
 * Evaluates the 7 fundamental RS Rating Criteria developed by William O'Neil and Mark Minervini.
 */
export function evaluateRSCriteria(stock: {
  currentPrice: number;
  high52W: number;
  low52W: number;
  sma50: number;
  sma150: number;
  sma200: number;
  sma200SlopePositive: boolean;
  rsRating: number;
  rsLineSlopePositive: boolean;
  rsLineAbove50SMA: boolean;
  rsLineNewHighBeforePrice: boolean;
  spyCorrelationInCorrection: number;
  upDownVolumeRatio: number;
}): { criteriaScore: number; criteriaResults: RSCriterionResult[]; verdict: StockData['verdict'] } {
  const results: RSCriterionResult[] = [];

  // 1. Umbral Mínimo de Liderazgo (RS Rating >= 80, Elite >= 90)
  const isEliteRS = stock.rsRating >= 90;
  const isPassRS = stock.rsRating >= 80;
  results.push({
    id: 'rule_rs_threshold',
    name: 'Umbral RS Rating ≥ 80 (Liderazgo)',
    category: 'Rating',
    status: isEliteRS || isPassRS ? 'pass' : stock.rsRating >= 70 ? 'warning' : 'fail',
    value: `RS ${stock.rsRating}`,
    threshold: '≥ 80 (Elite ≥ 90)',
    description: isEliteRS
      ? 'RS Rating élite (percentil 90+). Se sitúa en el 10% superior de todo el mercado.'
      : isPassRS
      ? 'RS Rating líder (percentil 80-89). Cumple el criterio mínimo de CANSLIM.'
      : stock.rsRating >= 70
      ? 'RS en rango intermedio (70-79). Requiere confirmación adicional antes de breakout.'
      : 'RS rezagado (< 70). William O\'Neil desaconseja comprar acciones bajo percentil 70.',
    authoritativeRule: 'O\'Neil & Minervini: Las superacciones líderes casi siempre tienen un RS ≥ 80 previo a sus grandes movimientos alcistas.',
  });

  // 2. Tendencia de la Línea RS (RS Line > SMA 50 y pendiente ascendente)
  const isLineBullish = stock.rsLineSlopePositive && stock.rsLineAbove50SMA;
  results.push({
    id: 'rule_rs_line_trend',
    name: 'Línea RS en Tendencia Alcista',
    category: 'RS Line',
    status: isLineBullish ? 'pass' : stock.rsLineAbove50SMA ? 'warning' : 'fail',
    value: stock.rsLineAbove50SMA ? (stock.rsLineSlopePositive ? 'Alcista > SMA 50' : 'Plana > SMA 50') : 'Bajo SMA 50',
    threshold: '> SMA 50 y pendiente > 0',
    description: isLineBullish
      ? 'La línea RS (Acción / SPY) cotiza por encima de su media de 50 sesiones y mantiene pendiente positiva.'
      : stock.rsLineAbove50SMA
      ? 'La línea RS está sobre la media pero con momento decreciente.'
      : 'La línea RS cotiza bajo su SMA 50, perdiendo fuerza relativa frente al S&P 500.',
    authoritativeRule: 'La línea de fuerza relativa debe mostrar acumulación constante y superar su propia media móvil.',
  });

  // 3. Nuevo Máximo de la Línea RS antes o con el Precio (Leading Indicator)
  const isRSNewHigh = stock.rsLineNewHighBeforePrice;
  results.push({
    id: 'rule_rs_new_high',
    name: 'Nuevo Máximo en Línea RS (Antes del Precio)',
    category: 'RS Line',
    status: isRSNewHigh ? 'pass' : 'warning',
    value: isRSNewHigh ? 'Confirmado (Blue Sky RS)' : 'Alineado al Precio',
    threshold: 'RS Line New High',
    description: isRSNewHigh
      ? '¡Señal de máxima fuerza! La línea RS marcó un nuevo máximo de 52 semanas antes o al romper la base.'
      : 'La línea RS acompaña al precio pero aún no ha registrado un nuevo máximo adelantado.',
    authoritativeRule: 'La señal técnica individual más alcista según O\'Neil: RS marcando nuevos máximos históricos mientras el precio aún consolida.',
  });

  // 4. Resistencia durante Correcciones del Mercado (Alpha vs SPY)
  const isPullbackResilient = stock.spyCorrelationInCorrection >= 1.5;
  const isModerateResilient = stock.spyCorrelationInCorrection >= 0.8;
  results.push({
    id: 'rule_pullback_resilience',
    name: 'Resiliencia en Correcciones del SPY',
    category: 'RS Line',
    status: isPullbackResilient ? 'pass' : isModerateResilient ? 'warning' : 'fail',
    value: `+${(stock.spyCorrelationInCorrection * 10).toFixed(1)}% Fuerza Rel.`,
    threshold: 'Mínimos crecientes vs SPY',
    description: isPullbackResilient
      ? 'En retrocesos del mercado, la acción no cede terreno o forma mínimos más altos (Divergencia Positiva).'
      : isModerateResilient
      ? 'Comportamiento en línea con el mercado en correcciones.'
      : 'Cae con mayor aceleración que el S&P 500 en correcciones.',
    authoritativeRule: 'Las verdaderas líderes revelan su identidad cuando el mercado general corrige.',
  });

  // 5. Plantilla de Tendencia Técnica (Minervini Trend Template)
  const priceAboveSMAs = stock.currentPrice > stock.sma50 && stock.sma50 > stock.sma150 && stock.sma150 > stock.sma200;
  const trendTemplatePass = priceAboveSMAs && stock.sma200SlopePositive;
  results.push({
    id: 'rule_trend_template',
    name: 'Plantilla de Tendencia (Minervini)',
    category: 'Trend Template',
    status: trendTemplatePass ? 'pass' : priceAboveSMAs ? 'warning' : 'fail',
    value: trendTemplatePass ? 'P > 50 > 150 > 200' : priceAboveSMAs ? 'SMA 200 Plana' : 'Desalineado',
    threshold: 'P > SMA50 > SMA150 > SMA200',
    description: trendTemplatePass
      ? 'Estructura en Etapa 2 (Stage 2 Uptrend). Precio sobre SMA50, SMA150 y SMA200 ascendente.'
      : priceAboveSMAs
      ? 'Medias alineadas pero la SMA 200 carece de inclinación alcista prolongada.'
      : 'Estructura técnica fuera de Etapa 2.',
    authoritativeRule: 'Mark Minervini SEPA: Nunca comprar sin confirmación de alineación de medias 50/150/200.',
  });

  // 6. Proximidad a Máximos de 52 Semanas (Cerca de Máximos, Lejos de Mínimos)
  const distFromHigh = ((stock.high52W - stock.currentPrice) / stock.high52W) * 100;
  const gainFromLow = ((stock.currentPrice - stock.low52W) / stock.low52W) * 100;
  const isNearHigh = distFromHigh <= 15 && gainFromLow >= 30;
  const isModerateHigh = distFromHigh <= 25 && gainFromLow >= 20;
  results.push({
    id: 'rule_high_proximity',
    name: 'Proximidad a Máximo 52 Semanas',
    category: 'Price Base',
    status: isNearHigh ? 'pass' : isModerateHigh ? 'warning' : 'fail',
    value: `-${distFromHigh.toFixed(1)}% del Máx / +${gainFromLow.toFixed(0)}% del Mín`,
    threshold: '≤ 15% del Máx & ≥ +30% del Mín',
    description: isNearHigh
      ? `Cotiza a solo ${distFromHigh.toFixed(1)}% de máximos y +${gainFromLow.toFixed(0)}% sobre mínimos anuales.`
      : isModerateHigh
      ? `A ${distFromHigh.toFixed(1)}% de máximos anuales.`
      : `Lejos de máximos (${distFromHigh.toFixed(1)}%). Riesgo de resistencia acumulada.`,
    authoritativeRule: 'Las acciones que parecen estar "demasiado altas" a menudo suben mucho más; las líderes cotizan cerca de máximos.',
  });

  // 7. Volumen Institucional y Ratio Acumulación / Distribución (Up/Down Ratio >= 1.2)
  const isAccumulationStrong = stock.upDownVolumeRatio >= 1.25;
  const isAccumulationModerate = stock.upDownVolumeRatio >= 1.0;
  results.push({
    id: 'rule_volume_accumulation',
    name: 'Ratio Acumulación / Distribución (U/D)',
    category: 'Volume/Inst',
    status: isAccumulationStrong ? 'pass' : isAccumulationModerate ? 'warning' : 'fail',
    value: `${stock.upDownVolumeRatio.toFixed(2)}x`,
    threshold: '≥ 1.20x (Volumen institucional)',
    description: isAccumulationStrong
      ? `Ratio Up/Down de ${stock.upDownVolumeRatio.toFixed(2)}x confirma patrocinio institucional neto (Rating A/B).`
      : isAccumulationModerate
      ? `Ratio neutro (${stock.upDownVolumeRatio.toFixed(2)}x). Flujo institucional equilibrado.`
      : `Ratio bajo (${stock.upDownVolumeRatio.toFixed(2)}x), indicando presión de venta o distribución neta.`,
    authoritativeRule: 'El volumen es el rastro del dinero institucional. Las subidas deben tener mayor volumen que las caídas.',
  });

  const passCount = results.filter((r) => r.status === 'pass').length;
  
  let verdict: StockData['verdict'] = 'Lagging / Avoid';
  if (passCount >= 6 && stock.rsRating >= 85) {
    verdict = 'Elite Leader';
  } else if (passCount >= 4 && stock.rsRating >= 75) {
    verdict = 'Strong Leader';
  } else if (passCount >= 3 && stock.rsRating >= 65) {
    verdict = 'Watchlist Setup';
  }

  return {
    criteriaScore: passCount,
    criteriaResults: results,
    verdict,
  };
}
