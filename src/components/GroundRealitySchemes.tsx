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
} from 'recharts';
import { CountryData } from '../types/cashFlow';
import { formatCurrency, formatCompactNumber } from '../utils/cashFlowCalculations';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Users,
  Coins,
  TrendingUp,
  Activity,
  CheckCircle2,
  PieChart,
  BarChart3,
} from 'lucide-react';

interface GroundRealitySchemesProps {
  country: CountryData;
  peerCountries: CountryData[];
  onSelectPeer: (code: string) => void;
}

export const GroundRealitySchemes: React.FC<GroundRealitySchemesProps> = ({
  country,
  peerCountries,
  onSelectPeer,
}) => {
  const [viewMode, setViewMode] = useState<'schemes' | 'reality'>('schemes');

  // Peer direct credit comparison data
  const peerChartData = peerCountries.slice(0, 10).map((p) => {
    const totalCreditUSD = p.directCreditSchemes.reduce(
      (acc, s) => acc + s.annualAllocationPerCitizenUSD,
      0
    );
    return {
      name: p.name,
      flag: p.flagEmoji,
      directCreditUSD: totalCreditUSD,
      informalPercent: p.informalEconomyPercent,
      liquidityScore: p.groundRealityLiquidityScore,
      isSelected: p.code === country.code,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Ground Reality & Sovereign Direct Credit Schemes
                </h2>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  REAL-TIME INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Auditing actual ground economic conditions, informal cash shares, and direct central bank credit fund distributions to consumers in {country.name}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('schemes')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'schemes'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Direct Credit Schemes
            </button>
            <button
              onClick={() => setViewMode('reality')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'reality'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Ground Reality Metrics
            </button>
          </div>
        </div>

        {/* Ground Reality Quick Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span>Liquidity Health Score</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {country.groundRealityLiquidityScore} / 100
            </div>
            <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-0.5">
              {country.groundRealityLiquidityScore >= 80 ? 'Optimal Circulation' : 'Moderate Friction'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <PieChart className="h-4 w-4 text-blue-500" />
              <span>Informal Economy Share</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {country.informalEconomyPercent}%
            </div>
            <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-0.5">
              Unyielded cash & unrecorded labor
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <Coins className="h-4 w-4 text-purple-500" />
              <span>Retail Cash Dependency</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {country.cashDependencyPercent}%
            </div>
            <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-0.5">
              Consumer transactions settled in physical cash
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <Users className="h-4 w-4 text-amber-500" />
              <span>Total Population</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {formatCompactNumber(country.population)}
            </div>
            <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-0.5">
              Census year {country.populationLastCensusYear}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      {viewMode === 'schemes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Direct Credit Schemes Cards */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              <span>Sovereign Direct Credit Fund Schemes ({country.name})</span>
            </h3>

            {country.directCreditSchemes.map((scheme, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {scheme.distributionChannel}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {scheme.schemeName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-700 dark:text-slate-300 block">Annual Grant / Citizen</span>
                    <span className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ${scheme.annualAllocationPerCitizenUSD.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {scheme.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300">Consumer Reach Coverage:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {scheme.reachPercentage}% of population covered
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recharts Peer Direct Credit Comparison */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-500" />
                <span>Zone Peers: Direct Consumer Credit Allocation (USD / Citizen)</span>
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mb-4">
                Comparing annual sovereign direct credit and benefit fund allocations across {country.currencyZone}.
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peerChartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [`$${Number(val).toLocaleString()} USD / citizen`, 'Direct Credit Allocation']}
                      contentStyle={{
                        borderRadius: '12px',
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="directCreditUSD" radius={[6, 6, 0, 0]}>
                      {peerChartData.map((p, idx) => (
                        <Cell
                          key={`peer-cell-${idx}`}
                          fill={p.isSelected ? '#059669' : '#34d399'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
              Click any country in the header dropdown or ledger to inspect their specific direct credit schemes.
            </div>
          </div>
        </div>
      ) : (
        /* Ground Reality Deep Dive */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Actual Ground Reality & Economic Liquidity Audit ({country.name})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Central Bank & Mint Authority
              </h4>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {country.centralBank}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Operating mint authority: <strong>{country.mintAuthority}</strong>. Annual cash velocity issuance rate: +{country.annualMintingVelocityPercent}% / year.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Informal Cash Economy
              </h4>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {country.informalEconomyPercent}% of GDP / Workforce
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Represents unrecorded cash transactions and informal merchant liquidity outside formal banking rails.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Consumer Cash Dependency
              </h4>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {country.cashDependencyPercent}% Retail Settlements
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Proportion of everyday consumer purchases settled using physical banknotes and coins rather than digital cards or apps.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
