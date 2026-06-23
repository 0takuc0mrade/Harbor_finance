# Submission Package

Use this checklist for the final Stacks grant submission.

## Links To Fill In

- GitHub repo: `TODO: add public repository URL`
- Live demo: `TODO: add Vercel deployment URL`
- Primary reviewer route: `TODO: add Vercel deployment URL` `/demo`
- Demo video: `TODO: add video URL`

## Testnet Contract IDs

| Contract | Contract ID |
| --- | --- |
| mock-sbtc | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.mock-sbtc` |
| receivable-registry | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.receivable-registry` |
| liquidity-pool | `ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.liquidity-pool` |

## Explorer Links

- mock-sbtc: `https://explorer.hiro.so/txid/0x62905ce5da5c59e71f8ebec4e91ea07331449d6c0b5a0c7830926889828da1e6?chain=testnet`
- receivable-registry: `https://explorer.hiro.so/txid/0x90ea30b37b74fb2f7e2359c91f114266c3d4acc89544cb1a72ca5bb3d7b166aa?chain=testnet`
- liquidity-pool: `https://explorer.hiro.so/txid/0xc05a1d743b6677387cf1cc85b81276b6d9ba532d61d66c668f21a215d2daba00?chain=testnet`

## Included Docs

- Grant application answers: `docs/FINAL_GRANT_ANSWERS.md`
- README: `README.md`
- PRD: `docs/PRD.md`
- Reviewer guide: `docs/REVIEWER_GUIDE.md`
- Demo guide: `docs/DEMO_GUIDE.md`
- Demo video script: `docs/DEMO_VIDEO_SCRIPT.md`
- Screenshot checklist: `docs/SCREENSHOT_CHECKLIST.md`
- Contract documentation: `docs/CONTRACTS.md`
- Testnet deployment notes: `docs/TESTNET_DEPLOYMENT.md`
- Vercel deployment notes: `docs/VERCEL_DEPLOYMENT.md`

## Screenshots To Include

- `01-landing.png`
- `02-business-dashboard.png`
- `03-admin-verification.png`
- `04-liquidity-pool.png`
- `05-receivable-detail.png`
- `06-demo-lifecycle.png`
- `07-wallet-mode-collapsed.png`
- `08-wallet-mode-expanded.png`
- `09-contract-action-panel.png`
- `10-offchain-onchain-split.png`
- `11-testnet-status.png`
- `12-explorer-contracts.png`
- `13-tests-passing.png`
- `14-leather-signing-optional.png`

## Passing Test Commands

Run and capture the final terminal output:

```bash
npm run lint
npm run build
npm run contracts:check
npm run contracts:test
npm run contracts:deploy:testnet:check
```

## Final Notes

- The frontend lifecycle simulator uses local UI state.
- The deployed contracts are on Stacks testnet.
- `mock-sbtc` is a demo token for modeling sBTC-style liquidity.
- Optional Wallet Mode supports safe user-side testnet submission only.
- No production credit, guaranteed yield, or instant financing claims should be added to the submission.
