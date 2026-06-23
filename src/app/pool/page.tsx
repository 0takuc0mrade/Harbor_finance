'use client';

import { useState, useMemo } from 'react';
import { useHarbor } from '@/lib/context';
import { formatCurrency, formatsBTC, formatDateTime } from '@/lib/utils';
import DashboardStats from '@/components/DashboardStats';
import PoolStatsComponent from '@/components/PoolStats';
import StatusBadge from '@/components/StatusBadge';

export default function PoolPage() {
  const { poolStats, deposits, receivables, depositToPool } = useHarbor();
  const [depositAmount, setDepositAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);

  const fundedReceivables = useMemo(() => {
    return receivables.filter(r => ['funded', 'repaid', 'settled'].includes(r.status));
  }, [receivables]);

  const stats = useMemo(() => [
    { label: 'Total Pool Balance', value: formatsBTC(poolStats.totalBalance), subtext: `≈ ${formatCurrency(poolStats.totalBalance * 100000)}` },
    { label: 'Available Liquidity', value: formatsBTC(poolStats.availableLiquidity), subtext: 'Ready to deploy' },
    { label: 'Active Deployments', value: poolStats.fundedReceivables, subtext: 'Receivables funded', trend: 'up' as const },
    { label: 'Illustrative APR', value: `${poolStats.apr}%`, subtext: formatsBTC(poolStats.expectedYield) + ' modeled yield', trend: 'up' as const },
  ], [poolStats]);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      depositToPool(amount);
      setDepositAmount('');
      setShowDeposit(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Liquidity Pool</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Review mock sBTC liquidity, utilization, and repayment accounting for verified receivables.
          </p>
        </div>
        <button
          onClick={() => setShowDeposit(!showDeposit)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            showDeposit
              ? 'bg-white/[0.06] text-zinc-300 border border-white/[0.1]'
              : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:brightness-110'
          }`}
        >
          {showDeposit ? 'Cancel' : '+ Add Mock Deposit'}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <DashboardStats stats={stats} />
      </div>

      {/* Deposit Form */}
      {showDeposit && (
        <div className="mb-8 rounded-xl border border-orange-500/20 bg-orange-500/[0.02] p-6">
          <h2 className="text-lg font-semibold text-white mb-1">Add Mock sBTC to Liquidity Pool</h2>
          <p className="text-sm text-zinc-500 mb-6">
            This local demo updates pool balances and modeled fee/yield accounting after approved receivables are funded and repaid.
          </p>

          <form onSubmit={handleDeposit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="depositAmount" className="block text-xs font-medium text-zinc-400 mb-1.5">
                Amount (mock sBTC)
              </label>
              <div className="relative">
                <input
                  id="depositAmount"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00000"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:border-orange-500/50 focus:ring-orange-500/30"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">sBTC</span>
              </div>
              {depositAmount && parseFloat(depositAmount) > 0 && (
                <p className="mt-1 text-xs text-zinc-500">
                  ≈ {formatCurrency(parseFloat(depositAmount) * 100000)} USD
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Deposit
            </button>
          </form>

          <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs text-zinc-500">
              <strong className="text-zinc-400">Note:</strong> This is a mock deposit for demo purposes. A future wallet-connected implementation would use sBTC transfers through Stacks contracts after additional security, compliance, and product work.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pool Stats Panel */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 sticky top-24">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Pool Overview</h2>
            <PoolStatsComponent stats={poolStats} />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Funded Receivables */}
          <div>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Funded Receivables ({fundedReceivables.length})
            </h2>
            {fundedReceivables.length > 0 ? (
              <div className="space-y-3">
                {fundedReceivables.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{r.businessName}</h3>
                        <p className="text-xs text-zinc-500">Debtor: {r.debtorName}</p>
                      </div>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Invoice</p>
                        <p className="text-sm font-semibold text-white">{formatCurrency(r.invoiceAmount)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Advanced</p>
                        <p className="text-sm font-semibold text-orange-400">{formatCurrency(r.advanceAmount || 0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Advance Rate</p>
                        <p className="text-sm font-semibold text-white">{r.finalAdvancePercent}%</p>
                      </div>
                    </div>
                    {r.fundingTx && (
                      <p className="mt-2 text-[10px] text-zinc-600 font-mono">Funding TX: {r.fundingTx}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                <p className="text-zinc-500 text-sm">No receivables have been funded yet.</p>
              </div>
            )}
          </div>

          {/* Deposit History */}
          <div>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Deposit History ({deposits.length})
            </h2>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Provider</th>
                    <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Amount</th>
                    <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-zinc-500 font-medium hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-zinc-500 font-medium hidden md:table-cell">TX Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((d) => (
                    <tr key={d.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-sm text-zinc-300 font-mono">{d.provider}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-white">{formatsBTC(d.amount)}</td>
                      <td className="px-4 py-3 text-xs text-right text-zinc-500 hidden sm:table-cell">{formatDateTime(d.timestamp)}</td>
                      <td className="px-4 py-3 text-xs text-right text-zinc-600 font-mono hidden md:table-cell">{d.txHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
