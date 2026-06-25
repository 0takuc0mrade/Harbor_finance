'use client';

import { useMemo, useState } from 'react';
import ContractActionPanel from '@/components/ContractActionPanel';
import OffchainOnchainSplit from '@/components/OffchainOnchainSplit';
import WalletMode from '@/components/WalletMode';
import { CONTRACTS, type ContractLayer } from '@/lib/contracts';
import { getTestnetDeploymentStatus } from '@/lib/testnet';
import { formatCurrency, formatsBTC } from '@/lib/utils';

type DemoStatus = 'draft' | 'submitted' | 'approved' | 'funded' | 'repaid' | 'settled';

interface DemoStep {
  status: DemoStatus;
  label: string;
  buttonLabel: string;
  title: string;
  summary: string;
  contractName: string;
  functionName: string;
  layer: ContractLayer;
  action: string;
  parameters: string[];
  note: string;
}

const SAMPLE_RECEIVABLE = {
  id: 101,
  business: 'Apex Logistics Group',
  debtor: 'NovaTech Industries',
  debtorHash: '0x9f24...debtor',
  invoiceAmount: 100000,
  requestedAdvance: 80000,
  approvedAdvance: 80000,
  dueHeight: 122450,
  metadataHash: '0xa1b2...invoice-meta',
  yieldAmount: 8000,
};

const STEPS: DemoStep[] = [
  {
    status: 'submitted',
    label: 'Step 1',
    buttonLabel: 'Submit receivable',
    title: 'Business submits receivable',
    summary:
      'Invoice documents stay off-chain. The registry stores metadata hashes, amount fields, due height, business principal, and submitted status.',
    contractName: 'receivable-registry',
    functionName: 'submit-receivable',
    layer: 'On-chain metadata/lifecycle',
    action: 'Create receivable record',
    parameters: ['id: u101', 'invoice: u100000', 'advance: u80000', 'metadata-hash'],
    note:
      'Creates an auditable lifecycle record without exposing the invoice PDF, client contract, or private debtor details on-chain.',
  },
  {
    status: 'approved',
    label: 'Step 2',
    buttonLabel: 'Approve receivable',
    title: 'Admin verifies and approves',
    summary:
      'Manual verification happens off-chain. The admin records the approved advance amount after business, debtor, invoice, and fraud checks.',
    contractName: 'receivable-registry',
    functionName: 'approve-receivable',
    layer: 'On-chain metadata/lifecycle',
    action: 'Record approval and advance amount',
    parameters: ['id: u101', 'approved-advance: u80000'],
    note:
      'The contract does not perform underwriting. It records the result of the off-chain verification process and gates funding.',
  },
  {
    status: 'funded',
    label: 'Step 3',
    buttonLabel: 'Fund receivable',
    title: 'Liquidity pool funds receivable',
    summary:
      'The pool deploys mock sBTC to the business and marks the approved receivable as funded through the registry trait.',
    contractName: 'liquidity-pool',
    functionName: 'fund-receivable',
    layer: 'On-chain token/accounting',
    action: 'Deploy pool liquidity',
    parameters: ['registry', 'id: u101', 'business principal', 'amount: u80000'],
    note:
      'Funding reduces available liquidity, increases deployed liquidity, and transfers mock sBTC for MVP demonstration.',
  },
  {
    status: 'repaid',
    label: 'Step 4',
    buttonLabel: 'Record repayment',
    title: 'Repayment is recorded',
    summary:
      'In the MVP, an admin confirms debtor repayment evidence and records principal plus yield returning to the pool.',
    contractName: 'liquidity-pool',
    functionName: 'record-repayment',
    layer: 'On-chain token/accounting',
    action: 'Record principal plus yield',
    parameters: ['registry', 'id: u101', 'principal: u80000', 'yield: u8000'],
    note:
      'This mirrors repayment accounting, but real-world debtor payment confirmation remains an off-chain operational step.',
  },
  {
    status: 'settled',
    label: 'Step 5',
    buttonLabel: 'Settle receivable',
    title: 'Settlement completed',
    summary:
      'The receivable is closed after repayment is recorded. Pool accounting now reflects returned principal and yield.',
    contractName: 'receivable-registry',
    functionName: 'mark-settled',
    layer: 'On-chain metadata/lifecycle',
    action: 'Close receivable lifecycle',
    parameters: ['id: u101'],
    note:
      'Settlement marks the lifecycle complete and preserves a clean audit trail from submission to repayment.',
  },
];

const VERIFICATION_ITEMS = [
  'Business identity reviewed',
  'Debtor/client reviewed',
  'Invoice authenticity checked',
  'Work delivery proof reviewed',
  'Duplicate invoice check completed',
];

const STATUS_ORDER: DemoStatus[] = ['draft', 'submitted', 'approved', 'funded', 'repaid', 'settled'];
const STATUS_LABELS: Record<DemoStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Approved',
  funded: 'Funded',
  repaid: 'Repaid',
  settled: 'Settled',
};

function getStepIndex(status: DemoStatus) {
  return STATUS_ORDER.indexOf(status);
}

export default function DemoPage() {
  const [status, setStatus] = useState<DemoStatus>('draft');
  const activeIndex = getStepIndex(status);
  const testnetStatus = getTestnetDeploymentStatus();

  const poolStats = useMemo(() => {
    const funded = activeIndex >= getStepIndex('funded');
    const repaid = activeIndex >= getStepIndex('repaid');
    return {
      totalDeposits: 500000,
      availableLiquidity: repaid ? 508000 : funded ? 420000 : 500000,
      deployedLiquidity: repaid ? 0 : funded ? 80000 : 0,
      totalRepaid: repaid ? 80000 : 0,
      totalYield: repaid ? 8000 : 0,
    };
  }, [activeIndex]);

  const currentStep = STEPS[Math.max(0, Math.min(activeIndex - 1, STEPS.length - 1))] ?? STEPS[0];
  const nextStep = STEPS.find((step) => getStepIndex(step.status) === activeIndex + 1);

  const handleAdvance = (nextStatus: DemoStatus) => {
    if (getStepIndex(nextStatus) === activeIndex + 1) {
      setStatus(nextStatus);
    }
  };

  return (
    <div className="harbor-workspace relative">
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-orange-500/[0.05] blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5">
              <span className="text-xs font-medium text-orange-400">
                Demo mode: mirrors the Clarity contract lifecycle using local UI state.
              </span>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Contract-aware Harbor walkthrough
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
              Follow one receivable from submission through approval, pool funding, repayment, and settlement while seeing
              exactly which off-chain checks and on-chain contract calls each step maps to.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.04] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Lifecycle model</p>
              <h2 className="mt-1 text-lg font-bold text-white">Harbor demonstrates:</h2>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {[
                'Verified receivable lifecycle',
                'Manual approval workflow',
                'Mock sBTC liquidity pool',
                'Funding and repayment accounting',
                'Transparent Stacks settlement model',
              ].map((item) => (
                <div key={item} className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-xs text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Current Lifecycle State</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{STATUS_LABELS[status]}</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Happy path: submit -&gt; approve -&gt; fund -&gt; repay -&gt; settle.
                </p>
              </div>
              <button
                onClick={() => setStatus('draft')}
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.18] hover:text-white"
              >
                Reset demo
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-5">
              {STEPS.map((step) => {
                const stepIndex = getStepIndex(step.status);
                const complete = activeIndex >= stepIndex;
                const isNext = activeIndex + 1 === stepIndex;
                return (
                  <div
                    key={step.status}
                    className={`rounded-lg border p-3 ${
                      complete
                        ? 'border-orange-500/30 bg-orange-500/[0.05]'
                        : isNext
                          ? 'border-white/[0.12] bg-white/[0.04]'
                          : 'border-white/[0.06] bg-white/[0.01]'
                    }`}
                  >
                    <p className="text-[10px] font-mono text-zinc-500">{step.label}</p>
                    <p className={`mt-1 text-xs font-semibold ${complete ? 'text-orange-300' : 'text-zinc-400'}`}>
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {STEPS.map((step) => {
                const isEnabled = getStepIndex(step.status) === activeIndex + 1;
                return (
                  <button
                    key={step.status}
                    disabled={!isEnabled}
                    onClick={() => handleAdvance(step.status)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                      isEnabled
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:brightness-110'
                        : 'border border-white/[0.06] bg-white/[0.02] text-zinc-600'
                    }`}
                  >
                    {step.buttonLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Sample Receivable</p>
          <div className="mt-4 space-y-3">
            {[
              ['Business', SAMPLE_RECEIVABLE.business],
              ['Debtor', SAMPLE_RECEIVABLE.debtor],
              ['Invoice', formatCurrency(SAMPLE_RECEIVABLE.invoiceAmount)],
              ['Advance', formatCurrency(SAMPLE_RECEIVABLE.approvedAdvance)],
              ['Metadata hash', SAMPLE_RECEIVABLE.metadataHash],
              ['Debtor hash', SAMPLE_RECEIVABLE.debtorHash],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <span className="text-xs text-zinc-500">{label}</span>
                <span className="text-right text-sm font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Testnet Status</p>
              <h2 className="mt-1 text-xl font-bold text-white">Network: {testnetStatus.displayNetwork}</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Deployment status: <span className="font-medium text-orange-300">{testnetStatus.status}</span>
              </p>
            </div>
            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              Public env configuration
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {testnetStatus.contracts.map((contract) => (
              <div key={contract.key} className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs font-semibold text-white">{contract.label}</p>
                <p className="mt-2 break-all font-mono text-xs text-zinc-400">
                  {contract.contractId || 'Not configured'}
                </p>
                {contract.explorerUrl ? (
                  <a
                    href={contract.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-xs font-medium text-orange-400 hover:text-orange-300"
                  >
                    View in explorer
                  </a>
                ) : (
                  <p className="mt-3 text-xs text-zinc-600">Explorer link unavailable</p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-zinc-500">
            Demo mode uses local UI state; deployed contracts demonstrate the same lifecycle on Stacks testnet.
          </p>
        </div>
      </section>

      <WalletMode />

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Active Step</p>
                  <h2 className="mt-1 text-xl font-bold text-white">
                    {status === 'draft' ? 'Ready to submit receivable' : currentStep.title}
                  </h2>
                </div>
                <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
                  {status === 'draft' ? 'No transaction mirrored yet' : `${currentStep.contractName}.${currentStep.functionName}`}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {status === 'draft'
                  ? 'Begin by submitting the sample receivable. The UI will update local state to mirror each Clarity lifecycle transition.'
                  : currentStep.summary}
              </p>

              {status !== 'draft' && (
                <div className="mt-6">
                  <ContractActionPanel
                    contractName={currentStep.contractName}
                    functionName={currentStep.functionName}
                    action={currentStep.action}
                    parameters={currentStep.parameters}
                    layer={currentStep.layer}
                    note={currentStep.note}
                  />
                </div>
              )}

              {nextStep && (
                <p className="mt-5 text-xs text-zinc-500">
                  Next contract mapping: {nextStep.contractName}.{nextStep.functionName}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Verification Checklist</p>
            <ul className="mt-4 space-y-3">
              {VERIFICATION_ITEMS.map((item) => {
                const checked = activeIndex >= getStepIndex('approved');
                return (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border text-[10px] ${
                        checked
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border-white/[0.08] text-zinc-600'
                      }`}
                    >
                      {checked ? 'OK' : ''}
                    </span>
                    <span className={checked ? 'text-zinc-200' : 'text-zinc-500'}>{item}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-zinc-500">
              These checks are manual and off-chain in the MVP. Approval records the result; it does not automate credit
              underwriting.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Mock sBTC Pool Accounting</p>
              <h2 className="mt-1 text-xl font-bold text-white">Pool before and after lifecycle events</h2>
            </div>
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              Demo token: mock-sbtc
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            {[
              ['Total deposits', poolStats.totalDeposits],
              ['Available', poolStats.availableLiquidity],
              ['Deployed', poolStats.deployedLiquidity],
              ['Repaid principal', poolStats.totalRepaid],
              ['Tracked yield', poolStats.totalYield],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
                <p className="mt-2 text-lg font-bold text-white">{formatCurrency(Number(value))}</p>
                <p className="mt-1 text-[10px] text-zinc-600">{formatsBTC(Number(value) / 100000)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">System Boundary</p>
          <h2 className="mt-1 text-xl font-bold text-white">Off-chain verification, on-chain coordination</h2>
        </div>
        <OffchainOnchainSplit />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Product Walkthrough</p>
          <h2 className="mt-2 text-xl font-bold text-white">The 90-second version</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ['What Harbor does', 'Harbor lets businesses turn verified unpaid invoices into working capital funded by an sBTC-style liquidity pool.'],
              ['Why Stacks/sBTC matters', 'Stacks gives programmable settlement anchored to Bitcoin, while sBTC is the intended Bitcoin-native funding asset.'],
              ['What Harbor shows', 'The app and contracts demonstrate submission, approval, funding, repayment, settlement, and auditable pool accounting.'],
              ['What is mocked', 'sBTC is mock-sbtc, repayment confirmation is admin-entered, and invoice documents are represented by hashes.'],
              ['What is out of scope', 'No real KYC, SPV, bank rails, legal enforcement, automated underwriting, or production credit claims are included.'],
              ['Production needs', 'A production version needs real sBTC integration, KYB/KYC, legal receivable assignment, fiat/payment ops, risk controls, and audits.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Contract Map</p>
          <h2 className="mt-1 text-xl font-bold text-white">Contract metadata</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {CONTRACTS.map((contract) => (
            <div key={contract.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <p className="font-mono text-xs text-orange-400">{contract.path}</p>
              <h3 className="mt-2 text-lg font-bold text-white">{contract.name}</h3>
              <p className="mt-1 text-sm font-medium text-zinc-300">{contract.lifecycleRole}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{contract.explanation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {contract.functions.slice(0, 4).map((fn) => (
                  <span
                    key={fn.name}
                    className="rounded-md border border-white/[0.06] bg-black/20 px-2.5 py-1 font-mono text-[11px] text-zinc-300"
                  >
                    {fn.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
