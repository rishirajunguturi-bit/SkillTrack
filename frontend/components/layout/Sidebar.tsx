'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  LineChart,
  User,
  Settings,
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  Target,
  Zap,
  GraduationCap,
  Bell,
  MessageSquare,
  Sparkle,
  Building,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export const studentWorkspaceItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Career status', href: '/career-status', icon: Briefcase },
  { name: 'Assessments', href: '/assessment', icon: Brain },
  { name: 'Skill gap analysis', href: '/skill-gap', icon: Target },
  { name: 'Training feedback', href: '/training-feedback', icon: MessageSquare },
  { name: 'Achievements', href: '/achievements', icon: Sparkle },
  { name: 'Company insights', href: '/company-insights', icon: Building },
  { name: 'Notifications', href: '/notifications', icon: Bell },
];

export const studentAccountItems = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const trainerWorkspaceItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Trainees', href: '/admin/users', icon: Users },
  { name: 'Training programs', href: '/admin/programs', icon: GraduationCap },
  { name: 'Cohorts', href: '/admin/cohorts', icon: Building2 },
  { name: 'Assessments', href: '/admin/assessments', icon: Brain },
  { name: 'Skill gaps', href: '/admin/skill-gaps', icon: Target },
  { name: 'Analytics', href: '/admin/analytics', icon: LineChart },
  { name: 'Opportunities', href: '/admin/opportunities', icon: Zap },
  { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
];

export const trainerAccountItems = [
  { name: 'Profile', href: '/admin/profile', icon: User },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const adminNavItems = [...trainerWorkspaceItems, ...trainerAccountItems];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'TRAINER';

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface min-h-screen sticky top-0 z-20 select-none transition-colors duration-150">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center px-5 border-b border-border bg-surface-secondary/40">
        <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#ffad8a] flex items-center justify-center text-[#2b1120] font-black text-lg shadow-md shadow-[#ffad8a]/20">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-foreground leading-none">
              SkillTrack <span className="text-[#ffad8a] font-semibold">AI</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium mt-0.5 tracking-wider uppercase">
              Gov Impact Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {isAdmin ? (
          /* TRAINER PORTAL SIDEBAR */
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Trainer workspace
                </span>
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
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-semibold border-l-2 border-[#ffad8a] pl-2.5 shadow-sm shadow-[#ffad8a]/10'
                        : 'text-muted-foreground hover:bg-[#ffad8a]/10 hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-[#ffad8a]' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Account
              </div>
              {trainerAccountItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-semibold border-l-2 border-[#ffad8a] pl-2.5 shadow-sm shadow-[#ffad8a]/10'
                        : 'text-muted-foreground hover:bg-[#ffad8a]/10 hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-[#ffad8a]' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          /* STUDENT PORTAL SIDEBAR */
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
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
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-semibold border-l-2 border-[#ffad8a] pl-2.5 shadow-sm shadow-[#ffad8a]/10'
                        : 'text-muted-foreground hover:bg-[#ffad8a]/10 hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-[#ffad8a]' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Account
              </div>
              {studentAccountItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-semibold border-l-2 border-[#ffad8a] pl-2.5 shadow-sm shadow-[#ffad8a]/10'
                        : 'text-muted-foreground hover:bg-[#ffad8a]/10 hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-[#ffad8a]' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}


