'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Receivable, PoolStats, LiquidityDeposit, ReceivableFormData, VerificationChecklist, TimelineEvent } from './types';
import { MOCK_RECEIVABLES, MOCK_POOL_STATS, MOCK_DEPOSITS } from './mock-data';

interface HarborContextType {
  receivables: Receivable[];
  poolStats: PoolStats;
  deposits: LiquidityDeposit[];
  submitReceivable: (data: ReceivableFormData) => void;
  approveReceivable: (id: string, finalAdvancePercent: number, riskNotes: string) => void;
  rejectReceivable: (id: string, riskNotes: string) => void;
  updateVerification: (id: string, checklist: VerificationChecklist) => void;
  startReview: (id: string) => void;
  fundReceivable: (id: string) => void;
  depositToPool: (amount: number) => void;
  getReceivableById: (id: string) => Receivable | undefined;
}

const HarborContext = createContext<HarborContextType | undefined>(undefined);

export function HarborProvider({ children }: { children: ReactNode }) {
  const [receivables, setReceivables] = useState<Receivable[]>(MOCK_RECEIVABLES);
  const [poolStats, setPoolStats] = useState<PoolStats>(MOCK_POOL_STATS);
  const [deposits, setDeposits] = useState<LiquidityDeposit[]>(MOCK_DEPOSITS);

  const submitReceivable = useCallback((data: ReceivableFormData) => {
    const now = new Date().toISOString();
    const id = `RCV-${String(receivables.length + 1).padStart(3, '0')}`;
    const newReceivable: Receivable = {
      id,
      businessName: data.businessName,
      debtorName: data.debtorName,
      invoiceAmount: parseFloat(data.invoiceAmount),
      requestedAdvancePercent: parseFloat(data.requestedAdvancePercent),
      dueDate: data.dueDate,
      invoiceReference: data.invoiceReference,
      description: data.description,
      status: 'submitted',
      submittedAt: now,
      updatedAt: now,
      timeline: [
        { id: `ev-${Date.now()}`, status: 'created', timestamp: now, description: `Receivable submitted by ${data.businessName}`, actor: 'Business' },
        { id: `ev-${Date.now() + 1}`, status: 'submitted', timestamp: now, description: `Invoice ${data.invoiceReference} entered the review queue`, actor: 'System' },
      ],
    };
    setReceivables(prev => [newReceivable, ...prev]);
  }, [receivables.length]);

  const startReview = useCallback((id: string) => {
    setReceivables(prev => prev.map(r => {
      if (r.id !== id || r.status !== 'submitted') return r;
      const now = new Date().toISOString();
      const event: TimelineEvent = {
        id: `ev-${Date.now()}`,
        status: 'under_review',
        timestamp: now,
        description: 'Verification checklist initiated by admin',
        actor: 'Admin',
      };
      return {
        ...r,
        status: 'under_review' as const,
        updatedAt: now,
        verification: {
          businessIdentityReviewed: false,
          debtorClientReviewed: false,
          invoiceAuthenticityReviewed: false,
          workDeliveryProofReviewed: false,
          duplicateInvoiceCheckCompleted: false,
        },
        timeline: [...r.timeline, event],
      };
    }));
  }, []);

  const updateVerification = useCallback((id: string, checklist: VerificationChecklist) => {
    setReceivables(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, verification: checklist, updatedAt: new Date().toISOString() };
    }));
  }, []);

  const approveReceivable = useCallback((id: string, finalAdvancePercent: number, riskNotes: string) => {
    setReceivables(prev => prev.map(r => {
      if (r.id !== id) return r;
      const now = new Date().toISOString();
      const advanceAmount = (r.invoiceAmount * finalAdvancePercent) / 100;
      const event: TimelineEvent = {
        id: `ev-${Date.now()}`,
        status: 'approved',
        timestamp: now,
        description: `Receivable approved at ${finalAdvancePercent}% advance rate`,
        actor: 'Admin',
      };
      return {
        ...r,
        status: 'approved' as const,
        finalAdvancePercent,
        advanceAmount,
        riskNotes,
        updatedAt: now,
        timeline: [...r.timeline, event],
      };
    }));
  }, []);

  const rejectReceivable = useCallback((id: string, riskNotes: string) => {
    setReceivables(prev => prev.map(r => {
      if (r.id !== id) return r;
      const now = new Date().toISOString();
      const event: TimelineEvent = {
        id: `ev-${Date.now()}`,
        status: 'rejected',
        timestamp: now,
        description: `Rejected — ${riskNotes}`,
        actor: 'Admin',
      };
      return {
        ...r,
        status: 'rejected' as const,
        riskNotes,
        updatedAt: now,
        timeline: [...r.timeline, event],
      };
    }));
  }, []);

  const fundReceivable = useCallback((id: string) => {
    setReceivables(prev => prev.map(r => {
      if (r.id !== id || r.status !== 'approved') return r;
      const now = new Date().toISOString();
      const sBTCAmount = ((r.advanceAmount || 0) / 100000).toFixed(5);
      const event: TimelineEvent = {
        id: `ev-${Date.now()}`,
        status: 'funded',
        timestamp: now,
        description: `${sBTCAmount} sBTC disbursed from liquidity pool`,
        actor: 'System',
      };
      return {
        ...r,
        status: 'funded' as const,
        updatedAt: now,
        fundingTx: `ST1MOCK...fund_${Date.now()}`,
        timeline: [...r.timeline, event],
      };
    }));
    setPoolStats(prev => {
      const receivable = receivables.find(r => r.id === id);
      if (!receivable?.advanceAmount) return prev;
      const sBTCDeploy = receivable.advanceAmount / 100000;
      return {
        ...prev,
        deployedLiquidity: prev.deployedLiquidity + sBTCDeploy,
        availableLiquidity: prev.availableLiquidity - sBTCDeploy,
        fundedReceivables: prev.fundedReceivables + 1,
      };
    });
  }, [receivables]);

  const depositToPool = useCallback((amount: number) => {
    const newDeposit: LiquidityDeposit = {
      id: `DEP-${String(deposits.length + 1).padStart(3, '0')}`,
      provider: `SP${Math.random().toString(36).slice(2, 8)}...provider`,
      amount,
      timestamp: new Date().toISOString(),
      txHash: `ST1MOCK...dep_${Date.now()}`,
    };
    setDeposits(prev => [newDeposit, ...prev]);
    setPoolStats(prev => ({
      ...prev,
      totalBalance: prev.totalBalance + amount,
      totalDeposited: prev.totalDeposited + amount,
      availableLiquidity: prev.availableLiquidity + amount,
    }));
  }, [deposits.length]);

  const getReceivableById = useCallback((id: string) => {
    return receivables.find(r => r.id === id);
  }, [receivables]);

  return (
    <HarborContext.Provider value={{
      receivables,
      poolStats,
      deposits,
      submitReceivable,
      approveReceivable,
      rejectReceivable,
      updateVerification,
      startReview,
      fundReceivable,
      depositToPool,
      getReceivableById,
    }}>
      {children}
    </HarborContext.Provider>
  );
}

export function useHarbor() {
  const context = useContext(HarborContext);
  if (!context) {
    throw new Error('useHarbor must be used within a HarborProvider');
  }
  return context;
}
