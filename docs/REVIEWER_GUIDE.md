# Reviewer Guide

This guide is for grant reviewers or technical evaluators who want to understand Harbor Finance quickly.

## Run the App

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Access the Demo

Open:

```text
http://localhost:3000/demo
```

The `/demo` page is the fastest way to understand how the frontend story maps to the Clarity contracts.

## Run Contract Tests

```bash
npm run contracts:check
npm run contracts:test
```

Then run frontend checks:

```bash
npm run lint
npm run build
```

## What to Look at First

1. `/demo` route
2. `contracts/receivable-registry.clar`
3. `contracts/liquidity-pool.clar`
4. `tests/harbor_test.ts`
5. `docs/CONTRACTS.md`
6. `deployments/deployment-status.json`

## Testnet Contracts

Harbor contracts are deployed to Stacks testnet:

| Contract | Contract ID |
| --- | --- |
| `mock-sbtc` | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.mock-sbtc` |
| `receivable-registry` | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.receivable-registry` |
| `liquidity-pool` | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.liquidity-pool` |

The `/demo` page shows these IDs and explorer links. The UI simulator still uses local state so reviewers can step through the lifecycle without signing transactions.

For technical reviewers, `/demo` also includes optional Wallet Mode. It can connect a Stacks testnet wallet, display the connected address, and submit a safe `receivable-registry.submit-receivable` transaction. Admin-only calls are labeled but not exposed because they require the deployer/admin.

## Suggested 5-minute Review Path

1. Open `/demo`.
2. Click through Submit, Approve, Fund, Record repayment, Settle.
3. Watch the pool accounting update.
4. Review the contract action panel for each step.
5. Skim the off-chain vs on-chain split.
6. Optional: connect a testnet wallet in Wallet Mode and submit a sample receivable transaction.

## Suggested 15-minute Review Path

1. Run `npm run contracts:test`.
2. Open `/demo` and click through the full lifecycle.
3. Open the admin dashboard and inspect the verification checklist.
4. Open the liquidity pool dashboard and inspect pool stats.
5. Open a receivable detail page and inspect the lifecycle timeline.
6. Read `docs/CONTRACTS.md`.
7. Review `contracts/liquidity-pool.clar` and `tests/harbor_test.ts`.

## Important Files

| File | Why it matters |
| --- | --- |
| `src/app/demo/page.tsx` | Guided lifecycle simulator and contract mapping |
| `src/lib/contracts.ts` | Frontend contract metadata |
| `contracts/mock-sbtc.clar` | Demo token used for mock sBTC |
| `contracts/receivable-registry.clar` | Receivable lifecycle rules |
| `contracts/liquidity-pool.clar` | Pool accounting and funding/repayment flow |
| `tests/harbor_test.ts` | Contract lifecycle and invalid transition tests |
| `docs/CONTRACTS.md` | Contract architecture explanation |
| `docs/DEMO_GUIDE.md` | Demo walkthrough and contract mapping |

## Known Limitations

- No real sBTC integration yet.
- Wallet Mode currently supports only safe user-side testnet submission and read-only inspection.
- No real KYC/KYB or legal receivable assignment.
- No bank/fiat payment integration.
- Repayment is admin-confirmed in the MVP.
- `mock-sbtc` is a test/demo token only.
- The frontend uses local mock state for reviewer-friendly exploration.
