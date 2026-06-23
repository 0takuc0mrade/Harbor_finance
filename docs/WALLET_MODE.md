# Wallet Mode

Wallet Mode is an optional `/demo` section for technical reviewers who want to sign a real Stacks testnet transaction from the browser.

## What It Does

- Connects a Stacks testnet wallet through Stacks Connect.
- Shows the connected testnet address.
- Shows deployed testnet contract IDs and explorer links.
- Lets a reviewer submit a sample receivable to `receivable-registry.submit-receivable`.
- Shows the returned transaction ID and Hiro Explorer link.
- Includes read-only helpers for receivable status and pool stats when a wallet address is available.

## Why The Simulator Remains Primary

The local simulator remains the primary reviewer path because it is deterministic, fast, and walks through the complete lifecycle:

```text
submit -> approve -> fund -> repay -> settle
```

That full lifecycle includes admin-only contract calls. Exposing those calls directly from a random connected wallet would either fail or require unsafe admin key handling. Wallet Mode therefore demonstrates safe user-side signing while the simulator demonstrates the full product lifecycle.

## Connect A Testnet Wallet

1. Install Leather or another Stacks wallet supported by Stacks Connect.
2. Switch the wallet to Stacks testnet.
3. Open `/demo`.
4. Scroll to "Optional Testnet Wallet Mode".
5. Click "Connect testnet wallet".

No deployer mnemonic, private key, backend relayer, or admin secret is used by the frontend.

## Supported Testnet Calls

Wallet Mode currently supports:

```text
receivable-registry.submit-receivable
```

The UI generates a unique receivable ID, 32-byte debtor hash, invoice amount, requested advance amount, future due height, and 32-byte metadata hash. The connected wallet signs and broadcasts the contract call on Stacks testnet.

## Read-only Helpers

Wallet Mode also includes read-only helpers for:

- `receivable-registry.get-receivable-status`
- `liquidity-pool.get-pool-stats`

These use the public Stacks testnet API and do not mutate contract state.

## Admin-only Calls

These calls are intentionally not exposed as wallet buttons:

- `receivable-registry.approve-receivable`
- `receivable-registry.reject-receivable`
- `liquidity-pool.fund-receivable`
- `liquidity-pool.record-repayment`
- `receivable-registry.mark-settled`

They require the contract deployer/admin. Harbor does not put admin keys in the frontend and does not use a backend relayer.

## What Remains Mocked

- `mock-sbtc` is not real sBTC.
- The demo does not move real assets.
- Invoice documents are represented by hashes.
- Verification and repayment confirmation remain off-chain.
- The complete lifecycle walkthrough remains local UI state.

## Why This Strengthens The Stacks Demo

Wallet Mode gives technical reviewers a real signed interaction with the deployed Stacks testnet contracts while preserving the fast local walkthrough. It proves that Harbor can support both a clear product demo and a Stacks-native transaction path without adding unsafe admin-key handling or production claims.
