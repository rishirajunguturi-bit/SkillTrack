'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, MapPin, DollarSign, Save, Edit3, X, ArrowRight, Brain } from 'lucide-react';

interface SeekingEmploymentSectionProps {
  seekingEmploymentDetails: any;
  onUpdate: (details: any) => void;
  isUpdating?: boolean;
}

export function SeekingEmploymentSection({
  seekingEmploymentDetails,
  onUpdate,
  isUpdating,
}: SeekingEmploymentSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [preferredLocation, setPreferredLocation] = useState(seekingEmploymentDetails?.preferredLocation || 'Hyderabad / Remote');
  const [expectedSalary, setExpectedSalary] = useState(seekingEmploymentDetails?.expectedSalary || 600000);
  const [jobSearchStatus, setJobSearchStatus] = useState(seekingEmploymentDetails?.jobSearchStatus || 'Actively Applying');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      preferredLocation,
      expectedSalary,
      jobSearchStatus,
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4 border-b border-border mb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Job search & readiness information
          </CardTitle>
          <CardDescription>
            Manage your active job search status, target salary expectations, and preferred work location.
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
                <label className="font-medium text-foreground text-xs block mb-1">Job search status</label>
                <select
                  value={jobSearchStatus}
                  onChange={(e) => setJobSearchStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                >
                  <option value="Actively Applying">Actively applying</option>
                  <option value="Preparing for Interviews">Preparing for interviews</option>
                  <option value="Open to Offers">Open to offers</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Preferred location</label>
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
              <Save className="h-4 w-4" /> Save job search details
            </Button>
          </form>
        ) : (
          <div className="space-y-6 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                <span className="text-muted-foreground font-medium text-xs block">Job search status</span>
                <Badge variant="blue" className="text-xs">
                  {seekingEmploymentDetails?.jobSearchStatus || 'Actively applying'}
                </Badge>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                <span className="text-muted-foreground font-medium text-xs flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Preferred location
                </span>
                <span className="font-semibold text-lg text-foreground">
                  {seekingEmploymentDetails?.preferredLocation || 'India'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                <span className="text-muted-foreground font-medium text-xs flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-primary" /> Expected salary
                </span>
                <span className="font-semibold text-lg text-primary">
                  ₹{((seekingEmploymentDetails?.expectedSalary || 600000) / 100000).toFixed(1)} LPA
                </span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-surface-secondary/50 border border-border flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-semibold text-base text-foreground flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" /> Assessment readiness
                </span>
                <p className="text-muted-foreground text-xs">
                  Solve 20-question skill evaluations to prove technical competence.
                </p>
              </div>

              <Link href="/assessment">
                <Button variant="primary" className="gap-1.5 shrink-0">
                  <span>Take assessment</span> <ArrowRight className="h-4 w-4 text-white" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


