import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border', className)}>
      {items.map((item) => {
        const isCompleted = item.status === 'completed';
        const isCurrent = item.status === 'current';

        return (
          <div key={item.id} className="relative flex items-start group">
            <div
              className={cn(
                'absolute -left-6 top-1 h-5 w-5 rounded-full flex items-center justify-center border transition-colors',
                isCompleted && 'bg-primary border-primary text-white',
                isCurrent && 'bg-surface border-2 border-primary text-primary',
                !isCompleted && !isCurrent && 'bg-surface-secondary border-border text-muted-text'
              )}
            >
              {isCompleted ? (
                <Check className="h-3 w-3" />
              ) : isCurrent ? (
                <div className="h-2 w-2 rounded-full bg-primary" />
              ) : (
                <Circle className="h-2 w-2 text-muted-text" />
              )}
            </div>

            <div className="flex-1 ml-3">
              <div className="flex items-center justify-between">
                <h4
                  className={cn(
                    'text-sm font-semibold',
                    isCompleted && 'text-foreground',
                    isCurrent && 'text-primary font-bold',
                    !isCompleted && !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {item.title}
                </h4>
                {item.date && <span className="text-xs text-muted-text">{item.date}</span>}
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
