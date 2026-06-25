'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Layers3, Menu, Moon, Sun, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/demo', label: 'Demo' },
  { href: '/dashboard', label: 'Business' },
  { href: '/admin', label: 'Admin' },
  { href: '/pool', label: 'Pool' },
];

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = window.localStorage.getItem('harbor-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('harbor-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-3 flex h-14 items-center justify-between rounded-full border border-white/15 bg-[#07111f]/70 px-3 shadow-[0_18px_60px_rgba(2,6,23,0.22)] backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white shadow-lg shadow-black/10 ring-1 ring-white/15 transition-colors group-hover:bg-white/20">
              <Layers3 className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">
              Harbor<span className="text-orange-400 font-light ml-0.5">Finance</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.07]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-orange-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Network Badge */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/75 transition-colors hover:bg-white/18 hover:text-white"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link href="/demo" className="group flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-xs font-medium text-[#1e325a] transition-colors hover:bg-white/90">
              <span className="flex rounded-full bg-[#1e325a]/10 p-1">
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              Launch Demo
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs text-white/65 font-medium">Stacks Testnet</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mx-4 mt-2 rounded-3xl border border-white/[0.08] bg-[#07111f]/95 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-white/[0.06]">
              <button
                onClick={toggleTheme}
                className="mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs text-zinc-400">Stacks Testnet</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
