import React, { useState, useMemo } from 'react';
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
} from 'recharts';
import { CountryData } from '../types/cashFlow';
import { formatCompactNumber, formatCurrency } from '../utils/cashFlowCalculations';
import {
  Sliders,
  Play,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Coins,
  Users,
  DollarSign,
  Sparkles,
} from 'lucide-react';

interface EconomicSimulatorProps {
  countries: CountryData[];
  selectedCountry: CountryData;
  onSelectCountry: (code: string) => void;
}

export const EconomicSimulator: React.FC<EconomicSimulatorProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
}) => {
  // Scenario Parameters
  const [populationChangePercent, setPopulationChangePercent] = useState<number>(0); // e.g. -20% to +50%
  const [mintingPolicyPercent, setMintingPolicyPercent] = useState<number>(10); // e.g. -50% (austerity) to +200% (QE/printing)
  const [sanctionsSeverity, setSanctionsSeverity] = useState<number>(0); // 0 (None) to 100 (Severe embargo & FX freeze)
  const [inflationRatePercent, setInflationRatePercent] = useState<number>(3.5); // 0% to 100%

  // Preset templates
  const applyPreset = (preset: 'hyperinflation' | 'austerity' | 'boom' | 'sanctions' | 'reset') => {
    if (preset === 'hyperinflation') {
      setPopulationChangePercent(2.0);
      setMintingPolicyPercent(150);
      setSanctionsSeverity(40);
      setInflationRatePercent(45.0);
    } else if (preset === 'austerity') {
      setPopulationChangePercent(0.5);
      setMintingPolicyPercent(-30);
      setSanctionsSeverity(10);
      setInflationRatePercent(1.5);
    } else if (preset === 'boom') {
      setPopulationChangePercent(12.0);
      setMintingPolicyPercent(25);
      setSanctionsSeverity(0);
      setInflationRatePercent(2.2);
    } else if (preset === 'sanctions') {
      setPopulationChangePercent(-5.0);
      setMintingPolicyPercent(60);
      setSanctionsSeverity(90);
      setInflationRatePercent(28.0);
    } else {
      setPopulationChangePercent(0);
      setMintingPolicyPercent(10);
      setSanctionsSeverity(0);
      setInflationRatePercent(3.5);
    }
  };

  // Calculations for Projected State
  const projectedValues = useMemo(() => {
    const origPop = selectedCountry.population;
    const newPop = Math.max(10000, Math.round(origPop * (1 + populationChangePercent / 100)));

    // Minting policy adds % growth to physical money supply
    const mintingFactor = 1 + mintingPolicyPercent / 100;

    // Sanctions increase exchange rate (depreciation) and decrease foreign purchasing power
    // e.g. 90% sanctions -> exchange rate multiplies by up to 3.5x (severe local currency devaluation)
    const sanctionsFXMultiplier = 1 + (sanctionsSeverity / 100) * 2.8;
    const newExchangeRate = selectedCountry.exchangeRateToUSD * sanctionsFXMultiplier;

    // Inflation reduces real purchasing power index
    const realValueMultiplier = mintingFactor / (1 + inflationRatePercent / 100);

    const origTotalLocal = selectedCountry.totalMintedValueLocal;
    const newTotalLocal = origTotalLocal * mintingFactor;
    const newTotalUSD = newTotalLocal / newExchangeRate;

    const newPerCapitaLocal = newTotalLocal / newPop;
    const newPerCapitaUSD = newTotalUSD / newPop;

    const origPerCapitaUSD = selectedCountry.cashPerCapitaUSD;
    const perCapitaUSDChangePercent = origPerCapitaUSD > 0
      ? ((newPerCapitaUSD - origPerCapitaUSD) / origPerCapitaUSD) * 100
      : 0;

    // Economic stability risk score (0-100)
    const riskScore = Math.min(
      100,
      Math.max(
        5,
        Math.round(
          Math.abs(mintingPolicyPercent) * 0.25 +
            sanctionsSeverity * 0.5 +
            Math.min(50, inflationRatePercent * 0.8)
        )
      )
    );

    return {
      newPop,
      newExchangeRate,
      newTotalLocal,
      newTotalUSD,
      newPerCapitaLocal,
      newPerCapitaUSD,
      perCapitaUSDChangePercent,
      riskScore,
    };
  }, [selectedCountry, populationChangePercent, mintingPolicyPercent, sanctionsSeverity, inflationRatePercent]);

  // Chart comparison data
  const comparisonChartData = [
    {
      metric: 'Population',
      Current: selectedCountry.population / 1_000_000,
      Projected: projectedValues.newPop / 1_000_000,
      unit: 'Millions',
    },
    {
      metric: 'Minted Cash (USD $B)',
      Current: selectedCountry.totalMintedValueUSD / 1_000_000_000,
      Projected: projectedValues.newTotalUSD / 1_000_000_000,
      unit: 'Billions USD',
    },
    {
      metric: 'Per Capita ($ USD)',
      Current: selectedCountry.cashPerCapitaUSD,
      Projected: projectedValues.newPerCapitaUSD,
      unit: 'USD / person',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sliders className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Economic & Mint Scenario Simulator
                </h2>
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  HYPOTHETICAL MODELING
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Simulate demographic shifts, central bank printing policies, economic sanctions, and inflation shocks for {selectedCountry.name}.
              </p>
            </div>
          </div>

          {/* Country Quick Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Target Country:</span>
            <select
              value={selectedCountry.code}
              onChange={(e) => onSelectCountry(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flagEmoji} {c.name} ({c.currencyCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mr-1">
            Presets:
          </span>
          <button
            onClick={() => applyPreset('hyperinflation')}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-500/20"
          >
            🔥 Hyperinflationary Shock
          </button>
          <button
            onClick={() => applyPreset('austerity')}
            className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-500/20"
          >
            ⚖️ Post-Crisis Austerity
          </button>
          <button
            onClick={() => applyPreset('boom')}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20"
          >
            📈 Demographic & Economic Boom
          </button>
          <button
            onClick={() => applyPreset('sanctions')}
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
          >
            🛡️ Severe Sanctions & FX Shock
          </button>
          <button
            onClick={() => applyPreset('reset')}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          >
            <RotateCcw className="h-3 w-3 inline mr-1" /> Reset
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-500" />
            <span>Scenario Parameters</span>
          </h3>

          {/* Slider 1: Population Shift */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Population Growth / Migration:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {populationChangePercent > 0 ? `+${populationChangePercent}%` : `${populationChangePercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="1"
              value={populationChangePercent}
              onChange={(e) => setPopulationChangePercent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono">
              <span>-30% Depopulation</span>
              <span>Baseline (0%)</span>
              <span>+50% Inflow</span>
            </div>
          </div>

          {/* Slider 2: Minting Policy */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Central Bank Minting / QE Policy:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {mintingPolicyPercent > 0 ? `+${mintingPolicyPercent}%` : `${mintingPolicyPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-60"
              max="250"
              step="5"
              value={mintingPolicyPercent}
              onChange={(e) => setMintingPolicyPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono">
              <span>-60% Tightening</span>
              <span>+10% Normal</span>
              <span>+250% Aggressive QE</span>
            </div>
          </div>

          {/* Slider 3: Sanctions Severity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Economic Sanctions & FX Freeze:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                {sanctionsSeverity}% Severity
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={sanctionsSeverity}
              onChange={(e) => setSanctionsSeverity(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono">
              <span>0% Open Trade</span>
              <span>50% Embargo</span>
              <span>100% Total Isolation</span>
            </div>
          </div>

          {/* Slider 4: Inflation Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Annual Inflation Rate:</span>
              <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                {inflationRatePercent}% / yr
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={inflationRatePercent}
              onChange={(e) => setInflationRatePercent(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono">
              <span>0% Stable</span>
              <span>20% Elevated</span>
              <span>100% Hyperinflation</span>
            </div>
          </div>

          {/* Risk Score Gauge */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <span>Economic Instability Risk:</span>
              </span>
              <span
                className={`font-mono font-extrabold text-sm px-2 py-0.5 rounded-md ${
                  projectedValues.riskScore >= 70
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                    : projectedValues.riskScore >= 40
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {projectedValues.riskScore} / 100 ({projectedValues.riskScore >= 70 ? 'High Risk' : projectedValues.riskScore >= 40 ? 'Moderate Risk' : 'Stable'})
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  projectedValues.riskScore >= 70
                    ? 'bg-red-500'
                    : projectedValues.riskScore >= 40
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${projectedValues.riskScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Results & Projections Column */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Projected Impact Analysis for {selectedCountry.name}
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
              {selectedCountry.currencyCode}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Projected Population */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Users className="h-4 w-4 text-blue-500" />
                <span>Projected Population</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1">
                {formatCompactNumber(projectedValues.newPop)}
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">
                Original: {formatCompactNumber(selectedCountry.population)} ({populationChangePercent >= 0 ? `+${populationChangePercent}%` : `${populationChangePercent}%`})
              </div>
            </div>

            {/* Projected Per Capita Cash */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Coins className="h-4 w-4 text-emerald-500" />
                <span>Projected Per Capita Cash</span>
              </div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                {formatCurrency(projectedValues.newPerCapitaUSD, '$', 2)}
              </div>
              <div className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                projectedValues.perCapitaUSDChangePercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {projectedValues.perCapitaUSDChangePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{projectedValues.perCapitaUSDChangePercent >= 0 ? `+${projectedValues.perCapitaUSDChangePercent.toFixed(1)}%` : `${projectedValues.perCapitaUSDChangePercent.toFixed(1)}%`} vs baseline</span>
              </div>
            </div>

            {/* Projected Exchange Rate */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <DollarSign className="h-4 w-4 text-amber-500" />
                <span>Projected Exchange Rate</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1">
                1 USD = {projectedValues.newExchangeRate.toFixed(2)} {selectedCountry.currencyCode}
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">
                Baseline: 1 USD = {selectedCountry.exchangeRateToUSD.toLocaleString()} {selectedCountry.currencyCode}
              </div>
            </div>

            {/* Projected Total Minted Value */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Zap className="h-4 w-4 text-purple-500" />
                <span>Projected Total Minted USD</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1">
                ${formatCompactNumber(projectedValues.newTotalUSD)}
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">
                Local: {selectedCountry.currencySymbol}{formatCompactNumber(projectedValues.newTotalLocal)}
              </div>
            </div>
          </div>

          {/* Recharts Comparison Bar Chart */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Baseline vs. Projected Scenario Comparison
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      color: '#fff',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 5, fontSize: 11 }} />
                  <Bar dataKey="Current" name="Baseline (Actual)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Projected" name="Projected Scenario" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
