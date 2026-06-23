# Harbor Finance Contracts

Harbor Finance uses a small Clarinet project to demonstrate the on-chain lifecycle for Bitcoin-native receivables financing. These contracts are MVP coordination contracts: they record state, move mock sBTC, and make lifecycle transitions auditable. They do not enforce real-world payment, legal rights, KYC, KYB, credit underwriting, or collections.

## Contracts

### `mock-sbtc.clar`

`mock-sbtc` is a simple SIP-010-like fungible token used only for local and testnet-style demos.

- The deployer/admin can mint mock sBTC.
- Token holders can transfer balances.
- Anyone can read balances and total supply.
- The token represents demo liquidity, not real sBTC.

### `receivable-registry.clar`

`receivable-registry` is the source of truth for receivable lifecycle state.

Each receivable stores:

- Receivable ID
- Business principal
- Debtor hash
- Invoice amount
- Requested advance amount
- Approved advance amount
- Due block height
- Metadata hash
- Status
- Creation block height
- Optional approving admin

Lifecycle statuses are encoded as integers:

| Code | Status |
|------|--------|
| `u1` | Submitted |
| `u2` | Approved |
| `u3` | Funded |
| `u4` | Repaid |
| `u5` | Settled |
| `u6` | Rejected |
| `u7` | Defaulted |

Allowed happy path:

```text
submit -> approve -> fund -> repay -> settle
```

The admin can also reject a submitted receivable or mark a funded receivable as defaulted. Invalid transitions fail. For example, a submitted receivable cannot be funded, and a funded receivable cannot be settled until repayment has been recorded.

### `liquidity-pool.clar`

`liquidity-pool` manages pooled mock sBTC accounting.

Liquidity providers can:

- Deposit mock sBTC.
- Withdraw unused liquidity up to their provider balance and the pool's available liquidity.
- Read their provider balance.

The admin can:

- Fund an approved receivable.
- Record repayment with principal plus yield.

`fund-receivable` and `record-repayment` accept a registry contract that implements the pool's small registry trait. This keeps the pool interface explicit while still coordinating lifecycle transitions with `receivable-registry`.

Pool stats track:

- Total deposits
- Available liquidity
- Deployed liquidity
- Total repaid principal
- Total yield

Funding reduces available liquidity and increases deployed liquidity. Repayment transfers mock sBTC back into the pool, increases available liquidity, reduces deployed liquidity, and increments total repaid and total yield.

## Mocked Behavior

This MVP intentionally mocks or simplifies:

- sBTC with `mock-sbtc`.
- Debtor identity and invoice documents as hashes.
- Real-world repayment as an admin-recorded event.
- Yield as a simple explicit amount supplied during repayment.
- Provider accounting as simple deposit balances, not pool shares.

## Out of Scope

The contract MVP does not include:

- Real sBTC integration
- KYC/KYB
- Legal SPV or assignment enforcement
- Fiat rails or bank integration
- Automated underwriting
- Oracles
- Secondary markets
- Fractional receivable ownership
- DAO/governance
- Cross-chain settlement logic

## Why Contracts Coordinate But Do Not Enforce Repayment

Receivables are claims on off-chain invoices. A smart contract can record that a receivable was approved, funded, repaid, and settled, but it cannot force an off-chain debtor to pay an invoice. Harbor's MVP uses contracts for transparent coordination and auditability while leaving real-world verification, legal rights, and collections outside the prototype.
