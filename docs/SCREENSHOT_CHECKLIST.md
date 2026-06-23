# Screenshot Checklist

Use this checklist when preparing grant submission materials. Save screenshots with the exact filenames below.

| File name | Capture |
| --- | --- |
| `01-landing.png` | Landing page hero with "View Grant Demo" CTA |
| `02-business-dashboard.png` | `/dashboard` business receivables dashboard |
| `03-admin-verification.png` | `/admin` verification queue with checklist visible |
| `04-liquidity-pool.png` | `/pool` mock sBTC pool overview and funded receivables |
| `05-receivable-detail.png` | `/receivable/RCV-001` lifecycle timeline and receivable metrics |
| `06-demo-lifecycle.png` | `/demo` lifecycle simulator after at least one step is advanced |
| `07-wallet-mode-collapsed.png` | `/demo` Optional Testnet Wallet Mode collapsed |
| `08-wallet-mode-expanded.png` | `/demo` Optional Testnet Wallet Mode expanded |
| `09-contract-action-panel.png` | `/demo` contract action panel showing mapped contract/function |
| `10-offchain-onchain-split.png` | `/demo` off-chain vs on-chain boundary section |
| `11-testnet-status.png` | `/demo` Testnet Status section with all contract IDs visible |
| `12-explorer-contracts.png` | Hiro Explorer page or pages showing deployed testnet contracts/transactions |
| `13-tests-passing.png` | Terminal showing final checks passing |
| `14-leather-signing-optional.png` | Optional Leather/Stacks Connect signing screen if manually captured |

## Terminal Output To Capture

For `13-tests-passing.png`, include the final passing output from:

```bash
npm run lint
npm run build
npm run contracts:check
npm run contracts:test
npm run contracts:deploy:testnet:check
```

## Notes

- Do not include `.secrets`, private keys, mnemonics, or `.env.local` in screenshots.
- Prefer `/demo` screenshots that show the testnet contract IDs clearly.
- Only include `14-leather-signing-optional.png` if you manually test Wallet Mode in the browser.
- Use the deployed Vercel URL for public demo screenshots once available.
