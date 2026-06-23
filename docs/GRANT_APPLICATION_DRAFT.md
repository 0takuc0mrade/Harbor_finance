# Harbor Finance Grant Application Draft

## Project Name

Harbor Finance

## One-line Summary

Harbor Finance is a Stacks-based receivables financing MVP that demonstrates verified invoice lifecycle management, mock sBTC liquidity funding, repayment, and transparent settlement accounting.

## Project Description

Harbor Finance explores receivables financing as a Bitcoin-native primitive on Stacks. The MVP shows how a business can submit receivable metadata, an admin can manually verify and approve that receivable, and a liquidity pool can fund the receivable using mock sBTC-style liquidity. Repayment and settlement are then recorded through simple Clarity contract accounting.

This is a grant/demo MVP. It is not a production credit facility, real invoice factoring company, legal SPV implementation, or live sBTC deployment. The goal is to make the lifecycle and accounting model understandable, testable, and reviewable.

## Problem Being Solved

Many businesses complete work and wait 30-90 days for invoices to be paid. Existing receivables financing options can be opaque, expensive, and operationally complex. In the Bitcoin ecosystem, there is also a gap between real-world working capital needs and transparent, programmable settlement rails.

Harbor addresses the early technical question: how can verified receivable lifecycle state and pooled BTC-style liquidity accounting be represented clearly on Stacks without putting private invoice documents or legal enforcement logic on-chain?

## Why This Matters to the Stacks Ecosystem

Harbor demonstrates a practical real-world finance use case for Stacks beyond speculative trading. It shows how Clarity contracts can coordinate a receivable lifecycle and liquidity pool while preserving a clear boundary between off-chain verification and on-chain settlement/accounting.

The MVP can help the ecosystem explore:

- Bitcoin-native working capital primitives
- sBTC-style liquidity deployment into real-world receivable workflows
- Transparent lifecycle state for off-chain assets
- Clarity contracts as auditable coordination layers

## How Harbor Uses Stacks

Harbor uses Clarity smart contracts for:

- Receivable metadata and lifecycle status
- Admin approval/rejection transitions
- Pool deposit and withdrawal accounting
- Funding, repayment, and settlement accounting
- Contract tests for valid and invalid lifecycle transitions

The frontend includes a `/demo` route that maps each product step to the corresponding Clarity function.

## How Harbor Uses or Plans to Use sBTC

The current MVP uses `mock-sbtc` as a demo token. This allows local/devnet tests to demonstrate deposits, funding, repayment, and yield accounting without requiring real sBTC.

A future testnet/production path would replace `mock-sbtc` with the appropriate sBTC contract integration, subject to current network support, wallet UX, security review, and deployment readiness.

## Target Users

- Small businesses with verified unpaid invoices
- Admin/verifier operators who review receivables manually
- Bitcoin/sBTC holders interested in transparent pool-based working capital exposure
- Stacks ecosystem reviewers and builders evaluating real-world asset lifecycle patterns

## MVP Scope

Included:

- Next.js product demo
- Business dashboard
- Admin verification dashboard
- Liquidity provider dashboard
- Receivable detail page
- Contract-aware `/demo` walkthrough
- Clarity contracts for mock token, receivable registry, and liquidity pool
- Clarinet tests for the lifecycle
- Documentation for reviewers and grant evaluation

## What Has Already Been Built

- Working Next.js application that builds successfully
- Mock receivable and pool state
- Reusable UI components for receivables, status badges, timelines, pool stats, and contract actions
- Clarinet project with three Clarity contracts
- Passing contract tests for mint, deposit, submit, approve, fund, repay, settle, and invalid transitions
- Reviewer-facing documentation

## 8-12 Week Milestone Plan

### Weeks 1-2: Testnet Readiness and Deployment Plan

- Finalize testnet deployment assumptions
- Add environment-based contract address configuration
- Prepare deployment scripts/plans
- Document wallet/faucet prerequisites

### Weeks 3-4: Controlled Testnet Deployment

- Deploy `mock-sbtc`, `receivable-registry`, and `liquidity-pool` to Stacks testnet
- Record contract addresses and ABIs
- Verify read-only calls from a frontend environment

### Weeks 5-6: Wallet-connected Demo Flow

- Add optional wallet connection for controlled demo transactions
- Wire submit/approve/fund/repay/settle calls behind explicit demo controls
- Keep non-wallet local simulator available for reviewers

### Weeks 7-8: Security and Product Hardening

- Expand Clarinet tests for edge cases
- Add contract documentation for all error codes and state transitions
- Review admin assumptions and permission boundaries
- Improve demo data and reviewer flows

### Weeks 9-12: Hosted Demo and Review Package

- Host frontend demo
- Record 2-3 minute walkthrough video
- Finalize grant report
- Document production gaps and next funding needs

## Budget Breakdown for $10,000

- Smart contract development and tests: $3,000
- Frontend demo and wallet/testnet integration: $2,500
- Documentation, reviewer guide, and grant reporting: $1,500
- Testnet deployment, QA, and debugging: $1,500
- Demo video, hosting, and final polish: $1,000
- Contingency for integration issues: $500

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Real receivables require legal enforcement | Keep MVP focused on lifecycle/accounting; document legal SPV as future work |
| sBTC integration details change | Use `mock-sbtc` locally and isolate contract metadata/config for future replacement |
| Credit underwriting is complex | Keep admin verification manual and out of contract scope |
| Reviewer confusion about production readiness | Label all mock/demo boundaries clearly in UI and docs |
| Contract assumptions need deeper review | Maintain simple contracts, tests, and explicit permission checks |

## What Is Intentionally Out of Scope

- Real KYC/KYB
- Real sBTC deployment
- Legal SPV or receivable assignment enforcement
- Bank account or fiat payment integration
- Automated underwriting
- Oracle-based repayment confirmation
- Permissionless borrower onboarding
- Secondary marketplace or fractional receivable trading

## Long-term Vision

Harbor could become a Stacks-based primitive for Bitcoin-native working capital, where verified receivable lifecycle records and sBTC liquidity pools coordinate transparent financing flows. A production version would require legal infrastructure, compliance, real sBTC integration, risk controls, audits, and institutional-grade operations.

## Links

- GitHub repo: `[add link]`
- Demo URL: `[add link]`
- Demo video: `[add link]`
- Documentation: `[add link]`
