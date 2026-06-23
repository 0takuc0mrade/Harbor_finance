# Demo Video Script

Target length: 2-3 minutes.

## 0:00-0:20 - Intro

Hi, this is Harbor Finance.

Harbor is a Bitcoin-native receivables financing MVP on Stacks. It helps businesses explore how they could access working capital from verified unpaid invoices while keeping private invoice documents and manual verification off-chain.

This is a controlled grant demo, not a production credit facility.

## 0:20-0:45 - Problem

Many businesses wait 30-90 days to get paid after completing work. That delay creates a working capital gap.

At the same time, Bitcoin capital needs more transparent real-world finance primitives. Harbor explores one focused use case: verified receivables, mock sBTC liquidity, and transparent lifecycle accounting on Stacks.

## 0:45-1:40 - Demo

Start on the landing page. The page explains Harbor's scope, the Stacks/sBTC direction, and the reviewer path.

Open the business dashboard. A business can submit receivable details: invoice amount, debtor, due date, requested advance, and supporting description. In a real implementation, private documents would stay off-chain while hashes and lifecycle metadata can be coordinated on-chain.

Open a receivable detail page. Show the invoice metrics, verification status, and lifecycle timeline.

Move to the admin dashboard. The admin reviews the receivable through a manual checklist: business identity, debtor review, invoice authenticity, work delivery proof, and duplicate invoice checks. The admin can approve, reject, or fund approved demo receivables.

Open the liquidity pool. This shows mock sBTC deposits, available liquidity, deployed liquidity, and modeled repayment accounting.

Now open `/demo`. This is the clearest reviewer path. The deterministic local simulator is the primary walkthrough, so click through submit, approve, fund, record repayment, and settle without needing a wallet. Show the deployed Stacks testnet contract IDs and the Hiro Explorer links.

Then briefly show Optional Testnet Wallet Mode in its collapsed state. Open it and explain that technical reviewers can connect Leather or another Stacks Connect wallet and submit a safe `receivable-registry.submit-receivable` transaction on testnet.

## 1:40-2:20 - Technical Explanation

Harbor uses three Clarity contracts.

`mock-sbtc` is a demo token used to model sBTC-style liquidity. It is not real sBTC.

`receivable-registry` stores receivable metadata hashes, amount fields, lifecycle status, approval status, repayment status, and settlement state.

`liquidity-pool` tracks deposits, available liquidity, deployed liquidity, repayments, and simple fee/yield accounting for the MVP.

The `/demo` lifecycle simulator uses local UI state so reviewers can walk through the flow without a wallet. The deployed testnet contracts demonstrate the same coordination model on Stacks testnet.

Wallet Mode is optional. It allows signed testnet interaction for the safe user-side submit step, while admin-only actions like approval, funding, repayment recording, and settlement are intentionally not exposed from a connected reviewer wallet.

## 2:20-2:50 - What The MVP Proves

This MVP proves the basic verified receivable lifecycle: submit, manually verify, approve, fund, record repayment, and settle.

It also proves a manual approval workflow, mock sBTC pool accounting, funding and repayment tracking, and a transparent settlement model that can be inspected through Stacks contracts and frontend contract mapping.

## 2:50-3:00 - Closing

The grant will fund deeper Stacks integration, improved verification workflows, expanded read-only contract inspection, and production-readiness analysis before any real credit or real sBTC flow is considered.
