'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Target,
  Brain,
  Sparkles,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  Zap,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';
import { skillGapService } from '@/services/skillGap.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/ui/PageHeader';
import { SkillGapAnalysis } from '@/types/skillGap';

export default function SkillGapPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'improvement' | 'strong' | 'unassessed'>('all');

  const { data: analysis, isLoading, error } = useQuery<SkillGapAnalysis>({
    queryKey: ['skill-gap-analysis'],
    queryFn: () => skillGapService.getStudentSkillGap(),
    staleTime: 5 * 60 * 1000,
  });

  const analyzeMutation = useMutation({
    mutationFn: () => skillGapService.recalculateSkillGap(),
    onSuccess: (data) => {
      queryClient.setQueryData(['skill-gap-analysis'], data);
      toast.success('Skill gap analysis updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to recalculate skill gap analysis.');
    },
  });

  if (isLoading) {
    return (
      <PageWrapper className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-28 w-full rounded-xl bg-surface-secondary" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl bg-surface-secondary" />
          <Skeleton className="h-64 md:col-span-2 rounded-xl bg-surface-secondary" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl bg-surface-secondary" />
      </PageWrapper>
    );
  }

  if (error || !analysis) {
    const errMsg = (error as any)?.response?.data?.message || 'No target career role selected.';
    return (
      <PageWrapper className="max-w-4xl mx-auto py-12 text-center space-y-6">
        <div className="p-8 rounded-xl bg-card border border-border text-foreground max-w-md mx-auto space-y-4 shadow-xs">
          <div className="h-14 w-14 rounded-full bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
            <Target className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Target role required</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{errMsg}</p>
          <Link href="/profile">
            <Button variant="primary" className="w-full text-xs gap-2">
              Select target career role
              <ArrowRight className="h-4 w-4 text-white" />
            </Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const {
    careerRoleName,
    overallReadiness,
    readinessLabel,
    skills = [],
    criticalGaps = [],
    needsImprovement = [],
    strongSkills = [],
    unassessedSkills = [],
    topPriorities = [],
    aiSummary,
    aiInsights = [],
  } = analysis;

  const labelBadgeMap: Record<string, { label: string; variant: 'blue' | 'success' | 'outline' | 'error' }> = {
    READY: { label: 'Ready for role', variant: 'blue' },
    NEARLY_READY: { label: 'Nearly ready', variant: 'success' },
    DEVELOPING: { label: 'Developing', variant: 'outline' },
    EARLY_STAGE: { label: 'Early stage', variant: 'error' },
  };

  const currentLabelInfo = labelBadgeMap[readinessLabel] || labelBadgeMap.DEVELOPING;

  // Filter skills by active tab
  const displayedSkills =
    activeTab === 'critical'
      ? criticalGaps
      : activeTab === 'improvement'
      ? needsImprovement
      : activeTab === 'strong'
      ? strongSkills
      : activeTab === 'unassessed'
      ? unassessedSkills
      : skills;

  return (
    <PageWrapper className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title={`${careerRoleName} Skill Gap Analysis`}
        description="Real-time evaluation against role requirements using assessment data and profile skills."
        action={
          <Button
            onClick={() => analyzeMutation.mutate()}
            isLoading={analyzeMutation.isPending}
            variant="secondary"
            className="text-xs gap-2 shrink-0"
          >
            <RotateCw className={`h-4 w-4 ${analyzeMutation.isPending ? 'animate-spin' : ''}`} />
            Recalculate analysis
          </Button>
        }
      />

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Readiness Ring Card */}
        <Card className="rounded-xl flex flex-col justify-between">
          <CardHeader className="p-6 pb-2 border-b border-border">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Career skill readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-surface-secondary"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="#2563EB"
                  strokeWidth="12"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * overallReadiness) / 100}
                  className="transition-all duration-1000 ease-out"
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-primary">
                  {overallReadiness}%
                </span>
                <span className="text-xs text-muted-foreground font-medium">Readiness</span>
              </div>
            </div>

            <Badge variant={currentLabelInfo.variant} className="px-3 py-1 text-xs">
              {currentLabelInfo.label}
            </Badge>
          </CardContent>
        </Card>

        {/* AI Strategic Insights Card */}
        <Card className="md:col-span-2 rounded-xl">
          <CardHeader className="p-6 pb-2 border-b border-border flex flex-row justify-between items-center">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI strategic insights & advisor summary
            </CardTitle>
            <Badge variant="blue" className="text-xs">
              AI advisor
            </Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <p className="text-foreground leading-relaxed font-medium bg-surface-secondary/50 p-4 rounded-xl border border-border">
              {aiSummary}
            </p>

            {aiInsights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-xs">Key priorities:</h4>
                <ul className="space-y-1.5">
                  {aiInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Priorities Section */}
      {topPriorities.length > 0 && (
        <Card className="rounded-xl">
          <CardHeader className="p-6 pb-3 border-b border-border">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Top recommended focus areas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topPriorities.slice(0, 3).map((item, idx) => (
              <div
                key={item.skillId}
                className="p-4 rounded-xl bg-surface-secondary/50 border border-border space-y-2 relative"
              >
                <div className="flex justify-between items-start">
                  <span className="h-5 w-5 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <Badge
                    variant="blue"
                    className="text-xs"
                  >
                    {item.priority}
                  </Badge>
                </div>
                <h4 className="font-semibold text-base text-foreground">{item.name}</h4>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Current: {item.currentProficiency}%</span>
                  <span className="font-semibold text-primary">Target: {item.recommendedProficiency}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skill Categories Tabs & Grids */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-border pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-primary text-white font-semibold'
                : 'bg-surface-secondary border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            All skills ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'critical'
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300'
            }`}
          >
            Critical gaps ({criticalGaps.length})
          </button>
          <button
            onClick={() => setActiveTab('improvement')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'improvement'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300'
            }`}
          >
            Needs improvement ({needsImprovement.length})
          </button>
          <button
            onClick={() => setActiveTab('strong')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'strong'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            Strong skills ({strongSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('unassessed')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'unassessed'
                ? 'bg-surface-secondary text-foreground font-semibold border border-border'
                : 'bg-surface-secondary/50 border border-border text-muted-foreground'
            }`}
          >
            Unassessed ({unassessedSkills.length})
          </button>
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedSkills.map((item) => {
            const isCritical = item.status === 'CRITICAL_GAP' || (item.status === 'UNASSESSED' && item.importance === 'CRITICAL');
            const isStrong = item.status === 'STRONG';

            return (
              <Card
                key={item.skillId}
                className={`rounded-xl transition-all border ${
                  isCritical
                    ? 'border-rose-200 dark:border-rose-800/40 bg-rose-50/30 dark:bg-rose-950/10'
                    : isStrong
                    ? 'border-blue-200 dark:border-blue-800/40 bg-blue-50/30 dark:bg-blue-950/10'
                    : 'border-border'
                }`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-foreground">
                          {item.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Importance: {item.importance} • Source: {item.source}
                      </span>
                    </div>

                    <Badge
                      variant="blue"
                      className="text-xs"
                    >
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Benchmark Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Current: <strong className="text-foreground">{item.currentProficiency}%</strong>
                      </span>
                      <span className="text-primary font-semibold">
                        Target: {item.recommendedProficiency}%
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-surface-secondary overflow-hidden relative">
                      <div
                        className={`h-full transition-all ${
                          isStrong
                            ? 'bg-primary'
                            : isCritical
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, item.currentProficiency)}%` }}
                      />
                      {/* Recommended Target Indicator Line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10"
                        style={{ left: `${item.recommendedProficiency}%` }}
                        title={`Target: ${item.recommendedProficiency}%`}
                      />
                    </div>

                    {item.gap > 0 && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-0.5 flex items-center justify-end gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Gap: {item.gap}% points below target
                      </p>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 flex justify-between items-center border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {item.latestAssessmentScore !== undefined
                        ? `Assessed: ${item.latestAssessmentScore}%`
                        : 'Not yet assessed'}
                    </span>

                    <Link href="/assessment">
                      <Button size="sm" variant="ghost" className="text-primary hover:text-primary-hover text-xs gap-1 py-1 h-auto">
                        Take assessment
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-6 rounded-xl bg-surface-secondary/50 border border-border text-foreground flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Ready to close these skill gaps?</h3>
          <p className="text-xs text-muted-foreground">
            Generate your personalized step-by-step learning roadmap tailored to your target career role.
          </p>
        </div>
        <Link href="/learning">
          <Button variant="primary" className="text-xs px-6 gap-2 shrink-0">
            Build learning roadmap
            <ArrowRight className="h-4 w-4 text-white" />
          </Button>
        </Link>
      </div>
    </PageWrapper>
  );
}


