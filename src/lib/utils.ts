import { ReceivableStatus } from './types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatsBTC(amount: number): string {
  return `${amount.toFixed(5)} sBTC`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusLabel(status: ReceivableStatus): string {
  const labels: Record<ReceivableStatus, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    funded: 'Funded',
    repaid: 'Repaid',
    settled: 'Settled',
    rejected: 'Rejected',
    defaulted: 'Defaulted',
  };
  return labels[status];
}

export function getStatusColor(status: ReceivableStatus): string {
  const colors: Record<ReceivableStatus, string> = {
    submitted: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    under_review: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    funded: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    repaid: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    settled: 'bg-green-500/15 text-green-300 border-green-500/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
    defaulted: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };
  return colors[status];
}

export function daysUntilDue(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
