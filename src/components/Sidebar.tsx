import React from 'react';
import {
  BarChart3,
  Globe2,
  Coins,
  ArrowLeftRight,
  TableProperties,
  RefreshCw,
  Radio,
  Sliders,
  X,
  Menu,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { CurrencyZone } from '../types/cashFlow';

export type ActiveTab = 'comparative' | 'heatmap' | 'denominations' | 'converter' | 'ledger' | 'simulator' | 'reality';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedZone: CurrencyZone;
  setSelectedZone: (zone: CurrencyZone) => void;
  isLiveAutoUpdating: boolean;
  setIsLiveAutoUpdating: (val: boolean) => void;
  secondsUntilNextUpdate: number;
  refreshData: () => void;
  isSyncing: boolean;
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

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  selectedZone,
  setSelectedZone,
  isLiveAutoUpdating,
  setIsLiveAutoUpdating,
  secondsUntilNextUpdate,
  refreshData,
  isSyncing,
}) => {
  const navItems = [
    {
      id: 'comparative' as ActiveTab,
      label: 'Comparative Bar Chart',
      description: 'Population vs. Minted Denominations',
      icon: BarChart3,
      badge: 'Recharts',
    },
    {
      id: 'heatmap' as ActiveTab,
      label: 'Global Per-Capita Heatmap',
      description: '195 Nations Cash Distribution',
      icon: Globe2,
      badge: 'Heatmap',
    },
    {
      id: 'denominations' as ActiveTab,
      label: 'Denomination Audit',
      description: 'Actual Printed & Minted Breakdown',
      icon: Coins,
      badge: 'Details',
    },
    {
      id: 'converter' as ActiveTab,
      label: '195-Country Converter',
      description: 'Live Rates & Physical Cash Stack',
      icon: ArrowLeftRight,
      badge: 'Live',
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'Economic Simulator',
      description: 'Scenario Policy & Sanctions Modeling',
      icon: Sliders,
      badge: 'Simulate',
    },
    {
      id: 'reality' as ActiveTab,
      label: 'Ground Reality & Credit',
      description: 'Direct Credit Funds & Informal Economy',
      icon: CreditCard,
      badge: 'Schemes',
    },
    {
      id: 'ledger' as ActiveTab,
      label: 'Global Currency Ledger',
      description: '195 Sovereign Countries Data',
      icon: TableProperties,
      badge: '195',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-500/20">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  World Cash Flow
                </span>
                <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  195 NATIONS
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Central Bank & Mint Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Core Analytics
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`mt-0.5 h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-700 group-hover:text-slate-600 dark:text-slate-300 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`rounded-sm px-1.5 py-0.2 text-[9px] font-semibold ${
                              isActive
                                ? 'bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-300'
                                : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-normal text-slate-700 dark:text-slate-300 truncate">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Currency Zone Selector */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Monetary Zone Filter
              </span>
              <Sliders className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            </div>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value as CurrencyZone)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-hidden"
            >
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone === 'All' ? '🌐 All 195 Nations' : zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Automatic Update Status Card */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`relative flex h-2.5 w-2.5 items-center justify-center`}
              >
                {isLiveAutoUpdating && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    isLiveAutoUpdating ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                ></span>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Automatic Updates
              </span>
            </div>

            <button
              onClick={() => setIsLiveAutoUpdating(!isLiveAutoUpdating)}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                isLiveAutoUpdating
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              {isLiveAutoUpdating ? 'ENABLED' : 'PAUSED'}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
            <span>
              {isLiveAutoUpdating
                ? `Next tick in ${secondsUntilNextUpdate}s`
                : 'Auto-poll paused'}
            </span>
            <button
              onClick={refreshData}
              disabled={isSyncing}
              className="flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 disabled:opacity-50"
              title="Sync now with global central bank mint registries"
            >
              <RefreshCw
                className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`}
              />
              <span>Sync Now</span>
            </button>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
            <span className="truncate">195 Sovereign States Verified</span>
          </div>
        </div>
      </aside>
    </>
  );
};
