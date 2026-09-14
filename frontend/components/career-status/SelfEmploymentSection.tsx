'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Building, Save, Edit3, X } from 'lucide-react';

interface SelfEmploymentSectionProps {
  selfEmploymentDetails: any;
  onUpdate: (details: any) => void;
  isUpdating?: boolean;
}

export function SelfEmploymentSection({
  selfEmploymentDetails,
  onUpdate,
  isUpdating,
}: SelfEmploymentSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState(selfEmploymentDetails?.businessName || '');
  const [businessType, setBusinessType] = useState(selfEmploymentDetails?.businessType || 'Freelancing / Agency');
  const [businessStatus, setBusinessStatus] = useState(selfEmploymentDetails?.businessStatus || 'Startup');
  const [currentIncome, setCurrentIncome] = useState(selfEmploymentDetails?.currentIncome || 500000);
  const [numberOfEmployees, setNumberOfEmployees] = useState(selfEmploymentDetails?.numberOfEmployees || 1);
  const [industry, setIndustry] = useState(selfEmploymentDetails?.industry || 'Software & IT Services');
  const [skillsUsedStr, setSkillsUsedStr] = useState(selfEmploymentDetails?.skillsUsed?.join(', ') || 'Full-Stack Web Development, REST APIs');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      businessName,
      businessType,
      businessStatus,
      currentIncome,
      numberOfEmployees,
      industry,
      skillsUsed: skillsUsedStr.split(',').map((s: string) => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4 border-b border-border mb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Self-employment & business information
          </CardTitle>
          <CardDescription>
            Record startup details, freelancing ventures, or independent agency information.
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
                <label className="font-medium text-foreground text-xs block mb-1">Business name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Dev Studio"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Business type</label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g. Software Agency"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Business status</label>
                <select
                  value={businessStatus}
                  onChange={(e) => setBusinessStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                >
                  <option value="Startup">Startup</option>
                  <option value="Freelancing">Freelancing</option>
                  <option value="Consultancy">Consultancy</option>
                  <option value="Established Business">Established business</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Current annual income (₹)</label>
                <input
                  type="number"
                  value={currentIncome}
                  onChange={(e) => setCurrentIncome(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 500000"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Number of employees</label>
                <input
                  type="number"
                  value={numberOfEmployees}
                  onChange={(e) => setNumberOfEmployees(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Technology / IT Services"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground text-xs block mb-1">Skills used (comma-separated)</label>
              <input
                type="text"
                value={skillsUsedStr}
                onChange={(e) => setSkillsUsedStr(e.target.value)}
                placeholder="e.g. React, Node.js, Cloud Services"
                className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              />
            </div>

            <Button type="submit" variant="primary" isLoading={isUpdating} className="gap-1.5">
              <Save className="h-4 w-4" /> Save self-employment details
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            {!selfEmploymentDetails?.businessName ? (
              <div className="p-4 text-center text-muted-foreground bg-surface-secondary/50 rounded-xl border border-dashed border-border space-y-2">
                <p className="font-semibold text-foreground text-base">Provide business details</p>
                <p className="text-xs text-muted-foreground">Click "Edit details" to record your business name, status, and income.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 space-y-1">
                  <span className="text-primary font-medium text-xs block">Business name</span>
                  <span className="font-semibold text-lg text-foreground">
                    {selfEmploymentDetails.businessName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-muted-foreground font-medium text-xs block">Business status</span>
                  <Badge variant="blue" className="text-xs">
                    {selfEmploymentDetails.businessStatus || 'Startup'}
                  </Badge>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-muted-foreground font-medium text-xs block">Annual income</span>
                  <span className="font-semibold text-lg text-primary">
                    ₹{((selfEmploymentDetails.currentIncome || 500000) / 100000).toFixed(1)} LPA
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


