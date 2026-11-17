import React, { useState } from 'react';
import { useCashFlowData } from './hooks/useCashFlowData';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { ComparativeBarChart } from './components/ComparativeBarChart';
import { GlobalHeatmap } from './components/GlobalHeatmap';
import { DenominationBreakdown } from './components/DenominationBreakdown';
import { CurrencyConverter } from './components/CurrencyConverter';
import { EconomicSimulator } from './components/EconomicSimulator';
import { GroundRealitySchemes } from './components/GroundRealitySchemes';
import { CountryLedgerTable } from './components/CountryLedgerTable';

export default function App() {
  const {
    countries,
    selectedCountryCode,
    setSelectedCountryCode,
    selectedCountry,
    globalAggregates,
    filteredCountries,
    searchQuery,
    setSearchQuery,
    selectedZone,
    setSelectedZone,
    isLiveAutoUpdating,
    setIsLiveAutoUpdating,
    updateIntervalSeconds,
    setUpdateIntervalSeconds,
    secondsUntilNextUpdate,
    lastUpdated,
    isSyncing,
    syncStatus,
    refreshData,
    simulateMintingBatch,
  } = useCashFlowData();

  const [activeTab, setActiveTab] = useState<ActiveTab>('comparative');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Peers in same currency zone for comparison
  const peerCountries = countries.filter(
    (c) => c.currencyZone === selectedCountry.currencyZone
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      <div className="flex flex-1 min-h-screen">
        {/* Responsive Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          isLiveAutoUpdating={isLiveAutoUpdating}
          setIsLiveAutoUpdating={setIsLiveAutoUpdating}
          secondsUntilNextUpdate={secondsUntilNextUpdate}
          refreshData={refreshData}
          isSyncing={isSyncing}
        />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            countries={countries}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountryCode}
            globalAggregates={globalAggregates}
            isSyncing={isSyncing}
            refreshData={refreshData}
            lastUpdated={lastUpdated}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* View Container */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* View Switcher based on Active Tab */}
            {activeTab === 'comparative' && (
              <ComparativeBarChart
                country={selectedCountry}
                peerCountries={peerCountries}
                onSelectPeer={setSelectedCountryCode}
              />
            )}

            {activeTab === 'heatmap' && (
              <GlobalHeatmap
                countries={countries}
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountryCode}
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
              />
            )}

            {activeTab === 'denominations' && (
              <DenominationBreakdown
                country={selectedCountry}
                onSimulateBatch={simulateMintingBatch}
              />
            )}

            {activeTab === 'converter' && (
              <CurrencyConverter
                countries={countries}
                initialFromCountry={selectedCountry}
              />
            )}

            {activeTab === 'simulator' && (
              <EconomicSimulator
                countries={countries}
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountryCode}
              />
            )}

            {activeTab === 'reality' && (
              <GroundRealitySchemes
                country={selectedCountry}
                peerCountries={peerCountries}
                onSelectPeer={setSelectedCountryCode}
              />
            )}

            {activeTab === 'ledger' && (
              <CountryLedgerTable
                countries={countries}
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountryCode}
                onViewComparative={(code) => {
                  setSelectedCountryCode(code);
                  setActiveTab('comparative');
                }}
                onViewDenominations={(code) => {
                  setSelectedCountryCode(code);
                  setActiveTab('denominations');
                }}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 text-center text-xs text-slate-700 dark:text-slate-300">
            <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100">World Cash Flow</span>
                <span>• Global Currency & Minted Denomination Intelligence</span>
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-mono">
                {syncStatus} • Last Synced: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
