import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CountryData, DenominationInfo } from '../types/cashFlow';
import {
  formatCompactNumber,
  formatCurrency,
} from '../utils/cashFlowCalculations';
import {
  Banknote,
  Coins,
  ShieldCheck,
  Building2,
  Printer,
  Sparkles,
  Layers,
  Scale,
  Plus,
  RefreshCw,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface DenominationBreakdownProps {
  country: CountryData;
  onSimulateBatch: (countryCode: string, denominationId: string, additionalMillions: number) => void;
}

const COLORS = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#d946ef', // fuchsia
  '#f59e0b', // amber
  '#ec4899', // pink
  '#14b8a6', // teal
];

export const DenominationBreakdown: React.FC<DenominationBreakdownProps> = ({
  country,
  onSimulateBatch,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'banknote' | 'coin'>('all');
  const [selectedDenomId, setSelectedDenomId] = useState<string>(country.denominations[0]?.id || '');
  const [simulationAmountMillion, setSimulationAmountMillion] = useState<number>(10);
  const [showSimSuccess, setShowSimSuccess] = useState<boolean>(false);

  const filteredDenominations = country.denominations.filter((d) => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  });

  const selectedDenom =
    country.denominations.find((d) => d.id === selectedDenomId) ||
    country.denominations[0];

  // Denominations value share breakdown for Recharts
  const chartData = country.denominations.map((d) => {
    const totalDenomValUSD = (d.totalValueMillionLocal * 1_000_000) / country.exchangeRateToUSD;
    const sharePercent = country.totalMintedValueUSD > 0
      ? (totalDenomValUSD / country.totalMintedValueUSD) * 100
      : 0;

    return {
      name: d.unitLabel,
      type: d.type,
      faceValue: d.faceValue,
      valueUSD: Math.round(totalDenomValUSD),
      circulationPiecesMillion: d.circulationQuantityMillion,
      sharePercent: Math.round(sharePercent * 10) / 10,
    };
  });

  const handleRunSimulation = () => {
    if (!selectedDenom) return;
    onSimulateBatch(country.code, selectedDenom.id, simulationAmountMillion);
    setShowSimSuccess(true);
    setTimeout(() => setShowSimSuccess(false), 3000);
  };

  // Cash weight & volume estimation
  // A standard banknote weighs approx 1 gram. A coin weighs approx 5-8 grams.
  const banknotePieces = country.denominations
    .filter((d) => d.type === 'banknote')
    .reduce((acc, d) => acc + d.circulationQuantityMillion * 1_000_000, 0);
  const coinPieces = country.denominations
    .filter((d) => d.type === 'coin')
    .reduce((acc, d) => acc + d.circulationQuantityMillion * 1_000_000, 0);

  const banknoteValueUSD = country.denominations
    .filter((d) => d.type === 'banknote')
    .reduce((acc, d) => acc + (d.totalValueMillionLocal * 1_000_000) / country.exchangeRateToUSD, 0);
  const coinValueUSD = country.denominations
    .filter((d) => d.type === 'coin')
    .reduce((acc, d) => acc + (d.totalValueMillionLocal * 1_000_000) / country.exchangeRateToUSD, 0);

  const banknoteValShare = country.totalMintedValueUSD > 0
    ? (banknoteValueUSD / country.totalMintedValueUSD) * 100
    : 0;
  const coinValShare = country.totalMintedValueUSD > 0
    ? (coinValueUSD / country.totalMintedValueUSD) * 100
    : 0;

  const approxPaperWeightTons = Math.round((banknotePieces * 0.001) / 1000);
  const approxCoinWeightTons = Math.round((coinPieces * 0.006) / 1000);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{country.flagEmoji}</span>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {country.name} Denomination Audit
                </h2>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Comprehensive audit of physical banknote printing and coinage minting across all {country.denominations.length} denominations.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 text-xs">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 block">Issuing Central Bank:</span>
              <strong className="text-slate-900 dark:text-slate-100">{country.centralBank}</strong>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 text-xs">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 block">Mint & Printing Press:</span>
              <strong className="text-slate-900 dark:text-slate-100">{country.mintAuthority}</strong>
            </div>
          </div>
        </div>

        {/* Aggregate Stats on Physical Formats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Banknote className="h-4 w-4" />
              <span>Banknotes Value</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {banknoteValShare.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-700 dark:text-slate-300">
              ${formatCompactNumber(banknoteValueUSD)} • {formatCompactNumber(banknotePieces)} bills
            </div>
          </div>

          <div className="rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-500/20 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Coins className="h-4 w-4" />
              <span>Coins Value</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {coinValShare.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-700 dark:text-slate-300">
              ${formatCompactNumber(coinValueUSD)} • {formatCompactNumber(coinPieces)} coins
            </div>
          </div>

          <div className="rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-500/20 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
              <Layers className="h-4 w-4" />
              <span>Active Denominations</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {country.denominations.length} Tiers
            </div>
            <div className="text-[10px] text-slate-700 dark:text-slate-300">
              {country.denominations.filter((d) => d.type === 'banknote').length} notes,{' '}
              {country.denominations.filter((d) => d.type === 'coin').length} coins
            </div>
          </div>

          <div className="rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/20 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>Issuance Velocity</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              +{country.annualMintingVelocityPercent}% / yr
            </div>
            <div className="text-[10px] text-slate-700 dark:text-slate-300">
              Updated automatically via central bank feed
            </div>
          </div>
        </div>
      </div>

      {/* Visual Composition Chart & Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recharts Denomination Value Distribution */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Value Distribution by Denomination (USD Equivalent)
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 mb-4">
            Total monetary value held by each denomination in circulation.
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(val) => `$${formatCompactNumber(val)}`}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `$${Number(val).toLocaleString()} (${item.payload.sharePercent}% share)`,
                    'Minted Value (USD)',
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="valueUSD" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Central Bank Issuance Simulation & Substrate Inspection */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Printer className="h-4 w-4" />
              <span>Simulate Central Bank Mint Run</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-4">
              Simulate an additional production print batch from the national press. Watch the app recalculate circulation totals and per-capita ratios in real time!
            </p>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Denomination to Mint:
                </label>
                <select
                  value={selectedDenom?.id}
                  onChange={(e) => setSelectedDenomId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden"
                >
                  {country.denominations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.unitLabel} ({d.type.toUpperCase()}) - Current: {d.circulationQuantityMillion}M pieces
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Additional Batch Size:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    +{simulationAmountMillion} Million Pieces
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={simulationAmountMillion}
                  onChange={(e) => setSimulationAmountMillion(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {selectedDenom && (
                <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <div>
                    Batch Added Value:{' '}
                    <strong className="text-slate-900 dark:text-slate-100 font-mono">
                      {country.currencySymbol}{(simulationAmountMillion * selectedDenom.faceValue).toLocaleString()} Million Local
                    </strong>{' '}
                    (approx ${Math.round((simulationAmountMillion * selectedDenom.faceValue * 1_000_000) / country.exchangeRateToUSD).toLocaleString()} USD)
                  </div>
                </div>
              )}

              <button
                onClick={handleRunSimulation}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Authorize & Issue Batch to Circulation</span>
              </button>

              {showSimSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Batch issued! Totals and per capita ratios updated automatically.</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Primary Substrate:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-right max-w-xs truncate">
              {country.denominations[0]?.materialOrSubstrate || 'Standard Cotton Rag'}
            </span>
          </div>
        </div>
      </div>

      {/* Denominations Detailed Breakdown Table & Cards */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              All Denominations Specification Ledger
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Specific dimensions, materials, security features, and circulating volume per denomination.
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              All ({country.denominations.length})
            </button>
            <button
              onClick={() => setFilterType('banknote')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                filterType === 'banknote'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Banknotes ({country.denominations.filter((d) => d.type === 'banknote').length})
            </button>
            <button
              onClick={() => setFilterType('coin')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                filterType === 'coin'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Coins ({country.denominations.filter((d) => d.type === 'coin').length})
            </button>
          </div>
        </div>

        {/* Denominations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDenominations.map((denom) => {
            const denomValUSD = (denom.totalValueMillionLocal * 1_000_000) / country.exchangeRateToUSD;
            const sharePercent = country.totalMintedValueUSD > 0
              ? (denomValUSD / country.totalMintedValueUSD) * 100
              : 0;

            return (
              <div
                key={denom.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 hover:border-emerald-500/50 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {denom.type === 'banknote' ? (
                        <Banknote className="h-5 w-5" />
                      ) : (
                        <Coins className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-base font-extrabold text-slate-900 dark:text-white">
                        {denom.unitLabel}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
                        {denom.type} • Face Value {denom.faceValue}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {sharePercent.toFixed(1)}% of Cash
                  </span>
                </div>

                <div className="py-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Circulation Volume:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {denom.circulationQuantityMillion.toLocaleString()}M pieces
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Total Minted Value:</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      ${formatCompactNumber(denomValUSD)} USD
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Material / Alloy:</span>
                    <span className="text-slate-700 dark:text-slate-300 text-right truncate max-w-[160px]" title={denom.materialOrSubstrate}>
                      {denom.materialOrSubstrate}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Dimensions:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{denom.dimensionsMm}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Security Features:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {denom.securityFeatures.map((sec, i) => (
                        <span
                          key={i}
                          className="rounded-xs bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 text-[9px] text-slate-700 dark:text-slate-300"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
