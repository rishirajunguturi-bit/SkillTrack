import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  subtitle?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  subtitle,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('p-6 flex flex-col justify-between space-y-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <div className="h-9 w-9 rounded-xl bg-[#281a3a] flex items-center justify-center border border-white/10 shadow-xs">
            <Icon className="h-4.5 w-4.5 text-[#ffad8a]" />
          </div>
        )}
      </div>

      <div>
        <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>
        {(change || subtitle) && (
          <div className="flex items-center gap-2 mt-1.5">
            {change && (
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center',
                  changeType === 'positive' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
                  changeType === 'negative' && 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
                  changeType === 'neutral' && 'bg-surface-secondary text-muted-foreground'
                )}
              >
                {change}
              </span>
            )}
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
