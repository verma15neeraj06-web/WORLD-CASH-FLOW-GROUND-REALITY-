import React, { useState, useMemo } from 'react';
import { CountryData, CurrencyZone } from '../types/cashFlow';
import {
  formatCompactNumber,
  formatCurrency,
  getPerCapitaCategory,
} from '../utils/cashFlowCalculations';
import { CountryComparisonModal } from './CountryComparisonModal';
import {
  Search,
  ArrowUpDown,
  Download,
  ExternalLink,
  TableProperties,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Scale,
  CheckSquare,
  Square,
} from 'lucide-react';

interface CountryLedgerTableProps {
  countries: CountryData[];
  selectedCountry: CountryData;
  onSelectCountry: (code: string) => void;
  onViewComparative: (code: string) => void;
  onViewDenominations: (code: string) => void;
}

export const CountryLedgerTable: React.FC<CountryLedgerTableProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  onViewComparative,
  onViewDenominations,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'name' | 'population' | 'totalCash' | 'perCapita'>('perCapita');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Comparison state
  const [compareCodes, setCompareCodes] = useState<string[]>(['USA', 'DEU']);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Toggle selection for comparison (max 2)
  const toggleCompareSelection = (code: string) => {
    if (compareCodes.includes(code)) {
      setCompareCodes(compareCodes.filter((c) => c !== code));
    } else {
      if (compareCodes.length >= 2) {
        setCompareCodes([compareCodes[1], code]);
      } else {
        setCompareCodes([...compareCodes, code]);
      }
    }
  };

  const countryA = countries.find((c) => c.code === compareCodes[0]) || countries[0];
  const countryB = countries.find((c) => c.code === compareCodes[1]) || countries[1] || countries[0];

  // Filter countries
  const filtered = useMemo(() => {
    return countries.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.currencyName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRegion = regionFilter === 'All' || c.region === regionFilter;

      return matchSearch && matchRegion;
    });
  }, [countries, searchTerm, regionFilter]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let res = 0;
      if (sortField === 'name') res = a.name.localeCompare(b.name);
      if (sortField === 'population') res = a.population - b.population;
      if (sortField === 'totalCash') res = a.totalMintedValueUSD - b.totalMintedValueUSD;
      if (sortField === 'perCapita') res = a.cashPerCapitaUSD - b.cashPerCapitaUSD;
      return sortAsc ? res : -res;
    });
  }, [filtered, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Country Code',
      'Country Name',
      'Region',
      'Monetary Zone',
      'Declared Population',
      'Currency Code',
      'Currency Name',
      'Exchange Rate to USD',
      'Total Minted Cash USD',
      'Total Minted Cash Local',
      'Cash Per Capita USD',
      'Physical Pieces Circulation',
      'Central Bank',
      'Mint Authority',
    ];

    const rows = sorted.map((c) => [
      `"${c.code}"`,
      `"${c.name}"`,
      `"${c.region}"`,
      `"${c.currencyZone}"`,
      c.population,
      `"${c.currencyCode}"`,
      `"${c.currencyName}"`,
      c.exchangeRateToUSD,
      Math.round(c.totalMintedValueUSD),
      Math.round(c.totalMintedValueLocal),
      c.cashPerCapitaUSD.toFixed(2),
      c.totalMintedPieces,
      `"${c.centralBank.replace(/"/g, '""')}"`,
      `"${c.mintAuthority.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `world_cash_flow_195_countries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Table Controls */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TableProperties className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Global 195-Nation Master Cash Ledger
              </h2>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Searchable, filterable directory comparing declared population figures against audited physical banknotes and coins. Select 2 countries to compare.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
            >
              <Scale className="h-4 w-4" />
              <span>Compare Selected ({compareCodes.length}/2)</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-600 dark:text-slate-300" />
              <input
                type="text"
                placeholder="Search by country, code, currency..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <select
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Continents</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <span>Page size:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>All 195</option>
            </select>
            <span>({sorted.length} nations)</span>
          </div>
        </div>

        {/* Master Data Table */}
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                <th className="py-3 px-3 w-10 text-center">Cmp</th>
                <th className="py-3 px-4">Nation</th>
                <th
                  onClick={() => handleSort('population')}
                  className="py-3 px-4 cursor-pointer hover:text-emerald-500"
                >
                  <div className="flex items-center gap-1">
                    <span>Declared Population</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Currency</th>
                <th
                  onClick={() => handleSort('totalCash')}
                  className="py-3 px-4 cursor-pointer hover:text-emerald-500"
                >
                  <div className="flex items-center gap-1">
                    <span>Total Minted Cash (USD)</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('perCapita')}
                  className="py-3 px-4 cursor-pointer hover:text-emerald-500"
                >
                  <div className="flex items-center gap-1">
                    <span>Cash / Capita</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Monetary Zone</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginated.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                const isComparing = compareCodes.includes(c.code);
                const tier = getPerCapitaCategory(c.cashPerCapitaUSD);

                return (
                  <tr
                    key={c.code}
                    className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40 ${
                      isSelected ? 'bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleCompareSelection(c.code)}
                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                        title={isComparing ? 'Remove from comparison' : 'Select for comparison'}
                      >
                        {isComparing ? (
                          <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{c.flagEmoji}</span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {c.name}
                          </div>
                          <span className="text-[10px] text-slate-700 dark:text-slate-300 font-mono">
                            {c.code} • {c.region}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">
                      <div>{formatCompactNumber(c.population)}</div>
                      <div className="text-[10px] text-slate-700 dark:text-slate-300">
                        {c.population.toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {c.currencyCode} ({c.currencySymbol})
                      </div>
                      <div className="text-[10px] text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                        {c.currencyName}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        ${formatCompactNumber(c.totalMintedValueUSD)}
                      </div>
                      <div className="text-[10px] text-slate-700 dark:text-slate-300">
                        {c.currencySymbol}{formatCompactNumber(c.totalMintedValueLocal)} local
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(c.cashPerCapitaUSD, '$', 2)}
                      </div>
                      <span className={`inline-block rounded-xs px-1.5 py-0.2 text-[9px] font-sans border ${tier.badgeClass}`}>
                        {tier.label.split(' ')[0]}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[120px] block">
                        {c.currencyZone}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectCountry(c.code);
                            onViewComparative(c.code);
                          }}
                          className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                        >
                          Chart
                        </button>
                        <button
                          onClick={() => {
                            onSelectCountry(c.code);
                            onViewDenominations(c.code);
                          }}
                          className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          Denoms
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} nations
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <CountryComparisonModal
          countryA={countryA}
          countryB={countryB}
          onClose={() => setIsModalOpen(false)}
          onSelectCountryA={(code) => setCompareCodes([code, compareCodes[1] || code])}
          onSelectCountryB={(code) => setCompareCodes([compareCodes[0] || code, code])}
          allCountries={countries}
        />
      )}
    </div>
  );
};
