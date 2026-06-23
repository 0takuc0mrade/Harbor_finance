import { PoolStats as PoolStatsType } from '@/lib/types';
import { formatsBTC } from '@/lib/utils';

interface PoolStatsProps {
  stats: PoolStatsType;
}

export default function PoolStats({ stats }: PoolStatsProps) {
  const utilizationRate = stats.totalBalance > 0
    ? ((stats.deployedLiquidity / stats.totalBalance) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Main Balance */}
      <div className="text-center py-6">
        <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">Total Pool Balance</p>
        <p className="text-4xl font-bold text-white tracking-tight">
          {formatsBTC(stats.totalBalance)}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          ≈ ${(stats.totalBalance * 100000).toLocaleString('en-US')} USD
        </p>
      </div>

      {/* Utilization Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-400 font-medium">Pool Utilization</span>
          <span className="text-xs font-semibold text-orange-400">{utilizationRate}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-700 relative"
            style={{ width: `${utilizationRate}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-zinc-600">
          <span>Deployed: {formatsBTC(stats.deployedLiquidity)}</span>
          <span>Available: {formatsBTC(stats.availableLiquidity)}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Total Deposited</p>
          <p className="mt-1 text-lg font-bold text-white">{formatsBTC(stats.totalDeposited)}</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Deployed</p>
          <p className="mt-1 text-lg font-bold text-orange-400">{formatsBTC(stats.deployedLiquidity)}</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Funded Receivables</p>
          <p className="mt-1 text-lg font-bold text-white">{stats.fundedReceivables}</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Expected Yield</p>
          <p className="mt-1 text-lg font-bold text-emerald-400">{formatsBTC(stats.expectedYield)}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{stats.apr}% APR</p>
        </div>
      </div>
    </div>
  );
}
