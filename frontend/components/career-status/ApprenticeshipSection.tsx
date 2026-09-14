'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, Save, Edit3, X } from 'lucide-react';

interface ApprenticeshipSectionProps {
  apprenticeshipDetails: any;
  onUpdate: (details: any) => void;
  isUpdating?: boolean;
}

export function ApprenticeshipSection({
  apprenticeshipDetails,
  onUpdate,
  isUpdating,
}: ApprenticeshipSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [organizationName, setOrganizationName] = useState(apprenticeshipDetails?.organizationName || '');
  const [role, setRole] = useState(apprenticeshipDetails?.role || '');
  const [stipend, setStipend] = useState(apprenticeshipDetails?.stipend || 25000);
  const [workLocation, setWorkLocation] = useState(apprenticeshipDetails?.workLocation || '');
  const [trainingRelevance, setTrainingRelevance] = useState(apprenticeshipDetails?.trainingRelevance || 'Highly Relevant');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      organizationName,
      role,
      stipend,
      workLocation,
      trainingRelevance,
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4 border-b border-border mb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Apprenticeship & vocational training
          </CardTitle>
          <CardDescription>
            Log active apprenticeship organizations, stipend, and skill training relevance.
          </CardDescription>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs gap-1.5"
        >
          {isEditing ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
          <span>{isEditing ? 'Cancel' : 'Edit details'}</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Organization *</label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. Apex Cloud Systems"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Apprenticeship role *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Cloud DevOps Trainee"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Monthly stipend (₹)</label>
                <input
                  type="number"
                  value={stipend}
                  onChange={(e) => setStipend(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 25000"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" isLoading={isUpdating} className="gap-1.5">
              <Save className="h-4 w-4" /> Save apprenticeship details
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            {!apprenticeshipDetails?.organizationName ? (
              <div className="p-4 text-center text-muted-foreground bg-surface-secondary/50 rounded-xl border border-dashed border-border space-y-2">
                <p className="font-semibold text-foreground text-base">Provide apprenticeship information</p>
                <p className="text-xs text-muted-foreground">Click "Edit details" to record organization, role, and stipend.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 space-y-1">
                  <span className="text-primary font-medium text-xs block">Organization</span>
                  <span className="font-semibold text-lg text-foreground">
                    {apprenticeshipDetails.organizationName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-muted-foreground font-medium text-xs block">Apprenticeship role</span>
                  <span className="font-semibold text-lg text-foreground">
                    {apprenticeshipDetails.role}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-muted-foreground font-medium text-xs block">Monthly stipend</span>
                  <span className="font-semibold text-lg text-primary">
                    ₹{apprenticeshipDetails.stipend?.toLocaleString()} / mo
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


