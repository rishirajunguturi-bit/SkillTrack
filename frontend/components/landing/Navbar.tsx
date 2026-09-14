'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Zap, ArrowRight, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface text-foreground transition-colors duration-150">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-[#ffad8a] flex items-center justify-center text-[#2b1120] font-black text-lg shadow-md shadow-[#ffad8a]/20">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight text-foreground">
            SkillTrack <span className="text-[#ffad8a]">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-muted-foreground">
          <a href="#features" className="hover:text-[#ffad8a] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#ffad8a] transition-colors">
            How it works
          </a>
          <a href="#solution" className="hover:text-[#ffad8a] transition-colors">
            Solution
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <Button variant="primary" className="gap-2 text-xs">
                <LayoutDashboard className="h-4 w-4 text-[#2b1120]" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex text-xs font-semibold">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" className="gap-1.5 text-xs">
                  Get started
                  <ArrowRight className="h-4 w-4 text-[#2b1120]" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


