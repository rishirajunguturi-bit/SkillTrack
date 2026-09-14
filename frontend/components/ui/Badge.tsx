import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'purple' | 'rose' | 'blue' | 'accent' | 'error';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#ffad8a]/15 text-[#ffad8a] border border-[#ffad8a]/30 font-semibold',
    secondary: 'bg-white/10 text-[#fff9fc] border border-white/15',
    outline: 'border border-white/20 text-[#fff9fc] bg-transparent',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold',
    warning: 'bg-[#ffad8a]/15 text-[#ffad8a] border border-[#ffad8a]/30 font-semibold',
    purple: 'bg-[#ae8cff]/15 text-[#ae8cff] border border-[#ae8cff]/30 font-semibold',
    rose: 'bg-[#ef7489]/15 text-[#ef7489] border border-[#ef7489]/30 font-semibold',
    error: 'bg-[#ef7489]/15 text-[#ef7489] border border-[#ef7489]/30 font-semibold',
    blue: 'bg-[#ffad8a]/15 text-[#ffad8a] border border-[#ffad8a]/30 font-semibold',
    accent: 'bg-[#ffad8a] text-[#2b1120] font-extrabold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}


