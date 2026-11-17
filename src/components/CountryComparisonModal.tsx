import React from 'react';
import { CountryData } from '../types/cashFlow';
import { formatCompactNumber, formatCurrency } from '../utils/cashFlowCalculations';
import { X, Scale, Coins, Banknote, Users, TrendingUp, ShieldCheck } from 'lucide-react';

interface CountryComparisonModalProps {
  countryA: CountryData;
  countryB: CountryData;
  onClose: () => void;
  onSelectCountryA: (code: string) => void;
  onSelectCountryB: (code: string) => void;
  allCountries: CountryData[];
}

export const CountryComparisonModal: React.FC<CountryComparisonModalProps> = ({
  countryA,
  countryB,
  onClose,
  onSelectCountryA,
  onSelectCountryB,
  allCountries,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Side-by-Side Country Minted Comparison</h3>
              <p className="text-xs text-slate-400">Comparing denomination structures, per-capita ratios, and ground reality</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Country Selectors Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Country A:</label>
              <select
                value={countryA.code}
                onChange={(e) => onSelectCountryA(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-sm font-bold text-white"
              >
                {allCountries.map((c) => (
                  <option key={`comp-a-${c.code}`} value={c.code}>
                    {c.flagEmoji} {c.name} ({c.currencyCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Country B:</label>
              <select
                value={countryB.code}
                onChange={(e) => onSelectCountryB(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-sm font-bold text-white"
              >
                {allCountries.map((c) => (
                  <option key={`comp-b-${c.code}`} value={c.code}>
                    {c.flagEmoji} {c.name} ({c.currencyCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold">
                  <th className="py-3 px-4 w-1/3">Key Metric</th>
                  <th className="py-3 px-4 w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{countryA.flagEmoji}</span>
                      <span className="text-white font-bold">{countryA.name}</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{countryB.flagEmoji}</span>
                      <span className="text-white font-bold">{countryB.name}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-400">Declared Population</td>
                  <td className="py-3 px-4 font-bold text-white">{countryA.population.toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-white">{countryB.population.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-400">Currency Code & Symbol</td>
                  <td className="py-3 px-4 text-emerald-400">{countryA.currencyCode} ({countryA.currencySymbol})</td>
                  <td className="py-3 px-4 text-emerald-400">{countryB.currencyCode} ({countryB.currencySymbol})</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-400">Exchange Rate to USD</td>
                  <td className="py-3 px-4">1 USD = {countryA.exchangeRateToUSD} {countryA.currencyCode}</td>
                  <td className="py-3 px-4">1 USD = {countryB.exchangeRateToUSD} {countryB.currencyCode}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-400">Total Minted Value (USD)</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">${formatCompactNumber(countryA.totalMintedValueUSD)}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">${formatCompactNumber(countryB.totalMintedValueUSD)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-400">Cash Per Capita (USD)</td>
                  <td className="py-3 px-4 font-extrabold text-white">{formatCurrency(countryA.cashPerCapitaUSD, '$', 2)}</td>
                  <td className="py-3 px-4 font-extrabold text-white">{formatCurrency(countryB.cashPerCapitaUSD, '$', 2)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-400">Banknotes vs Coins Share</td>
                  <td className="py-3 px-4">{countryA.notesPiecesPercent}% notes / {countryA.coinsPiecesPercent}% coins</td>
                  <td className="py-3 px-4">{countryB.notesPiecesPercent}% notes / {countryB.coinsPiecesPercent}% coins</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-400">Active Denomination Tiers</td>
                  <td className="py-3 px-4">{countryA.denominations.length} denominations</td>
                  <td className="py-3 px-4">{countryB.denominations.length} denominations</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-400">Informal Economy Share</td>
                  <td className="py-3 px-4 text-amber-400">{countryA.informalEconomyPercent}%</td>
                  <td className="py-3 px-4 text-amber-400">{countryB.informalEconomyPercent}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-400">Central Bank Authority</td>
                  <td className="py-3 px-4 font-sans text-slate-300">{countryA.centralBank}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">{countryB.centralBank}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 px-6 py-4 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
