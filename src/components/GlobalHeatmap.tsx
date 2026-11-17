import React, { useState, useMemo } from 'react';
import { CountryData, CurrencyZone } from '../types/cashFlow';
import {
  formatCompactNumber,
  formatCurrency,
  getPerCapitaCategory,
} from '../utils/cashFlowCalculations';
import {
  Globe2,
  Filter,
  ArrowUpDown,
  TrendingUp,
  Layers,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';

interface GlobalHeatmapProps {
  countries: CountryData[];
  selectedCountry: CountryData;
  onSelectCountry: (code: string) => void;
  selectedZone: CurrencyZone;
  setSelectedZone: (zone: CurrencyZone) => void;
}

const ZONES: CurrencyZone[] = [
  'All',
  'Eurozone',
  'USD Zone & Pegs',
  'Asia-Pacific',
  'Latin America & Caribbean',
  'Middle East & GCC',
  'Sub-Saharan Africa',
  'Europe & Central Asia',
  'Oceania',
];

export const GlobalHeatmap: React.FC<GlobalHeatmapProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  selectedZone,
  setSelectedZone,
}) => {
  const [sortBy, setSortBy] = useState<'perCapita' | 'totalCash' | 'population' | 'name'>('perCapita');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);

  // Filter by currency zone
  const zoneFiltered = useMemo(() => {
    if (selectedZone === 'All') return countries;
    return countries.filter((c) => c.currencyZone === selectedZone);
  }, [countries, selectedZone]);

  // Sorted list
  const sortedCountries = useMemo(() => {
    return [...zoneFiltered].sort((a, b) => {
      let diff = 0;
      if (sortBy === 'perCapita') diff = a.cashPerCapitaUSD - b.cashPerCapitaUSD;
      if (sortBy === 'totalCash') diff = a.totalMintedValueUSD - b.totalMintedValueUSD;
      if (sortBy === 'population') diff = a.population - b.population;
      if (sortBy === 'name') diff = a.name.localeCompare(b.name);
      return sortOrder === 'desc' ? -diff : diff;
    });
  }, [zoneFiltered, sortBy, sortOrder]);

  // Overall rankings across all 195 countries
  const rankedAll = useMemo(() => {
    return [...countries].sort((a, b) => b.cashPerCapitaUSD - a.cashPerCapitaUSD);
  }, [countries]);

  const topPerCapita = useMemo(() => rankedAll.slice(0, 5), [rankedAll]);
  const bottomPerCapita = useMemo(() => rankedAll.slice(-5).reverse(), [rankedAll]);

  // Get color scale function based on USD per capita
  const getCellColor = (perCapitaUSD: number) => {
    if (perCapitaUSD >= 4000) return 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400';
    if (perCapitaUSD >= 2500) return 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-300';
    if (perCapitaUSD >= 1500) return 'bg-teal-500 hover:bg-teal-400 text-white border-teal-300';
    if (perCapitaUSD >= 800) return 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400';
    if (perCapitaUSD >= 400) return 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400';
    if (perCapitaUSD >= 200) return 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400';
    return 'bg-purple-700 hover:bg-purple-600 text-white border-purple-400';
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Globe2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Global Minted Cash Per Capita Heatmap
              </h2>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Visualizing the total physical printed and minted currency value per citizen across all 195 sovereign nations.
            </p>
          </div>

          {/* Color Heat Legend */}
          <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Cash Value Per Capita Scale (USD)
            </span>
            <div className="flex items-center gap-1 text-[10px] font-medium">
              <span className="text-slate-700 dark:text-slate-300 mr-1">&lt;$200</span>
              <div className="h-4 w-6 rounded-xs bg-purple-700" title="<$200 (Digital / Lower Velocity)" />
              <div className="h-4 w-6 rounded-xs bg-amber-600" title="$200 - $400" />
              <div className="h-4 w-6 rounded-xs bg-blue-600" title="$400 - $800" />
              <div className="h-4 w-6 rounded-xs bg-cyan-600" title="$800 - $1,500" />
              <div className="h-4 w-6 rounded-xs bg-teal-500" title="$1,500 - $2,500" />
              <div className="h-4 w-6 rounded-xs bg-emerald-500" title="$2,500 - $4,000" />
              <div className="h-4 w-6 rounded-xs bg-emerald-600" title=">$4,000 (Ultra High Cash Depth)" />
              <span className="text-slate-700 dark:text-slate-300 ml-1">&gt;$4,000+</span>
            </div>
          </div>
        </div>

        {/* Currency Zone Toggles */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Filter className="h-3.5 w-3.5 text-emerald-500" />
              <span>Toggle Currency Zone:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 dark:text-slate-300">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="perCapita">Per Capita Cash ($)</option>
                <option value="totalCash">Total Minted Cash</option>
                <option value="population">Population</option>
                <option value="name">Country Name (A-Z)</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900"
                title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Zone Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {ZONES.map((zone) => {
              const isSelected = selectedZone === zone;
              const count = zone === 'All'
                ? countries.length
                : countries.filter((c) => c.currencyZone === zone).length;

              return (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{zone === 'All' ? '🌐 All 195 Nations' : zone}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboards Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top 5 Cash per Capita */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Award className="h-4 w-4" />
            <span>Highest Cash Value Per Capita</span>
          </div>
          <div className="space-y-1.5">
            {topPerCapita.map((item, idx) => (
              <button
                key={item.code}
                onClick={() => onSelectCountry(item.code)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                  item.code === selectedCountry.code
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-4 font-mono font-bold text-slate-700 dark:text-slate-300">#{idx + 1}</span>
                  <span className="text-xl">{item.flagEmoji}</span>
                  <div className="text-left">
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{item.name}</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 block">{item.currencyCode}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    {formatCurrency(item.cashPerCapitaUSD, '$', 2)}
                  </div>
                  <div className="text-[10px] text-slate-700 dark:text-slate-300">
                    Pop: {formatCompactNumber(item.population)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lowest 5 (Cashless/Developing) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Flame className="h-4 w-4" />
            <span>Lowest Physical Cash Depth / Digital Transition</span>
          </div>
          <div className="space-y-1.5">
            {bottomPerCapita.map((item, idx) => (
              <button
                key={item.code}
                onClick={() => onSelectCountry(item.code)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                  item.code === selectedCountry.code
                    ? 'bg-purple-50 dark:bg-purple-950/60 border border-purple-500 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-4 font-mono font-bold text-slate-700 dark:text-slate-300">#{idx + 1}</span>
                  <span className="text-xl">{item.flagEmoji}</span>
                  <div className="text-left">
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{item.name}</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 block">{item.currencyCode}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                    {formatCurrency(item.cashPerCapitaUSD, '$', 2)}
                  </div>
                  <div className="text-[10px] text-slate-700 dark:text-slate-300">
                    Pop: {formatCompactNumber(item.population)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 195 Nations Heatmap Matrix Grid */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Showing {sortedCountries.length} Sovereign Nations in {selectedZone}
            </span>
          </div>
          <span className="text-xs text-slate-700 dark:text-slate-300">
            Click any tile to inspect central bank audit
          </span>
        </div>

        {/* Heatmap Tile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {sortedCountries.map((c) => {
            const isSelected = c.code === selectedCountry.code;
            const cellColorClass = getCellColor(c.cashPerCapitaUSD);

            return (
              <button
                key={c.code}
                onClick={() => onSelectCountry(c.code)}
                onMouseEnter={() => setHoveredCountry(c)}
                onMouseLeave={() => setHoveredCountry(null)}
                className={`relative group flex flex-col justify-between p-3 rounded-xl border text-left transition-all transform hover:-translate-y-0.5 shadow-xs ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 border-white'
                    : 'border-transparent'
                } ${cellColorClass}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl leading-none">{c.flagEmoji}</span>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-black/20 text-white">
                    {c.currencyCode}
                  </span>
                </div>

                <div className="mt-2 min-w-0">
                  <div className="text-xs font-bold text-white truncate drop-shadow-xs">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-white/80 truncate">
                    Pop: {formatCompactNumber(c.population)}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[10px] text-white/70">Per Cap:</span>
                  <span className="font-mono text-xs font-extrabold text-white">
                    ${Math.round(c.cashPerCapitaUSD).toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
