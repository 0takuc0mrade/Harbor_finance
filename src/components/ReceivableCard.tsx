import Link from 'next/link';
import { Receivable } from '@/lib/types';
import { formatCurrency, formatDate, daysUntilDue } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface ReceivableCardProps {
  receivable: Receivable;
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onStartReview?: () => void;
  onFund?: () => void;
}

export default function ReceivableCard({
  receivable,
  showActions = false,
  onApprove,
  onReject,
  onStartReview,
  onFund,
}: ReceivableCardProps) {
  const days = daysUntilDue(receivable.dueDate);

  return (
    <div className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-lg hover:shadow-black/20">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0 flex-1">
          <Link href={`/receivable/${receivable.id}`} className="block">
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-orange-400 transition-colors">
              {receivable.businessName}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-zinc-500 truncate">
            Debtor: {receivable.debtorName}
          </p>
        </div>
        <StatusBadge status={receivable.status} size="sm" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">Invoice Amount</p>
          <p className="mt-0.5 text-sm font-semibold text-white">{formatCurrency(receivable.invoiceAmount)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">Advance Request</p>
          <p className="mt-0.5 text-sm font-semibold text-white">
            {receivable.finalAdvancePercent || receivable.requestedAdvancePercent}%
            {receivable.finalAdvancePercent && receivable.finalAdvancePercent !== receivable.requestedAdvancePercent && (
              <span className="ml-1 text-xs text-zinc-500 line-through">{receivable.requestedAdvancePercent}%</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">Due Date</p>
          <p className="mt-0.5 text-sm text-white">{formatDate(receivable.dueDate)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">Days Until Due</p>
          <p className={`mt-0.5 text-sm font-semibold ${days < 0 ? 'text-red-400' : days < 14 ? 'text-amber-400' : 'text-zinc-300'}`}>
            {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
          </p>
        </div>
      </div>

      {/* Reference */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <span className="text-xs text-zinc-500 font-mono">{receivable.invoiceReference}</span>
        <Link
          href={`/receivable/${receivable.id}`}
          className="text-xs text-orange-400/80 hover:text-orange-400 font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>

      {/* Admin Actions */}
      {showActions && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-2">
          {receivable.status === 'submitted' && onStartReview && (
            <button
              onClick={onStartReview}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
            >
              Start Review
            </button>
          )}
          {(receivable.status === 'under_review') && onApprove && (
            <button
              onClick={onApprove}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              Approve
            </button>
          )}
          {(receivable.status === 'submitted' || receivable.status === 'under_review') && onReject && (
            <button
              onClick={onReject}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              Reject
            </button>
          )}
          {receivable.status === 'approved' && onFund && (
            <button
              onClick={onFund}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
            >
              Fund Receivable
            </button>
          )}
        </div>
      )}
    </div>
  );
}
