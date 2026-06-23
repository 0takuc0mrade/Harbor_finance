# Harbor Finance — Product Requirements Document

## Overview

Harbor Finance is a Bitcoin-native receivables financing MVP built on Stacks. It demonstrates how verified unpaid invoices can move through manual review, mock sBTC-style pool accounting, and transparent lifecycle coordination.

Harbor is **not** an NFT marketplace, a speculative DeFi protocol, or a lending platform. It is a structured receivables financing facility where every step — submission, verification, funding, repayment, and settlement — is transparent and auditable.

---

## Problem

Small and medium businesses routinely wait 30–90 days for invoice payments. This creates cash flow gaps that limit growth, delay payroll, and prevent new project intake. Traditional invoice factoring is:

- **Opaque** — businesses don't see the full funding chain.
- **Expensive** — high fees driven by intermediary overhead.
- **Slow** — manual underwriting and bank settlement delays.
- **Inaccessible** — smaller businesses are often excluded.

---

## Solution

Harbor provides a transparent, Bitcoin-settled alternative:

1. **Submit**: A business submits a verified unpaid invoice/receivable.
2. **Verify**: An admin reviews the submission against a structured checklist.
3. **Fund**: Approved receivables are modeled through a mock sBTC liquidity pool at a negotiated advance rate (typically 65-85%).
4. **Repay**: When the debtor pays the original invoice, the advance is repaid with a small fee.
5. **Settle**: Settlement is recorded on Stacks. Pool accounting tracks returned principal and modeled fee/yield amounts.

---

## Users

### Business (Submitter)
- Has completed work or delivered goods.
- Holds an unpaid invoice from a creditworthy debtor.
- Needs working capital before the invoice due date.

### Admin (Verifier)
- Reviews submitted receivables for legitimacy.
- Runs a structured verification checklist.
- Sets final advance terms and adds risk notes.
- Approves or rejects submissions.

### Liquidity Provider (LP)
- Deposits sBTC into the liquidity pool.
- Capital is deployed to fund approved receivables.
- Earns yield from repayment fees when receivables settle.

---

## Receivable Lifecycle

```
Submitted → Under Review → Approved → Funded → Repaid → Settled
                 ↓
              Rejected
                              Funded → Defaulted (edge case)
```

### Status Definitions

| Status | Description |
|--------|------------|
| Submitted | Invoice entered the review queue |
| Under Review | Admin has started the verification checklist |
| Approved | Passed verification; ready for funding |
| Funded | sBTC disbursed from liquidity pool |
| Repaid | Debtor has paid; advance repaid |
| Settled | Yield distributed; lifecycle complete |
| Rejected | Did not pass verification |
| Defaulted | Repayment not received by due date |

---

## Verification Checklist

Each receivable must pass five checks before approval:

1. **Business Identity Reviewed** — Confirm the submitting business is registered and operational.
2. **Debtor / Client Reviewed** — Verify the debtor entity and payment history.
3. **Invoice Authenticity Reviewed** — Confirm invoice details and supporting documentation.
4. **Work / Delivery Proof Reviewed** — Verify that goods or services were delivered.
5. **Duplicate Invoice Check** — Ensure no duplicate submission or double-financing.

---

## Why Stacks & sBTC

| Feature | Benefit |
|---------|---------|
| Bitcoin finality | Stacks settles on Bitcoin L1 — maximum security |
| sBTC | 1:1 BTC-pegged asset — real Bitcoin value in contracts |
| Clarity | Decidable language — predictable, auditable contract logic |
| Post-Nakamoto | ~5s blocks — practical for financial operations |

---

## MVP Boundaries

This MVP is a **demo-grade prototype** for grant evaluation. It demonstrates the core flow and user experience. It is **not** a production financial product.

### Explicitly Not Included
- Real KYC/KYB verification
- Legal SPV entity structure
- Automated credit underwriting or risk scoring
- Bank or fiat payment integration
- Secondary markets or receivable trading
- Multi-signature custody
- Regulatory compliance framework
