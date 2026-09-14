'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, MapPin, DollarSign, Save, Edit3, X, ArrowRight, Brain } from 'lucide-react';

interface UnemploymentSectionProps {
  unemploymentDetails: any;
  onUpdate: (details: any) => void;
  isUpdating?: boolean;
}

export function UnemploymentSection({
  unemploymentDetails,
  onUpdate,
  isUpdating,
}: UnemploymentSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [reason, setReason] = useState(unemploymentDetails?.reason || 'Skill Gap');
  const [preferredLocation, setPreferredLocation] = useState(unemploymentDetails?.preferredLocation || 'Hyderabad / Remote');
  const [expectedSalary, setExpectedSalary] = useState(unemploymentDetails?.expectedSalary || 600000);

  const reasonsList = [
    'Skill gap',
    'Technical skills',
    'Interview skills',
    'Communication',
    'Lack of experience',
    'No suitable opportunities',
    'Location constraint',
    'Salary expectation',
    'Eligibility',
    'Personal reason',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      reason,
      preferredLocation,
      expectedSalary,
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4 border-b border-border mb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            Non-placement information & skill remediation
          </CardTitle>
          <CardDescription>
            Log primary non-placement reasons to connect with AI Skill Gap Analysis.
          </CardDescription>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs gap-1.5"
        >
          {isEditing ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
          <span>{isEditing ? 'Cancel' : 'Edit information'}</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Reason for non-placement *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                >
                  {reasonsList.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Preferred work location</label>
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Bangalore / Remote"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Expected salary (₹ per annum)</label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 600000"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" isLoading={isUpdating} className="gap-1.5">
              <Save className="h-4 w-4" /> Save non-placement info
            </Button>
          </form>
        ) : (
          <div className="space-y-6 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-1">
                <span className="text-amber-600 dark:text-amber-400 font-medium text-xs block">Primary reason</span>
                <span className="font-semibold text-lg text-foreground">
                  {unemploymentDetails?.reason || 'Skill gap'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                <span className="text-muted-foreground font-medium text-xs flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Preferred location
                </span>
                <span className="font-semibold text-lg text-foreground">
                  {unemploymentDetails?.preferredLocation || 'India'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                <span className="text-muted-foreground font-medium text-xs flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-primary" /> Expected salary
                </span>
                <span className="font-semibold text-lg text-primary">
                  ₹{((unemploymentDetails?.expectedSalary || 600000) / 100000).toFixed(1)} LPA
                </span>
              </div>
            </div>

            {/* AI Skill Gap Recommendation Integration */}
            <div className="p-5 rounded-xl bg-surface-secondary/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-semibold text-base text-foreground flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" /> Resolution action: AI skill gap analysis
                </span>
                <p className="text-muted-foreground text-xs">
                  Analyze missing skills and complete standardized assessments to boost readiness.
                </p>
              </div>

              <Link href="/skill-gap">
                <Button variant="primary" className="shrink-0 gap-1.5">
                  <span>Analyze skill gaps</span> <ArrowRight className="h-4 w-4 text-white" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


