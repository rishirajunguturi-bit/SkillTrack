'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Target,
  Clock,
  Filter,
  RotateCw,
  AlertCircle,
  Brain,
  Award,
  Layers,
  Code,
  BarChart3,
} from 'lucide-react';
import { skillService } from '@/services/skill.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/ui/PageHeader';
import { SkillGrowthData } from '@/types/skillGrowth';
import { useChartTheme } from '@/lib/hooks/useChartTheme';

export default function SkillGrowthPage() {
  const [timeRange, setTimeRange] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const chartTheme = useChartTheme();

  const { data, isLoading, error, refetch, isFetching } = useQuery<SkillGrowthData>({
    queryKey: ['skill-growth', timeRange, categoryFilter],
    queryFn: () => skillService.getSkillGrowth({ timeRange, category: categoryFilter }),
    staleTime: 30 * 1000,
  });

  const timeRangeOptions = [
    { label: 'All time', value: 'all' },
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '3 months', value: '3m' },
    { label: '6 months', value: '6m' },
    { label: '1 year', value: '1y' },
  ];

  const categoriesList = ['ALL', 'Programming', 'Web Development', 'Databases', 'Cloud', 'AI/Data', 'DevOps', 'DSA', 'Core CS'];

  const getTrendBadge = (trend: string, growthPoints: number) => {
    if (trend === 'IMPROVING' || growthPoints > 0) {
      return (
        <Badge variant="success" className="text-xs gap-1">
          <TrendingUp className="h-3 w-3" /> Improving
        </Badge>
      );
    }
    if (trend === 'DECLINING' || growthPoints < 0) {
      return (
        <Badge variant="rose" className="text-xs gap-1">
          <TrendingDown className="h-3 w-3" /> Declining
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs gap-1">
        <Minus className="h-3 w-3" /> Stable
      </Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'ASSESSMENT':
        return <Badge variant="blue" className="text-xs">Assessment</Badge>;
      case 'PROFILE':
        return <Badge variant="secondary" className="text-xs">Profile</Badge>;
      case 'ADMIN':
        return <Badge variant="warning" className="text-xs">Verified Admin</Badge>;
      case 'LEARNING':
        return <Badge variant="success" className="text-xs">Learning</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">System Baseline</Badge>;
    }
  };

  return (
    <PageWrapper className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Navigation Tabs Header */}
      <PageHeader
        title="Skill growth"
        description="See how your technical skills have improved over time."
        action={
          <div className="flex items-center gap-1.5 bg-surface-secondary border border-border p-1 rounded-lg shrink-0">
            <Link href="/progress">
              <button className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                Career readiness
              </button>
            </Link>
            <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-white shadow-xs">
              Skill growth
            </button>
            <Link href="/progress/timeline">
              <button className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                Timeline
              </button>
            </Link>
          </div>
        }
      />

      {/* REFRESH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border shadow-xs">
        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeRange(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                timeRange === opt.value
                  ? 'bg-primary text-white shadow-xs font-semibold'
                  : 'bg-surface-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category & Refresh */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface border border-input text-xs font-medium text-foreground rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-xs h-8"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-xl bg-surface-secondary" />
            <Skeleton className="h-24 rounded-xl bg-surface-secondary" />
            <Skeleton className="h-24 rounded-xl bg-surface-secondary" />
            <Skeleton className="h-24 rounded-xl bg-surface-secondary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-64 rounded-xl bg-surface-secondary" />
            <Skeleton className="h-64 rounded-xl bg-surface-secondary" />
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !isLoading && (
        <Card className="border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-center p-8 rounded-xl space-y-4 max-w-md mx-auto">
          <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Unable to load skill growth data.</h3>
            <p className="text-xs text-muted-foreground mt-1">Please check your connection and try again.</p>
          </div>
          <Button onClick={() => refetch()} variant="primary" className="text-xs mx-auto">
            Retry
          </Button>
        </Card>
      )}

      {/* EMPTY STATE */}
      {data && data.summary.totalSkills === 0 && !isLoading && !error && (
        <Card className="text-center p-12 rounded-xl space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/50">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              No skill history yet
            </h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Complete assessments or update your skills to start tracking your growth over time.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/assessment">
              <Button variant="primary" className="text-xs gap-2">
                <Brain className="h-4 w-4" />
                Take assessment
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="secondary" className="text-xs gap-2">
                Add skills to profile
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* MAIN DASHBOARD CONTENT */}
      {data && data.summary.totalSkills > 0 && !isLoading && (
        <div className="space-y-8">
          {/* METRIC SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {data.summary.totalSkills}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Total skills</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs space-y-1">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                {data.summary.improvingCount}
              </div>
              <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Improving</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs space-y-1">
              <div className="text-2xl font-bold text-muted-foreground flex items-center justify-center gap-1">
                <Minus className="h-5 w-5 text-muted-foreground" />
                {data.summary.stableCount}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Stable</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs space-y-1">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
                <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                {data.summary.decliningCount}
              </div>
              <div className="text-xs font-medium text-rose-600 dark:text-rose-400">Declining</div>
            </div>
          </div>

          {/* HIGHLIGHTS GRID: MOST IMPROVED vs HIGHEST CURRENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Most Improved Skill */}
            <Card className="rounded-xl shadow-xs">
              <CardHeader className="p-6 pb-2 border-b border-border">
                <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Most improved skill
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-3 space-y-3">
                {data.highlights.mostImproved ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-foreground">
                        {data.highlights.mostImproved.skillName}
                      </h3>
                      <Badge variant="blue" className="text-xs font-semibold">
                        +{data.highlights.mostImproved.growthPoints} pts
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Started at {data.highlights.mostImproved.initialProficiency}% → Currently at{' '}
                      <span className="font-semibold text-primary">{data.highlights.mostImproved.currentProficiency}%</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No skills have recorded proficiency gains in this time period yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Highest Current Skill */}
            <Card className="rounded-xl shadow-xs">
              <CardHeader className="p-6 pb-2 border-b border-border">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Highest current skill
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-3 space-y-3">
                {data.highlights.highestCurrent ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-foreground">
                        {data.highlights.highestCurrent.skillName}
                      </h3>
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {data.highlights.highestCurrent.currentProficiency}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Category: <span className="font-semibold text-foreground">{data.highlights.highestCurrent.category}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No active skills recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* TARGET CAREER ROLE GAP ANALYSIS */}
          {data.careerRoleInfo && data.careerTargetGaps.length > 0 && (
            <Card className="rounded-xl shadow-xs">
              <CardHeader className="p-6 pb-3 border-b border-border">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Target career role requirements ({data.careerRoleInfo.roleName})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.careerTargetGaps.map((gap) => (
                  <div
                    key={gap.skillId}
                    className="p-3 rounded-xl bg-surface-secondary/50 border border-border space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground">{gap.skillName}</span>
                      {gap.status === 'TARGET_REACHED' ? (
                        <Badge variant="success" className="text-xs">Target reached</Badge>
                      ) : (
                        <Badge variant="rose" className="text-xs">Gap: {gap.gapPoints} pts</Badge>
                      )}
                    </div>
                    <Progress value={gap.currentProficiency} className="h-1.5" />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Current: {gap.currentProficiency}%</span>
                      <span>Target: {gap.targetProficiency}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* SKILL CARDS WITH RECHARTS PROGRESSION LINES */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Technical skill growth progression cards ({data.skillCards.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.skillCards.map((card) => {
                const trendBadge = getTrendBadge(card.trend, card.growthPoints);
                const growthLabel =
                  card.growthPoints > 0
                    ? `+${card.growthPoints} pts`
                    : card.growthPoints < 0
                    ? `${card.growthPoints} pts`
                    : `0 pts`;

                return (
                  <Card key={card.skillId} className="rounded-xl flex flex-col justify-between shadow-xs">
                    <CardHeader className="p-5 pb-3 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {card.category}
                        </Badge>
                        {trendBadge}
                      </div>

                      <div className="flex items-baseline justify-between">
                        <h3 className="font-bold text-xl text-foreground">
                          {card.skillName}
                        </h3>
                        <div className="text-right">
                          <span className="text-2xl font-extrabold text-primary">
                            {card.currentProficiency}%
                          </span>
                        </div>
                      </div>

                      {/* Numeric Started / Current / Growth */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-surface-secondary/50 border border-border text-center">
                        <div>
                          <div className="text-xs text-muted-foreground font-medium">Started</div>
                          <div className="text-xs font-bold text-foreground">
                            {card.initialProficiency}%
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground font-medium">Current</div>
                          <div className="text-xs font-bold text-primary">
                            {card.currentProficiency}%
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground font-medium">Growth</div>
                          <div
                            className={`text-xs font-bold ${
                              card.growthPoints > 0
                                ? 'text-primary'
                                : card.growthPoints < 0
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {growthLabel}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-0 space-y-3">
                      {/* Recharts Line Chart or Single Data Point Notice */}
                      {card.historyPoints.length > 1 ? (
                        <div className="h-32 w-full pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={card.historyPoints}
                              margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                              <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartTheme.secondaryTextColor }} />
                              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: chartTheme.secondaryTextColor }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: chartTheme.tooltipBg,
                                  borderColor: chartTheme.tooltipBorder,
                                  borderRadius: '8px',
                                  color: chartTheme.tooltipText,
                                  fontSize: '11px',
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="proficiency"
                                name="Proficiency %"
                                stroke="#2563EB"
                                strokeWidth={2.5}
                                dot={{ r: 3.5, fill: '#2563EB' }}
                                activeDot={{ r: 5 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-surface-secondary/50 border border-border text-center space-y-1">
                          <div className="text-xs font-semibold text-foreground">
                            Baseline: {card.currentProficiency}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Not enough historical data yet.
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CATEGORY ANALYSIS BREAKDOWN */}
          {data.categorySummaries.length > 0 && (
            <Card className="rounded-xl shadow-xs">
              <CardHeader className="p-6 pb-3 border-b border-border">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Category level performance analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.categorySummaries.map((cat) => (
                  <div
                    key={cat.category}
                    className="p-3.5 rounded-xl border border-border bg-surface-secondary/50 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-foreground">{cat.category}</span>
                      <Badge variant="secondary" className="text-xs">
                        {cat.skillCount} {cat.skillCount === 1 ? 'skill' : 'skills'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Avg proficiency</span>
                        <span className="font-bold text-primary">{cat.avgCurrentProficiency}%</span>
                      </div>
                      <Progress value={cat.avgCurrentProficiency} className="h-1.5" />
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Avg growth</span>
                      <span className={cat.avgGrowthPoints >= 0 ? 'text-primary font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                        {cat.avgGrowthPoints >= 0 ? `+${cat.avgGrowthPoints}` : cat.avgGrowthPoints} pts
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* SKILL HISTORY TIMELINE LOG */}
          {data.historyTimeline.length > 0 && (
            <Card className="rounded-xl shadow-xs">
              <CardHeader className="p-6 pb-3 border-b border-border">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Historical skill progression log ({data.historyTimeline.length} entries)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {data.historyTimeline.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-border bg-surface-secondary/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
                        <Code className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{item.skillName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{new Date(item.recordedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {getSourceBadge(item.source)}
                      <span className="font-bold text-primary text-base">
                        {item.proficiency}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </PageWrapper>
  );
}


