'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Clock,
  Search,
  ArrowUpDown,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Eye,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { assessmentService } from '@/services/assessment.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/ui/PageHeader';
import { AssessmentHistoryData, AssessmentAttemptHistoryItem } from '@/types/assessmentHistory';
import { useChartTheme } from '@/lib/hooks/useChartTheme';

export default function AssessmentHistoryPage() {
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [sort, setSort] = useState<string>('latest');
  const [page, setPage] = useState<number>(1);
  const [selectedAttempt, setSelectedAttempt] = useState<AssessmentAttemptHistoryItem | null>(null);
  const chartTheme = useChartTheme();

  const { data, isLoading, error, refetch, isFetching } = useQuery<AssessmentHistoryData>({
    queryKey: ['assessmentHistory', search, timeRange, sort, page],
    queryFn: () =>
      assessmentService.getUserAttemptHistory({
        search,
        timeRange,
        sort,
        page,
        limit: 10,
      }),
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

  const getProficiencyBadge = (proficiency: string) => {
    switch (proficiency) {
      case 'ADVANCED':
        return <Badge variant="success" className="text-xs">Advanced</Badge>;
      case 'INTERMEDIATE':
        return <Badge variant="purple" className="text-xs">Intermediate</Badge>;
      default:
        return <Badge variant="warning" className="text-xs">Beginner</Badge>;
    }
  };

  const getImprovementBadge = (improvementPoints: number | null) => {
    if (improvementPoints === null) {
      return (
        <Badge variant="secondary" className="text-xs">
          First attempt
        </Badge>
      );
    }
    if (improvementPoints > 0) {
      return (
        <Badge variant="success" className="text-xs gap-1">
          <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          +{improvementPoints} pts
        </Badge>
      );
    }
    if (improvementPoints < 0) {
      return (
        <Badge variant="rose" className="text-xs gap-1">
          <TrendingDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
          {improvementPoints} pts
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs gap-1">
        <Minus className="h-3 w-3" />
        0 pts
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const chartData = (data?.attempts || []).slice().reverse().map((att) => ({
    date: new Date(att.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: att.percentage,
    assessment: att.assessmentTitle,
    attempt: `Attempt #${att.attemptNumber}`,
  }));

  return (
    <PageWrapper className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <PageHeader
        title="Assessment history"
        description="Track your technical evaluation performance and score progression over time."
        action={
          <div className="flex items-center gap-2 bg-surface-secondary p-1 rounded-lg border border-border">
            <Link href="/assessment">
              <button className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
                Available assessments
              </button>
            </Link>
            <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-surface text-foreground shadow-xs">
              Assessment history
            </button>
          </div>
        }
      />

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col gap-4 p-4 rounded-xl bg-card border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Input
              placeholder="Search assessment, skill, or category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 text-xs h-9 bg-surface"
            />
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-surface border border-border text-xs font-medium text-foreground rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest_score">Highest score</option>
              <option value="lowest_score">Lowest score</option>
              <option value="most_improved">Most improved</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2 text-xs h-9"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Time Range Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-border scrollbar-none">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTimeRange(opt.value);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                timeRange === opt.value
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      )}

      {/* ERROR STATE */}
      {error && !isLoading && (
        <Card className="border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-center p-8 rounded-xl space-y-4 max-w-md mx-auto">
          <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Unable to load assessment history</h3>
            <p className="text-xs text-muted-foreground mt-1">Please check your connection and try again.</p>
          </div>
          <Button onClick={() => refetch()} variant="primary" className="text-xs mx-auto">
            Retry
          </Button>
        </Card>
      )}

      {/* EMPTY STATE */}
      {data && data.summary.totalAttempts === 0 && !isLoading && !error && (
        <Card className="p-12 text-center text-muted-foreground rounded-xl max-w-lg mx-auto shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/50 mb-3">
            <Award className="h-8 w-8" />
          </div>
          <div className="space-y-1 mb-4">
            <h2 className="text-base font-semibold text-foreground">
              No assessment history yet
            </h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Complete an assessment to start tracking your performance and improvement over time.
            </p>
          </div>
          <Link href="/assessment">
            <Button variant="primary" className="text-xs gap-2 px-6">
              <Brain className="h-4 w-4" />
              Start assessment
            </Button>
          </Link>
        </Card>
      )}

      {/* MAIN CONTENT */}
      {data && data.summary.totalAttempts > 0 && !isLoading && (
        <div className="space-y-8">
          {/* SUMMARY METRIC CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs text-center space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {data.summary.totalAttempts}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Total attempts</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs text-center space-y-1">
              <div className="text-2xl font-bold text-primary">
                {data.summary.averageScore}%
              </div>
              <div className="text-xs font-medium text-muted-foreground">Average score</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs text-center space-y-1">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {data.summary.bestScore}%
              </div>
              <div className="text-xs font-medium text-muted-foreground">Best score</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs text-center space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {data.summary.latestScore}%
              </div>
              <div className="text-xs font-medium text-muted-foreground">Latest score</div>
            </div>
          </div>

          {/* PERFORMANCE TREND CHART */}
          <Card className="shadow-xs border border-border rounded-xl">
            <CardHeader className="pb-2 border-b border-border flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Assessment score progression trend
              </CardTitle>
              <span className="text-xs text-muted-foreground font-medium">
                {chartData.length} {chartData.length === 1 ? 'attempt' : 'attempts'}
              </span>
            </CardHeader>
            <CardContent className="p-6">
              {chartData.length <= 1 ? (
                <div className="p-6 text-center space-y-2 bg-surface-secondary/50 rounded-xl border border-border">
                  <div className="text-sm font-semibold text-foreground">
                    Baseline attempt recorded ({data.summary.latestScore}%)
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complete another attempt to see your improvement trend over time.
                  </p>
                </div>
              ) : (
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartTheme.primaryColor} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={chartTheme.primaryColor} stopOpacity={0} />
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
                        name="Score %"
                        stroke={chartTheme.primaryColor}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#scoreGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ASSESSMENT HISTORY TABLE */}
          <Card className="shadow-xs border border-border rounded-xl">
            <CardHeader className="pb-3 border-b border-border flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Assessment attempts ({data.pagination.total})
              </CardTitle>

              {data.targetRoleName && (
                <Badge variant="blue" className="text-xs font-normal">
                  Role: {data.targetRoleName}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {data.attempts.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground">
                  No assessment attempts match your active search or filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[11px] bg-surface-secondary/50">
                        <th className="py-3 px-4">Assessment & skill</th>
                        <th className="py-3 px-4">Attempt</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Correct / Incorrect / Blank</th>
                        <th className="py-3 px-4">Improvement</th>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.attempts.map((att) => (
                        <tr
                          key={att._id}
                          className="hover:bg-surface-secondary/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-semibold text-foreground">
                            <div className="flex items-center gap-2">
                              <span>{att.assessmentTitle}</span>
                              {getProficiencyBadge(att.proficiency)}
                            </div>
                            <div className="text-xs font-normal text-muted-foreground mt-0.5">
                              Skill: <span className="font-medium text-foreground">{att.skillName}</span> ({att.category})
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-muted-foreground whitespace-nowrap">
                            Attempt #{att.attemptNumber}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-sm text-primary">
                              {att.percentage}%
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="h-3 w-3" /> {att.correctAnswers}
                              </span>
                              <span className="text-rose-600 font-semibold flex items-center gap-0.5">
                                <XCircle className="h-3 w-3" /> {att.incorrectAnswers}
                              </span>
                              {att.unanswered > 0 && (
                                <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                                  <HelpCircle className="h-3 w-3" /> {att.unanswered}
                                </span>
                              )}
                              <span className="text-muted-foreground">/ {att.totalQuestions}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {getImprovementBadge(att.improvementPoints)}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground">
                            {formatDuration(att.timeTaken)}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground">
                            {new Date(att.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelectedAttempt(att)}
                              className="h-7 text-xs gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PAGINATION */}
              {data.pagination.totalPages > 1 && (
                <div className="p-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">
                    Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="h-8 text-xs font-medium gap-1"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= data.pagination.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="h-8 text-xs font-medium gap-1"
                    >
                      Next
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SKILL & TOPIC PERFORMANCE BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Performance Breakdown */}
            {data.skillPerformanceSummary.length > 0 && (
              <Card className="shadow-xs border border-border rounded-xl">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Skill assessment performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {data.skillPerformanceSummary.map((skill) => (
                    <div
                      key={skill.skillName}
                      className="p-3 rounded-xl border border-border bg-surface space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs text-foreground">{skill.skillName}</span>
                        <Badge variant="blue" className="text-xs">
                          {skill.attemptCount} {skill.attemptCount === 1 ? 'attempt' : 'attempts'}
                        </Badge>
                      </div>
                      <Progress value={skill.latestScore} className="h-1.5" />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Latest: {skill.latestScore}%</span>
                        <span>Best: {skill.bestScore}%</span>
                        <span>Avg: {skill.averageScore}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Topic Performance Breakdown */}
            {data.topicPerformanceSummary.length > 0 && (
              <Card className="shadow-xs border border-border rounded-xl">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Topic accuracy analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 max-h-80 overflow-y-auto">
                  {data.topicPerformanceSummary.map((tp) => (
                    <div key={tp.topic} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-foreground">{tp.topic}</span>
                        <span className="text-primary font-semibold">
                          {tp.correct} / {tp.questionsAttempted} ({tp.percentage}%)
                        </span>
                      </div>
                      <Progress value={tp.percentage} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ATTEMPT DETAILS MODAL */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-xl p-6 sm:p-8 max-w-xl w-full shadow-lg space-y-5 overflow-y-auto max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-xs font-semibold text-primary">
                  Attempt #{selectedAttempt.attemptNumber} details
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {selectedAttempt.assessmentTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="text-muted-foreground hover:text-foreground text-lg font-bold p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Score & Improvement Highlights */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-surface-secondary/50 border border-border text-center">
              <div>
                <div className="text-xs text-muted-foreground font-medium">Score</div>
                <div className="text-2xl font-bold text-primary">
                  {selectedAttempt.percentage}%
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground font-medium">Improvement</div>
                <div className="mt-1 flex justify-center">{getImprovementBadge(selectedAttempt.improvementPoints)}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground font-medium">Proficiency</div>
                <div className="mt-1 flex justify-center">{getProficiencyBadge(selectedAttempt.proficiency)}</div>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 space-y-0.5">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium block">Correct</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selectedAttempt.correctAnswers}</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 space-y-0.5">
                <span className="text-rose-700 dark:text-rose-300 font-medium block">Incorrect</span>
                <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{selectedAttempt.incorrectAnswers}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 space-y-0.5">
                <span className="text-amber-700 dark:text-amber-300 font-medium block">Unanswered</span>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{selectedAttempt.unanswered}</span>
              </div>
            </div>

            {/* Attempt Details List */}
            <div className="space-y-2 text-xs border-t border-border pt-3">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Skill / Category:</span>
                <span className="font-semibold text-foreground">
                  {selectedAttempt.skillName} ({selectedAttempt.category})
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Time taken:</span>
                <span className="font-semibold text-foreground">
                  {formatDuration(selectedAttempt.timeTaken)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Previous attempt score:</span>
                <span className="font-semibold text-foreground">
                  {selectedAttempt.previousScore !== null ? `${selectedAttempt.previousScore}%` : 'None (First attempt)'}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Completed date:</span>
                <span className="font-semibold text-foreground">
                  {new Date(selectedAttempt.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Topic Performance in Attempt */}
            {selectedAttempt.topicPerformance.length > 0 && (
              <div className="space-y-2 border-t border-border pt-3">
                <h4 className="text-xs font-semibold text-foreground">Topic performance in attempt</h4>
                <div className="space-y-1.5">
                  {selectedAttempt.topicPerformance.map((tp) => (
                    <div key={tp.topic} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground">{tp.topic}</span>
                        <span className="font-semibold text-primary">
                          {tp.correct} / {tp.questionsAttempted} ({tp.percentage}%)
                        </span>
                      </div>
                      <Progress value={tp.percentage} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAttempt(null)}
                className="text-xs font-medium"
              >
                Close
              </Button>
              <Link href={`/assessment/results/${selectedAttempt.attemptId}`}>
                <Button size="sm" variant="primary" className="text-xs gap-1.5">
                  Full question review
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </PageWrapper>
  );
}

