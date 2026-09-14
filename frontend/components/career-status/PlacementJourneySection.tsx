'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, ArrowRight, GraduationCap, Target, Send, Users, FileCheck, UserCheck, Briefcase } from 'lucide-react';

interface PlacementJourneySectionProps {
  placementJourney: any;
}

export function PlacementJourneySection({ placementJourney }: PlacementJourneySectionProps) {
  const steps = [
    { key: 'trainingCompleted', title: 'Training completed', icon: GraduationCap, done: placementJourney?.trainingCompleted ?? true },
    { key: 'placementReady', title: 'Placement ready', icon: Target, done: placementJourney?.placementReady ?? true },
    { key: 'applied', title: 'Application submitted', icon: Send, done: placementJourney?.applied ?? true },
    { key: 'interview', title: 'Interview rounds', icon: Users, done: placementJourney?.interview ?? true },
    { key: 'offerReceived', title: 'Offer received', icon: FileCheck, done: placementJourney?.offerReceived ?? true },
    { key: 'joined', title: 'Joined company', icon: UserCheck, done: placementJourney?.joined ?? true },
    { key: 'employed', title: 'Placement confirmed', icon: Briefcase, done: placementJourney?.employed ?? true },
  ];

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4 border-b border-border mb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Placement journey
        </CardTitle>
        <CardDescription>
          Progression timeline from skill development to full-time placement.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-[700px] justify-between gap-2 p-4 rounded-xl bg-surface-secondary/50 border border-border">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-center gap-2 flex-1">
                  <div className="flex flex-col items-center text-center space-y-2 flex-1">
                    <div
                      className={`p-3 rounded-full flex items-center justify-center transition-colors ${
                        step.done
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-surface text-muted-foreground border border-border'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-xs text-foreground block">
                      {step.title}
                    </span>
                    <Badge variant={step.done ? 'success' : 'secondary'} className="text-[10px]">
                      {step.done ? 'Completed' : 'Upcoming'}
                    </Badge>
                  </div>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-text shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


