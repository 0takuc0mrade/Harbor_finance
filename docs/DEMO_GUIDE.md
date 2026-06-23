# Harbor Finance Demo Guide

This guide explains how to run and evaluate the Harbor Finance MVP demo. The demo connects the frontend story to the Clarity contract lifecycle without requiring a wallet or real transactions.

## Run the Frontend

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/demo
```

The `/demo` route is a guided walkthrough that mirrors contract lifecycle state in local UI state. It does not submit real Stacks transactions.

The page also includes an optional Wallet Mode section. Wallet Mode lets technical reviewers connect a Stacks testnet wallet and submit a safe `receivable-registry.submit-receivable` transaction to the deployed testnet contract. The deterministic simulator remains the primary path because it shows the complete lifecycle without requiring admin keys.

## Run Contract Verification

```bash
npm run contracts:check
npm run contracts:test
```

`contracts:check` requires a Clarinet CLI binary. The project was verified with Clarinet `3.20.0`.

## Demo Flow

The demo follows the grant MVP lifecycle:

```text
submit -> approve -> fund -> repay -> settle
```

### Step 1: Business Submits Receivable

Frontend action: `Submit receivable`

Contract mapping:

```text
receivable-registry.submit-receivable
```

Purpose: create an auditable receivable record using invoice amount, requested advance amount, due height, debtor hash, and metadata hash. Private invoice documents stay off-chain.

### Step 2: Admin Verifies and Approves

Frontend action: `Approve receivable`

Contract mapping:

```text
receivable-registry.approve-receivable
```

Purpose: record the admin-approved advance amount after off-chain business, debtor, invoice, delivery, and duplicate-invoice checks.

### Step 3: Liquidity Pool Funds Receivable

Frontend action: `Fund receivable`

Contract mapping:

```text
liquidity-pool.fund-receivable
receivable-registry.mark-funded
```

Purpose: reduce available pool liquidity, increase deployed liquidity, transfer mock sBTC to the business, and move the receivable into funded status.

### Step 4: Repayment Is Recorded

Frontend action: `Record repayment`

Contract mapping:

```text
liquidity-pool.record-repayment
receivable-registry.mark-repaid
```

Purpose: record principal plus yield returning to the pool after an admin confirms repayment evidence off-chain.

### Step 5: Settlement Completed

Frontend action: `Settle receivable`

Contract mapping:

```text
receivable-registry.mark-settled
```

Purpose: close the receivable lifecycle after repayment and pool accounting are complete.

## Off-chain vs On-chain

Off-chain in the MVP:

- Invoice PDF/document storage
- Business verification
- Debtor verification
- Fraud review
- Repayment confirmation
- Legal/compliance review in production

On-chain in the MVP:

- Receivable metadata hash
- Lifecycle status
- Pool liquidity accounting
- Funding event
- Repayment record
- Settlement/yield accounting

## Contract Metadata

Frontend contract descriptions live in:

```text
src/lib/contracts.ts
```

The `/demo` page uses this mapping to show each contract path, lifecycle role, main public functions, and explanation.

## Known Limitations

- `mock-sbtc` is a demo token, not real sBTC.
- The `/demo` simulator uses local UI state, not wallet transactions.
- Wallet Mode is limited to safe user-side testnet calls for now.
- Repayment confirmation is represented as an admin action.
- No real KYC/KYB, bank integration, legal SPV, legal enforcement, or automated underwriting is included.
- Provider accounting is intentionally simple and does not implement production share/yield distribution.
- Contracts coordinate lifecycle/accounting; they do not force off-chain debtors to repay invoices.
