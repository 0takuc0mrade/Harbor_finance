# Harbor Finance — MVP Scope

## Purpose

This document defines what is included in the Harbor Finance MVP and what is explicitly deferred. The MVP is a **grant-ready demo** that demonstrates the core receivables financing flow on a Stacks/sBTC foundation.

---

## In Scope

### Core Features

| Feature | Status | Description |
|---------|--------|------------|
| Receivable Submission | ✅ Implemented | Businesses can submit invoices with all required fields |
| Lifecycle Tracking | ✅ Implemented | Full status progression: Submitted → Funded → Settled |
| Admin Verification | ✅ Implemented | Structured 5-point checklist with approve/reject |
| Advance Rate Setting | ✅ Implemented | Admin sets final advance percentage per receivable |
| Risk Notes | ✅ Implemented | Admin attaches risk assessment notes |
| Mock Liquidity Pool | ✅ Implemented | sBTC pool with deposit, utilization, and yield display |
| Funding Flow | ✅ Implemented | Approved receivables can be funded from the pool |
| Lifecycle Timeline | ✅ Implemented | Chronological event log per receivable |
| Detail Page | ✅ Implemented | Full metadata, on-chain records, and verification status |
| Landing Page | ✅ Implemented | Clear project explanation for grant reviewers |

### User Roles

| Role | Capabilities |
|------|-------------|
| Business | Submit receivables, view status, track lifecycle |
| Admin | Review queue, run verification checklist, approve/reject, fund |
| Liquidity Provider | Deposit sBTC, view pool metrics, see funded receivables |

### Technical

| Item | Status |
|------|--------|
| Next.js App Router | ✅ |
| TypeScript | ✅ |
| TailwindCSS | ✅ |
| React Context state management | ✅ |
| Mock data with realistic receivables | ✅ |
| Responsive design | ✅ |
| Dark mode UI | ✅ |
| Component architecture ready for extension | ✅ |

---

## Out of Scope

### Deferred to Post-MVP

| Feature | Reason |
|---------|--------|
| Real KYC/KYB verification | Requires third-party identity provider integration |
| Legal SPV entity | Requires legal structure and jurisdiction setup |
| Automated credit underwriting | Requires credit bureau APIs and scoring models |
| Bank account integration | Requires banking partner and fiat rails |
| Secondary markets | Receivable trading is a complex feature beyond MVP |
| Multi-token support | MVP uses sBTC only |
| Production risk scoring | Requires historical data and ML models |
| Expanded wallet flows | Current Wallet Mode only supports safe user-side testnet submission |
| Admin on-chain wallet actions | Admin-only calls require deployer/admin permissions and are not exposed in frontend |
| Real sBTC transfers | MVP uses mock transactions |
| User authentication | No login/session management in MVP |
| Data persistence | State resets on page refresh (by design) |
| Email notifications | No notification system in MVP |
| Production audit logging | Current contracts demonstrate lifecycle/accounting only |
| Multi-signature administration | Requires governance framework |

---

## Success Criteria

The MVP is successful if:

1. **Runs locally** without errors.
2. **All pages render** and are navigable.
3. A **grant reviewer can understand the project** in under 2 minutes by reading the landing page.
4. The **receivable lifecycle** is clearly demonstrated through mock data.
5. The **verification flow** (admin checklist → approve/reject) works interactively.
6. The **liquidity pool** displays realistic metrics and accepts mock deposits.
7. **No production claims** are made anywhere in the UI or documentation.
8. The code is **clean, typed, and easy to extend** with real backend/blockchain integrations.

---

## MVP Limitations (Acknowledged)

- No persistent data — refresh resets state.
- Deployed contracts are on Stacks testnet, but the primary lifecycle walkthrough uses local UI state.
- Wallet Mode is optional and limited to safe user-side testnet submission/read-only inspection.
- No authentication — anyone can access any dashboard.
- No real financial calculations — yield and APR are illustrative.
- Single-user experience — no multi-tenancy or access control.

These limitations are intentional for a controlled grant MVP and are clearly communicated in the UI.
