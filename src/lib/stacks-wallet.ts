'use client';

export interface WalletConnection {
  address: string;
  network: 'testnet';
}

export function getConfiguredStacksNetwork() {
  return process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
}

export function isStacksTestnetConfigured() {
  return getConfiguredStacksNetwork() === 'testnet';
}

export function hasStacksWalletInstalled() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  return import('@stacks/connect').then(({ isStacksWalletInstalled }) => isStacksWalletInstalled());
}

function findTestnetAddress(addresses: { address: string }[]) {
  return addresses.find((entry) => entry.address.startsWith('ST'))?.address;
}

export async function getCachedWalletConnection(): Promise<WalletConnection | null> {
  if (typeof window === 'undefined' || !isStacksTestnetConfigured()) return null;

  const { getLocalStorage, isConnected } = await import('@stacks/connect');
  if (!isConnected()) return null;

  const storage = getLocalStorage();
  const address = findTestnetAddress(storage?.addresses.stx ?? []);
  return address ? { address, network: 'testnet' } : null;
}

export async function connectStacksTestnetWallet(): Promise<WalletConnection> {
  if (!isStacksTestnetConfigured()) {
    throw new Error('Wallet Mode is configured for Stacks testnet only.');
  }

  const { connect } = await import('@stacks/connect');
  const result = await connect({ network: 'testnet' });
  const address = findTestnetAddress(result.addresses);

  if (!address) {
    throw new Error('No Stacks testnet address was returned. Switch your wallet to testnet and try again.');
  }

  return { address, network: 'testnet' };
}

export async function disconnectStacksWallet() {
  const { disconnect } = await import('@stacks/connect');
  disconnect();
}

export function formatWalletError(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('user') && (message.includes('cancel') || message.includes('reject'))) {
      return 'The wallet request was cancelled.';
    }
    if (message.includes('testnet')) return error.message;
    if (message.includes('no installed')) return 'No Stacks wallet was detected. Install Leather or another Stacks wallet and try again.';
    return error.message;
  }

  return 'Something went wrong while talking to the wallet.';
}
