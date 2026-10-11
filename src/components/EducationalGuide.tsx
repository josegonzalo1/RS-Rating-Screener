import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const EducationalGuide: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <span>Guía Maestra: Reglas y Criterios de RS Rating</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Fundamentos técnicos del Relative Strength Rating creado por <strong>William J. O'Neil</strong> (fundador de
          Investor's Business Daily y del sistema CANSLIM) y perfeccionado por el dos veces campeón de trading de EE. UU.{' '}
          <strong>Mark Minervini</strong> (metodología SEPA).
        </p>
      </div>

      {/* Distinction Card: RS Rating vs RSI (Clearing the common confusion) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Diferencia Vital: RS Rating (O'Neil) vs RSI (Wilder)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 border border-emerald-500/30 rounded-lg p-4">
            <span className="font-bold font-mono text-emerald-400 text-sm block mb-1">
              RS Rating (Relative Strength)
            </span>
            <p className="text-slate-300 leading-relaxed">
              Mide el rendimiento de <strong>una acción comparada con todas las demás acciones del mercado</strong> a lo
              largo de 12 meses. Es una clasificación de percentil (1 a 99). Un RS de 95 significa que ha superado al
              95% de todo el mercado.
            </p>
            <span className="text-[11px] text-emerald-300 font-mono mt-2 block">
              ✓ Objetivo: Detectar líderes institucionales y acciones ganadoras.
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <span className="font-bold font-mono text-slate-400 text-sm block mb-1">
              RSI (Relative Strength Index)
            </span>
            <p className="text-slate-400 leading-relaxed">
              Oscilador técnico de 0 a 100 desarrollado por J. Welles Wilder que solo mide las ganancias internas de una
              sola acción contra sus propias pérdidas durante 14 periodos. No compara la acción contra el resto del mercado.
            </p>
            <span className="text-[11px] text-slate-500 font-mono mt-2 block">
              • Objetivo: Identificar sobrecompra (&gt;70) o sobreventa (&lt;30).
            </span>
          </div>
        </div>
      </div>

      {/* Core Mathematical Components of the RS Rating System */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Estructura Matemática y Componentes Centrales del RS Rating</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Desglose de los factores cuantitativos, escalas de medición, ponderaciones y metodología de normalización percentil.
          </p>
        </div>

        {/* Factors & Weights Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Factor / Ventana Temporal</th>
                <th className="py-2.5 px-3">Definición Cuantitativa</th>
                <th className="py-2.5 px-3">Escala de Entrada</th>
                <th className="py-2.5 px-3 text-right">Ponderación Relativa</th>
                <th className="py-2.5 px-3 text-right">Peso en Fórmula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              <tr className="bg-emerald-500/5 text-emerald-300">
                <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Q4 (Trimestre Reciente)</span>
                </td>
                <td className="py-3 px-3 font-sans text-slate-300">Rendimiento de los últimos 3 meses (~63 días de bolsa)</td>
                <td className="py-3 px-3 text-slate-300">% Retorno de Precio</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-400">Doble Peso (2x)</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-400">40.0%</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-white">Q3 (Trimestre Medio)</td>
                <td className="py-3 px-3 font-sans text-slate-400">Rendimiento de hace 3 a 6 meses</td>
                <td className="py-3 px-3 text-slate-300">% Retorno de Precio</td>
                <td className="py-3 px-3 text-right text-slate-400">Peso Estándar (1x)</td>
                <td className="py-3 px-3 text-right text-slate-300">20.0%</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-white">Q2 (Trimestre Posterior)</td>
                <td className="py-3 px-3 font-sans text-slate-400">Rendimiento de hace 6 a 9 meses</td>
                <td className="py-3 px-3 text-slate-300">% Retorno de Precio</td>
                <td className="py-3 px-3 text-right text-slate-400">Peso Estándar (1x)</td>
                <td className="py-3 px-3 text-right text-slate-300">20.0%</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-white">Q1 (Trimestre Base)</td>
                <td className="py-3 px-3 font-sans text-slate-400">Rendimiento de hace 9 a 12 meses</td>
                <td className="py-3 px-3 text-slate-300">% Retorno de Precio</td>
                <td className="py-3 px-3 text-right text-slate-400">Peso Estándar (1x)</td>
                <td className="py-3 px-3 text-right text-slate-300">20.0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Formula Representation Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="text-xs font-semibold uppercase text-slate-400">Fórmula de Combinación (Score Bruto):</div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-emerald-400 text-xs sm:text-sm text-center">
            Puntuación Compuesta = (0.40 × Q4) + (0.20 × Q3) + (0.20 × Q2) + (0.20 × Q1)
          </div>
          <div className="text-xs font-semibold uppercase text-slate-400 pt-2">Conversión a Escala de Percentil (1 a 99):</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Una vez calculada la puntuación compuesta para cada acción en el universo cotizado (más de 8,000 acciones en EE.UU.),
            todos los valores se ordenan de menor a mayor. A cada acción se le asigna un número entero del <strong>1 al 99</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono pt-1">
            <div className="bg-slate-900 p-2.5 rounded border border-emerald-500/30 text-emerald-300">
              <span className="font-bold block">RS Rating 90 – 99</span>
              <span className="text-[11px] font-sans text-slate-400">Top 10% superior. Acciones líderes institucionales indiscutibles.</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-teal-500/30 text-teal-300">
              <span className="font-bold block">RS Rating 80 – 89</span>
              <span className="text-[11px] font-sans text-slate-400">Top 20% superior. Umbral mínimo para compras CANSLIM.</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-rose-500/30 text-rose-300">
              <span className="font-bold block">RS Rating &lt; 70</span>
              <span className="text-[11px] font-sans text-slate-400">Rezagadas. Prohibidas para compra según O'Neil y Minervini.</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 7 Core RS Criteria in Detail */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <span>Los 7 Criterios Fundamentales de RS Rating</span>
        </h2>

        <div className="space-y-4 text-xs">
          {/* Criterio 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
              <span className="font-mono">Criterio 1:</span>
              <span className="text-white">Umbral Mínimo de Liderazgo (RS Rating ≥ 80, Ideal ≥ 90)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              El estudio de O'Neil sobre las mayores ganadoras de bolsa desde 1880 demostró que antes de comenzar sus
              mayores subidas, las mejores acciones ya tenían un RS Rating promedio de <strong>87</strong>. Minervini
              establece un mínimo estricto de RS ≥ 80 y aconseja buscar preferiblemente RS ≥ 90.
            </p>
            <div className="mt-2.5 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800/80">
              <strong className="text-emerald-400">Regla Práctica:</strong> Elimina de tu lista cualquier acción con RS &lt; 70.
              No intentes cazar rebotes en empresas rezagadas.
            </div>
          </div>

          {/* Criterio 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
              <span className="font-mono">Criterio 2:</span>
              <span className="text-white">Línea RS en Tendencia Alcista (Sobre SMA 50)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              La línea RS es el cociente diario entre el precio de la acción y el índice de referencia (ej. Acción / SPY).
              No basta con que el precio suba: si el mercado sube más rápido que la acción, la línea RS caerá. La línea RS
              debe mantener una pendiente positiva y situarse por encima de su propia media móvil de 50 sesiones.
            </p>
          </div>

          {/* Criterio 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-sky-400 mb-2">
              <span className="font-mono">Criterio 3:</span>
              <span className="text-white">Nuevo Máximo en Línea RS ANTES del Precio ("Blue Sky RS")</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              William O'Neil denominó esta señal como <em>"uno de los mayores secretos del análisis técnico"</em>. Ocurre
              cuando la acción aún está consolidando dentro de una base (ej. Cup with Handle o VCP), pero su línea RS
              rompe a nuevos máximos de 52 semanas antes que el precio. Esto revela acumulación institucional encubierta.
            </p>
          </div>

          {/* Criterio 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
              <span className="font-mono">Criterio 4:</span>
              <span className="text-white">Resiliencia y Divergencia en Correcciones del Mercado</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Las verdaderas acciones líderes se descubren durante las correcciones del mercado general. Cuando el S&P 500
              cae un 5-10% y marca mínimos decrecientes, la superacción se niega a caer o forma mínimos crecientes. En el
              primer día de rebote del índice, estas acciones suelen ser las primeras en romper a máximos históricos.
            </p>
          </div>

          {/* Criterio 5 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
              <span className="font-mono">Criterio 5:</span>
              <span className="text-white">Alineación con la Plantilla de Tendencia (Trend Template)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              El RS alto debe estar respaldado por una estructura técnica impecable en <strong>Etapa 2 (Stage 2 Uptrend)</strong>:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>El precio actual está por encima de las medias móviles simples de 50, 150 y 200 días.</li>
              <li>La media de 50 días está por encima de la de 150 días, y ésta por encima de la de 200 días.</li>
              <li>La media de 200 días lleva al menos 1 mes en pendiente ascendente.</li>
            </ul>
          </div>

          {/* Criterio 6 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
              <span className="font-mono">Criterio 6:</span>
              <span className="text-white">Proximidad a Máximos Anuales (Cerca de Máximos, Lejos de Mínimos)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Contrario a la intuición de novatos que buscan acciones "baratas", las mejores acciones cotizan dentro del
              15-20% de su máximo de 52 semanas y han subido al menos un 30% desde sus mínimos anuales. El dinero
              institucional empuja los precios hacia nuevos máximos continuos.
            </p>
          </div>

          {/* Criterio 7 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
              <span className="font-mono">Criterio 7:</span>
              <span className="text-white">Patrocinio Institucional y Ratio Acumulación/Distribución (A/D)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              El volumen valida el movimiento. El ratio Up/Down Volume debe ser superior a 1.2x (mayor volumen en días de
              subida que en días de caída en las últimas 50 sesiones), lo cual corresponde a un rating A o B de
              Acumulación Institucional en IBD.
            </p>
          </div>
        </div>
      </div>

      {/* Practical Checklist Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Checklist de Decisión Rápida antes de Operar</span>
        </h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>¿Tiene el valor un RS Rating ≥ 80 (preferiblemente ≥ 90)?</span>
          </div>
          <div className="flex items-start gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>¿La línea RS apunta hacia arriba y supera su media de 50 periodos?</span>
          </div>
          <div className="flex items-start gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>¿El precio está rompiendo una base constructiva adecuada (ej. Cup with Handle, VCP)?</span>
          </div>
          <div className="flex items-start gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>¿El volumen al romper es al menos un 40-50% superior a la media de 50 días?</span>
          </div>
          <div className="flex items-start gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>¿Está el mercado general (SPY / QQQ) en tendencia alcista confirmada?</span>
          </div>
        </div>
      </div>
    </div>
  );
};
