import React, { useState } from 'react';
import {
  Menu,
  Search,
  Sparkles,
  RefreshCw,
  Coins,
  Users,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import { CountryData, GlobalAggregates } from '../types/cashFlow';
import { formatCompactNumber, formatCurrency } from '../utils/cashFlowCalculations';

interface HeaderProps {
  onToggleSidebar: () => void;
  countries: CountryData[];
  selectedCountry: CountryData;
  onSelectCountry: (code: string) => void;
  globalAggregates: GlobalAggregates;
  isSyncing: boolean;
  refreshData: () => void;
  lastUpdated: Date;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  countries,
  selectedCountry,
  onSelectCountry,
  globalAggregates,
  isSyncing,
  refreshData,
  lastUpdated,
  searchQuery,
  setSearchQuery,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-8 py-3 gap-3">
        {/* Left Section: Mobile menu button + Country Quick Picker */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Country Quick Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-emerald-500 transition-colors shadow-xs"
            >
              <span className="text-xl leading-none">{selectedCountry.flagEmoji}</span>
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {selectedCountry.name}
              </span>
              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                {selectedCountry.currencyCode}
              </span>
            </button>

            {/* Dropdown for picking country */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 z-50 w-72 max-h-96 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-2">
                  <div className="sticky top-0 pb-2 bg-white dark:bg-slate-900">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                      <input
                        type="text"
                        placeholder="Search 195 countries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-hidden text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {countries
                      .filter(
                        (c) =>
                          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.currencyCode.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((country) => (
                        <button
                          key={country.code}
                          onClick={() => {
                            onSelectCountry(country.code);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                            country.code === selectedCountry.code
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span>{country.flagEmoji}</span>
                            <span className="truncate">{country.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                            {country.currencyCode}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span>Pop:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatCompactNumber(selectedCountry.population)}
            </span>
          </div>
        </div>

        {/* Global Key Metrics Tickers */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0 text-xs">
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <div>
              <div className="text-[10px] text-slate-600 dark:text-slate-300 leading-none">Global Pop</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {formatCompactNumber(globalAggregates.totalPopulation)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <Coins className="h-3.5 w-3.5 text-emerald-500" />
            <div>
              <div className="text-[10px] text-slate-600 dark:text-slate-300 leading-none">Minted Cash (USD)</div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                ${formatCompactNumber(globalAggregates.totalMintedValueUSD)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
            <div>
              <div className="text-[10px] text-slate-600 dark:text-slate-300 leading-none">Avg Cash/Capita</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {formatCurrency(globalAggregates.averageCashPerCapitaUSD, '$', 0)}
              </div>
            </div>
          </div>

          <button
            onClick={refreshData}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all shrink-0"
            title="Last synced from central banks"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Live Auto-Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
};
