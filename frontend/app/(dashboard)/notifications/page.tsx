'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Bell } from 'lucide-react';

export default function StudentNotificationsPage() {
  const notifications = [
    { id: '1', title: 'Assessment evaluated: Java & Spring Boot', desc: 'Scored 85% proficiency. Skill badges updated on profile.', time: '2 hours ago', type: 'ASSESSMENT' },
    { id: '2', title: 'Company insight published', desc: 'Trainer approved your peer contribution for TechCorp Backend Developer.', time: '5 hours ago', type: 'INSIGHT' },
    { id: '3', title: 'Skill gap remedial plan updated', desc: 'Gemini AI generated a targeted learning step for Spring Boot.', time: '1 day ago', type: 'REMEDIAL' },
  ];

  return (
    <PageWrapper className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Notifications & Alerts"
        description="Real-time notifications for assessment evaluations, company insights, and skill-gap recommendations."
        badge={
          <Badge variant="blue" className="gap-1.5 py-1 px-3">
            <Bell className="h-3.5 w-3.5" />
            Trainee notification center
          </Badge>
        }
      />

      <Card className="p-6 rounded-xl">
        <CardContent className="p-0 space-y-3 text-xs">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 rounded-xl bg-surface-secondary/50 border border-border flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-semibold text-base text-foreground block">{n.title}</span>
                <p className="text-muted-foreground text-xs">{n.desc}</p>
                <span className="text-xs text-primary font-medium block">{n.time}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}


