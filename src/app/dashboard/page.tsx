'use client';

import { useState, useMemo } from 'react';
import { useHarbor } from '@/lib/context';
import { ReceivableStatus, ReceivableFormData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import DashboardStats from '@/components/DashboardStats';
import ReceivableCard from '@/components/ReceivableCard';
import ReceivableForm from '@/components/ReceivableForm';

const STATUS_FILTERS: { label: string; value: ReceivableStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Funded', value: 'funded' },
  { label: 'Repaid', value: 'repaid' },
  { label: 'Settled', value: 'settled' },
  { label: 'Rejected', value: 'rejected' },
];

export default function DashboardPage() {
  const { receivables, submitReceivable } = useHarbor();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<ReceivableStatus | 'all'>('all');

  const filteredReceivables = useMemo(() => {
    if (filter === 'all') return receivables;
    return receivables.filter(r => r.status === filter);
  }, [receivables, filter]);

  const stats = useMemo(() => {
    const totalValue = receivables.reduce((sum, r) => sum + r.invoiceAmount, 0);
    const funded = receivables.filter(r => ['funded', 'repaid', 'settled'].includes(r.status));
    const fundedValue = funded.reduce((sum, r) => sum + (r.advanceAmount || 0), 0);
    const pending = receivables.filter(r => ['submitted', 'under_review'].includes(r.status)).length;

    return [
      { label: 'Total Receivables', value: receivables.length, subtext: `${formatCurrency(totalValue)} total value` },
      { label: 'Pending Review', value: pending, subtext: 'Awaiting verification', trend: 'neutral' as const },
      { label: 'Total Funded', value: funded.length, subtext: formatCurrency(fundedValue), trend: 'up' as const },
      { label: 'Active Rate', value: `${((funded.length / Math.max(receivables.length, 1)) * 100).toFixed(0)}%`, subtext: 'Of submissions funded' },
    ];
  }, [receivables]);

  const handleSubmit = (data: ReceivableFormData) => {
    submitReceivable(data);
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Business Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Submit and track your receivables through the Harbor lifecycle.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            showForm
              ? 'bg-white/[0.06] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.08]'
              : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:brightness-110'
          }`}
        >
          {showForm ? 'Cancel' : '+ Submit Receivable'}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <DashboardStats stats={stats} />
      </div>

      {/* Submit Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-orange-500/20 bg-orange-500/[0.02] p-6">
          <h2 className="text-lg font-semibold text-white mb-1">Submit a New Receivable</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Provide invoice details below. Your receivable will enter the review queue after submission.
          </p>
          <ReceivableForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {STATUS_FILTERS.map((f) => {
          const count = f.value === 'all'
            ? receivables.length
            : receivables.filter(r => r.status === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f.value
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent hover:bg-white/[0.03]'
              }`}
            >
              {f.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                filter === f.value ? 'bg-orange-500/20 text-orange-400' : 'bg-white/[0.04] text-zinc-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Receivables Grid */}
      {filteredReceivables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReceivables.map((receivable) => (
            <ReceivableCard key={receivable.id} receivable={receivable} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl border border-white/[0.04] bg-white/[0.01]">
          <p className="text-zinc-500 text-sm">No receivables match this filter.</p>
        </div>
      )}
    </div>
  );
}
