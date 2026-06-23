'use client';
import { createNetwork } from '@stacks/network';
import {
  Cl,
  fetchCallReadOnlyFunction,
  type ClarityValue,
  type ContractIdString,
  type PostConditionModeName,
} from '@stacks/transactions';
import { getTestnetContracts } from '@/lib/testnet';

const STACKS_TESTNET_API_URL = 'https://api.testnet.hiro.so';

export interface SubmitReceivableSample {
  receivableId: number;
  debtorHash: string;
  invoiceAmount: number;
  requestedAdvanceAmount: number;
  dueHeight: number;
  metadataHash: string;
}

export interface SubmitReceivableResult {
  txId: string;
  explorerUrl: string;
  sample: SubmitReceivableSample;
  statusNote: string;
}

function getContract(key: 'receivable-registry' | 'liquidity-pool') {
  const contract = getTestnetContracts().find((item) => item.key === key);
  if (!contract?.address || !contract.contractName || !contract.contractId) {
    throw new Error(`Missing ${key} testnet contract configuration.`);
  }
  return contract;
}

function testnetNetwork() {
  return createNetwork({ network: 'testnet', client: { baseUrl: STACKS_TESTNET_API_URL } });
}

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function randomReceivableId() {
  const bytes = randomBytes(4);
  const value = new DataView(bytes.buffer).getUint32(0);
  return 100000 + (value % 800000);
}

async function getFutureDueHeight() {
  try {
    const response = await fetch(`${STACKS_TESTNET_API_URL}/v2/info`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to read testnet chain height.');
    const info = await response.json() as { stacks_tip_height?: number; burn_block_height?: number };
    const currentHeight = Number(info.stacks_tip_height || info.burn_block_height || 0);
    if (Number.isFinite(currentHeight) && currentHeight > 0) {
      return currentHeight + 1440;
    }
  } catch {
    // A high fallback keeps the sample usable if the public API is briefly unavailable.
  }

  return 9999999;
}

export async function buildSampleReceivable(): Promise<SubmitReceivableSample> {
  return {
    receivableId: randomReceivableId(),
    debtorHash: bytesToHex(randomBytes(32)),
    invoiceAmount: 100000,
    requestedAdvanceAmount: 80000,
    dueHeight: await getFutureDueHeight(),
    metadataHash: bytesToHex(randomBytes(32)),
  };
}

function submitReceivableArgs(sample: SubmitReceivableSample): ClarityValue[] {
  return [
    Cl.uint(sample.receivableId),
    Cl.bufferFromHex(sample.debtorHash),
    Cl.uint(sample.invoiceAmount),
    Cl.uint(sample.requestedAdvanceAmount),
    Cl.uint(sample.dueHeight),
    Cl.bufferFromHex(sample.metadataHash),
  ];
}

function formatClarityValue(value: ClarityValue) {
  return JSON.stringify(
    value,
    (_key, item) => (typeof item === 'bigint' ? item.toString() : item),
    2,
  );
}

export function buildTestnetTxExplorerUrl(txId: string) {
  const normalized = txId.startsWith('0x') ? txId : `0x${txId}`;
  return `https://explorer.hiro.so/txid/${normalized}?chain=testnet`;
}

async function fetchTransactionStatus(txId: string) {
  const normalized = txId.startsWith('0x') ? txId.slice(2) : txId;
  const response = await fetch(`${STACKS_TESTNET_API_URL}/extended/v1/tx/0x${normalized}`, { cache: 'no-store' });
  if (!response.ok) return 'Broadcast submitted. The explorer may take a moment to index the transaction.';
  const tx = await response.json() as { tx_status?: string };
  return tx.tx_status ? `Current testnet status: ${tx.tx_status}.` : 'Broadcast submitted. Check the explorer for confirmation.';
}

export async function submitReceivableOnTestnet(senderAddress: string): Promise<SubmitReceivableResult> {
  const registry = getContract('receivable-registry');
  const sample = await buildSampleReceivable();
  const { request } = await import('@stacks/connect');

  const result = await request('stx_callContract', {
    address: senderAddress as never,
    network: 'testnet',
    contract: registry.contractId as ContractIdString,
    functionName: 'submit-receivable',
    functionArgs: submitReceivableArgs(sample),
    postConditionMode: 'allow' as PostConditionModeName,
  });

  const txResponse = result as { txid?: string; txId?: string };
  const txId = txResponse.txid || txResponse.txId;
  if (!txId) {
    throw new Error('The wallet did not return a transaction ID.');
  }

  return {
    txId,
    explorerUrl: buildTestnetTxExplorerUrl(txId),
    sample,
    statusNote: await fetchTransactionStatus(txId),
  };
}

export async function readReceivableStatus(receivableId: number, senderAddress: string) {
  const registry = getContract('receivable-registry');
  const value = await fetchCallReadOnlyFunction({
    contractAddress: registry.address,
    contractName: registry.contractName,
    functionName: 'get-receivable-status',
    functionArgs: [Cl.uint(receivableId)],
    senderAddress,
    network: testnetNetwork(),
  });

  return formatClarityValue(value);
}

export async function readPoolStats(senderAddress: string) {
  const pool = getContract('liquidity-pool');
  const value = await fetchCallReadOnlyFunction({
    contractAddress: pool.address,
    contractName: pool.contractName,
    functionName: 'get-pool-stats',
    functionArgs: [],
    senderAddress,
    network: testnetNetwork(),
  });

  return formatClarityValue(value);
}
