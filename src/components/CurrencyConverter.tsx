import React, { useState, useMemo } from 'react';
import { CountryData } from '../types/cashFlow';
import {
  convertCurrency,
  breakdownAmountIntoDenominations,
  formatCurrency,
  formatCompactNumber,
} from '../utils/cashFlowCalculations';
import {
  ArrowLeftRight,
  Coins,
  Banknote,
  Search,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Check,
  Layers,
} from 'lucide-react';

interface CurrencyConverterProps {
  countries: CountryData[];
  initialFromCountry?: CountryData;
  initialToCountry?: CountryData;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  countries,
  initialFromCountry,
  initialToCountry,
}) => {
  const [fromCode, setFromCode] = useState<string>(initialFromCountry?.code || 'USA');
  const [toCode, setToCode] = useState<string>(initialToCountry?.code || 'DEU');
  const [inputAmount, setInputAmount] = useState<number>(1000);
  const [searchFrom, setSearchFrom] = useState<string>('');
  const [searchTo, setSearchTo] = useState<string>('');

  const fromCountry = useMemo(() => {
    return countries.find((c) => c.code === fromCode) || countries[0];
  }, [countries, fromCode]);

  const toCountry = useMemo(() => {
    return countries.find((c) => c.code === toCode) || countries[1] || countries[0];
  }, [countries, toCode]);

  // Convert amount
  const convertedAmount = useMemo(() => {
    return convertCurrency(
      inputAmount,
      fromCountry.exchangeRateToUSD,
      toCountry.exchangeRateToUSD
    );
  }, [inputAmount, fromCountry, toCountry]);

  // Break down converted amount into destination physical denominations
  const breakdown = useMemo(() => {
    return breakdownAmountIntoDenominations(convertedAmount, toCountry.denominations);
  }, [convertedAmount, toCountry]);

  // Swap currencies
  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  // 1 unit exchange rate
  const unitRateFromTo = convertCurrency(1, fromCountry.exchangeRateToUSD, toCountry.exchangeRateToUSD);
  const unitRateToFrom = convertCurrency(1, toCountry.exchangeRateToUSD, fromCountry.exchangeRateToUSD);

  return (
    <div className="space-y-6">
      {/* Main Conversion Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                195-Nation Currency & Cash Converter
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Instant currency conversion powered by live exchange rates and physical cash denomination breakdown for all sovereign nations.
              </p>
            </div>
          </div>
        </div>

        {/* Input & Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center pt-6">
          {/* FROM COUNTRY */}
          <div className="md:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
              From Currency:
            </span>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">{fromCountry.flagEmoji}</span>
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden"
              >
                {countries.map((c) => (
                  <option key={`from-${c.code}`} value={c.code}>
                    {c.flagEmoji} {c.name} ({c.currencyCode} - {c.currencySymbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Enter Amount ({fromCountry.currencySymbol}):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-700 dark:text-slate-300">
                  {fromCountry.currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-3 py-2 text-lg font-black font-mono text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[100, 500, 1000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setInputAmount(amt)}
                  className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500"
                >
                  +{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 transition-transform active:scale-95 cursor-pointer"
              title="Swap From and To currencies"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>

          {/* TO COUNTRY */}
          <div className="md:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
              To Target Currency:
            </span>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">{toCountry.flagEmoji}</span>
              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden"
              >
                {countries.map((c) => (
                  <option key={`to-${c.code}`} value={c.code}>
                    {c.flagEmoji} {c.name} ({c.currencyCode} - {c.currencySymbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Converted Equivalent:
              </span>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/40 px-3 py-2 text-lg font-black font-mono text-emerald-700 dark:text-emerald-300 truncate">
                {toCountry.currencySymbol}
                {convertedAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                <span className="text-xs font-bold font-sans text-emerald-600 dark:text-emerald-400">
                  {toCountry.currencyCode}
                </span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Exchange Rate:</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                1 {fromCountry.currencyCode} = {unitRateFromTo.toFixed(4)} {toCountry.currencyCode}
              </span>
            </div>
          </div>
        </div>

        {/* Live Rates Summary Bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              <strong>1 {fromCountry.currencyCode}</strong> = {unitRateFromTo.toFixed(4)} {toCountry.currencyCode} •{' '}
              <strong>1 {toCountry.currencyCode}</strong> = {unitRateToFrom.toFixed(4)} {fromCountry.currencyCode}
            </span>
          </div>
          <span className="text-[11px] text-slate-700 dark:text-slate-300">
            Rates synchronized automatically with central bank reference feeds
          </span>
        </div>
      </div>

      {/* Physical Cash Denomination Decomposer */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Physical Cash Denomination Stack
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                How this converted {toCountry.currencySymbol}{convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} would be paid out in actual minted banknotes and coins in {toCountry.name}.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-700 dark:text-slate-300 block">Total Pieces:</span>
            <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
              {breakdown.totalPiecesCount} physical pieces
            </span>
          </div>
        </div>

        {/* Breakdown Items List */}
        {breakdown.items.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-700 dark:text-slate-300">
            Enter an amount above to view the physical cash stack breakdown.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {breakdown.items.map((item) => (
              <div
                key={item.denomination.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.denomination.type === 'banknote' ? (
                      <Banknote className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Coins className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {item.denomination.unitLabel}
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    x {item.count}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300">Subtotal:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {toCountry.currencySymbol}{item.subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {breakdown.remainder > 0 && (
          <div className="mt-3 text-[11px] text-slate-700 dark:text-slate-300">
            Small fractional change: {toCountry.currencySymbol}{breakdown.remainder.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};
