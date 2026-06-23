// Harbor Finance - Core Types

export type ReceivableStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'funded'
  | 'repaid'
  | 'settled'
  | 'rejected'
  | 'defaulted';

export interface Receivable {
  id: string;
  businessName: string;
  debtorName: string;
  invoiceAmount: number;
  requestedAdvancePercent: number;
  finalAdvancePercent?: number;
  advanceAmount?: number;
  dueDate: string;
  invoiceReference: string;
  description: string;
  status: ReceivableStatus;
  submittedAt: string;
  updatedAt: string;
  riskNotes?: string;
  verification?: VerificationChecklist;
  timeline: TimelineEvent[];
  fundingTx?: string;
  repaymentTx?: string;
  settlementTx?: string;
}

export interface VerificationChecklist {
  businessIdentityReviewed: boolean;
  debtorClientReviewed: boolean;
  invoiceAuthenticityReviewed: boolean;
  workDeliveryProofReviewed: boolean;
  duplicateInvoiceCheckCompleted: boolean;
}

export interface TimelineEvent {
  id: string;
  status: ReceivableStatus | 'created';
  timestamp: string;
  description: string;
  actor?: string;
}

export interface PoolStats {
  totalBalance: number;
  totalDeposited: number;
  deployedLiquidity: number;
  availableLiquidity: number;
  fundedReceivables: number;
  expectedYield: number;
  apr: number;
}

export interface LiquidityDeposit {
  id: string;
  provider: string;
  amount: number;
  timestamp: string;
  txHash: string;
}

export interface ReceivableFormData {
  businessName: string;
  debtorName: string;
  invoiceAmount: string;
  requestedAdvancePercent: string;
  dueDate: string;
  invoiceReference: string;
  description: string;
}
