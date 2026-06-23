'use client';

import { useState } from 'react';
import { ReceivableFormData } from '@/lib/types';

interface ReceivableFormProps {
  onSubmit: (data: ReceivableFormData) => void;
  onCancel?: () => void;
}

const INITIAL_FORM: ReceivableFormData = {
  businessName: '',
  debtorName: '',
  invoiceAmount: '',
  requestedAdvancePercent: '80',
  dueDate: '',
  invoiceReference: '',
  description: '',
};

export default function ReceivableForm({ onSubmit, onCancel }: ReceivableFormProps) {
  const [form, setForm] = useState<ReceivableFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ReceivableFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ReceivableFormData, string>> = {};

    if (!form.businessName.trim()) newErrors.businessName = 'Required';
    if (!form.debtorName.trim()) newErrors.debtorName = 'Required';
    if (!form.invoiceAmount || parseFloat(form.invoiceAmount) <= 0) newErrors.invoiceAmount = 'Must be a positive number';
    if (!form.requestedAdvancePercent || parseFloat(form.requestedAdvancePercent) < 1 || parseFloat(form.requestedAdvancePercent) > 100)
      newErrors.requestedAdvancePercent = 'Must be 1–100';
    if (!form.dueDate) newErrors.dueDate = 'Required';
    if (!form.invoiceReference.trim()) newErrors.invoiceReference = 'Required';
    if (!form.description.trim()) newErrors.description = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      setForm(INITIAL_FORM);
      setErrors({});
    }
  };

  const handleChange = (field: keyof ReceivableFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" id="receivable-submit-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-xs font-medium text-zinc-400 mb-1.5">
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            value={form.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            placeholder="Your business name"
            className={`w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
              errors.businessName ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/[0.08] focus:border-orange-500/50 focus:ring-orange-500/30'
            }`}
          />
          {errors.businessName && <p className="mt-1 text-xs text-red-400">{errors.businessName}</p>}
        </div>

        {/* Debtor Name */}
        <div>
          <label htmlFor="debtorName" className="block text-xs font-medium text-zinc-400 mb-1.5">
            Debtor / Client Name
          </label>
          <input
            id="debtorName"
            type="text"
            value={form.debtorName}
            onChange={(e) => handleChange('debtorName', e.target.value)}
            placeholder="Who owes the invoice"
            className={`w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
              errors.debtorName ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/[0.08] focus:border-orange-500/50 focus:ring-orange-500/30'
            }`}
          />
          {errors.debtorName && <p className="mt-1 text-xs text-red-400">{errors.debtorName}</p>}
        </div>

        {/* Invoice Amount */}
        <div>
          <label htmlFor="invoiceAmount" className="block text-xs font-medium text-zinc-400 mb-1.5">
            Invoice Amount (USD)
          </label>
          <input
            id="invoiceAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.invoiceAmount}
            onChange={(e) => handleChange('invoiceAmount', e.target.value)}
            placeholder="0.00"
            className={`w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
              errors.invoiceAmount ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/[0.08] focus:border-orange-500/50 focus:ring-orange-500/30'
            }`}
          />
          {errors.invoiceAmount && <p className="mt-1 text-xs text-red-400">{errors.invoiceAmount}</p>}
        </div>

        {/* Advance Percentage */}
        <div>
          <label htmlFor="requestedAdvancePercent" className="block text-xs font-medium text-zinc-400 mb-1.5">
            Requested Advance (%)
          </label>
          <input
            id="requestedAdvancePercent"
            type="number"
            min="1"
            max="100"
            value={form.requestedAdvancePercent}
            onChange={(e) => handleChange('requestedAdvancePercent', e.target.value)}
            placeholder="80"
            className={`w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
              errors.requestedAdvancePercent ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/[0.08] focus:border-orange-500/50 focus:ring-orange-500/30'
            }`}
          />
          {errors.requestedAdvancePercent && <p className="mt-1 text-xs text-red-400">{errors.requestedAdvancePercent}</p>}
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-xs font-medium text-zinc-400 mb-1.5">
            Invoice Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className={`w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
              errors.dueDate ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/[0.08] focus:border-orange-500/50 focus:ring-orange-500/30'
            }`}
          />
          {errors.dueDate && <p className="mt-1 text-xs text-red-400">{errors.dueDate}</p>}
        </div>

        {/* Invoice Reference */}
        <div>
          <label htmlFor="invoiceReference" className="block text-xs font-medium text-zinc-400 mb-1.5">
            Invoice Reference
          </label>
          <input
            id="invoiceReference"
            type="text"
            value={form.invoiceReference}
            onChange={(e) => handleChange('invoiceReference', e.target.value)}
            placeholder="INV-2026-XXXX"
            className={`w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
              errors.invoiceReference ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/[0.08] focus:border-orange-500/50 focus:ring-orange-500/30'
            }`}
          />
          {errors.invoiceReference && <p className="mt-1 text-xs text-red-400">{errors.invoiceReference}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-zinc-400 mb-1.5">
          Description / Work Completed
        </label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the work completed or goods delivered..."
          className={`w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors resize-none ${
            errors.description ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/[0.08] focus:border-orange-500/50 focus:ring-orange-500/30'
          }`}
        />
        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
      </div>

      {/* Preview */}
      {form.invoiceAmount && form.requestedAdvancePercent && (
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <p className="text-xs text-zinc-400 mb-1">Estimated Advance Amount</p>
          <p className="text-xl font-bold text-orange-400">
            ${((parseFloat(form.invoiceAmount) || 0) * (parseFloat(form.requestedAdvancePercent) || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {form.requestedAdvancePercent}% of ${parseFloat(form.invoiceAmount || '0').toLocaleString('en-US')} — subject to admin review
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:brightness-110 transition-all duration-200"
        >
          Submit Receivable
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
