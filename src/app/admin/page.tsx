'use client';

import { useState, useMemo } from 'react';
import { useHarbor } from '@/lib/context';
import { Receivable, VerificationChecklist as VerificationChecklistType } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import DashboardStats from '@/components/DashboardStats';
import StatusBadge from '@/components/StatusBadge';
import VerificationChecklist from '@/components/VerificationChecklist';
import LifecycleTimeline from '@/components/LifecycleTimeline';

export default function AdminPage() {
  const { receivables, approveReceivable, rejectReceivable, updateVerification, startReview, fundReceivable } = useHarbor();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [advancePercent, setAdvancePercent] = useState('');
  const [riskNotes, setRiskNotes] = useState('');

  const actionableReceivables = useMemo(() => {
    return receivables.filter(r => ['submitted', 'under_review', 'approved'].includes(r.status));
  }, [receivables]);

  const allReceivables = useMemo(() => receivables, [receivables]);
  const selected = useMemo(() => receivables.find(r => r.id === selectedId), [receivables, selectedId]);

  const stats = useMemo(() => {
    const pendingCount = receivables.filter(r => r.status === 'submitted').length;
    const reviewCount = receivables.filter(r => r.status === 'under_review').length;
    const approvedCount = receivables.filter(r => r.status === 'approved').length;
    const rejectedCount = receivables.filter(r => r.status === 'rejected').length;
    return [
      { label: 'Pending Queue', value: pendingCount, subtext: 'Awaiting review' },
      { label: 'Under Review', value: reviewCount, subtext: 'Verification in progress', trend: 'neutral' as const },
      { label: 'Approved', value: approvedCount, subtext: 'Ready for funding', trend: 'up' as const },
      { label: 'Rejected', value: rejectedCount, subtext: 'Did not pass verification' },
    ];
  }, [receivables]);

  const handleSelect = (r: Receivable) => {
    setSelectedId(r.id);
    setAdvancePercent(String(r.finalAdvancePercent || r.requestedAdvancePercent));
    setRiskNotes(r.riskNotes || '');
  };

  const handleApprove = () => {
    if (!selectedId || !advancePercent) return;
    approveReceivable(selectedId, parseFloat(advancePercent), riskNotes);
    setSelectedId(null);
  };

  const handleReject = () => {
    if (!selectedId) return;
    rejectReceivable(selectedId, riskNotes || 'Did not pass verification requirements');
    setSelectedId(null);
  };

  const handleStartReview = () => {
    if (!selectedId) return;
    startReview(selectedId);
  };

  const handleFund = () => {
    if (!selectedId) return;
    fundReceivable(selectedId);
  };

  const handleChecklistChange = (checklist: VerificationChecklistType) => {
    if (!selectedId) return;
    updateVerification(selectedId, checklist);
  };

  return (
    <div className="harbor-workspace mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Verification Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Review submitted receivables, run verification checklists, and approve or reject submissions.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <DashboardStats stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Review Queue ({actionableReceivables.length})
          </h2>

          {/* Actionable items */}
          {actionableReceivables.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                selectedId === r.id
                  ? 'border-orange-500/30 bg-orange-500/[0.04]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-semibold text-white truncate">{r.businessName}</h3>
                <StatusBadge status={r.status} size="sm" />
              </div>
              <p className="text-xs text-zinc-500 truncate mb-2">Debtor: {r.debtorName}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{formatCurrency(r.invoiceAmount)}</span>
                <span className="text-xs text-zinc-600 font-mono">{r.invoiceReference}</span>
              </div>
            </button>
          ))}

          {actionableReceivables.length === 0 && (
            <div className="text-center py-10 rounded-xl border border-white/[0.04] bg-white/[0.01]">
              <p className="text-zinc-500 text-sm">No receivables require action.</p>
            </div>
          )}

          {/* Other receivables */}
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mt-6 mb-3">
            All Receivables ({allReceivables.length})
          </h2>
          {allReceivables.filter(r => !['submitted', 'under_review', 'approved'].includes(r.status)).map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-200 opacity-60 ${
                selectedId === r.id
                  ? 'border-orange-500/30 bg-orange-500/[0.04] opacity-100'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-sm font-medium text-white truncate">{r.businessName}</h3>
                <StatusBadge status={r.status} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">{formatCurrency(r.invoiceAmount)}</span>
                <span className="text-xs text-zinc-600 font-mono">{r.invoiceReference}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6 sticky top-24">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{selected.businessName}</h2>
                  <p className="text-sm text-zinc-500">Debtor: {selected.debtorName}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Invoice Amount</p>
                  <p className="mt-1 text-lg font-bold text-white">{formatCurrency(selected.invoiceAmount)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Requested Advance</p>
                  <p className="mt-1 text-lg font-bold text-white">{selected.requestedAdvancePercent}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Due Date</p>
                  <p className="mt-1 text-sm text-white">{formatDate(selected.dueDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Reference</p>
                  <p className="mt-1 text-sm text-white font-mono">{selected.invoiceReference}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1">Description</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{selected.description}</p>
              </div>

              {/* Verification Checklist */}
              {selected.verification && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Verification Checklist</h3>
                  <VerificationChecklist
                    checklist={selected.verification}
                    onChange={handleChecklistChange}
                    readOnly={!['under_review'].includes(selected.status)}
                  />
                </div>
              )}

              {/* Admin Controls */}
              {['submitted', 'under_review', 'approved'].includes(selected.status) && (
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-white">Admin Actions</h3>

                  {selected.status === 'submitted' && (
                    <button
                      onClick={handleStartReview}
                      className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                    >
                      Start Review
                    </button>
                  )}

                  {selected.status === 'under_review' && (
                    <>
                      <div>
                        <label htmlFor="advancePercent" className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Final Advance Percentage
                        </label>
                        <input
                          id="advancePercent"
                          type="number"
                          min="1"
                          max="100"
                          value={advancePercent}
                          onChange={(e) => setAdvancePercent(e.target.value)}
                          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:border-orange-500/50 focus:ring-orange-500/30"
                        />
                        {advancePercent && (
                          <p className="mt-1 text-xs text-zinc-500">
                            Advance: {formatCurrency(selected.invoiceAmount * parseFloat(advancePercent) / 100)}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="riskNotes" className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Risk Notes
                        </label>
                        <textarea
                          id="riskNotes"
                          rows={3}
                          value={riskNotes}
                          onChange={(e) => setRiskNotes(e.target.value)}
                          placeholder="Add risk assessment notes..."
                          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:border-orange-500/50 focus:ring-orange-500/30 resize-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleApprove}
                          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={handleReject}
                          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </>
                  )}

                  {selected.status === 'approved' && (
                    <button
                      onClick={handleFund}
                      className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:brightness-110 transition-all"
                    >
                      💰 Fund Receivable ({formatCurrency(selected.advanceAmount || 0)})
                    </button>
                  )}
                </div>
              )}

              {/* Risk Notes */}
              {selected.riskNotes && !['submitted', 'under_review'].includes(selected.status) && (
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1">Risk Notes</p>
                  <p className="text-sm text-zinc-400">{selected.riskNotes}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="border-t border-white/[0.06] pt-6">
                <h3 className="text-sm font-semibold text-white mb-4">Lifecycle Timeline</h3>
                <LifecycleTimeline events={selected.timeline} />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-16 text-center sticky top-24">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-zinc-500 text-sm">Select a receivable from the queue to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
