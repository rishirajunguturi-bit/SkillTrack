'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  RotateCw,
  ArrowRight,
  Zap,
  Sliders,
  Play,
  RotateCcw,
  Coffee,
  ChevronRight,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';
import { studyPlanService } from '@/services/studyPlan.service';
import { roadmapService } from '@/services/roadmap.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { StudyPlan, StudyTask, StudyPlanPreferences } from '@/types/studyPlan';

const WEEKDAYS = [
  { label: 'Mon', value: 'MONDAY' },
  { label: 'Tue', value: 'TUESDAY' },
  { label: 'Wed', value: 'WEDNESDAY' },
  { label: 'Thu', value: 'THURSDAY' },
  { label: 'Fri', value: 'FRIDAY' },
  { label: 'Sat', value: 'SATURDAY' },
  { label: 'Sun', value: 'SUNDAY' },
];

export default function StudyPlanPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPrefsModalOpen, setIsPrefsModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [rescheduleTaskObj, setRescheduleTaskObj] = useState<StudyTask | null>(null);
  const [rescheduleDateStr, setRescheduleDateStr] = useState('');

  // Preference Form State
  const [prefsForm, setPrefsForm] = useState<StudyPlanPreferences>({
    dailyStudyMinutes: 120,
    studyDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    preferredStudyTime: 'EVENING',
    studyIntensity: 'BALANCED',
    planDurationWeeks: 1,
  });

  // Fetch active study plan
  const { data: studyPlan, isLoading, error } = useQuery<StudyPlan>({
    queryKey: ['study-plan'],
    queryFn: () => studyPlanService.getStudentStudyPlan(),
    staleTime: 5 * 60 * 1000,
  });

  // Mutations
  const generatePlanMutation = useMutation({
    mutationFn: (prefs: StudyPlanPreferences) => studyPlanService.generateStudyPlan(prefs),
    onSuccess: (newPlan) => {
      queryClient.setQueryData(['study-plan'], newPlan);
      toast.success('Personalized study plan generated!');
      setIsPrefsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to generate study plan.');
    },
  });

  const regeneratePlanMutation = useMutation({
    mutationFn: () => studyPlanService.regenerateStudyPlan(),
    onSuccess: (newPlan) => {
      queryClient.setQueryData(['study-plan'], newPlan);
      toast.success('Study plan refreshed with latest roadmap data!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to refresh study plan.');
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' }) =>
      studyPlanService.updateTaskStatus(taskId, status),
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(['study-plan'], updatedPlan);
      queryClient.invalidateQueries({ queryKey: ['learning-roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['skill-gap-analysis'] });
      toast.success('Task progress updated!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update task.');
    },
  });

  const rescheduleTaskMutation = useMutation({
    mutationFn: ({ taskId, targetDate }: { taskId: string; targetDate: string }) =>
      studyPlanService.rescheduleTask(taskId, targetDate),
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(['study-plan'], updatedPlan);
      toast.success('Task rescheduled!');
      setRescheduleTaskObj(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to reschedule task.');
    },
  });

  // YouTube Video Launch Handler
  const watchTutorialMutation = useMutation({
    mutationFn: (topicId: string) => roadmapService.getTopicResource(topicId),
    onSuccess: (data) => {
      const resource = data.learningResource || data.topic?.learningResource;
      if (resource && resource.url) {
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      } else {
        toast.info('Tutorial search opened in new tab.');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to launch tutorial.');
    },
  });

  // Determine Today's Day Object
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayDay = useMemo(() => {
    if (!studyPlan || !studyPlan.days) return null;
    return studyPlan.days.find((d) => d.date === todayStr) || studyPlan.days[0];
  }, [studyPlan, todayStr]);

  const activeDisplayDay = useMemo(() => {
    if (!studyPlan || !studyPlan.days) return null;
    if (selectedDayId) {
      return studyPlan.days.find((d) => d.dayId === selectedDayId) || todayDay;
    }
    return todayDay;
  }, [studyPlan, selectedDayId, todayDay]);

  const toggleDayOfWeekPref = (dayVal: string) => {
    setPrefsForm((prev) => {
      const exists = prev.studyDays.includes(dayVal);
      const updatedDays = exists
        ? prev.studyDays.filter((d) => d !== dayVal)
        : [...prev.studyDays, dayVal];
      return { ...prev, studyDays: updatedDays };
    });
  };

  if (isLoading) {
    return (
      <PageWrapper className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-28 w-full rounded-xl bg-surface-secondary" />
        <Skeleton className="h-44 w-full rounded-xl bg-surface-secondary" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl bg-surface-secondary" />
          <Skeleton className="h-32 w-full rounded-xl bg-surface-secondary" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !studyPlan) {
    const errMsg = (error as any)?.response?.data?.message || 'Please build your learning roadmap first.';
    return (
      <PageWrapper className="max-w-4xl mx-auto py-12 text-center space-y-6">
        <div className="p-8 rounded-xl bg-card border border-border text-foreground max-w-md mx-auto space-y-4 shadow-xs">
          <div className="h-14 w-14 rounded-full bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
            <CalendarIcon className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">AI personalized study plan</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{errMsg}</p>
          <Link href="/learning">
            <Button variant="primary" className="w-full text-xs gap-2">
              Generate personalized roadmap
              <ArrowRight className="h-4 w-4 text-white" />
            </Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const {
    title,
    summary,
    overallProgress = 0,
    completedMinutes = 0,
    totalPlannedMinutes = 0,
    completedTasksCount = 0,
    totalTasksCount = 0,
    streakDays = 1,
    aiSummary,
    days = [],
  } = studyPlan;

  return (
    <PageWrapper className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <PageHeader
        title={title || "Personalized Study Schedule"}
        description={summary || "Daily structured learning tasks tailored to your career roadmap."}
        action={
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Badge variant="blue" className="gap-1 text-xs">
              <Flame className="h-3.5 w-3.5 fill-primary text-primary" />
              {streakDays} day streak
            </Badge>
            <Button
              onClick={() => setIsPrefsModalOpen(true)}
              variant="secondary"
              className="text-xs gap-2"
            >
              <Sliders className="h-4 w-4" />
              Preferences
            </Button>
            <Button
              onClick={() => regeneratePlanMutation.mutate()}
              isLoading={regeneratePlanMutation.isPending}
              variant="secondary"
              className="text-xs gap-1.5"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Main Grid: Weekly Calendar Matrix & Today's Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Focus Task Card List (2 Cols) */}
        <Card className="lg:col-span-2 rounded-xl">
          <CardHeader className="p-6 pb-3 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {activeDisplayDay?.date === todayStr
                  ? "Today's study focus"
                  : `Schedule for ${activeDisplayDay?.dayOfWeek} (${activeDisplayDay?.date})`}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeDisplayDay?.isRestDay
                  ? 'Scheduled rest & recovery day'
                  : `${activeDisplayDay?.completedMinutes || 0} / ${activeDisplayDay?.totalPlannedMinutes || 0} mins completed • ${activeDisplayDay?.tasks.length || 0} tasks`}
              </p>
            </div>

            {activeDisplayDay && (
              <Badge
                variant="blue"
                className="text-xs"
              >
                {activeDisplayDay.isRestDay ? 'Rest day' : activeDisplayDay.status}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {activeDisplayDay?.isRestDay ? (
              <div className="text-center py-10 space-y-3">
                <div className="h-14 w-14 rounded-full bg-surface-secondary text-primary flex items-center justify-center mx-auto border border-border">
                  <Coffee className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Scheduled rest & review day</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  No heavy learning tasks scheduled for today. Take time to relax or lightly review your past notes.
                </p>
              </div>
            ) : activeDisplayDay && activeDisplayDay.tasks.length > 0 ? (
              <div className="space-y-3">
                {activeDisplayDay.tasks.map((task) => {
                  const isTaskCompleted = task.status === 'COMPLETED';
                  const isTaskInProgress = task.status === 'IN_PROGRESS';
                  const isTaskSkipped = task.status === 'SKIPPED';

                  return (
                    <div
                      key={task.taskId}
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        isTaskCompleted
                          ? 'bg-surface border-border'
                          : isTaskInProgress
                          ? 'bg-blue-50/40 dark:bg-blue-950/20 border-primary/40'
                          : isTaskSkipped
                          ? 'bg-surface-secondary/50 border-border opacity-50'
                          : 'bg-surface border-border'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <Badge
                              variant="blue"
                              className="text-xs py-0"
                            >
                              {task.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs py-0">
                              {task.skillName}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" /> {task.durationMinutes} mins
                            </span>
                          </div>

                          <h4 className="font-semibold text-base text-foreground leading-snug">
                            {task.title}
                          </h4>
                        </div>

                        <Badge
                          variant="secondary"
                          className="text-xs py-0"
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      {task.reason && (
                        <p className="text-xs text-muted-foreground leading-relaxed bg-surface-secondary/50 p-2.5 rounded-md border border-border">
                          <strong className="text-foreground">Reason:</strong> {task.reason}
                        </p>
                      )}

                      {/* Action Bar */}
                      <div className="pt-2 flex flex-wrap justify-between items-center gap-2 border-t border-border">
                        <div className="flex items-center gap-2">
                          {task.roadmapTopicId && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => watchTutorialMutation.mutate(task.roadmapTopicId!)}
                              isLoading={watchTutorialMutation.isPending}
                              className="text-xs h-7 px-2.5 gap-1"
                            >
                              <Play className="h-3 w-3" />
                              Watch tutorial ↗
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {task.status !== 'COMPLETED' && (
                            <>
                              <button
                                onClick={() => {
                                  setRescheduleTaskObj(task);
                                  setRescheduleDateStr(todayStr);
                                }}
                                className="text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1"
                              >
                                Reschedule
                              </button>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() =>
                                  updateTaskStatusMutation.mutate({
                                    taskId: task.taskId,
                                    status: 'COMPLETED',
                                  })
                                }
                                isLoading={updateTaskStatusMutation.isPending}
                                className="text-xs h-7 px-3 gap-1"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Mark complete
                              </Button>
                            </>
                          )}

                          {isTaskCompleted && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                updateTaskStatusMutation.mutate({
                                  taskId: task.taskId,
                                  status: 'NOT_STARTED',
                                })
                              }
                              className="text-xs h-7 px-2.5"
                            >
                              Undo
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-muted-foreground">No study tasks scheduled for this day.</div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Calendar & Analytics Sidebar (1 Col) */}
        <div className="space-y-6">
          {/* Study Plan Analytics */}
          <Card className="rounded-xl">
            <CardHeader className="p-6 pb-2 border-b border-border">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Weekly study metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1 text-center">
                <div className="text-3xl font-extrabold text-primary">
                  {overallProgress}%
                </div>
                <p className="text-xs font-medium text-muted-foreground">Plan execution rate</p>
                <Progress value={overallProgress} className="h-1.5 mt-2" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
                <div className="p-2.5 rounded-xl bg-surface-secondary/50 border border-border text-center">
                  <span className="text-xs text-muted-foreground font-medium block">Tasks done</span>
                  <span className="font-bold text-sm text-foreground">
                    {completedTasksCount} / {totalTasksCount}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-secondary/50 border border-border text-center">
                  <span className="text-xs text-muted-foreground font-medium block">Time spent</span>
                  <span className="font-bold text-sm text-foreground">
                    {Math.round(completedMinutes / 60)}h / {Math.round(totalPlannedMinutes / 60)}h
                  </span>
                </div>
              </div>

              {aiSummary && (
                <p className="text-xs text-muted-foreground leading-relaxed italic bg-surface-secondary/50 p-3 rounded-xl border border-border">
                  "{aiSummary}"
                </p>
              )}
            </CardContent>
          </Card>

          {/* 7-Day Weekly Calendar Matrix */}
          <Card className="rounded-xl">
            <CardHeader className="p-6 pb-2 border-b border-border">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                7-day study matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {days.map((day) => {
                const isSelected = activeDisplayDay?.dayId === day.dayId;
                const isToday = day.date === todayStr;

                return (
                  <div
                    key={day.dayId}
                    onClick={() => setSelectedDayId(day.dayId)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-blue-50/40 dark:bg-blue-950/20 border-primary text-foreground font-semibold'
                        : isToday
                        ? 'bg-surface border-primary/40'
                        : 'bg-surface border-border hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 text-center font-semibold text-xs py-1 rounded-md ${
                          isToday
                            ? 'bg-primary text-white'
                            : 'bg-surface-secondary text-foreground'
                        }`}
                      >
                        {day.dayOfWeek.slice(0, 3)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground truncate text-xs">
                            {day.date}
                          </span>
                          {isToday && <Badge variant="blue" className="text-[10px] py-0">Today</Badge>}
                        </div>
                        <span className="text-[11px] text-muted-foreground block">
                          {day.isRestDay ? 'Rest day' : `${day.completedMinutes}/${day.totalPlannedMinutes} mins`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="secondary"
                        className="text-[10px] py-0"
                      >
                        {day.isRestDay ? 'Rest' : `${day.tasks.length} tasks`}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preferences Setup Modal */}
      <Dialog open={isPrefsModalOpen} onOpenChange={setIsPrefsModalOpen}>
        <DialogContent className="max-w-md bg-card border-border text-foreground rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              Personalize study preferences
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure your daily study limit, active study days, and preferred time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Daily Study Time */}
            <div className="space-y-2">
              <label className="font-medium text-xs text-muted-foreground">
                Daily study time limit
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '30 mins', mins: 30 },
                  { label: '1 hour', mins: 60 },
                  { label: '1.5 hours', mins: 90 },
                  { label: '2 hours', mins: 120 },
                  { label: '3 hours', mins: 180 },
                  { label: '4 hours', mins: 240 },
                ].map((opt) => (
                  <button
                    key={opt.mins}
                    type="button"
                    onClick={() => setPrefsForm({ ...prefsForm, dailyStudyMinutes: opt.mins })}
                    className={`p-2.5 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                      prefsForm.dailyStudyMinutes === opt.mins
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-border text-foreground hover:border-border/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Study Days */}
            <div className="space-y-2">
              <label className="font-medium text-xs text-muted-foreground">
                Active study days
              </label>
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAYS.map((w) => {
                  const isSelected = prefsForm.studyDays.includes(w.value);
                  return (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => toggleDayOfWeekPref(w.value)}
                      className={`h-9 w-9 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-surface-secondary border border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Study Time of Day */}
            <div className="space-y-2">
              <label className="font-medium text-xs text-muted-foreground">
                Preferred study time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Morning (8:00 AM)', val: 'MORNING' },
                  { label: 'Afternoon (1:00 PM)', val: 'AFTERNOON' },
                  { label: 'Evening (7:00 PM)', val: 'EVENING' },
                  { label: 'Night (10:00 PM)', val: 'NIGHT' },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => setPrefsForm({ ...prefsForm, preferredStudyTime: t.val as any })}
                    className={`p-2 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                      prefsForm.preferredStudyTime === t.val
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-primary border-primary'
                        : 'bg-surface border-border text-muted-foreground'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button variant="secondary" onClick={() => setIsPrefsModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              onClick={() => generatePlanMutation.mutate(prefsForm)}
              isLoading={generatePlanMutation.isPending}
              variant="primary"
              className="text-xs"
            >
              Generate study plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Task Modal */}
      <Dialog open={!!rescheduleTaskObj} onOpenChange={(open) => !open && setRescheduleTaskObj(null)}>
        {rescheduleTaskObj && (
          <DialogContent className="max-w-md bg-card border-border text-foreground rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                Reschedule study task
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Move "{rescheduleTaskObj.title}" to a future study day.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <label className="font-medium text-xs text-muted-foreground">
                Target date
              </label>
              <input
                type="date"
                value={rescheduleDateStr}
                onChange={(e) => setRescheduleDateStr(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-surface text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button variant="secondary" onClick={() => setRescheduleTaskObj(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                onClick={() =>
                  rescheduleTaskMutation.mutate({
                    taskId: rescheduleTaskObj.taskId,
                    targetDate: rescheduleDateStr || todayStr,
                  })
                }
                isLoading={rescheduleTaskMutation.isPending}
                variant="primary"
                className="text-xs"
              >
                Confirm reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </PageWrapper>
  );
}

