'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  BadgeCheck,
  Bitcoin,
  BookOpenText,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Waves,
} from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4';

const FLOW_STEPS = [
  {
    number: '01',
    title: 'Submit',
    description: 'A business enters invoice terms and off-chain evidence references.',
    icon: FileCheck2,
  },
  {
    number: '02',
    title: 'Verify',
    description: 'Admin review checks business, debtor, invoice, and duplicate risk.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Fund',
    description: 'Approved receivables move through mock sBTC pool accounting.',
    icon: CircleDollarSign,
  },
  {
    number: '04',
    title: 'Repay',
    description: 'Repayment evidence updates principal and illustrative yield fields.',
    icon: BadgeCheck,
  },
  {
    number: '05',
    title: 'Settle',
    description: 'Lifecycle state closes with a transparent Stacks-facing record.',
    icon: Layers3,
  },
];

const WHY_HARBOR = [
  {
    title: 'Verified Receivables',
    description:
      'Harbor keeps private invoice documents off-chain while showing how lifecycle metadata can be coordinated transparently.',
    icon: FileCheck2,
  },
  {
    title: 'Bitcoin-Native Liquidity',
    description:
      'Harbor models future sBTC receivables liquidity using a mock sBTC pool deployed on Stacks testnet.',
    icon: Bitcoin,
  },
  {
    title: 'Manual Review First',
    description:
      'The demo favors explicit verification checkpoints over unsupported automated underwriting or instant credit claims.',
    icon: ShieldCheck,
  },
  {
    title: 'Auditable Settlement',
    description:
      'Funding, repayment, and settlement states are visible in a single lifecycle path with deployed contract IDs linked from `/demo`.',
    icon: BookOpenText,
  },
];

const DOCS = [
  ['Project Answers', 'docs/FINAL_GRANT_ANSWERS.md'],
  ['Technical Guide', 'docs/REVIEWER_GUIDE.md'],
  ['Demo Guide', 'docs/DEMO_GUIDE.md'],
  ['Vercel Deployment', 'docs/VERCEL_DEPLOYMENT.md'],
];

function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/60 px-4 py-2 text-[rgba(30,50,90,0.9)] shadow-sm backdrop-blur-md"
    >
      <Sparkles className="h-4 w-4 text-[rgba(30,50,90,0.8)]" />
      <span className="text-sm font-normal">Stacks testnet deployment</span>
    </motion.div>
  );
}

function BottomLeftCard() {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute bottom-28 right-4 left-auto flex w-fit min-w-[170px] flex-col gap-3 rounded-[1.5rem] bg-white/35 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.16)] ring-1 ring-white/30 backdrop-blur-xl md:bottom-6 md:left-6 md:right-auto lg:bottom-10 lg:left-10 lg:min-w-[210px] lg:rounded-[2.2rem] lg:p-5"
    >
      <div>
        <p className="text-3xl font-normal tracking-tight text-[rgba(30,50,90,0.92)]">3</p>
        <p className="text-[11px] font-normal uppercase tracking-wider text-[rgba(30,50,90,0.62)]">
          Testnet contracts
        </p>
      </div>
      <Link href="/demo" className="group flex items-center gap-2 self-start rounded-full bg-white py-1.5 pr-5 pl-1.5 text-sm font-normal text-[rgba(30,50,90,0.9)] shadow-sm transition-colors hover:bg-white/90">
        <span className="flex rounded-full bg-[rgba(30,50,90,0.1)] p-1 text-[rgba(30,50,90,0.9)]">
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
        View demo
      </Link>
    </motion.div>
  );
}

function BottomRightCorner() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute right-0 bottom-0 flex items-center gap-3 rounded-tl-[1.5rem] bg-[#f0f0f0] p-3 pt-5 pl-8 text-[#f0f0f0] sm:gap-4 sm:rounded-tl-[2rem] sm:p-4 sm:pt-6 sm:pl-10 md:gap-6 md:rounded-tl-[3.5rem] md:p-6 md:pt-8 md:pl-14"
    >
      <div className="pointer-events-none absolute -top-[1.5rem] right-0 h-[1.5rem] w-[1.5rem] sm:-top-[2rem] sm:h-[2rem] sm:w-[2rem] md:-top-[3.5rem] md:h-[3.5rem] md:w-[3.5rem]">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="currentColor" />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-0 -left-[1.5rem] h-[1.5rem] w-[1.5rem] sm:-left-[2rem] sm:h-[2rem] sm:w-[2rem] md:-left-[3.5rem] md:h-[3.5rem] md:w-[3.5rem]">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="currentColor" />
        </svg>
      </div>
      <Link href="#documentation" className="flex items-center gap-3 rounded-full transition-opacity hover:opacity-80 sm:gap-4 md:gap-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(30,50,90,0.1)] bg-[rgba(30,50,90,0.05)] text-[rgba(30,50,90,0.8)] md:h-14 md:w-14">
          <ArrowUpRight className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-normal text-[rgba(30,50,90,0.95)] md:text-xl">Documentation</span>
          <span className="mt-0.5 flex items-center gap-1 text-[rgba(30,50,90,0.62)]">
            <span className="text-xs font-normal md:text-[15px]">Technical library</span>
            <ChevronRight className="h-4 w-4" />
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

function Hero() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f0f0f0] p-3 pt-20 md:p-5 md:pt-20">
      <section className="group relative flex h-[calc(100vh-6rem)] min-h-[680px] w-full max-w-[1536px] flex-col items-center overflow-hidden rounded-[1.5rem] bg-white/10 shadow-none md:rounded-[3rem]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover object-[65%] lg:object-center"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(240,240,240,0.28),rgba(240,240,240,0.1)_42%,rgba(240,240,240,0.48))]" />
        <div className="absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-[#f0f0f0]/70 to-transparent" />
        <div className="relative z-10 flex h-full w-full flex-col items-center">
          <div className="flex w-full flex-col items-center px-6 pt-10 text-center md:pt-12">
            <HeroBadge />
            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-5xl text-4xl font-normal leading-[1.03] tracking-normal text-[#35425a] sm:text-5xl md:text-6xl lg:text-[82px]"
            >
              Bitcoin receivables, made transparent.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-5 max-w-2xl text-sm font-normal leading-relaxed text-[#4d586b]/85 sm:text-base md:text-lg"
            >
              Harbor is a controlled Stacks prototype for verified unpaid invoices, mock sBTC pool accounting,
              and a clear lifecycle path from submission to settlement.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link href="/demo" className="group flex items-center gap-3 rounded-full bg-[rgba(30,50,90,0.86)] py-2 pr-6 pl-2 text-sm font-normal text-white shadow-[0_16px_40px_rgba(30,50,90,0.18)] transition-colors hover:bg-[rgba(30,50,90,1)]">
                <span className="flex rounded-full bg-white/20 p-1.5">
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                Launch Demo
              </Link>
              <Link href="/dashboard" className="rounded-full border border-white/40 bg-white/45 px-6 py-3 text-sm font-normal text-[rgba(30,50,90,0.9)] backdrop-blur-md transition-colors hover:bg-white/70">
                Business Dashboard
              </Link>
            </motion.div>
          </div>
          <BottomLeftCard />
          <BottomRightCorner />
        </div>
      </section>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="harbor-landing -mt-16 bg-[#f0f0f0] text-[#1f2937]">
      <Hero />

      <section className="bg-[#f0f0f0] px-4 py-16 sm:px-6 lg:px-8" id="how-it-works">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e7c92]">Lifecycle</p>
              <h2 className="mt-3 text-3xl font-normal tracking-normal text-[#243149] md:text-5xl">
                One receivable, five visible states.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-[#5f6b7d]">
              The primary demo is deterministic local UI state. It mirrors the deployed Clarity lifecycle so users can inspect the model before optional wallet signing.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FLOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="rounded-[1.5rem] border border-white/70 bg-white/50 p-5 shadow-[0_24px_80px_rgba(30,50,90,0.08)] backdrop-blur-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#7b8799]">{step.number}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e325a]/10 text-[#1e325a]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="text-lg font-normal text-[#243149]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#657286]">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f0f0f0] px-4 py-16 sm:px-6 lg:px-8" id="why-harbor">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="rounded-[2rem] bg-[#1e325a] p-8 text-white shadow-[0_28px_90px_rgba(30,50,90,0.18)]">
            <div className="mb-16 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <Waves className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Controlled prototype</p>
            <h2 className="mt-4 text-3xl font-normal leading-tight tracking-normal md:text-5xl">
              A transparent path from invoice review to settlement.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              Harbor stays intentionally risk-aware: manual verification, mock sBTC, public testnet contracts,
              and clear separation between off-chain review and on-chain lifecycle coordination.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY_HARBOR.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[1.75rem] border border-white/70 bg-white/55 p-6 shadow-[0_24px_80px_rgba(30,50,90,0.08)] backdrop-blur-xl">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#ff7a1a]/12 text-[#d75f00]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-normal text-[#243149]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#657286]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f0f0f0] px-4 py-16 sm:px-6 lg:px-8" id="documentation">
        <div className="mx-auto max-w-7xl rounded-[2.25rem] bg-white/55 p-6 shadow-[0_24px_90px_rgba(30,50,90,0.1)] ring-1 ring-white/70 backdrop-blur-xl md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e7c92]">Technical package</p>
              <h2 className="mt-3 text-3xl font-normal tracking-normal text-[#243149] md:text-5xl">
                Demo first. Docs right beside it.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#657286]">
                Use `/demo` for the clearest path through lifecycle simulation, contract mappings,
                Wallet Mode, and Stacks testnet deployment status.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/demo" className="group flex w-fit items-center gap-3 rounded-full bg-[#1e325a] py-2 pr-6 pl-2 text-sm font-normal text-white transition-colors hover:bg-[#162642]">
                  <span className="flex rounded-full bg-white/20 p-1.5">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                  Launch Demo
                </Link>
                <Link href="/pool" className="w-fit rounded-full border border-[#1e325a]/10 bg-white/60 px-6 py-3 text-sm font-normal text-[#1e325a] transition-colors hover:bg-white">
                  Liquidity Pool
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {DOCS.map(([title, path]) => (
                <div key={path} className="rounded-[1.25rem] border border-[#1e325a]/10 bg-[#f7f8fa]/70 p-5">
                  <h3 className="text-sm font-medium text-[#243149]">{title}</h3>
                  <p className="mt-3 break-all font-mono text-xs leading-relaxed text-[#6e7c92]">{path}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#f0f0f0] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-[#1e325a]/10 pt-6 text-xs text-[#6e7c92] sm:flex-row">
          <p>Harbor Finance — Stacks testnet prototype. Not a production financial product.</p>
          <p>Mock sBTC liquidity • Manual verification • Transparent lifecycle model</p>
        </div>
      </footer>
    </div>
  );
}
