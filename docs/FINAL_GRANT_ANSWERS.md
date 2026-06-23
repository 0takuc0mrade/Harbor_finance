# Final Grant Answers

Copy-paste ready answers for the Stacks grant application.

## Project Name

Harbor Finance

## One-line Summary

Harbor is a Bitcoin-native receivables financing MVP on Stacks that demonstrates verified invoice lifecycle, mock sBTC pool accounting, and transparent settlement coordination.

## Short Description

Harbor helps businesses explore how unpaid invoices could move through a transparent financing lifecycle on Stacks. The MVP includes a Next.js demo app, manual verification workflow, mock sBTC liquidity pool, Clarity contracts, Clarinet tests, deployed Stacks testnet contracts, and optional wallet-based testnet submission. It is intentionally demo-grade and does not make production credit, yield, or legal factoring claims.

## Full Project Description

Harbor Finance is a controlled Real-World Asset and DeFi MVP for Bitcoin-native receivables financing. It models how a business can submit an unpaid invoice, have it manually reviewed, receive mock sBTC-style funding from a liquidity pool, record repayment, and close settlement through a transparent lifecycle.

The product deliberately separates sensitive real-world operations from on-chain coordination. Invoice documents, business verification, debtor review, fraud checks, repayment evidence, legal review, and compliance workflows remain off-chain. The Stacks contracts coordinate lifecycle state, metadata hashes, pool liquidity accounting, funding records, repayment records, and settlement status.

The current MVP includes a reviewer-focused frontend, business/admin/liquidity dashboards, a contract-aware `/demo` lifecycle simulator, optional Wallet Mode for a safe signed testnet submit call, Clarity contracts, Clarinet tests, and Stacks testnet deployments for `mock-sbtc`, `receivable-registry`, and `liquidity-pool`.

## Problem Statement

Many businesses wait 30-90 days after completing work before invoices are paid. That delay creates a working capital gap, especially for small businesses and service providers. Traditional invoice financing can be opaque, slow, expensive, and operationally fragmented.

At the same time, Bitcoin-native capital lacks enough transparent, real-world financing primitives. Harbor explores a focused bridge between verified receivables and Bitcoin-denominated liquidity without putting private invoice documents directly on-chain.

## Target Users

- Businesses with unpaid invoices seeking earlier working capital.
- Admin or verification teams responsible for reviewing invoices, debtors, and documentation.
- Bitcoin and sBTC liquidity providers interested in transparent Real-World Asset financing models.
- Grant reviewers and developers evaluating how Stacks can coordinate off-chain verification with on-chain lifecycle state.

## Why Stacks

Stacks is a strong fit because Harbor needs transparent smart contract logic anchored to Bitcoin. Clarity makes lifecycle and accounting rules explicit and inspectable, which matters for financial workflows involving real-world documents and manual verification.

sBTC is also aligned with the long-term direction of the product: Bitcoin-native capital can be represented in programmable contracts while keeping the financing workflow tied to Bitcoin settlement infrastructure.

## How Harbor Uses sBTC

The MVP uses `mock-sbtc`, a demo token, to model sBTC-style liquidity. Liquidity providers can see how deposits, available liquidity, deployed liquidity, repayment, and fee/yield accounting would flow through a pool.

Real sBTC integration is intentionally out of scope for this MVP. The grant would support deeper Stacks integration research, read-only contract inspection, controlled wallet-connected testnet flows, and production-readiness work needed before any real asset integration.

## What Has Already Been Built

- Next.js frontend with landing page, business dashboard, admin dashboard, liquidity pool dashboard, receivable detail page, and `/demo` route.
- Contract-aware lifecycle simulator showing submit, approve, fund, repay, and settle steps.
- Optional Wallet Mode for a safe `receivable-registry.submit-receivable` Stacks testnet transaction.
- Manual verification checklist and admin approval workflow.
- Mock sBTC liquidity pool UI and accounting model.
- Clarity contracts for `mock-sbtc`, `receivable-registry`, and `liquidity-pool`.
- Clarinet/Vitest tests covering the core lifecycle and invalid transitions.
- Stacks testnet deployment plan and safe deployment wrapper.
- Deployed Stacks testnet contracts with explorer links.
- Reviewer documentation, demo guide, contract guide, deployment notes, and grant materials.

## Testnet Deployment Status

Harbor contracts are deployed to Stacks testnet.

| Contract | Contract ID | Explorer |
| --- | --- | --- |
| mock-sbtc | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.mock-sbtc` | `https://explorer.hiro.so/txid/0x62905ce5da5c59e71f8ebec4e91ea07331449d6c0b5a0c7830926889828da1e6?chain=testnet` |
| receivable-registry | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.receivable-registry` | `https://explorer.hiro.so/txid/0x90ea30b37b74fb2f7e2359c91f114266c3d4acc89544cb1a72ca5bb3d7b166aa?chain=testnet` |
| liquidity-pool | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.liquidity-pool` | `https://explorer.hiro.so/txid/0xc05a1d743b6677387cf1cc85b81276b6d9ba532d61d66c668f21a215d2daba00?chain=testnet` |

The frontend `/demo` page displays these contract IDs and explorer links. The lifecycle simulator still uses local UI state so reviewers can walk through the full flow without a wallet or signed transactions. Optional Wallet Mode lets technical reviewers connect a Stacks testnet wallet and submit a safe user-side receivable transaction.

## What Will Be Built With The Grant

The grant will fund the next step from controlled MVP to stronger Stacks integration:

- Read-only frontend contract inspection for deployed testnet contracts.
- Cleaner testnet status and contract metadata surfaces for reviewers.
- Expand the optional wallet-connected testnet flow beyond the safe submit action, where appropriate.
- Expanded Clarity tests for edge cases, permissions, and accounting invariants.
- Improved verification workflow design for business and debtor review.
- Security and production-readiness research around real sBTC integration, legal assignment, compliance, and repayment operations.
- Public demo deployment, demo video, and grant evaluation package.

## 8-12 Week Milestones

| Week | Milestone | Deliverable |
| --- | --- | --- |
| 1-2 | Testnet integration polish | Public demo deployment, environment configuration, testnet contract display, reviewer documentation |
| 3-4 | Contract read layer | Read-only frontend contract calls, contract state inspection, graceful not-configured states |
| 5-6 | Controlled wallet flow | Optional testnet wallet connection for selected demo actions, no mainnet or production claims |
| 7-8 | Verification workflow upgrade | Improved admin review states, evidence metadata model, clearer off-chain/on-chain boundary |
| 9-10 | Contract and test hardening | More Clarity tests, invalid transition coverage, accounting invariants, documentation updates |
| 11-12 | Production-readiness research | sBTC integration plan, risk register, compliance/legal assumptions, demo video, final report |

## Budget Breakdown For $10,000

| Category | Amount | Use |
| --- | ---: | --- |
| Stacks/frontend integration | $3,000 | Read-only contract inspection, testnet configuration, wallet-connected demo research |
| Clarity contract hardening | $2,000 | Additional tests, edge-case coverage, accounting invariants, contract documentation |
| Verification workflow design | $1,500 | Manual review UX, evidence metadata model, off-chain/on-chain separation |
| Public demo and deployment | $1,000 | Vercel deployment, environment setup, reviewer path, demo QA |
| Security and production-readiness research | $1,500 | sBTC integration plan, compliance assumptions, risk controls, audit preparation notes |
| Documentation and demo video | $1,000 | Grant materials, demo script, screenshots, final report |

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Reviewer confusion about production readiness | Label MVP/demo boundaries clearly in the UI and docs |
| Real-world invoice enforcement is off-chain | Keep legal assignment, debtor payment, and collections out of scope for this MVP |
| sBTC integration complexity | Use mock sBTC now and define a staged integration plan before real asset support |
| Credit and fraud risk | Keep underwriting manual, documented, and separate from contract automation |
| Privacy concerns around invoice data | Store only metadata hashes on-chain; keep private documents off-chain |
| Pool accounting limitations | Document simple MVP accounting and expand tests before production research |

## What Is Intentionally Out Of Scope

- Production credit facility or real invoice factoring operation.
- Guaranteed yield, instant credit, or automated underwriting claims.
- Real KYC/KYB, legal SPV, bank rails, collections, or debtor payment enforcement.
- Real sBTC deposits or mainnet asset movement.
- NFT marketplace framing or secondary trading.
- Permissionless public credit protocol.
- Production security audit or regulatory approval.

## Long-term Vision

Harbor could become a Bitcoin-native Real-World Asset financing primitive on Stacks. The long-term vision is a transparent receivables lifecycle where verified off-chain documents, manual or institutional verification, sBTC liquidity, and auditable settlement records work together in a mature financing workflow.

That future requires legal infrastructure, compliance operations, real sBTC integration, repayment controls, risk management, audits, and institutional partnerships. The MVP is a focused first step that proves the lifecycle and accounting model.

## Team Capability

The current MVP demonstrates the team's ability to ship across product, frontend, Clarity contracts, testing, deployment, and grant documentation. The project already includes a working Next.js app, typed mock data/state, reusable UI components, Clarity contracts, Clarinet tests, Stacks testnet deployments, and reviewer-ready documentation.

The next grant-funded phase is well scoped: deepen the Stacks integration, improve verification workflows, harden tests, and document the path from controlled MVP to a more production-informed design.
