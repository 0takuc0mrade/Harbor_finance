# Harbor Finance — Architecture

## System Overview

Harbor Finance is designed as a three-layer system. The MVP implements the frontend layer with mock data. The backend and smart contract layers are placeholders for future development.

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (MVP)                     │
│  Next.js + TypeScript + TailwindCSS                  │
│  React Context for state • Mock data                 │
├─────────────────────────────────────────────────────┤
│                 Backend (Planned)                     │
│  API server • Database • Auth • KYC integration      │
│  Off-chain verification logic • Event indexing       │
├─────────────────────────────────────────────────────┤
│              Smart Contracts (Planned)                │
│  Clarity contracts on Stacks                         │
│  sBTC pool management • Receivable registry          │
│  Funding disbursement • Settlement logic             │
└─────────────────────────────────────────────────────┘
                         │
                    Bitcoin L1
              (Stacks settles here)
```

---

## Frontend Architecture (Current — MVP)

### Framework
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **TailwindCSS 4** for styling

### State Management
- **React Context** (`HarborProvider`) manages all application state.
- State is initialized from mock data and modified through context actions.
- No persistence — state resets on page refresh (by design for MVP).

### Component Architecture

```
Layout (Navbar + Context Provider)
├── Landing Page (static content)
├── Business Dashboard
│   ├── DashboardStats
│   ├── ReceivableForm
│   └── ReceivableCard[]
├── Admin Dashboard
│   ├── DashboardStats
│   ├── Queue List
│   ├── VerificationChecklist
│   └── LifecycleTimeline
├── Liquidity Pool
│   ├── DashboardStats
│   ├── PoolStats
│   ├── Deposit Form
│   └── Funded Receivables List
└── Receivable Detail
    ├── Key Metrics
    ├── On-Chain Records
    ├── VerificationChecklist (read-only)
    └── LifecycleTimeline
```

### Routing

| Route | Page | Description |
|-------|------|------------|
| `/` | Landing | Project overview and flow explanation |
| `/dashboard` | Business Dashboard | Submit and track receivables |
| `/admin` | Admin Dashboard | Verify, approve, reject, and fund |
| `/pool` | Liquidity Pool | Deposit sBTC and view pool metrics |
| `/receivable/[id]` | Detail | Full receivable lifecycle view |

---

## Backend Architecture (Planned)

### API Server
- RESTful API for receivable CRUD, user management, and pool operations.
- Authentication via wallet connection (Stacks wallet) and session management.
- Database for persisting receivable data, verification state, and user profiles.

### Key Services
- **Receivable Service**: Manages submission, status transitions, and metadata.
- **Verification Service**: Handles admin workflows, checklist state, and risk scoring.
- **Pool Service**: Tracks deposits, withdrawals, utilization, and yield calculations.
- **Indexer Service**: Monitors on-chain events (funding, repayment, settlement) and syncs state.

### Integrations (Future)
- **KYC/KYB Provider**: Identity verification for businesses and debtors.
- **Credit Bureau API**: Debtor creditworthiness assessment.
- **Notification Service**: Email/webhook notifications for status changes.

---

## Smart Contract Architecture (Planned)

### Contracts

#### `harbor-pool.clar`
- Manages the sBTC liquidity pool.
- Handles deposits, withdrawals, and utilization tracking.
- Calculates and distributes yield to LPs.

#### `harbor-receivable.clar`
- Registers receivables on-chain.
- Records status transitions with timestamps.
- Stores verification metadata (hash of checklist, admin address).

#### `harbor-funding.clar`
- Orchestrates the funding flow.
- Transfers sBTC from pool to business upon approval.
- Handles repayment receipt and fee calculation.

#### `harbor-settlement.clar`
- Manages the settlement process.
- Distributes repayment: principal back to pool, yield to LPs.
- Records final settlement state on-chain.

### Contract Interactions

```
Business submits receivable
    → harbor-receivable registers on-chain
    → Admin approves (off-chain + on-chain status update)
    → harbor-funding pulls sBTC from harbor-pool
    → sBTC transferred to business
    → Debtor pays → repayment received
    → harbor-settlement distributes funds
    → harbor-pool updated with returned principal + yield
```

### sBTC Integration
- All funding and repayment is denominated in sBTC.
- sBTC is a trust-minimized, 1:1 Bitcoin-pegged asset on Stacks.
- Smart contracts interact with sBTC through the SIP-010 fungible token interface.

---

## Security Considerations (Future)

- **Access control**: Admin functions gated by principal-based authorization in Clarity.
- **Reentrancy protection**: Not applicable in Clarity (single-threaded execution model).
- **Arithmetic safety**: Clarity provides native overflow/underflow protection.
- **Audit trail**: All state transitions recorded on-chain with timestamps.
- **Multi-sig**: Pool admin operations should require multi-signature approval.

---

## Deployment Strategy (Future)

1. **Testnet**: Deploy contracts to Stacks testnet. Frontend connects via Stacks.js.
2. **Mainnet**: After audit and testing, deploy to Stacks mainnet.
3. **Frontend**: Deploy to Vercel or similar. API server on managed infrastructure.
