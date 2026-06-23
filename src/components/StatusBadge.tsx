import { ReceivableStatus } from '@/lib/types';
import { getStatusLabel, getStatusColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: ReceivableStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colorClasses = getStatusColor(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold tracking-wide uppercase ${colorClasses} ${sizeClasses}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
        status === 'funded' ? 'bg-orange-400 animate-pulse' :
        status === 'settled' ? 'bg-green-400' :
        status === 'rejected' ? 'bg-red-400' :
        status === 'defaulted' ? 'bg-rose-400' :
        status === 'approved' ? 'bg-emerald-400' :
        status === 'under_review' ? 'bg-amber-400 animate-pulse' :
        status === 'repaid' ? 'bg-cyan-400' :
        'bg-blue-400'
      }`} />
      {getStatusLabel(status)}
    </span>
  );
}
