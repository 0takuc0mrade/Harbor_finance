# Vercel Deployment

Use this guide to deploy Harbor Finance as a public grant demo.

## Deploy To Vercel

1. Push the repository to GitHub.
2. In Vercel, create a new project from the GitHub repo.
3. Use the Next.js framework preset.
4. Use `npm install` as the install command.
5. Use `npm run build` as the build command.
6. Set the environment variables below for Production, Preview, and Development as needed.
7. Deploy.

## Project Settings

- Framework: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: Vercel default for Next.js

## Build Command

```bash
npm run build
```

The start command is handled by Vercel for Next.js projects.

## Required Public Environment Variables

These values are public testnet metadata only. They are safe to expose in the browser.

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

## Routes To Verify After Deployment

- `/`
- `/dashboard`
- `/admin`
- `/pool`
- `/demo`
- `/receivable/RCV-001`

## Expected Behavior

- The landing page should show "View Grant Demo" and "Read Documentation" CTAs.
- `/demo` should be the clearest reviewer path.
- The lifecycle simulator should work without a wallet.
- Optional Wallet Mode should be collapsed by default and expandable.
- Wallet Mode should allow connecting a Stacks testnet wallet in a browser with Leather/Stacks Connect support.
- Contract action panels should show the mapped Clarity contract functions.
- Testnet status should show the deployed Stacks testnet contract IDs.
- Explorer links should open in a new tab.
- Dashboards should use local mock state and remain interactive.

## Confirm `/demo` Shows Testnet Contracts

Open:

```text
https://YOUR-VERCEL-URL/demo
```

Confirm the Testnet Status section includes:

```text
ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.mock-sbtc
ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.receivable-registry
ST1MMSQCF1MPF5R6CWCCBC8Z9R6DH2PZ8QCCCDHZV.liquidity-pool
```

Click each explorer link and confirm it opens the Hiro Explorer transaction page on testnet.

## What Not To Expose

Do not add any secret values to Vercel environment variables or public docs:

- Deployer mnemonic
- Private keys
- Wallet seed phrases
- `.secrets/*`
- `.env.local`
- Mainnet credentials
- Any user/customer/private invoice documents

Only `NEXT_PUBLIC_*` testnet metadata should be configured for the public demo.

## Update The Grant Form

After deployment:

1. Copy the Vercel production URL.
2. Add it to the grant application as the live demo URL.
3. Use `/demo` as the primary reviewer route.
4. Include the GitHub repo link, demo video link, and testnet contract explorer links.
5. Reference `docs/FINAL_GRANT_ANSWERS.md` for copy-paste application answers.
