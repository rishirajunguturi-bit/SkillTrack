'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldCheck } from 'lucide-react';
import {
  studentWorkspaceItems,
  studentAccountItems,
  trainerWorkspaceItems,
  trainerAccountItems,
} from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'TRAINER';

  return (
    <div className="md:hidden flex items-center gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Menu"
        className="p-2 rounded-md text-muted-foreground hover:bg-surface-secondary hover:text-foreground cursor-pointer"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 top-16 z-50 border-b border-border bg-surface p-4 shadow-xl space-y-4 max-h-[80vh] overflow-y-auto text-foreground animate-in slide-in-from-top-2 duration-150">
          {isAdmin ? (
            /* TRAINER PORTAL MOBILE NAV */
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  <span>Trainer workspace</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-[#ffad8a]" />
                </div>
                {trainerWorkspaceItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname === item.href || pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-semibold border-l-2 border-[#ffad8a] pl-2.5 shadow-sm shadow-[#ffad8a]/10'
                          : 'text-muted-foreground hover:bg-[#ffad8a]/10 hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#ffad8a]' : 'text-muted-foreground')} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                  Account
                </div>
                {trainerAccountItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-semibold border-l-2 border-[#ffad8a] pl-2.5 shadow-sm shadow-[#ffad8a]/10'
                          : 'text-muted-foreground hover:bg-[#ffad8a]/10 hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#ffad8a]' : 'text-muted-foreground')} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            /* STUDENT PORTAL MOBILE NAV */
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                  Trainee workspace
                </div>
                {studentWorkspaceItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-semibold border-l-2 border-[#ffad8a] pl-2.5 shadow-sm shadow-[#ffad8a]/10'
                          : 'text-muted-foreground hover:bg-[#ffad8a]/10 hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#ffad8a]' : 'text-muted-foreground')} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                  Account
                </div>
                {studentAccountItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-semibold border-l-2 border-[#ffad8a] pl-2.5 shadow-sm shadow-[#ffad8a]/10'
                          : 'text-muted-foreground hover:bg-[#ffad8a]/10 hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#ffad8a]' : 'text-muted-foreground')} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


