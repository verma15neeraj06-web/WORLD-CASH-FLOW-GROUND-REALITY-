import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { CountryData } from '../types/cashFlow';
import {
  formatCompactNumber,
  formatCurrency,
  getPerCapitaCategory,
} from '../utils/cashFlowCalculations';
import {
  BarChart3,
  Users,
  Coins,
  Scale,
  DollarSign,
  TrendingUp,
  Layers,
  Info,
  Building2,
  Sparkles,
} from 'lucide-react';

interface ComparativeBarChartProps {
  country: CountryData;
  peerCountries: CountryData[];
  onSelectPeer: (code: string) => void;
}

export const ComparativeBarChart: React.FC<ComparativeBarChartProps> = ({
  country,
  peerCountries,
  onSelectPeer,
}) => {
  const [scaleView, setScaleView] = useState<'balanced' | 'raw'>('balanced');
  const [metricMode, setMetricMode] = useState<'value' | 'peers'>('value');
  const [useLogScale, setUseLogScale] = useState<boolean>(false);
  const [currencyUnit, setCurrencyUnit] = useState<'USD' | 'LOCAL'>('USD');

  const tier = getPerCapitaCategory(country.cashPerCapitaUSD);

  const isUSD = country.currencyCode === 'USD';
  const mintedValue = currencyUnit === 'USD' ? country.totalMintedValueUSD : country.totalMintedValueLocal;
  const currencyLabel = currencyUnit === 'USD' ? 'USD ($)' : country.currencyCode;

  const countryComparisonData = [
    {
      metric: 'Declared Population',
      type: 'population',
      value: country.population,
      scaledValue: country.population / 1_000_000, // Millions
      scaleLabel: 'Pop (Millions of Citizens)',
      displayUnit: 'Citizens',
      preciseValue: `${country.population.toLocaleString()} citizens`,
      perCapitaRatio: '1.0 Citizen / Person',
      notes: `Official Census record (${country.populationLastCensusYear})`,
      color: '#3b82f6', // blue-500
    },
    {
      metric: currencyUnit === 'USD' ? 'Minted Cash (USD)' : `Minted Cash (${country.currencyCode})`,
      type: 'currency',
      value: mintedValue,
      scaledValue: mintedValue / 1_000_000_000, // Billions
      scaleLabel: currencyUnit === 'USD' ? 'Value ($ Billions USD)' : `Value (Billions ${country.currencyCode})`,
      displayUnit: currencyLabel,
      preciseValue:
        currencyUnit === 'USD'
          ? `$${Math.round(country.totalMintedValueUSD).toLocaleString()} USD`
          : `${country.currencySymbol}${Math.round(country.totalMintedValueLocal).toLocaleString()} ${country.currencyCode}`,
      perCapitaRatio:
        currencyUnit === 'USD'
          ? `${formatCurrency(country.cashPerCapitaUSD, '$', 2)} per citizen`
          : `${formatCurrency(country.cashPerCapitaLocal, country.currencySymbol, 2)} per citizen`,
      notes: `Issued by ${country.centralBank}`,
      color: '#10b981', // emerald-500
    },
    {
      metric: 'Physical Minted Pieces',
      type: 'pieces',
      value: country.totalMintedPieces,
      scaledValue: country.totalMintedPieces / 1_000_000_000, // Billions of pieces
      scaleLabel: 'Volume (Billions of Pieces)',
      displayUnit: 'Pieces (Notes + Coins)',
      preciseValue: `${country.totalMintedPieces.toLocaleString()} pieces`,
      perCapitaRatio: `${(country.totalMintedPieces / country.population).toFixed(1)} pieces per citizen`,
      notes: `Printed & minted by ${country.mintAuthority}`,
      color: '#8b5cf6', // purple-500
    },
  ];

  // 2. Data for Peer Country comparison in the same currency zone
  const peerComparisonData = peerCountries.slice(0, 8).map((p) => ({
    code: p.code,
    name: p.name,
    flag: p.flagEmoji,
    population: p.population,
    mintedUSD: Math.round(p.totalMintedValueUSD),
    cashPerCapitaUSD: Math.round(p.cashPerCapitaUSD * 100) / 100,
    totalPieces: p.totalMintedPieces,
    isSelected: p.code === country.code,
  }));

  // Custom hover tooltip for Recharts
  const CustomComparativeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload || {};
      const perCapitaVal = country?.cashPerCapitaUSD || 0;
      const pop = country?.population || 1;
      const piecesPerCapita = pop > 0 ? ((country?.totalMintedPieces || 0) / pop).toFixed(1) : '0';

      return (
        <div className="rounded-xl border border-slate-700/80 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md text-white max-w-xs z-50">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
            <span className="text-xl">{country?.flagEmoji || '🌐'}</span>
            <div>
              <div className="text-sm font-bold text-white">{country?.name || 'Country'}</div>
              <div className="text-[11px] text-slate-400">
                {label || data?.metric || data?.name || ''}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400">Metric Value:</span>
              <span className="font-mono font-bold text-emerald-400">
                {data?.preciseValue || (data?.value !== undefined && data?.value !== null ? Number(data.value).toLocaleString() : '')}
              </span>
            </div>

            {/* Calculated Per-Capita Ratio Banner */}
            <div className="rounded-lg bg-emerald-950/60 border border-emerald-500/30 p-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 mb-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Calculated 'Per Capita' Currency Ratio:</span>
              </div>
              <div className="text-base font-extrabold text-white font-mono">
                {formatCurrency(perCapitaVal, '$', 2)}{' '}
                <span className="text-xs font-normal text-emerald-200">/ citizen</span>
              </div>
              <div className="text-[10px] text-slate-300 mt-1">
                Local: {formatCurrency(country?.cashPerCapitaLocal || 0, country?.currencySymbol || '$', 2)} / citizen
                ({piecesPerCapita} physical pieces / citizen)
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex flex-col gap-0.5 pt-1">
              <div>
                <span className="text-slate-400">Declared Population:</span>{' '}
                <span className="text-slate-200 font-mono">{(country?.population || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400">Total Minted Cash:</span>{' '}
                <span className="text-slate-200 font-mono">
                  ${Math.round(country?.totalMintedValueUSD || 0).toLocaleString()} USD
                </span>
              </div>
              <div>
                <span className="text-slate-400">Monetary Authority:</span>{' '}
                <span className="text-slate-300 truncate">{country?.centralBank || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Peer tooltip
  const CustomPeerTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload || {};
      return (
        <div className="rounded-xl border border-slate-700/80 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-white text-xs max-w-xs z-50">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 font-bold text-sm">
            <span>{data?.flag || '🌐'}</span>
            <span>{data?.name || 'Peer Country'}</span>
            {data?.isSelected && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-sm">
                SELECTED
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Population:</span>
              <span className="font-mono">{(data?.population || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Minted Cash (USD):</span>
              <span className="font-mono text-emerald-400">${(data?.mintedUSD || 0).toLocaleString()}</span>
            </div>
            <div className="rounded-md bg-slate-800 p-2 mt-1 border border-slate-700">
              <div className="text-[10px] text-slate-400">Per Capita Ratio:</div>
              <div className="text-sm font-bold text-emerald-300 font-mono">
                ${(data?.cashPerCapitaUSD || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} / person
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Card for Selected Country */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="text-4xl sm:text-5xl drop-shadow-sm select-none">
              {country.flagEmoji}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {country.name}
                </h2>
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {country.code} • {country.currencyCode}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${tier.badgeClass}`}
                >
                  {tier.label}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span>{country.region} ({country.subregion})</span>
                <span>•</span>
                <span>Zone: <strong className="text-slate-700 dark:text-slate-300">{country.currencyZone}</strong></span>
                <span>•</span>
                <span>Exchange: 1 USD = <strong>{country.exchangeRateToUSD.toLocaleString()} {country.currencyCode}</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Metrics highlight */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                <Users className="h-3.5 w-3.5" />
                <span>Declared Population</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                {formatCompactNumber(country.population)}
              </div>
              <div className="text-[10px] text-slate-700 dark:text-slate-300">
                {country.population.toLocaleString()} citizens
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Coins className="h-3.5 w-3.5" />
                <span>Total Minted Cash</span>
              </div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                ${formatCompactNumber(country.totalMintedValueUSD)}
              </div>
              <div className="text-[10px] text-slate-700 dark:text-slate-300">
                {country.currencySymbol}{formatCompactNumber(country.totalMintedValueLocal)} local
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Per Capita Cash</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                {formatCurrency(country.cashPerCapitaUSD, '$', 2)}
              </div>
              <div className="text-[10px] text-slate-700 dark:text-slate-300">
                {formatCurrency(country.cashPerCapitaLocal, country.currencySymbol, 2)} local / person
              </div>
            </div>
          </div>
        </div>

        {/* Chart Configuration Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Chart View:
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-800/60">
              <button
                onClick={() => setMetricMode('value')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  metricMode === 'value'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Selected Country Comparative
              </button>
              <button
                onClick={() => setMetricMode('peers')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  metricMode === 'peers'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Compare with Zone Peers
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {metricMode === 'value' && !isUSD && (
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-800/60 text-xs">
                <button
                  onClick={() => setCurrencyUnit('USD')}
                  className={`rounded-md px-2.5 py-1 font-semibold ${
                    currencyUnit === 'USD'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrencyUnit('LOCAL')}
                  className={`rounded-md px-2.5 py-1 font-semibold ${
                    currencyUnit === 'LOCAL'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {country.currencyCode} ({country.currencySymbol})
                </button>
              </div>
            )}

            {metricMode === 'value' && (
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-800/60 text-xs">
                <button
                  onClick={() => setScaleView('balanced')}
                  className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                    scaleView === 'balanced'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                  title="Normalized comparison (Pop in Millions, Cash in Billions) so all bars are clearly visible"
                >
                  Balanced Scale
                </button>
                <button
                  onClick={() => setScaleView('raw')}
                  className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                    scaleView === 'raw'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                  title="Absolute raw numeric totals"
                >
                  Raw Totals
                </button>
              </div>
            )}

            <button
              onClick={() => setUseLogScale(!useLogScale)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-colors ${
                useLogScale
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Log Scale {useLogScale ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="mt-4 h-96 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {metricMode === 'value' ? (
              <BarChart
                data={countryComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                />
                <YAxis
                  scale={useLogScale ? 'log' : 'auto'}
                  domain={useLogScale ? ['auto', 'auto'] : [0, 'auto']}
                  tickFormatter={(val) =>
                    scaleView === 'balanced'
                      ? `${val.toLocaleString()} (M/B)`
                      : formatCompactNumber(val)
                  }
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomComparativeTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                  formatter={(value) => (
                    <span className="text-slate-700 dark:text-slate-300">
                      {scaleView === 'balanced'
                        ? 'Comparative Magnitude (Pop: Millions, Cash & Pieces: Billions)'
                        : 'Raw Numerical Value'}
                    </span>
                  )}
                />
                <Bar
                  dataKey={scaleView === 'balanced' ? 'scaledValue' : 'value'}
                  name="Comparative Magnitude"
                  radius={[8, 8, 0, 0]}
                  barSize={60}
                >
                  {countryComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart
                data={peerComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 45 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  tickLine={false}
                />
                <YAxis
                  scale={useLogScale ? 'log' : 'auto'}
                  tickFormatter={(val) => `$${formatCompactNumber(val)}`}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomPeerTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 15, fontSize: 12 }} />
                <Bar
                  dataKey="mintedUSD"
                  name="Minted Cash (USD $)"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                >
                  {peerComparisonData.map((p, idx) => (
                    <Cell
                      key={`peer-cell-${idx}`}
                      fill={p.isSelected ? '#059669' : '#34d399'}
                      stroke={p.isSelected ? '#047857' : 'none'}
                      strokeWidth={p.isSelected ? 2 : 0}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="population"
                  name="Declared Population"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  opacity={0.8}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Contextual Explanatory Footer */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              Hover over each bar to view exact numeric values and the computed per-capita currency distribution ratio.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block"></span> Population
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span> Minted Cash
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 inline-block"></span> Physical Pieces
            </span>
          </div>
        </div>
      </div>

      {/* Peer Quick Switcher */}
      {metricMode === 'peers' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Click to compare with any peer in {country.currencyZone}:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {peerCountries.map((p) => (
              <button
                key={p.code}
                onClick={() => onSelectPeer(p.code)}
                className={`flex items-center gap-2 rounded-xl p-2.5 text-left border text-xs transition-all ${
                  p.code === country.code
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <span className="text-xl">{p.flagEmoji}</span>
                <div className="truncate">
                  <div className="truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-700 dark:text-slate-300">
                    ${Math.round(p.cashPerCapitaUSD)} / cap
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
