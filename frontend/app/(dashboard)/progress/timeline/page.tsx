'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ClipboardCheck,
  TrendingUp,
  BookOpen,
  Target,
  Briefcase,
  BadgeCheck,
  Trophy,
  ArrowLeft,
  Calendar,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  AlertCircle,
  Sparkles,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { progressService } from '@/services/progress.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  TimelineCategory,
  TimelineDateFilter,
  TimelineSortOrder,
  TimelineData,
  TimelineEvent,
} from '@/types/timeline';

function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatEventTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getEventIcon(eventType: string, category: string) {
  switch (eventType) {
    case 'ASSESSMENT_COMPLETED':
      return <ClipboardCheck className="h-5 w-5 text-primary" />;
    case 'SKILL_IMPROVED':
    case 'SKILL_MILESTONE':
      return <TrendingUp className="h-5 w-5 text-primary" />;
    case 'TOPIC_STARTED':
    case 'TOPIC_COMPLETED':
    case 'STUDY_PLAN_COMPLETED':
      return <BookOpen className="h-5 w-5 text-primary" />;
    case 'CAREER_GOAL_SET':
    case 'CAREER_GOAL_CHANGED':
      return <Target className="h-5 w-5 text-primary" />;
    case 'CAREER_OUTCOME_CREATED':
    case 'CAREER_OUTCOME_SUBMITTED':
      return <Briefcase className="h-5 w-5 text-primary" />;
    case 'CAREER_OUTCOME_VERIFIED':
      return <BadgeCheck className="h-5 w-5 text-primary" />;
    case 'CAREER_OUTCOME_REJECTED':
      return <XCircle className="h-5 w-5 text-rose-500" />;
    case 'CAREER_OUTCOME_CHANGES_REQUESTED':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'ACHIEVEMENT_UNLOCKED':
      return <Trophy className="h-5 w-5 text-primary" />;
    default:
      return <Sparkles className="h-5 w-5 text-primary" />;
  }
}

export default function ProgressTimelinePage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<TimelineCategory>('ALL');
  const [dateFilter, setDateFilter] = useState<TimelineDateFilter>('ALL_TIME');
  const [sort, setSort] = useState<TimelineSortOrder>('DESC');

  const { data, isLoading, error, refetch, isFetching } = useQuery<TimelineData>({
    queryKey: ['progress-timeline', page, category, dateFilter, sort],
    queryFn: () =>
      progressService.getTimeline({
        page,
        limit: 20,
        category,
        dateFilter,
        sort,
      }),
    staleTime: 60 * 1000,
  });

  const categories: { label: string; value: TimelineCategory }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Assessments', value: 'ASSESSMENT' },
    { label: 'Skills', value: 'SKILL' },
    { label: 'Learning', value: 'LEARNING' },
    { label: 'Career', value: 'CAREER' },
    { label: 'Achievements', value: 'ACHIEVEMENT' },
  ];

  const dateFilters: { label: string; value: TimelineDateFilter }[] = [
    { label: 'All time', value: 'ALL_TIME' },
    { label: 'This week', value: 'THIS_WEEK' },
    { label: 'This month', value: 'THIS_MONTH' },
    { label: 'Last 3 months', value: 'LAST_3_MONTHS' },
  ];

  return (
    <PageWrapper className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <PageHeader
        title="Progress timeline"
        description="Track your SkillTrack journey and see how your preparation has evolved over time."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/progress"
              className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to overview
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2 text-xs"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* HERO SUMMARY */}
      {data?.heroSummary && (
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="p-6 pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Your journey
              </CardTitle>
              <Badge variant="blue" className="text-xs">
                {data.heroSummary.totalActivities} total activities
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border">
              <div className="text-2xl font-bold text-foreground">
                {data.heroSummary.totalActivities}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Total activities
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border">
              <div className="text-2xl font-bold text-primary">
                {data.heroSummary.assessmentsCompleted}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Assessments
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border">
              <div className="text-2xl font-bold text-primary">
                {data.heroSummary.topicsCompleted}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Topics completed
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border">
              <div className="text-2xl font-bold text-primary">
                {data.heroSummary.skillsImproved}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Skills improved
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border col-span-2 sm:col-span-1">
              <div className="text-2xl font-bold text-primary">
                {data.heroSummary.careerMilestones}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Milestones
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FILTER & CONTROL BAR */}
      <div className="flex flex-col gap-4 p-4 rounded-xl bg-card border border-border shadow-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                category === cat.value
                  ? 'bg-primary text-white shadow-xs font-semibold'
                  : 'bg-surface-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Date Filter & Sort Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Timeframe:</span>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value as TimelineDateFilter);
                setPage(1);
              }}
              className="bg-surface border border-input text-xs font-medium text-foreground rounded-md px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {dateFilters.map((df) => (
                <option key={df.value} value={df.value}>
                  {df.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSort(sort === 'DESC' ? 'ASC' : 'DESC')}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 px-2.5"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            Order: {sort === 'DESC' ? 'Newest first' : 'Oldest first'}
          </Button>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="space-y-6 pl-4 border-l-2 border-primary/40 ml-4 py-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute -left-[31px] top-1 h-6 w-6 rounded-full bg-primary border-2 border-surface" />
              <Skeleton className="h-24 w-full rounded-xl bg-surface-secondary" />
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {error && !isLoading && (
        <Card className="border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-center p-8 rounded-xl space-y-4 max-w-md mx-auto">
          <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Unable to load your progress timeline.
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Please check your connection or try again.
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="destructive"
            className="gap-2 text-xs mx-auto"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Try again
          </Button>
        </Card>
      )}

      {/* EMPTY STATE */}
      {data && data.events.length === 0 && !isLoading && !error && (
        <Card className="text-center p-12 rounded-xl space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/50">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              Your journey starts here
            </h2>
            <p className="text-xs text-muted-foreground">
              You haven't completed any tracked activities yet.
            </p>
          </div>
          <Link href="/learning">
            <Button variant="primary" className="text-xs gap-2 px-6 rounded-md mt-2">
              <BookOpen className="h-4 w-4" />
              Start learning
            </Button>
          </Link>
        </Card>
      )}

      {/* VERTICAL TIMELINE */}
      {data && data.events.length > 0 && !isLoading && (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/30 ml-4 sm:ml-6 space-y-6">
          {data.events.map((event: TimelineEvent, idx: number) => {
            const formattedDate = formatEventDate(event.timestamp);
            const formattedTime = formatEventTime(event.timestamp);
            const icon = getEventIcon(event.eventType, event.category);

            return (
              <div
                key={event.id || `${event.eventType}-${idx}`}
                className="relative group"
              >
                {/* Timeline Dot Node */}
                <div className="absolute -left-[37px] sm:-left-[45px] top-4 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-surface border-2 border-primary flex items-center justify-center shadow-xs">
                  {icon}
                </div>

                {/* Event Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-200 space-y-3 shadow-xs">
                  {/* Top Row: Category Badge & Date */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Badge variant="blue" className="text-xs">
                      {event.category}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{formattedDate}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{formattedTime}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* METADATA CHIPS / SCORE BADGES */}
                  {event.metadata && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {event.metadata.score !== undefined && (
                        <Badge variant="blue" className="text-xs">
                          Score: {event.metadata.score}%
                        </Badge>
                      )}

                      {event.metadata.accuracy !== undefined && (
                        <Badge variant="blue" className="text-xs">
                          Accuracy: {event.metadata.accuracy}%
                        </Badge>
                      )}

                      {event.metadata.previousScore !== undefined && event.metadata.newScore !== undefined && (
                        <Badge variant="blue" className="text-xs">
                          {event.metadata.previousScore}% → {event.metadata.newScore}%
                        </Badge>
                      )}

                      {event.metadata.proficiency && (
                        <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 rounded-md bg-surface-secondary/50 border border-border">
                          Level: {event.metadata.proficiency}
                        </span>
                      )}

                      {event.metadata.roleName && (
                        <Badge variant="secondary" className="text-xs">
                          Role: {event.metadata.roleName}
                        </Badge>
                      )}

                      {event.metadata.status && (
                        <Badge variant="secondary" className="text-xs">
                          {event.metadata.status}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {data && data.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-1.5 text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-xs text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>

          <Button
            variant="secondary"
            size="sm"
            disabled={!data.pagination.hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="gap-1.5 text-xs"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </PageWrapper>
  );
}


