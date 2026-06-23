# Harbor Finance

Harbor Finance is a controlled Stacks/sBTC grant MVP for Bitcoin-native receivables financing. It demonstrates how a verified receivable can be submitted, manually approved, funded through mock sBTC-style liquidity, repaid, and settled with transparent lifecycle and pool accounting. Harbor is not a production credit facility, legal SPV, real invoice factoring business, or live sBTC deployment.

## Current Status

- Frontend MVP complete
- Contract-aware demo complete
- Optional wallet-based testnet interaction added
- Clarinet tests passing
- Contracts deployed to Stacks testnet
- Mock sBTC used for demo liquidity
- Frontend lifecycle simulation is local UI state
- No production credit claims

## Problem

Businesses often wait 30-90 days for completed work to be paid. Traditional receivables financing can be opaque, operationally heavy, and disconnected from transparent settlement rails. For a Bitcoin-native capital market, there needs to be a clear primitive for representing verified receivable lifecycle state and pooled liquidity accounting without putting private invoice documents on-chain.

## Solution

Harbor provides a demo flow for three roles:

- Businesses submit receivable metadata and track lifecycle state.
- Admin reviewers manually verify invoices and approve or reject funding.
- Liquidity providers deposit mock sBTC and see pool deployment, repayment, and yield accounting.

The frontend tells the product story, while Clarity contracts demonstrate the core coordination model:

```text
submit -> approve -> fund -> repay -> settle
```

## Why Stacks/sBTC

- Stacks provides Clarity smart contracts and settlement that anchors to Bitcoin.
- sBTC is the intended Bitcoin-native asset for programmable BTC liquidity.
- Clarity makes lifecycle and accounting rules explicit and inspectable.
- Receivables financing benefits from transparent funding, repayment, and settlement records.

In this MVP, real sBTC is represented by `mock-sbtc` for local/devnet testing.

## MVP Features

- Landing page with reviewer-friendly product positioning
- Business dashboard for receivable submission and tracking
- Admin dashboard with manual verification checklist and approval controls
- Liquidity pool dashboard with mock sBTC deposits and utilization stats
- Receivable detail page with lifecycle timeline and on-chain-style records
- `/demo` guided contract-aware walkthrough
- Clarinet contracts for mock token, receivable lifecycle, and pool accounting
- Contract tests covering mint, deposit, approve, fund, repay, settle, and invalid transitions

## Smart Contracts

| Contract | Role |
| --- | --- |
| `contracts/mock-sbtc.clar` | Demo SIP-010-like token for mock sBTC liquidity |
| `contracts/receivable-registry.clar` | Receivable metadata and lifecycle source of truth |
| `contracts/liquidity-pool.clar` | Provider deposits, funding, repayment, and simple yield accounting |

The contracts coordinate lifecycle/accounting only. Off-chain systems still handle document storage, verification, repayment confirmation, legal review, and production compliance.

## Demo Route

Run the app and open:

```text
http://localhost:3000/demo
```

The `/demo` route is a grant reviewer walkthrough. It mirrors the Clarity contract lifecycle in local UI state and shows the matching contract function for each step. It does not submit real transactions or require a wallet.

The same page also includes optional Wallet Mode for technical reviewers. Wallet Mode can connect a Stacks testnet wallet and submit a safe `receivable-registry.submit-receivable` transaction to the deployed testnet contract. Admin-only lifecycle actions remain labeled and are not exposed from the frontend.

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Frontend Commands

```bash
npm run dev
npm run dev:webpack
npm run lint
npm run build
npm run start
```

If `npm run dev` reports an OS file watch limit from Turbopack/HMR, either raise the Linux watcher limit:

```bash
sudo sysctl -w fs.inotify.max_user_watches=524288 fs.inotify.max_user_instances=2048
```

Or use the webpack dev fallback:

```bash
npm run dev:webpack
```

## Clarinet Commands

```bash
npm run contracts:check
npm run contracts:test
npm run contracts:deploy:testnet:plan
npm run contracts:deploy:testnet:check
npm run contracts:deploy:testnet
```

`contracts:check` requires the Clarinet CLI. This repo was verified with Clarinet `3.20.0`. If `clarinet` is not on your PATH, install it from the official Clarinet releases or place the release binary where the script can find it.

## Testnet Deployment

Harbor contracts are deployed to Stacks testnet using mock sBTC. Deployment status and public contract IDs are tracked in [deployments/deployment-status.json](deployments/deployment-status.json). Explorer links and deployment steps are documented in [docs/TESTNET_DEPLOYMENT.md](docs/TESTNET_DEPLOYMENT.md).

Deployed contract IDs:

- `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.mock-sbtc`
- `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.receivable-registry`
- `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.liquidity-pool`

## Test Commands

Run the full reviewer check:

```bash
npm run lint
npm run build
npm run contracts:check
npm run contracts:test
npm run contracts:deploy:testnet:check
```

## Vercel Deployment

Harbor is ready for Vercel as a standard Next.js project.

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Primary route for reviewers: `/demo`

Configure only the public `NEXT_PUBLIC_*` testnet variables listed in [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md). Do not add deployer mnemonics, private keys, `.secrets/*`, `.env.local`, or admin wallet material to Vercel.

## Project Structure

```text
src/
  app/
    page.tsx                 Landing page
    demo/page.tsx            Contract-aware MVP walkthrough
    dashboard/page.tsx       Business dashboard
    admin/page.tsx           Admin verification dashboard
    pool/page.tsx            Liquidity provider dashboard
    receivable/[id]/page.tsx Receivable detail page
  components/                Shared UI components
  lib/
    context.tsx              Client-side mock state
    contracts.ts             Contract metadata used by /demo
    mock-data.ts             Demo receivable/pool data
    types.ts                 TypeScript domain types

contracts/
  mock-sbtc.clar
  receivable-registry.clar
  liquidity-pool.clar

tests/
  harbor_test.ts             Clarinet SDK lifecycle tests

docs/
  CONTRACTS.md
  DEMO_GUIDE.md
  MVP_SCOPE.md
  FINAL_GRANT_ANSWERS.md
  GRANT_APPLICATION_DRAFT.md
  REVIEWER_GUIDE.md
  WALLET_MODE.md
  SUBMISSION_PACKAGE.md
  TESTNET_READINESS.md
  TESTNET_DEPLOYMENT.md
  VERCEL_DEPLOYMENT.md
```

## What Is Mocked

- `mock-sbtc` stands in for real sBTC.
- Receivable documents are represented by metadata hashes.
- Repayment confirmation is an admin-recorded event.
- Frontend state is local mock/demo state.
- Provider yield accounting is intentionally simple.
- Wallet Mode is limited to safe user-side testnet submission and read-only inspection.

## Out of Scope

- Production credit facility or legal factoring operation
- Legal SPV/receivable assignment enforcement
- Real KYC/KYB, compliance workflows, or bank integrations
- Automated underwriting or oracle-based risk scoring
- Real sBTC integration
- Secondary marketplace or fractional receivable NFTs
- Permissionless credit protocol claims

## Grant Milestone Summary

Completed MVP milestone:

- Built full Next.js product demo with business, admin, LP, receivable detail, and `/demo` routes.
- Added Clarity contracts for mock sBTC, receivable registry, and liquidity pool accounting.
- Added lifecycle tests for submit, approve, fund, repay, settle, and invalid transitions.
- Added reviewer documentation, demo guide, contract guide, and grant application draft.

Proposed next milestone:

- Add richer frontend testnet contract inspection.
- Add read-only frontend contract calls.
- Expand optional wallet-connected testnet flows where safe.
- Expand contract tests and review security assumptions.
- Produce demo video and hosted grant-review deployment.

## Documentation

- [docs/CONTRACTS.md](docs/CONTRACTS.md)
- [docs/DEMO_GUIDE.md](docs/DEMO_GUIDE.md)
- [docs/WALLET_MODE.md](docs/WALLET_MODE.md)
- [docs/MVP_SCOPE.md](docs/MVP_SCOPE.md)
- [docs/FINAL_GRANT_ANSWERS.md](docs/FINAL_GRANT_ANSWERS.md)
- [docs/GRANT_APPLICATION_DRAFT.md](docs/GRANT_APPLICATION_DRAFT.md)
- [docs/REVIEWER_GUIDE.md](docs/REVIEWER_GUIDE.md)
- [docs/SUBMISSION_PACKAGE.md](docs/SUBMISSION_PACKAGE.md)
- [docs/TESTNET_READINESS.md](docs/TESTNET_READINESS.md)
- [docs/TESTNET_DEPLOYMENT.md](docs/TESTNET_DEPLOYMENT.md)
- [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

## License

MIT
