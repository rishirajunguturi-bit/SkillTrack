'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Briefcase, Building, MapPin, Calendar, Star, Edit3, Save, X } from 'lucide-react';

interface CareerOutcomeSectionProps {
  employmentDetails: any;
  onUpdate: (details: any) => void;
  isUpdating?: boolean;
}

export function CareerOutcomeSection({
  employmentDetails,
  onUpdate,
  isUpdating,
}: CareerOutcomeSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: employmentDetails?.companyName || '',
    jobRole: employmentDetails?.jobRole || '',
    industry: employmentDetails?.industry || 'Information Technology',
    employmentType: employmentDetails?.employmentType || 'FULL_TIME',
    joiningDate: employmentDetails?.joiningDate ? employmentDetails.joiningDate.substring(0, 10) : '',
    workLocation: employmentDetails?.workLocation || '',
    trainingRelevance: employmentDetails?.trainingRelevance || 'Highly Relevant',
    jobSatisfaction: employmentDetails?.jobSatisfaction || 4,
    skillsUsedStr: employmentDetails?.skillsUsed?.join(', ') || 'Java, REST APIs, SQL',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      skillsUsed: formData.skillsUsedStr.split(',').map((s: string) => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4 border-b border-border mb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Career outcome
          </CardTitle>
          <CardDescription>
            Verified current employment information, role, and organization details.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Company name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. ABC Technologies"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Job role *</label>
                <input
                  type="text"
                  required
                  value={formData.jobRole}
                  onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g. Information Technology"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Employment type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                >
                  <option value="FULL_TIME">Full time</option>
                  <option value="PART_TIME">Part time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Joining date *</label>
                <input
                  type="date"
                  required
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Work location</label>
                <input
                  type="text"
                  value={formData.workLocation}
                  onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                  placeholder="e.g. Hyderabad, Telangana"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Training relevance</label>
                <select
                  value={formData.trainingRelevance}
                  onChange={(e) => setFormData({ ...formData, trainingRelevance: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                >
                  <option value="Highly Relevant">Highly relevant</option>
                  <option value="Relevant">Relevant</option>
                  <option value="Partially Relevant">Partially relevant</option>
                  <option value="Not Relevant">Not relevant</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Job satisfaction (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.jobSatisfaction}
                  onChange={(e) => setFormData({ ...formData, jobSatisfaction: parseInt(e.target.value, 10) || 4 })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground text-xs block mb-1">Skills used (comma-separated)</label>
              <input
                type="text"
                value={formData.skillsUsedStr}
                onChange={(e) => setFormData({ ...formData, skillsUsedStr: e.target.value })}
                placeholder="e.g. Java, Spring Boot, REST APIs, SQL"
                className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              />
            </div>

            <Button type="submit" variant="primary" isLoading={isUpdating} className="gap-1.5">
              <Save className="h-4 w-4" /> Save employment details
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            {!employmentDetails?.companyName ? (
              <div className="p-4 text-center text-muted-foreground bg-surface-secondary/50 rounded-xl border border-dashed border-border space-y-2">
                <p className="font-semibold text-foreground text-base">Complete your employment information</p>
                <p className="text-xs text-muted-foreground">Click "Edit details" to record your company, job role, and location.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <div className="text-muted-foreground font-medium flex items-center gap-1.5 text-xs">
                    <Building className="h-3.5 w-3.5 text-primary" /> Company
                  </div>
                  <div className="font-semibold text-base text-foreground">
                    {employmentDetails.companyName}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <div className="text-muted-foreground font-medium flex items-center gap-1.5 text-xs">
                    <Briefcase className="h-3.5 w-3.5 text-primary" /> Current role
                  </div>
                  <div className="font-semibold text-base text-foreground">
                    {employmentDetails.jobRole}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <div className="text-muted-foreground font-medium flex items-center gap-1.5 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Location
                  </div>
                  <div className="font-semibold text-base text-foreground">
                    {employmentDetails.workLocation || 'Hyderabad, India'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <div className="text-muted-foreground font-medium text-xs">Employment type</div>
                  <Badge variant="blue" className="text-xs">
                    {employmentDetails.employmentType?.replace(/_/g, ' ') || 'Full time'}
                  </Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <div className="text-muted-foreground font-medium flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Joining date
                  </div>
                  <div className="font-semibold text-sm text-foreground">
                    {employmentDetails.joiningDate ? new Date(employmentDetails.joiningDate).toLocaleDateString() : 'Not set'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <div className="text-muted-foreground font-medium flex items-center gap-1.5 text-xs">
                    <Star className="h-3.5 w-3.5 text-primary" /> Job satisfaction
                  </div>
                  <div className="font-semibold text-sm text-primary">
                    {employmentDetails.jobSatisfaction || 4} / 5
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


