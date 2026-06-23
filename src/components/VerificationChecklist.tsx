'use client';

import { VerificationChecklist as VerificationChecklistType } from '@/lib/types';

interface VerificationChecklistProps {
  checklist: VerificationChecklistType;
  onChange?: (checklist: VerificationChecklistType) => void;
  readOnly?: boolean;
}

const CHECKLIST_ITEMS: { key: keyof VerificationChecklistType; label: string; description: string }[] = [
  {
    key: 'businessIdentityReviewed',
    label: 'Business Identity Reviewed',
    description: 'Verify business registration, ownership, and operational history.',
  },
  {
    key: 'debtorClientReviewed',
    label: 'Debtor / Client Reviewed',
    description: 'Verify debtor entity, creditworthiness, and payment history.',
  },
  {
    key: 'invoiceAuthenticityReviewed',
    label: 'Invoice Authenticity Reviewed',
    description: 'Confirm invoice details, amounts, and supporting documentation.',
  },
  {
    key: 'workDeliveryProofReviewed',
    label: 'Work / Delivery Proof Reviewed',
    description: 'Verify goods delivered or services completed as described.',
  },
  {
    key: 'duplicateInvoiceCheckCompleted',
    label: 'Duplicate Invoice Check',
    description: 'Confirm no duplicate submissions or double-financing risk.',
  },
];

export default function VerificationChecklist({ checklist, onChange, readOnly = false }: VerificationChecklistProps) {
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progress = (completedCount / totalCount) * 100;

  const handleToggle = (key: keyof VerificationChecklistType) => {
    if (readOnly || !onChange) return;
    onChange({ ...checklist, [key]: !checklist[key] });
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-zinc-400">
            Verification Progress
          </span>
          <span className="text-xs font-semibold text-white">
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress === 100 ? 'bg-emerald-500' : 'bg-orange-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {CHECKLIST_ITEMS.map((item) => {
          const checked = checklist[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleToggle(item.key)}
              disabled={readOnly}
              className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all duration-200 ${
                checked
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
              } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {/* Checkbox */}
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border mt-0.5 transition-colors ${
                checked
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-zinc-600 bg-transparent'
              }`}>
                {checked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${checked ? 'text-emerald-400' : 'text-white'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
