'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, Edit3, Save, X, Info } from 'lucide-react';

interface SalaryGrowthSectionProps {
  salaryDetails: any;
  onUpdate: (details: any) => void;
  isUpdating?: boolean;
}

export function SalaryGrowthSection({
  salaryDetails,
  onUpdate,
  isUpdating,
}: SalaryGrowthSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [startingSalary, setStartingSalary] = useState<number>(salaryDetails?.startingSalary || 450000);
  const [previousSalary, setPreviousSalary] = useState<number>(salaryDetails?.previousSalary || 450000);
  const [currentSalary, setCurrentSalary] = useState<number>(salaryDetails?.currentSalary || 600000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      startingSalary,
      previousSalary,
      currentSalary,
    });
    setIsEditing(false);
  };

  const hasPreviousSalary = previousSalary > 0;
  const growthAmount = currentSalary - previousSalary;
  const growthPct = hasPreviousSalary ? Number(((growthAmount / previousSalary) * 100).toFixed(2)) : 0;

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4 border-b border-border mb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Salary & growth
          </CardTitle>
          <CardDescription>
            Compensation milestones and automated wage progression analytics.
          </CardDescription>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs gap-1.5"
        >
          {isEditing ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
          <span>{isEditing ? 'Cancel' : 'Edit salary'}</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Starting salary (₹ per annum) *</label>
                <input
                  type="number"
                  required
                  value={startingSalary}
                  onChange={(e) => setStartingSalary(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 450000"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Previous salary (₹ per annum) *</label>
                <input
                  type="number"
                  required
                  value={previousSalary}
                  onChange={(e) => setPreviousSalary(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 450000"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground text-xs block mb-1">Current salary (₹ per annum) *</label>
                <input
                  type="number"
                  required
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 600000"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-secondary border border-border text-muted-foreground flex items-center gap-2 text-xs">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <span>Salary growth amount and percentage are calculated automatically.</span>
            </div>

            <Button type="submit" variant="primary" isLoading={isUpdating} className="gap-1.5">
              <Save className="h-4 w-4" /> Save salary information
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                <span className="text-muted-foreground font-medium text-xs block">Starting salary</span>
                <span className="text-xl font-bold text-foreground">
                  ₹{(startingSalary / 100000).toFixed(2)} LPA
                </span>
                <span className="text-xs text-muted-foreground block">₹{startingSalary.toLocaleString()} / year</span>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                <span className="text-muted-foreground font-medium text-xs block">Previous salary</span>
                <span className="text-xl font-bold text-foreground">
                  ₹{(previousSalary / 100000).toFixed(2)} LPA
                </span>
                <span className="text-xs text-muted-foreground block">₹{previousSalary.toLocaleString()} / year</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 space-y-1">
                <span className="text-primary font-medium text-xs block">Current salary</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{(currentSalary / 100000).toFixed(2)} LPA
                </span>
                <span className="text-xs text-muted-foreground block">₹{currentSalary.toLocaleString()} / year</span>
              </div>
            </div>

            {/* Growth Metrics */}
            {!hasPreviousSalary ? (
              <div className="p-3 text-muted-foreground bg-surface-secondary/50 rounded-lg border border-border flex items-center gap-2 text-xs">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>Salary growth will be calculated once previous salary information is available.</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-base text-foreground block">Automated wage progression</span>
                  <p className="text-xs text-muted-foreground">Calculated growth between previous and current salary.</p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground font-medium block">Growth amount</span>
                    <span className="font-bold text-base text-primary">
                      +₹{(growthAmount / 100000).toFixed(2)} LPA
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium block">Growth rate</span>
                    <Badge variant="success" className="text-xs">
                      +{growthPct}%
                    </Badge>
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


