export type ContractLayer = 'On-chain metadata/lifecycle' | 'On-chain token/accounting' | 'Off-chain process';

export interface ContractFunctionMeta {
  name: string;
  purpose: string;
  layer: ContractLayer;
}

export interface ContractMeta {
  name: string;
  path: string;
  lifecycleRole: string;
  explanation: string;
  functions: ContractFunctionMeta[];
}

export const CONTRACTS: ContractMeta[] = [
  {
    name: 'mock-sbtc',
    path: 'contracts/mock-sbtc.clar',
    lifecycleRole: 'Demo liquidity token',
    explanation:
      'A simple SIP-010-like token used to represent sBTC-style liquidity in local and testnet demos. It is not real sBTC.',
    functions: [
      {
        name: 'mint',
        layer: 'On-chain token/accounting',
        purpose: 'Admin mints demo liquidity for providers or repayment simulation.',
      },
      {
        name: 'transfer',
        layer: 'On-chain token/accounting',
        purpose: 'Moves mock sBTC between providers, the pool, businesses, and repayment accounts.',
      },
      {
        name: 'get-balance',
        layer: 'On-chain token/accounting',
        purpose: 'Reads a participant mock sBTC balance.',
      },
    ],
  },
  {
    name: 'receivable-registry',
    path: 'contracts/receivable-registry.clar',
    lifecycleRole: 'Receivable lifecycle source of truth',
    explanation:
      'Stores metadata hashes, lifecycle status, approved advance amount, and admin lifecycle actions for each receivable.',
    functions: [
      {
        name: 'submit-receivable',
        layer: 'On-chain metadata/lifecycle',
        purpose: 'Creates an auditable receivable record without storing private invoice documents on-chain.',
      },
      {
        name: 'approve-receivable',
        layer: 'On-chain metadata/lifecycle',
        purpose: 'Records that an admin approved the receivable and the permitted advance amount.',
      },
      {
        name: 'reject-receivable',
        layer: 'On-chain metadata/lifecycle',
        purpose: 'Prevents a receivable from moving into funding after failed verification.',
      },
      {
        name: 'mark-funded',
        layer: 'On-chain metadata/lifecycle',
        purpose: 'Moves an approved receivable into funded status.',
      },
      {
        name: 'mark-repaid',
        layer: 'On-chain metadata/lifecycle',
        purpose: 'Records admin-confirmed repayment in the lifecycle.',
      },
      {
        name: 'mark-settled',
        layer: 'On-chain metadata/lifecycle',
        purpose: 'Closes the lifecycle after repayment and pool accounting are complete.',
      },
    ],
  },
  {
    name: 'liquidity-pool',
    path: 'contracts/liquidity-pool.clar',
    lifecycleRole: 'Pooled mock sBTC accounting',
    explanation:
      'Tracks provider deposits, available liquidity, deployed liquidity, repayments, and simple yield for the MVP pool.',
    functions: [
      {
        name: 'deposit',
        layer: 'On-chain token/accounting',
        purpose: 'Lets liquidity providers deposit mock sBTC into the demo pool.',
      },
      {
        name: 'withdraw',
        layer: 'On-chain token/accounting',
        purpose: 'Lets providers withdraw unused liquidity within their provider balance.',
      },
      {
        name: 'fund-receivable',
        layer: 'On-chain token/accounting',
        purpose: 'Deploys pool liquidity to an approved receivable and coordinates registry funded status.',
      },
      {
        name: 'record-repayment',
        layer: 'On-chain token/accounting',
        purpose: 'Records principal plus yield returning to the pool and coordinates registry repaid status.',
      },
      {
        name: 'get-pool-stats',
        layer: 'On-chain token/accounting',
        purpose: 'Reads total deposits, available liquidity, deployed liquidity, total repaid, and yield.',
      },
    ],
  },
];

export function getContractMeta(name: string) {
  return CONTRACTS.find((contract) => contract.name === name);
}
