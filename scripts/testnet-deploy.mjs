import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ACTIONS = new Set(['plan', 'check', 'apply']);
const action = process.argv[2];
const root = process.cwd();
const secretPath = resolve(root, '.secrets/testnet-deployer.mnemonic');
const contractOrder = ['mock-sbtc', 'receivable-registry', 'liquidity-pool'];

if (!ACTIONS.has(action)) {
  console.error('Usage: node scripts/testnet-deploy.mjs <plan|check|apply>');
  process.exit(1);
}

function findClarinet() {
  const local = '/tmp/clarinet-bin/clarinet';
  if (existsSync(local)) return local;

  const result = spawnSync('sh', ['-lc', 'command -v clarinet'], { encoding: 'utf8' });
  const binary = result.stdout.trim();
  if (result.status === 0 && binary) return binary;

  console.error('Clarinet CLI not found. Install Clarinet or place the binary at /tmp/clarinet-bin/clarinet.');
  process.exit(1);
}

function getMnemonic() {
  const envMnemonic = process.env.HARBOR_TESTNET_DEPLOYER_MNEMONIC?.trim();
  if (envMnemonic) return envMnemonic;

  if (existsSync(secretPath)) {
    return readFileSync(secretPath, 'utf8').trim();
  }

  console.error('No testnet deployer mnemonic configured.');
  console.error('Safe options:');
  console.error('  1. Put the mnemonic in .secrets/testnet-deployer.mnemonic (gitignored).');
  console.error('  2. Export HARBOR_TESTNET_DEPLOYER_MNEMONIC for this shell session.');
  console.error('Do not put a real mnemonic in settings/Testnet.toml, docs, source files, or command logs.');
  process.exit(1);
}

function copyIntoWorkspace(workspace) {
  mkdirSync(join(workspace, 'contracts'), { recursive: true });
  mkdirSync(join(workspace, 'settings'), { recursive: true });
  mkdirSync(join(workspace, 'deployments'), { recursive: true });

  cpSync(join(root, 'Clarinet.toml'), join(workspace, 'Clarinet.toml'));
  for (const contract of ['mock-sbtc.clar', 'receivable-registry.clar', 'liquidity-pool.clar']) {
    cpSync(join(root, 'contracts', contract), join(workspace, 'contracts', contract));
  }

  if (action !== 'plan' && existsSync(join(root, 'deployments/default.testnet-plan.yaml'))) {
    cpSync(join(root, 'deployments/default.testnet-plan.yaml'), join(workspace, 'deployments/default.testnet-plan.yaml'));
  }
}

function writeTestnetSettings(workspace, mnemonic) {
  writeFileSync(
    join(workspace, 'settings/Testnet.toml'),
    `[network]
name = "testnet"

[accounts.deployer]
mnemonic = ${JSON.stringify(mnemonic)}
`,
    { mode: 0o600 },
  );
}

function runClarinet(workspace, args) {
  const clarinet = findClarinet();
  const result = spawnSync(clarinet, args, {
    cwd: workspace,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const output = `${result.stdout || ''}${result.stderr || ''}`;
  process.stdout.write(redact(output));

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function redact(output) {
  return output.replace(/[a-z]+(?: [a-z]+){11,23}/gi, '[redacted mnemonic-like text]');
}

function reorderPlan(planText) {
  const marker = '    - transaction-type: contract-publish\n';
  const firstTransactionIndex = planText.indexOf(marker);
  const epochIndex = planText.indexOf('\n    epoch:', firstTransactionIndex);
  if (firstTransactionIndex < 0 || epochIndex < 0) return planText;

  const header = planText.slice(0, firstTransactionIndex);
  const footer = planText.slice(epochIndex);
  const transactionText = planText.slice(firstTransactionIndex, epochIndex);
  const parts = transactionText.split(marker).filter(Boolean);
  const blocks = parts.map((part) => {
    const block = `${marker}${part}`;
    return block.endsWith('\n') ? block : `${block}\n`;
  });
  const blockByName = new Map();

  for (const block of blocks) {
    const match = block.match(/contract-name: ([^\n]+)/);
    if (match) blockByName.set(match[1].trim(), block);
  }

  const orderedBlocks = contractOrder.map((name) => blockByName.get(name)).filter(Boolean);
  const remainingBlocks = blocks.filter((block) => {
    const match = block.match(/contract-name: ([^\n]+)/);
    return !match || !contractOrder.includes(match[1].trim());
  });

  return `${header}${orderedBlocks.join('')}${remainingBlocks.join('')}${footer}`;
}

function sanitizePlan(planText) {
  return planText.replace(
    /bitcoin-node: http:\/\/[^:\s]+:[^@\s]+@bitcoind\.testnet\.stacks\.co:18332/g,
    'bitcoin-node: http://bitcoind.testnet.stacks.co:18332',
  );
}

function syncPlanToRepo(workspace) {
  const source = join(workspace, 'deployments/default.testnet-plan.yaml');
  if (!existsSync(source)) return '';

  const orderedPlan = sanitizePlan(reorderPlan(readFileSync(source, 'utf8')));
  const destination = join(root, 'deployments/default.testnet-plan.yaml');
  writeFileSync(destination, orderedPlan);
  return orderedPlan;
}

function parseExpectedSender(planText) {
  return planText.match(/expected-sender: ([A-Z0-9]+)/)?.[1] || '';
}

async function printReadiness(address) {
  if (!address) return;

  console.log(`Public testnet deployer: ${address}`);

  try {
    const response = await fetch(`https://api.testnet.hiro.so/extended/v1/address/${address}/balances`);
    if (!response.ok) {
      console.log(`Balance check unavailable: Stacks API returned ${response.status}.`);
      return;
    }
    const data = await response.json();
    const balanceMicroStx = BigInt(data?.stx?.balance ?? '0');
    const lockedMicroStx = BigInt(data?.stx?.locked ?? '0');
    const spendableMicroStx = balanceMicroStx - lockedMicroStx;
    console.log(`Spendable testnet STX: ${Number(spendableMicroStx) / 1_000_000}`);
    if (spendableMicroStx <= 0n) {
      console.log(`Fund this public testnet address before deployment: ${address}`);
    }
  } catch {
    console.log('Balance check unavailable: could not reach the Stacks testnet API.');
  }
}

const mnemonic = getMnemonic();
const workspace = mkdtempSync(join(tmpdir(), 'harbor-testnet-deploy-'));

try {
  copyIntoWorkspace(workspace);
  writeTestnetSettings(workspace, mnemonic);

  if (action === 'plan') {
    runClarinet(workspace, ['deployments', 'generate', '--testnet', '--manual-cost']);
    const plan = syncPlanToRepo(workspace);
    const address = parseExpectedSender(plan);
    await printReadiness(address);
  }

  if (action === 'check') {
    runClarinet(workspace, ['deployments', 'check']);
  }

  if (action === 'apply') {
    runClarinet(workspace, ['deployments', 'apply', '--testnet', '--no-dashboard', '--use-on-disk-deployment-plan']);
  }
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
