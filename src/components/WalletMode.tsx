'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  connectStacksTestnetWallet,
  disconnectStacksWallet,
  formatWalletError,
  getCachedWalletConnection,
  hasStacksWalletInstalled,
  isStacksTestnetConfigured,
  type WalletConnection,
} from '@/lib/stacks-wallet';
import {
  readPoolStats,
  readReceivableStatus,
  submitReceivableOnTestnet,
  type SubmitReceivableResult,
} from '@/lib/stacks-contract-calls';
import { getTestnetDeploymentStatus } from '@/lib/testnet';

const ADMIN_ACTIONS = [
  ['Approve receivable', 'receivable-registry.approve-receivable'],
  ['Reject receivable', 'receivable-registry.reject-receivable'],
  ['Fund receivable', 'liquidity-pool.fund-receivable'],
  ['Record repayment', 'liquidity-pool.record-repayment'],
  ['Settle receivable', 'receivable-registry.mark-settled'],
];

export default function WalletMode() {
  const testnetStatus = getTestnetDeploymentStatus();
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [walletInstalled, setWalletInstalled] = useState(false);
  const [error, setError] = useState('');
  const [txResult, setTxResult] = useState<SubmitReceivableResult | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receivableId, setReceivableId] = useState('');
  const [readResult, setReadResult] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const configIssues = useMemo(() => {
    const issues: string[] = [];
    if (!isStacksTestnetConfigured()) issues.push('Wallet Mode only supports Stacks testnet.');
    if (testnetStatus.contracts.some((contract) => !contract.configured)) {
      issues.push('One or more deployed contract IDs are not configured.');
    }
    return issues;
  }, [testnetStatus.contracts]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      getCachedWalletConnection().then(setWallet).catch(() => setWallet(null));
      hasStacksWalletInstalled().then(setWalletInstalled).catch(() => setWalletInstalled(false));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleConnect = async () => {
    setError('');
    setIsConnecting(true);
    try {
      setWallet(await connectStacksTestnetWallet());
    } catch (connectError) {
      setError(formatWalletError(connectError));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    void disconnectStacksWallet();
    setWallet(null);
    setTxResult(null);
    setReadResult('');
    setError('');
  };

  const handleSubmitReceivable = async () => {
    if (!wallet) {
      setError('Connect a Stacks testnet wallet before submitting a testnet transaction.');
      return;
    }

    setError('');
    setTxResult(null);
    setIsSubmitting(true);
    try {
      const result = await submitReceivableOnTestnet(wallet.address);
      setTxResult(result);
      setReceivableId(String(result.sample.receivableId));
    } catch (submitError) {
      setError(formatWalletError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReadStatus = async () => {
    if (!wallet) {
      setError('Connect a Stacks testnet wallet before reading contract state.');
      return;
    }

    const id = Number(receivableId);
    if (!Number.isInteger(id) || id <= 0) {
      setError('Enter a valid receivable ID to read from testnet.');
      return;
    }

    setError('');
    setIsReading(true);
    try {
      setReadResult(await readReceivableStatus(id, wallet.address));
    } catch (readError) {
      setError(formatWalletError(readError));
    } finally {
      setIsReading(false);
    }
  };

  const handleReadPoolStats = async () => {
    if (!wallet) {
      setError('Connect a Stacks testnet wallet before reading contract state.');
      return;
    }

    setError('');
    setIsReading(true);
    try {
      setReadResult(await readPoolStats(wallet.address));
    } catch (readError) {
      setError(formatWalletError(readError));
    } finally {
      setIsReading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.03] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Optional Testnet Wallet Mode</p>
            <h2 className="mt-2 text-xl font-bold text-white">Signed interaction for technical reviewers</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              The main demo stays local and deterministic. Open this optional panel only when you want to connect a
              testnet wallet and submit a safe receivable transaction.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
            <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
              mock sBTC only
            </div>
            <button
              onClick={() => setExpanded((value) => !value)}
              className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/20"
            >
              {expanded ? 'Hide Wallet Mode' : 'Open Wallet Mode'}
            </button>
          </div>
        </div>

        {!expanded && (
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ['Network', 'Stacks Testnet'],
              ['Supported signed call', 'submit-receivable'],
              ['Admin actions', 'Shown as read-only mappings'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
                <p className="mt-2 text-sm font-medium text-zinc-200">{value}</p>
              </div>
            ))}
          </div>
        )}

        {expanded && (
          <>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-white/[0.06] bg-black/20 p-4 lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Wallet</p>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs text-zinc-500">Network</p>
                <p className="mt-1 text-sm font-medium text-white">Stacks Testnet</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Connected address</p>
                <p className="mt-1 break-all font-mono text-xs text-zinc-300">
                  {wallet?.address || 'Not connected'}
                </p>
              </div>
              {!walletInstalled && (
                <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-200">
                  No installed Stacks wallet was detected in this browser. Install Leather or use a wallet provider supported
                  by Stacks Connect.
                </p>
              )}
              {configIssues.map((issue) => (
                <p key={issue} className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
                  {issue}
                </p>
              ))}
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <button
                  onClick={handleConnect}
                  disabled={isConnecting || configIssues.length > 0}
                  className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : wallet ? 'Reconnect wallet' : 'Connect testnet wallet'}
                </button>
                {wallet && (
                  <button
                    onClick={handleDisconnect}
                    className="rounded-lg border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.18] hover:text-white"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-black/20 p-4 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Deployed contracts</p>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {testnetStatus.contracts.map((contract) => (
                <div key={contract.key} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-xs font-semibold text-white">{contract.label}</p>
                  <p className="mt-2 break-all font-mono text-[11px] text-zinc-500">{contract.contractId || 'Not configured'}</p>
                  {contract.explorerUrl && (
                    <a
                      href={contract.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-xs font-medium text-cyan-300 hover:text-cyan-200"
                    >
                      View in explorer
                    </a>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Admin-only lifecycle calls require the contract deployer/admin. Wallet Mode exposes only a safe user-side
              submit call; use the local simulator above to review the complete lifecycle without admin keys.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Safe signed action</p>
            <h3 className="mt-2 text-base font-semibold text-white">Submit Receivable on Testnet</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Generates a unique sample receivable and asks your wallet to call
              <span className="font-mono text-cyan-300"> receivable-registry.submit-receivable</span>.
            </p>
            <button
              onClick={handleSubmitReceivable}
              disabled={!wallet || isSubmitting || configIssues.length > 0}
              className="mt-4 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Waiting for wallet...' : 'Submit Receivable on Testnet'}
            </button>

            {txResult && (
              <div className="mt-4 space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
                <p className="text-sm font-semibold text-emerald-300">Transaction broadcast</p>
                <p className="break-all font-mono text-xs text-zinc-300">{txResult.txId}</p>
                <p className="text-xs leading-relaxed text-zinc-400">{txResult.statusNote}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  <span>Receivable ID</span>
                  <span className="text-right font-mono text-white">u{txResult.sample.receivableId}</span>
                  <span>Invoice amount</span>
                  <span className="text-right font-mono text-white">u{txResult.sample.invoiceAmount}</span>
                  <span>Requested advance</span>
                  <span className="text-right font-mono text-white">u{txResult.sample.requestedAdvanceAmount}</span>
                </div>
                <a
                  href={txResult.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-xs font-medium text-emerald-300 hover:text-emerald-200"
                >
                  View transaction in explorer
                </a>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Read-only helpers</p>
            <h3 className="mt-2 text-base font-semibold text-white">Inspect deployed contract state</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Read-only calls use the public Stacks testnet API and do not require signing.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={receivableId}
                onChange={(event) => setReceivableId(event.target.value)}
                placeholder="Receivable ID"
                className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              />
              <button
                onClick={handleReadStatus}
                disabled={!wallet || isReading}
                className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Read status
              </button>
            </div>
            <button
              onClick={handleReadPoolStats}
              disabled={!wallet || isReading}
              className="mt-3 rounded-lg border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.18] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReading ? 'Reading...' : 'Read pool stats'}
            </button>
            {readResult && (
              <pre className="mt-4 max-h-56 overflow-auto rounded-lg border border-white/[0.06] bg-black/30 p-3 text-xs leading-relaxed text-zinc-300">
                {readResult}
              </pre>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Admin-only on-chain actions</p>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5">
            {ADMIN_ACTIONS.map(([label, fn]) => (
              <div key={fn} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="text-xs font-semibold text-zinc-300">{label}</p>
                <p className="mt-2 break-all font-mono text-[11px] text-zinc-600">{fn}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm leading-relaxed text-red-200">
            {error}
          </div>
        )}
          </>
        )}
      </div>
    </section>
  );
}
