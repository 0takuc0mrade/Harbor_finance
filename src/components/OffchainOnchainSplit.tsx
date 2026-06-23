const OFFCHAIN_ITEMS = [
  'Invoice PDF/document storage',
  'Business verification',
  'Debtor verification',
  'Fraud review',
  'Repayment confirmation',
  'Legal/compliance review in production',
];

const ONCHAIN_ITEMS = [
  'Receivable metadata hash',
  'Lifecycle status',
  'Pool liquidity accounting',
  'Funding event',
  'Repayment record',
  'Settlement/yield accounting',
];

function SplitColumn({
  title,
  description,
  items,
  accent,
}: {
  title: string;
  description: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
      <p className={`text-xs font-semibold uppercase tracking-wider ${accent}`}>{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
            <span className={`mt-2 h-1.5 w-1.5 flex-none rounded-full ${title === 'Off-chain' ? 'bg-cyan-400' : 'bg-orange-400'}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OffchainOnchainSplit() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <SplitColumn
        title="Off-chain"
        description="Private documents, verification judgment, legal review, and real-world payment evidence stay outside the contracts."
        items={OFFCHAIN_ITEMS}
        accent="text-cyan-400"
      />
      <SplitColumn
        title="On-chain"
        description="Contracts coordinate the auditable lifecycle, pool accounting, and settlement state for the demo."
        items={ONCHAIN_ITEMS}
        accent="text-orange-400"
      />
    </div>
  );
}
