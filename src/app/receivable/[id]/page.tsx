'use client';

import { use } from 'react';
import Link from 'next/link';
import { useHarbor } from '@/lib/context';
import { formatCurrency, formatDate, formatsBTC, daysUntilDue } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import LifecycleTimeline from '@/components/LifecycleTimeline';
import VerificationChecklist from '@/components/VerificationChecklist';

export default function ReceivableDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getReceivableById } = useHarbor();
  const receivable = getReceivableById(id);

  if (!receivable) {
    return (
      <div className="harbor-workspace mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-white mb-2">Receivable Not Found</h1>
        <p className="text-zinc-500 mb-6">No receivable exists with ID &quot;{id}&quot;.</p>
        <Link href="/dashboard" className="text-orange-400 hover:text-orange-300 text-sm font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const days = daysUntilDue(receivable.dueDate);
  const advanceRate = receivable.finalAdvancePercent || receivable.requestedAdvancePercent;
  const advanceAmount = receivable.advanceAmount || (receivable.invoiceAmount * advanceRate / 100);

  return (
    <div className="harbor-workspace mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-zinc-300">{receivable.id}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{receivable.businessName}</h1>
            <StatusBadge status={receivable.status} />
          </div>
          <p className="text-sm text-zinc-500">
            Receivable {receivable.id} • Invoice {receivable.invoiceReference}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 border border-white/[0.08] hover:border-white/[0.15] hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Invoice Amount</p>
              <p className="mt-1 text-xl font-bold text-white">{formatCurrency(receivable.invoiceAmount)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Advance Amount</p>
              <p className="mt-1 text-xl font-bold text-orange-400">{formatCurrency(advanceAmount)}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{advanceRate}% advance rate</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Due Date</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatDate(receivable.dueDate)}</p>
              <p className={`text-[10px] mt-0.5 ${days < 0 ? 'text-red-400' : days < 14 ? 'text-amber-400' : 'text-zinc-500'}`}>
                {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days remaining`}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">sBTC Equivalent</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatsBTC(advanceAmount / 100000)}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">@ $100K/BTC mock rate</p>
            </div>
          </div>

          {/* Receivable Details */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Receivable Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Business Name</p>
                <p className="text-sm font-medium text-white">{receivable.businessName}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Debtor / Client</p>
                <p className="text-sm font-medium text-white">{receivable.debtorName}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Invoice Reference</p>
                <p className="text-sm font-mono text-white">{receivable.invoiceReference}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Submitted</p>
                <p className="text-sm text-white">{formatDate(receivable.submittedAt)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-zinc-500 mb-1">Description / Work Completed</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{receivable.description}</p>
              </div>
            </div>
          </div>

          {/* Funding Information */}
          {(receivable.fundingTx || receivable.repaymentTx || receivable.settlementTx) && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">On-Chain Records</h2>
              <div className="space-y-3">
                {receivable.fundingTx && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-xs text-zinc-500">Funding Transaction</p>
                      <p className="text-sm font-mono text-orange-400">{receivable.fundingTx}</p>
                    </div>
                    <span className="text-xs text-emerald-400">✓ Confirmed</span>
                  </div>
                )}
                {receivable.repaymentTx && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-xs text-zinc-500">Repayment Transaction</p>
                      <p className="text-sm font-mono text-cyan-400">{receivable.repaymentTx}</p>
                    </div>
                    <span className="text-xs text-emerald-400">✓ Confirmed</span>
                  </div>
                )}
                {receivable.settlementTx && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-xs text-zinc-500">Settlement Transaction</p>
                      <p className="text-sm font-mono text-green-400">{receivable.settlementTx}</p>
                    </div>
                    <span className="text-xs text-emerald-400">✓ Confirmed</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verification Checklist */}
          {receivable.verification && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Verification Status</h2>
              <VerificationChecklist checklist={receivable.verification} readOnly />
            </div>
          )}

          {/* Risk Notes */}
          {receivable.riskNotes && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Admin Risk Notes</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">{receivable.riskNotes}</p>
            </div>
          )}
        </div>

        {/* Timeline Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 sticky top-24">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Lifecycle Timeline</h2>
            <LifecycleTimeline events={receivable.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
