# Testnet Deployment

Harbor Finance contracts are deployed to Stacks testnet. No funded deployer wallet secret is committed to this repository.

## Current Deployment Status

See:

```text
deployments/deployment-status.json
```

Current status:

```text
deployed
```

Deployment date:

```text
2026-06-22T23:20:00Z
```

Deployer:

```text
ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV
```

Contracts:

| Contract | Contract ID | Explorer |
| --- | --- | --- |
| `mock-sbtc` | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.mock-sbtc` | https://explorer.hiro.so/txid/0x62905ce5da5c59e71f8ebec4e91ea07331449d6c0b5a0c7830926889828da1e6?chain=testnet |
| `receivable-registry` | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.receivable-registry` | https://explorer.hiro.so/txid/0x90ea30b37b74fb2f7e2359c91f114266c3d4acc89544cb1a72ca5bb3d7b166aa?chain=testnet |
| `liquidity-pool` | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.liquidity-pool` | https://explorer.hiro.so/txid/0xc05a1d743b6677387cf1cc85b81276b6d9ba532d61d66c668f21a215d2daba00?chain=testnet |

The frontend `/demo` page reads public environment variables and `deployments/deployment-status.json` to display deployed contract IDs and explorer links.

## Prerequisites

- Clarinet CLI `3.20.0` or compatible
- Stacks testnet deployer wallet
- Testnet STX for deployment fees
- Local-only deployer mnemonic/private key configuration
- Network access to Stacks testnet

Do not commit private keys, mnemonics, seed phrases, or funded wallet secrets.

## Create or Use a Testnet Deployer Wallet

1. Create a Stacks testnet wallet using your preferred wallet tooling.
2. Record the testnet address.
3. Keep the mnemonic/private key outside git.
4. Configure the deployer locally using one of the safe methods below.

Clarinet `3.20.0` expects this shape inside `settings/Testnet.toml`:

```toml
[accounts.deployer]
mnemonic = "..."
```

Because `settings/Testnet.toml` is tracked, do not put a real mnemonic there. The package deployment scripts use `scripts/testnet-deploy.mjs`, which writes the mnemonic only into a temporary workspace under `/tmp`.

Safe local options:

```bash
mkdir -p .secrets
chmod 700 .secrets
printf '%s' '<your testnet mnemonic>' > .secrets/testnet-deployer.mnemonic
chmod 600 .secrets/testnet-deployer.mnemonic
```

or:

```bash
export HARBOR_TESTNET_DEPLOYER_MNEMONIC='<your testnet mnemonic>'
```

`.secrets/`, `.env*`, `*.mnemonic`, `*.seed`, `*.private-key`, and `*.key` are gitignored.

## Fund the Deployer

Use a Stacks testnet faucet to send testnet STX to the deployer address. Confirm funds on the Hiro Explorer before applying a deployment.

## Deployment Order

Deploy in this order:

1. `mock-sbtc`
2. `receivable-registry`
3. `liquidity-pool`

This keeps the demo token and registry available before pool operations.

## Commands

Generate a testnet deployment plan:

```bash
npm run contracts:deploy:testnet:plan
```

This command derives and prints only the public testnet deployer address, checks its spendable testnet STX balance through the public Hiro testnet API, and writes a non-secret deployment plan to `deployments/default.testnet-plan.yaml`.

Check deployment plan formatting:

```bash
npm run contracts:deploy:testnet:check
```

Apply the deployment to Stacks testnet:

```bash
npm run contracts:deploy:testnet
```

The scripts map to Clarinet `3.20.0` commands:

```bash
clarinet deployments generate --testnet --manual-cost
clarinet deployments check
clarinet deployments apply --testnet --no-dashboard
```

## Update `.env.local`

After deployment, create or update `.env.local`:

```bash
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_STACKS_EXPLORER_BASE_URL=https://explorer.hiro.so
NEXT_PUBLIC_MOCK_SBTC_ADDRESS=ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV
NEXT_PUBLIC_MOCK_SBTC_CONTRACT=mock-sbtc
NEXT_PUBLIC_RECEIVABLE_REGISTRY_ADDRESS=ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV
NEXT_PUBLIC_RECEIVABLE_REGISTRY_CONTRACT=receivable-registry
NEXT_PUBLIC_LIQUIDITY_POOL_ADDRESS=ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV
NEXT_PUBLIC_LIQUIDITY_POOL_CONTRACT=liquidity-pool
```

Restart the frontend after changing environment variables.

## Update Deployment Status

`deployments/deployment-status.json` has been updated with:

- `status: "deployed"`
- deployer address
- each contract address
- each contract ID
- explorer URLs
- `lastUpdated` ISO timestamp

Contract ID format:

```text
<deployer-address>.<contract-name>
```

## Verify on Explorer

Use the configured explorer base URL:

```text
https://explorer.hiro.so
```

Confirm the deployer address and deployed contract publish transactions on Stacks testnet using the links above.

## What Remains Mocked

- `mock-sbtc` is still a demo token, not real sBTC.
- Repayment confirmation remains admin-controlled.
- Real invoice documents and legal checks remain off-chain.
- The frontend `/demo` lifecycle simulator still uses local UI state.
- Optional Wallet Mode supports safe user-side testnet submission and read-only inspection only.

## Production sBTC Integration Requirements

Production or real testnet sBTC integration would require:

- Replacing `mock-sbtc` with the appropriate sBTC contract/interface.
- Security review of token transfer assumptions.
- Wallet transaction flow and user permissions.
- Operational controls for admin actions.
- Legal/compliance design for receivable assignment and repayment handling.
- Expanded tests and audits.
