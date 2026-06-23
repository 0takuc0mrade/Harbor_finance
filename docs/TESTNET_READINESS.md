# Testnet Readiness

Harbor Finance is verified locally with Clarinet and deployed to Stacks testnet using mock sBTC contracts.

## Current Deployment State

Currently deployed:

- `contracts/mock-sbtc.clar`
- `contracts/receivable-registry.clar`
- `contracts/liquidity-pool.clar`
- Clarinet simnet deployment plan
- Clarinet SDK tests
- Frontend `/demo` simulator using local UI state

Public testnet deployer:

```text
ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV
```

Public contract IDs are recorded in `deployments/deployment-status.json`.

## Needed for Stacks Testnet Deployment

- Stacks testnet wallet controlled by the deployer
- Testnet STX from a faucet for deployment fees
- Clarinet CLI installed locally
- Review of current contract assumptions and admin principal behavior
- Deployment plan generated for testnet
- Frontend environment variables configured with deployed contract addresses

## Wallet and Faucet Prerequisites

1. Create or select a Stacks testnet wallet.
2. Fund it with testnet STX.
3. Keep private keys and seed phrases out of the repository.
4. Store deployment secrets only in `.secrets/testnet-deployer.mnemonic`, `HARBOR_TESTNET_DEPLOYER_MNEMONIC`, local environment files, or secure CI secrets.
5. Never edit tracked `settings/Testnet.toml` with a real mnemonic.

## Deployment Order

Deploy contracts in this order:

1. `mock-sbtc`
2. `receivable-registry`
3. `liquidity-pool`

This order keeps token and registry dependencies available before pool interactions.

## Clarinet Next Steps

Suggested flow:

```bash
npm run contracts:check
npm run contracts:deploy:testnet:plan
npm run contracts:deploy:testnet:check
npm run contracts:deploy:testnet
```

Review the generated deployment plan before applying it. Do not commit secrets.

See [TESTNET_DEPLOYMENT.md](TESTNET_DEPLOYMENT.md) for the full deployment guide and status update process.

## Environment Variables

Use `.env.local` for local frontend configuration:

```bash
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_RECEIVABLE_REGISTRY_ADDRESS=
NEXT_PUBLIC_RECEIVABLE_REGISTRY_CONTRACT=receivable-registry
NEXT_PUBLIC_LIQUIDITY_POOL_ADDRESS=
NEXT_PUBLIC_LIQUIDITY_POOL_CONTRACT=liquidity-pool
NEXT_PUBLIC_MOCK_SBTC_ADDRESS=
NEXT_PUBLIC_MOCK_SBTC_CONTRACT=mock-sbtc
```

See `.env.example` for placeholders.

## Frontend Contract Address Configuration

The frontend should eventually read contract metadata from environment variables and expose:

- Receivable registry contract principal
- Liquidity pool contract principal
- Mock sBTC or real sBTC contract principal
- Selected Stacks network

The current `/demo` route uses local UI state and contract metadata only. It does not submit transactions.

## Known Limitations

- `mock-sbtc` is not real sBTC.
- Deployment account ownership affects admin-only contract functions.
- The pool uses simple provider balances, not production share accounting.
- Wallet transaction UX has not been implemented.
- Real repayment enforcement remains off-chain.
- Production use would require legal, compliance, security, and operational work beyond this MVP.
