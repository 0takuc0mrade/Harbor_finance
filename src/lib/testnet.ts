import deploymentStatus from '../../deployments/deployment-status.json';

type ContractKey = 'mock-sbtc' | 'receivable-registry' | 'liquidity-pool';

interface EnvContractConfig {
  key: ContractKey;
  label: string;
  address?: string;
  contractName?: string;
}

const EXPLORER_BASE_URL = process.env.NEXT_PUBLIC_STACKS_EXPLORER_BASE_URL || 'https://explorer.hiro.so';
const NETWORK = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';

const CONTRACT_CONFIGS: EnvContractConfig[] = [
  {
    key: 'mock-sbtc',
    label: 'mock-sbtc',
    address: process.env.NEXT_PUBLIC_MOCK_SBTC_ADDRESS,
    contractName: process.env.NEXT_PUBLIC_MOCK_SBTC_CONTRACT || 'mock-sbtc',
  },
  {
    key: 'receivable-registry',
    label: 'receivable-registry',
    address: process.env.NEXT_PUBLIC_RECEIVABLE_REGISTRY_ADDRESS,
    contractName: process.env.NEXT_PUBLIC_RECEIVABLE_REGISTRY_CONTRACT || 'receivable-registry',
  },
  {
    key: 'liquidity-pool',
    label: 'liquidity-pool',
    address: process.env.NEXT_PUBLIC_LIQUIDITY_POOL_ADDRESS,
    contractName: process.env.NEXT_PUBLIC_LIQUIDITY_POOL_CONTRACT || 'liquidity-pool',
  },
];

function buildContractId(address?: string, contractName?: string) {
  if (!address || !contractName) return '';
  return `${address}.${contractName}`;
}

export function buildExplorerContractUrl(contractId: string) {
  if (!contractId) return '';
  const [address] = contractId.split('.');
  const search = NETWORK === 'testnet' ? '?chain=testnet' : '';
  return `${EXPLORER_BASE_URL}/address/${address}${search}`;
}

export function getTestnetContracts() {
  return CONTRACT_CONFIGS.map((config) => {
    const fallback = deploymentStatus.contracts[config.key];
    const address = config.address || fallback.address;
    const contractName = config.contractName || fallback.contractName;
    const contractId = buildContractId(address, contractName) || fallback.contractId;
    return {
      key: config.key,
      label: config.label,
      address,
      contractName,
      contractId,
      explorerUrl: fallback.explorerUrl || (contractId ? buildExplorerContractUrl(contractId) : ''),
      configured: Boolean(contractId),
    };
  });
}

export function getTestnetDeploymentStatus() {
  return {
    network: NETWORK,
    displayNetwork: NETWORK === 'testnet' ? 'Stacks Testnet' : NETWORK,
    status: deploymentStatus.status,
    explorerBaseUrl: EXPLORER_BASE_URL,
    contracts: getTestnetContracts(),
  };
}
