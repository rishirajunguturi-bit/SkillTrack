'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Trophy,
  Sparkles,
  TrendingUp,
  Target,
  Brain,
  BookOpen,
  Calendar,
  RotateCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Award,
  Code,
} from 'lucide-react';
import { toast } from 'sonner';
import { progressService } from '@/services/progress.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/ui/PageHeader';
import { CareerReadinessData } from '@/types/progress';
import { useChartTheme } from '@/lib/hooks/useChartTheme';

export default function ProgressPage() {
  const queryClient = useQueryClient();
  const chartTheme = useChartTheme();

  const { data, isLoading, error } = useQuery<CareerReadinessData>({
    queryKey: ['career-readiness'],
    queryFn: () => progressService.getStudentProgress(),
    staleTime: 5 * 60 * 1000,
  });

  const refreshMutation = useMutation({
    mutationFn: () => progressService.refreshProgress(),
    onSuccess: (newData) => {
      queryClient.setQueryData(['career-readiness'], newData);
      toast.success('Career readiness index recalculated!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to refresh progress analysis.');
    },
  });

  if (isLoading) {
    return (
      <PageWrapper className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-36 w-full rounded-xl bg-surface-secondary" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-xl bg-surface-secondary" />
          <Skeleton className="h-28 rounded-xl bg-surface-secondary" />
          <Skeleton className="h-28 rounded-xl bg-surface-secondary" />
          <Skeleton className="h-28 rounded-xl bg-surface-secondary" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl bg-surface-secondary" />
      </PageWrapper>
    );
  }

  if (error || !data) {
    const errObj = (error as any)?.response?.data;
    const errCode = errObj?.code;
    const errMsg = errObj?.message;

    if (errCode === 'TARGET_ROLE_REQUIRED') {
      return (
        <PageWrapper className="max-w-4xl mx-auto py-12 text-center space-y-6">
          <Card className="p-8 rounded-xl border border-border text-foreground max-w-md mx-auto space-y-4 shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/50">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Target career role required</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {errMsg || 'Please select a target career role in your profile to view progress analytics.'}
            </p>
            <Link href="/profile">
              <Button variant="primary" className="w-full text-xs gap-2">
                Select target career role
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </PageWrapper>
      );
    }

    if (errCode === 'SKILL_GAP_REQUIRED') {
      return (
        <PageWrapper className="max-w-4xl mx-auto py-12 text-center space-y-6">
          <Card className="p-8 rounded-xl border border-border text-foreground max-w-md mx-auto space-y-4 shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/50">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Skill gap analysis required</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {errMsg || 'Run your Skill Gap Analysis first to calculate readiness metrics.'}
            </p>
            <Link href="/skill-gap">
              <Button variant="primary" className="w-full text-xs gap-2">
                Run skill gap analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </PageWrapper>
      );
    }

    return (
      <PageWrapper className="max-w-4xl mx-auto py-12 text-center space-y-6">
        <Card className="p-8 rounded-xl border border-rose-200 dark:border-rose-900/40 text-foreground max-w-md mx-auto space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
            <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Career readiness intelligence unavailable</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {errMsg || 'An unexpected error occurred while calculating career readiness analytics.'}
          </p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['career-readiness'] })}
            variant="destructive"
            className="w-full text-xs gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </Button>
        </Card>
      </PageWrapper>
    );
  }

  const {
    careerRole,
    readinessScore = 0,
    readinessCategory,
    dimensions,
    biggestGaps = [],
    strongestSkills = [],
    skillImprovements = [],
    achievements = [],
    history = [],
    aiSummary,
    aiInsight,
    nextActionExplanation,
    isAiGenerated,
  } = data;

  const chartData = history.map((item) => ({
    date: new Date(item.snapshotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.readinessScore,
    skill: item.skillReadinessScore,
    assessment: item.assessmentReadinessScore,
  }));

  const formattedCategory = readinessCategory.replace('_', ' ');

  return (
    <PageWrapper className="max-w-6xl mx-auto space-y-6">
      {/* Top Header & Navigation Links */}
      <PageHeader
        title="Career readiness & skill growth"
        description="Comprehensive readiness analytics aligned with your target career pathway."
        action={
          <div className="flex items-center gap-1.5 bg-surface-secondary border border-border p-1 rounded-lg shrink-0">
            <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-white shadow-xs">
              Career readiness
            </button>
            <Link href="/progress/growth">
              <button className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                Skill growth
              </button>
            </Link>
            <Link href="/progress/timeline">
              <button className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                Timeline
              </button>
            </Link>
          </div>
        }
      />

      {/* Top Header Banner & Overall Score Gauge */}
      <Card className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="blue" className="gap-1.5 py-1 px-3">
              <Trophy className="h-3.5 w-3.5" />
              Career readiness intelligence
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {formattedCategory}
            </Badge>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Target goal: {careerRole.name}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {aiSummary}
          </p>
        </div>

        {/* Big Radial/Metric Readiness Gauge */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-secondary/50 border border-border shrink-0 text-center space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Placement readiness score</span>
          <div className="text-4xl font-extrabold text-primary">
            {readinessScore}%
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <Button
              onClick={() => refreshMutation.mutate()}
              isLoading={refreshMutation.isPending}
              size="sm"
              variant="secondary"
              className="text-xs h-8 gap-1.5"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Refresh analysis
            </Button>

            <Link href="/progress/growth">
              <Button
                size="sm"
                variant="primary"
                className="text-xs h-8 gap-1.5"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Skill growth
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 4 Dimension Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Code className="h-3.5 w-3.5 text-primary" /> Skill readiness
              </span>
              <span className="font-bold text-primary text-base">
                {dimensions.skillReadiness}%
              </span>
            </div>
            <Progress value={dimensions.skillReadiness} className="h-1.5" />
            <span className="text-xs text-muted-foreground block">Weight: 35%</span>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Brain className="h-3.5 w-3.5 text-primary" /> Assessments
              </span>
              <span className="font-bold text-primary text-base">
                {dimensions.assessmentPerformance}%
              </span>
            </div>
            <Progress value={dimensions.assessmentPerformance} className="h-1.5" />
            <span className="text-xs text-muted-foreground block">Weight: 25%</span>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-primary" /> Roadmap
              </span>
              <span className="font-bold text-primary text-base">
                {dimensions.roadmapProgress}%
              </span>
            </div>
            <Progress value={dimensions.roadmapProgress} className="h-1.5" />
            <span className="text-xs text-muted-foreground block">Weight: 25%</span>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Study consistency
              </span>
              <span className="font-bold text-primary text-base">
                {dimensions.studyConsistency}%
              </span>
            </div>
            <Progress value={dimensions.studyConsistency} className="h-1.5" />
            <span className="text-xs text-muted-foreground block">Weight: 15%</span>
          </CardContent>
        </Card>
      </div>

      {/* AI Insight & Primary Next Action Box */}
      <Card className="border border-primary/30 bg-blue-50/30 dark:bg-blue-950/20 rounded-xl shadow-xs">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="blue" className="text-xs gap-1">
                  <Sparkles className="h-3 w-3" />
                  {isAiGenerated ? 'AI readiness coach' : 'Measured intelligence'}
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-foreground leading-snug">
                {aiInsight}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Recommended step: </span>
                {nextActionExplanation}
              </p>
            </div>

            {biggestGaps.length > 0 && (
              <Link href="/skill-gap" className="shrink-0">
                <Button variant="primary" className="text-xs gap-1.5">
                  Close primary gaps
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recharts Career Readiness Historical Timeline */}
      <Card className="rounded-xl shadow-xs">
        <CardHeader className="p-6 pb-2 border-b border-border flex flex-row justify-between items-center">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Career readiness index growth timeline
          </CardTitle>
          <span className="text-xs text-muted-foreground">Snapshots ({history.length})</span>
        </CardHeader>
        <CardContent className="p-6">
          {chartData.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">
              Initial readiness snapshot recorded today. Historical trend data will accumulate as you complete learning goals.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: chartTheme.secondaryTextColor }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: chartTheme.secondaryTextColor }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.tooltipBg,
                      borderColor: chartTheme.tooltipBorder,
                      borderRadius: '8px',
                      color: chartTheme.tooltipText,
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Readiness Index"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#readinessGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Grid: Biggest Gaps vs Strongest Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biggest Skill Gaps */}
        <Card className="border-border rounded-xl shadow-xs">
          <CardHeader className="p-6 pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Primary skill gaps relative to role
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {biggestGaps.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">No major skill gaps remaining!</div>
            ) : (
              biggestGaps.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-foreground font-semibold">{item.name}</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      Current: {item.currentProficiency}% / Target: {item.targetProficiency}%
                    </span>
                  </div>
                  <Progress value={item.currentProficiency} className="h-1.5" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Strongest Skills */}
        <Card className="border-border rounded-xl shadow-xs">
          <CardHeader className="p-6 pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Strongest target career skills
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {strongestSkills.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">Work towards reaching 65%+ in target skills.</div>
            ) : (
              strongestSkills.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-foreground font-semibold">{item.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {item.currentProficiency}% verified
                    </span>
                  </div>
                  <Progress value={item.currentProficiency} className="h-1.5" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Before vs After Skill Development Gains Table */}
      {skillImprovements.length > 0 && (
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="p-6 pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Skill development — before vs after gains
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {skillImprovements.map((item) => (
                <div
                  key={item.skillName}
                  className="flex justify-between items-center p-3.5 rounded-xl border border-border bg-surface-secondary/50"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-sm text-foreground">{item.skillName}</h4>
                    <span className="text-xs text-muted-foreground">
                      Baseline: {item.initialProficiency}% → Current: {item.currentProficiency}%
                    </span>
                  </div>
                  <Badge variant="blue" className="text-xs font-semibold">
                    +{item.changePoints} points
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unlocked Milestones Gallery */}
      <Card className="rounded-xl shadow-xs">
        <CardHeader className="p-6 pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Career achievements & milestones unlocked ({achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {achievements.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">
              Complete your first skill assessment or roadmap topic to unlock milestones!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-xl bg-surface-secondary/50 border border-border space-y-2 flex items-start gap-3"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 dark:border-blue-900/50">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{item.description}</p>
                    <span className="text-xs text-primary font-medium block pt-1">
                      Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}


