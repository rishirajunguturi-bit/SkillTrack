'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GraduationCap, Save, Edit3, X } from 'lucide-react';

interface HigherStudiesSectionProps {
  higherStudiesDetails: any;
  onUpdate: (details: any) => void;
  isUpdating?: boolean;
}

export function HigherStudiesSection({
  higherStudiesDetails,
  onUpdate,
  isUpdating,
}: HigherStudiesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [institutionName, setInstitutionName] = useState(higherStudiesDetails?.institutionName || '');
  const [programme, setProgramme] = useState(higherStudiesDetails?.programme || 'M.Tech');
  const [fieldOfStudy, setFieldOfStudy] = useState(higherStudiesDetails?.fieldOfStudy || 'Computer Science & Engineering');
  const [location, setLocation] = useState(higherStudiesDetails?.location || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      institutionName,
      programme,
      fieldOfStudy,
      location,
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4 border-b border-border mb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Higher studies information
          </CardTitle>
          <CardDescription>
            Log enrolled institution, degree programme, and academic field of study.
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
                <label className="font-medium text-foreground text-xs block mb-1">Institution name *</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. IIT Hyderabad / IISc"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Programme *</label>
                <input
                  type="text"
                  required
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  placeholder="e.g. M.Tech / MS / MBA"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Field of study</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" isLoading={isUpdating} className="gap-1.5">
              <Save className="h-4 w-4" /> Save higher studies info
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            {!higherStudiesDetails?.institutionName ? (
              <div className="p-4 text-center text-muted-foreground bg-surface-secondary/50 rounded-xl border border-dashed border-border space-y-2">
                <p className="font-semibold text-foreground text-base">Provide higher studies information</p>
                <p className="text-xs text-muted-foreground">Click "Edit details" to record institution, degree programme, and specialization.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 space-y-1">
                  <span className="text-primary font-medium text-xs block">Institution</span>
                  <span className="font-semibold text-lg text-foreground">
                    {higherStudiesDetails.institutionName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-muted-foreground font-medium text-xs block">Programme</span>
                  <span className="font-semibold text-lg text-foreground">
                    {higherStudiesDetails.programme}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-muted-foreground font-medium text-xs block">Field of study</span>
                  <span className="font-semibold text-lg text-foreground">
                    {higherStudiesDetails.fieldOfStudy}
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


