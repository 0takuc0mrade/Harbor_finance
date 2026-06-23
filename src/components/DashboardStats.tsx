interface StatItem {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

interface DashboardStatsProps {
  stats: StatItem[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium leading-tight">{stat.label}</p>
            {stat.icon && (
              <div className="text-zinc-600">{stat.icon}</div>
            )}
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
          {stat.subtext && (
            <p className={`mt-1 text-xs font-medium ${
              stat.trend === 'up' ? 'text-emerald-400' :
              stat.trend === 'down' ? 'text-red-400' :
              'text-zinc-500'
            }`}>
              {stat.trend === 'up' && '↑ '}
              {stat.trend === 'down' && '↓ '}
              {stat.subtext}
            </p>
          )}
          {/* Subtle gradient accent */}
          <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-gradient-to-br from-orange-500/5 to-transparent" />
        </div>
      ))}
    </div>
  );
}
