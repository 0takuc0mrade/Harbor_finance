import Link from 'next/link';

const FLOW_STEPS = [
  {
    number: '01',
    title: 'Submit Receivable',
    description: 'A business submits a verified unpaid invoice with supporting documentation — invoice amount, debtor details, due date, and work completion proof.',
    icon: '📄',
  },
  {
    number: '02',
    title: 'Verification & Approval',
    description: 'An admin reviews the receivable against a structured checklist — business identity, debtor credit, invoice authenticity, and duplicate checks.',
    icon: '🔍',
  },
  {
    number: '03',
    title: 'Funding',
    description: 'Approved receivables move through a mock sBTC liquidity pool. The demo records an advance amount and pool accounting changes.',
    icon: '💰',
  },
  {
    number: '04',
    title: 'Repayment',
    description: 'When repayment evidence is confirmed, the demo records returned principal plus fee/yield amounts against the pool.',
    icon: '🔄',
  },
  {
    number: '05',
    title: 'Settlement',
    description: 'The cycle closes transparently with lifecycle and accounting records that reviewers can inspect end to end.',
    icon: '🏁',
  },
];

const WHY_HARBOR = [
  {
    title: 'Transparent Settlement',
    description: 'Every funding event, repayment, and settlement is logged on the Stacks blockchain. No opaque intermediaries.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Bitcoin-Native Capital',
    description: 'The intended funding asset is sBTC, a Bitcoin-pegged asset on Stacks. This MVP uses mock sBTC for controlled testing.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Structured Verification',
    description: 'No black-box underwriting. Every receivable passes a clear verification checklist before funding — visible to all parties.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Pool Accounting Model',
    description: 'The demo shows how deposits, deployed liquidity, repayments, and fee/yield accounting could be tracked for verified receivables.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

const WHY_STACKS = [
  {
    title: 'Bitcoin Finality',
    description: 'Stacks anchors transaction history to Bitcoin, giving Harbor a Bitcoin-native settlement foundation.',
  },
  {
    title: 'sBTC Integration',
    description: 'sBTC is the intended Bitcoin-pegged funding asset for future programmable liquidity flows.',
  },
  {
    title: 'Clarity Smart Contracts',
    description: 'Clarity is a decidable, non-Turing-complete language that makes contract behavior predictable and auditable.',
  },
  {
    title: 'Post-Nakamoto Performance',
    description: 'Fast block times (~5s) and reliable finality make Stacks practical for real-world financial applications.',
  },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-orange-500/[0.07] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-gradient-to-br from-amber-500/[0.04] to-transparent rounded-full blur-3xl animate-float" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              <span className="text-xs font-medium text-orange-400">MVP Demo — Built on Stacks with sBTC</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-white">Bitcoin-powered working capital</span>
              <br />
              <span className="gradient-text">for verified receivables.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Harbor connects businesses holding unpaid invoices with sBTC liquidity providers.
              Submit a receivable, review verification, and trace mock funding, repayment, and settlement logic on Stacks.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo"
                className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:brightness-110 transition-all duration-300"
              >
                View Grant Demo
              </Link>
              <Link
                href="/#documentation"
                className="px-8 py-3.5 rounded-xl text-sm font-semibold text-zinc-300 border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.03] transition-all duration-300"
              >
                Read Documentation
              </Link>
              <Link
                href="/pool"
                className="px-8 py-3.5 rounded-xl text-sm font-semibold text-zinc-300 border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.03] transition-all duration-300"
              >
                Explore Liquidity Pool
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {[
                { value: '7', label: 'Demo Receivables' },
                { value: '15.0', label: 'sBTC in Pool' },
                { value: '8.5%', label: 'Illustrative APR' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative border-t border-white/[0.04] py-24" id="how-it-works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">How Harbor Works</h2>
            <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
              A clear, five-step flow from invoice to settlement — designed for transparency at every stage.
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {FLOW_STEPS.map((step) => (
                <div key={step.number} className="relative group">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 h-full transition-all duration-300 hover:border-orange-500/20 hover:bg-orange-500/[0.02]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="text-xs font-mono text-orange-500/60">{step.number}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Harbor */}
      <section className="relative border-t border-white/[0.04] py-24" id="why-harbor">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Why Harbor</h2>
            <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
              Traditional invoice financing is opaque, expensive, and slow. Harbor brings transparency and Bitcoin-native settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHY_HARBOR.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Stacks / sBTC */}
      <section className="relative border-t border-white/[0.04] py-24" id="why-stacks">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Why Stacks & sBTC</h2>
            <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
              Harbor is built on Stacks because receivables financing benefits from transparent state, auditable logic, and Bitcoin-native settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {WHY_STACKS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-orange-500/15"
              >
                <h3 className="text-sm font-semibold text-orange-400 mb-2">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MVP Scope */}
      <section className="relative border-t border-white/[0.04] py-24" id="mvp-scope">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">MVP Scope</h2>
            <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
              This is a grant-ready demo — not a production credit facility. Here&apos;s what&apos;s included and what&apos;s planned for later.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* In Scope */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-6">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">✅ In This MVP</h3>
              <ul className="space-y-2.5">
                {[
                  'Receivable submission and lifecycle tracking',
                  'Admin verification with structured checklist',
                  'Mock sBTC liquidity pool and deposits',
                  'Funding, repayment, and settlement flow',
                  'Full lifecycle timeline per receivable',
                  'Business, admin, and LP dashboards',
                  'Stacks testnet contracts deployed',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Out of Scope */}
            <div className="rounded-xl border border-zinc-700/50 bg-white/[0.02] p-6">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">🔜 Planned for Later</h3>
              <ul className="space-y-2.5">
                {[
                  'Real KYC/KYB verification',
                  'Legal SPV entity structure',
                  'Automated credit underwriting',
                  'Bank account integration',
                  'Secondary markets for receivables',
                  'Multi-token support beyond sBTC',
                  'Production-grade risk scoring',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-500">
                    <span className="text-zinc-600 mt-0.5">○</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reviewer CTA */}
      <section className="relative border-t border-white/[0.04] py-20">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/[0.03] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-orange-400">Grant reviewer path</p>
          <h2 className="text-2xl font-bold text-white mb-3">Start with the guided demo, then review the docs.</h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            The `/demo` route is the clearest path through the MVP lifecycle, contract mappings, and testnet deployment status.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all"
            >
              View Grant Demo
            </Link>
            <Link
              href="/#documentation"
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-300 border border-white/[0.1] hover:border-white/[0.2] transition-all"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section className="relative border-t border-white/[0.04] py-20" id="documentation">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Documentation</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Grant submission package</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              The repository includes grant answers, reviewer notes, contract documentation, deployment notes,
              and a screenshot checklist for the public demo package.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['Final Grant Answers', 'docs/FINAL_GRANT_ANSWERS.md'],
              ['Reviewer Guide', 'docs/REVIEWER_GUIDE.md'],
              ['Demo Guide', 'docs/DEMO_GUIDE.md'],
              ['Vercel Deployment', 'docs/VERCEL_DEPLOYMENT.md'],
            ].map(([title, path]) => (
              <div key={path} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 break-all font-mono text-xs text-zinc-500">{path}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-300 border border-white/[0.1] hover:border-white/[0.2] transition-all"
            >
              Business Dashboard
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-300 border border-white/[0.1] hover:border-white/[0.2] transition-all"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/pool"
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-300 border border-white/[0.1] hover:border-white/[0.2] transition-all"
            >
              Liquidity Pool
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">
              Harbor Finance — MVP Demo. Not a production financial product.
            </p>
            <p className="text-xs text-zinc-600">
              Built on Stacks • Modeled with mock sBTC • Anchored to Bitcoin
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
