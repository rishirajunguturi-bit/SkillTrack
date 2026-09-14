'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  Lock,
  Play,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Brain,
  ArrowRight,
  Zap,
  ExternalLink,
  Youtube,
  RefreshCw,
  Eye,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';
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
import { LearningRoadmap, RoadmapStage, RoadmapTopic } from '@/types/roadmap';

export default function LearningPage() {
  const queryClient = useQueryClient();
  const [expandedStages, setExpandedStages] = useState<{ [stageId: string]: boolean }>({});
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [sliderProgress, setSliderProgress] = useState(0);

  // Resource Video Modal State
  const [videoModalTopic, setVideoModalTopic] = useState<RoadmapTopic | null>(null);
  const [activeResource, setActiveResource] = useState<any | null>(null);

  // Fetch active roadmap
  const { data: roadmap, isLoading, error } = useQuery<LearningRoadmap>({
    queryKey: ['learning-roadmap'],
    queryFn: () => roadmapService.getStudentRoadmap(),
    staleTime: 5 * 60 * 1000,
  });

  // Toggle stage expand/collapse
  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  // Mutations
  const updateProgressMutation = useMutation({
    mutationFn: ({ topicId, progress }: { topicId: string; progress: number }) =>
      roadmapService.updateTopicProgress(topicId, progress),
    onSuccess: (updatedRoadmap) => {
      queryClient.setQueryData(['learning-roadmap'], updatedRoadmap);
      queryClient.invalidateQueries({ queryKey: ['skill-gap-analysis'] });
      toast.success('Progress updated!');
      if (selectedTopic) {
        setSelectedTopic(null);
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update progress.');
    },
  });

  const completeTopicMutation = useMutation({
    mutationFn: (topicId: string) => roadmapService.completeTopic(topicId),
    onSuccess: (updatedRoadmap) => {
      queryClient.setQueryData(['learning-roadmap'], updatedRoadmap);
      queryClient.invalidateQueries({ queryKey: ['skill-gap-analysis'] });
      toast.success('Topic completed! Downstream topics unlocked 🎉');
      if (selectedTopic) {
        setSelectedTopic(null);
      }
      if (videoModalTopic) {
        setVideoModalTopic(null);
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to complete topic.');
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: () => roadmapService.regenerateRoadmap(),
    onSuccess: (newRoadmap) => {
      queryClient.setQueryData(['learning-roadmap'], newRoadmap);
      toast.success('Learning Roadmap regenerated! Completed progress preserved.');
      setIsRegenerateModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to regenerate roadmap.');
    },
  });

  // YouTube Learning Resource Mutations
  const fetchResourceMutation = useMutation({
    mutationFn: (topicId: string) => roadmapService.getTopicResource(topicId),
    onSuccess: (data, topicId) => {
      queryClient.invalidateQueries({ queryKey: ['learning-roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['skill-gap-analysis'] });

      const topicObj = data.topic || data;
      const resource = data.learningResource || topicObj.learningResource;

      setActiveResource(resource);
      setVideoModalTopic(topicObj);

      // Open direct video URL in new window/tab
      if (resource && resource.url) {
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to load learning tutorial.');
    },
  });

  const refreshResourceMutation = useMutation({
    mutationFn: (topicId: string) => roadmapService.refreshTopicResource(topicId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['learning-roadmap'] });
      const topicObj = data.topic || data;
      const resource = data.learningResource || topicObj.learningResource;

      setActiveResource(resource);
      setVideoModalTopic(topicObj);
      toast.success('Alternative tutorial recommended!');

      if (resource && resource.url) {
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to find alternative tutorial.');
    },
  });

  // Find active focus topic (first IN_PROGRESS or first AVAILABLE)
  const currentFocusTopic = useMemo(() => {
    if (!roadmap || !roadmap.stages) return null;
    let active: RoadmapTopic | null = null;
    let avail: RoadmapTopic | null = null;

    for (const stage of roadmap.stages) {
      for (const topic of stage.topics) {
        if (topic.status === 'IN_PROGRESS' && !active) {
          active = topic;
        } else if (topic.status === 'AVAILABLE' && !avail) {
          avail = topic;
        }
      }
    }
    return active || avail;
  }, [roadmap]);

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

  if (error || !roadmap) {
    const errMsg = (error as any)?.response?.data?.message || 'Please select a target role to generate your roadmap.';
    return (
      <PageWrapper className="max-w-4xl mx-auto py-12 text-center space-y-6">
        <Card className="p-8 rounded-xl border border-border text-foreground max-w-md mx-auto space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/50">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Learning roadmap</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{errMsg}</p>
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

  const {
    careerRoleName,
    title,
    description,
    overallProgress = 0,
    completedTopicsCount = 0,
    totalTopicsCount = 0,
    estimatedTotalHours = 0,
    aiSummary,
    stages = [],
  } = roadmap;

  return (
    <PageWrapper className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title={title}
        description={description}
        badge={
          <Badge variant="blue" className="gap-1.5 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5" />
            Personalized AI learning pathway
          </Badge>
        }
        action={
          <Button
            onClick={() => setIsRegenerateModalOpen(true)}
            variant="secondary"
            className="text-xs gap-2 shrink-0"
          >
            <RotateCw className="h-4 w-4" />
            Regenerate roadmap
          </Button>
        }
      />

      {/* Overview Cards & Current Focus Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Focus / Continue Learning Card */}
        <Card className="lg:col-span-2 border-border rounded-xl shadow-xs">
          <CardHeader className="p-6 pb-2 border-b border-border flex flex-row justify-between items-center">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Active learning focus
            </CardTitle>
            {currentFocusTopic && (
              <Badge
                variant="blue"
                className="text-xs"
              >
                {currentFocusTopic.status.replace('_', ' ')}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {currentFocusTopic ? (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Skill: {currentFocusTopic.skillName} • Est. {currentFocusTopic.estimatedHours} hrs
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-0.5">
                    {currentFocusTopic.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {currentFocusTopic.description}
                  </p>
                </div>

                {/* Data-Driven Reason */}
                {currentFocusTopic.reason && (
                  <div className="p-3 rounded-lg bg-surface-secondary/50 border border-border text-xs text-muted-foreground flex items-start gap-2">
                    <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong className="text-foreground font-semibold">Why this topic:</strong> {currentFocusTopic.reason}</span>
                  </div>
                )}

                {/* Direct Learning Video Action */}
                <div className="p-4 rounded-xl bg-surface-secondary/50 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-rose-600 flex items-center justify-center shrink-0">
                      <Youtube className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-rose-600 dark:text-rose-400">
                        Recommended video tutorial
                      </div>
                      <div className="text-xs font-semibold text-foreground line-clamp-1">
                        {currentFocusTopic.learningResource?.title || `${currentFocusTopic.title} Tutorial`}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => fetchResourceMutation.mutate(currentFocusTopic.topicId)}
                    isLoading={fetchResourceMutation.isPending}
                    variant="primary"
                    className="w-full sm:w-auto text-xs gap-1.5 shrink-0 bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    Watch tutorial ↗
                  </Button>
                </div>

                {/* Progress Controls */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Current topic progress</span>
                    <span className="text-base font-bold text-primary">
                      {currentFocusTopic.progress}%
                    </span>
                  </div>
                  <Progress value={currentFocusTopic.progress} className="h-2" />

                  <div className="pt-2 flex flex-wrap gap-2 justify-end">
                    {currentFocusTopic.status === 'AVAILABLE' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => fetchResourceMutation.mutate(currentFocusTopic.topicId)}
                        isLoading={fetchResourceMutation.isPending}
                        className="text-xs gap-1.5"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start learning topic ↗
                      </Button>
                    )}

                    {currentFocusTopic.status === 'IN_PROGRESS' && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedTopic(currentFocusTopic);
                            setSliderProgress(currentFocusTopic.progress);
                          }}
                          className="text-xs font-medium"
                        >
                          Update progress %
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => completeTopicMutation.mutate(currentFocusTopic.topicId)}
                          isLoading={completeTopicMutation.isPending}
                          className="text-xs gap-1.5"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark topic complete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-foreground">All available topics complete!</h4>
                <p className="text-xs text-muted-foreground">Great job! Keep progressing through your stages below.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Roadmap Stats & AI Executive Summary Card */}
        <Card className="rounded-xl flex flex-col justify-between shadow-xs">
          <CardHeader className="p-6 pb-2 border-b border-border">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Roadmap analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1 text-center">
              <div className="text-4xl font-extrabold text-primary">
                {overallProgress}%
              </div>
              <p className="text-xs font-medium text-muted-foreground">Overall pathway completion</p>
              <Progress value={overallProgress} className="h-2 mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
              <div className="p-2.5 rounded-lg bg-surface-secondary/50 border border-border text-center">
                <span className="text-xs text-muted-foreground font-medium block">Completed</span>
                <span className="font-bold text-sm text-foreground">
                  {completedTopicsCount} / {totalTopicsCount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-secondary/50 border border-border text-center">
                <span className="text-xs text-muted-foreground font-medium block">Est. time</span>
                <span className="font-bold text-sm text-foreground">
                  ~{estimatedTotalHours} hrs
                </span>
              </div>
            </div>

            {aiSummary && (
              <p className="text-xs text-muted-foreground leading-relaxed italic bg-surface-secondary/50 p-3 rounded-lg border border-border">
                "{aiSummary}"
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Multi-Stage Accordion List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Learning stages & sequence
        </h2>

        <div className="space-y-4">
          {stages.map((stage, stageIdx) => {
            const isExpanded = expandedStages[stage.stageId] !== false; // Default expanded
            const isStageCompleted = stage.status === 'COMPLETED';
            const isStageLocked = stage.status === 'LOCKED';

            return (
              <Card
                key={stage.stageId}
                className={`border rounded-xl transition-all shadow-xs ${
                  isStageCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/40'
                    : isStageLocked
                    ? 'opacity-60 border-border'
                    : 'border-border'
                }`}
              >
                {/* Stage Header Bar */}
                <div
                  onClick={() => toggleStage(stage.stageId)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none border-b border-border"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`h-10 w-10 rounded-lg text-sm font-bold flex items-center justify-center shrink-0 ${
                        isStageCompleted
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : isStageLocked
                          ? 'bg-surface-secondary text-muted-foreground border border-border'
                          : 'bg-blue-50 text-primary dark:bg-blue-950 dark:text-blue-400'
                      }`}
                    >
                      {stageIdx + 1}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-foreground truncate">
                          {stage.title}
                        </h3>
                        <Badge
                          variant={isStageCompleted ? 'success' : isStageLocked ? 'secondary' : 'blue'}
                          className="text-xs"
                        >
                          {stage.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{stage.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:flex flex-col items-end text-xs">
                      <span className="font-semibold text-foreground">
                        {stage.progress}% complete
                      </span>
                      <span className="text-xs text-muted-foreground">~{stage.estimatedHours} hrs</span>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Stage Topics List */}
                {isExpanded && (
                  <CardContent className="p-5 space-y-3 bg-surface-secondary/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stage.topics.map((topic) => {
                        const isTopicCompleted = topic.status === 'COMPLETED';
                        const isTopicLocked = topic.status === 'LOCKED';
                        const isTopicInProgress = topic.status === 'IN_PROGRESS';

                        return (
                          <div
                            key={topic.topicId}
                            className={`p-4 rounded-xl border transition-all space-y-3 ${
                              isTopicCompleted
                                ? 'bg-surface border-emerald-200 dark:border-emerald-900/40 text-foreground'
                                : isTopicInProgress
                                ? 'bg-surface border-primary text-foreground shadow-xs'
                                : isTopicLocked
                                ? 'bg-surface border-border opacity-60 text-muted-foreground'
                                : 'bg-surface border-border text-foreground'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1 pr-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <Badge variant="secondary" className="text-xs">
                                    {topic.skillName}
                                  </Badge>
                                  <Badge variant="blue" className="text-xs">
                                    {topic.difficulty}
                                  </Badge>
                                </div>

                                <h4 className="font-semibold text-base text-foreground leading-snug">
                                  {topic.title}
                                </h4>
                              </div>

                              <Badge
                                variant={isTopicCompleted ? 'success' : isTopicLocked ? 'secondary' : 'blue'}
                                className="text-xs shrink-0"
                              >
                                {isTopicLocked ? (
                                  <span className="flex items-center gap-1">
                                    <Lock className="h-3 w-3" /> Locked
                                  </span>
                                ) : (
                                  topic.status.replace('_', ' ')
                                )}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {topic.description}
                            </p>

                            {/* Video Resource Quick Display */}
                            {topic.learningResource && (
                              <div className="p-2.5 rounded-lg bg-surface-secondary/50 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between text-xs gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Youtube className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                  <span className="font-medium text-foreground truncate text-xs">
                                    {topic.learningResource.title}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {topic.learningResource.duration}
                                </span>
                              </div>
                            )}

                            {/* Prerequisites Lock Warning */}
                            {isTopicLocked && topic.prerequisites && topic.prerequisites.length > 0 && (
                              <div className="p-2 rounded-lg bg-surface-secondary/50 text-xs text-muted-foreground flex items-center gap-1.5 border border-border">
                                <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                                <span>Requires: {topic.prerequisites.join(', ')}</span>
                              </div>
                            )}

                            {/* Progress Bar & Controls */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>~{topic.estimatedHours} hrs</span>
                                <span className="font-semibold text-primary">
                                  {topic.progress}%
                                </span>
                              </div>
                              <Progress value={topic.progress} className="h-1.5" />
                            </div>

                            {/* Card Actions */}
                            <div className="pt-2 flex justify-between items-center border-t border-border">
                              <button
                                onClick={() => {
                                  setSelectedTopic(topic);
                                  setSliderProgress(topic.progress);
                                }}
                                className="text-xs font-semibold text-primary hover:underline"
                              >
                                View details
                              </button>

                              <div className="flex items-center gap-1.5">
                                {topic.status === 'AVAILABLE' && (
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => fetchResourceMutation.mutate(topic.topicId)}
                                    isLoading={fetchResourceMutation.isPending}
                                    className="text-xs h-7 px-3 gap-1"
                                  >
                                    <Play className="h-3 w-3 fill-white" />
                                    Start topic ↗
                                  </Button>
                                )}

                                {isTopicInProgress && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => fetchResourceMutation.mutate(topic.topicId)}
                                      isLoading={fetchResourceMutation.isPending}
                                      className="text-xs h-7 px-2.5 gap-1"
                                    >
                                      <Youtube className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                                      Watch ↗
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="primary"
                                      onClick={() => completeTopicMutation.mutate(topic.topicId)}
                                      isLoading={completeTopicMutation.isPending}
                                      className="text-xs h-7 px-2.5 gap-1"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      Done
                                    </Button>
                                  </>
                                )}

                                {isTopicCompleted && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Done
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recommended YouTube Tutorial Modal */}
      <Dialog open={!!videoModalTopic} onOpenChange={(open) => !open && setVideoModalTopic(null)}>
        {videoModalTopic && (
          <DialogContent className="max-w-xl bg-card border-border text-foreground rounded-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="blue" className="text-xs">
                  {videoModalTopic.skillName}
                </Badge>
                <Badge variant="rose" className="text-xs gap-1">
                  <Youtube className="h-3 w-3" /> YouTube recommended
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {videoModalTopic.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Top rated educational video matching your current topic gap.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Video Preview Card */}
              {activeResource && (
                <div className="p-4 rounded-xl bg-surface-secondary/50 text-foreground space-y-3 border border-border">
                  {activeResource.thumbnail && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-surface border border-border">
                      <img
                        src={activeResource.thumbnail}
                        alt={activeResource.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-xs text-white font-medium">
                        {activeResource.duration}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <h4 className="font-semibold text-base text-foreground leading-snug">
                      {activeResource.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{activeResource.channelName}</span>
                      {activeResource.viewCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-muted-foreground" /> {activeResource.viewCount.toLocaleString()} views
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2 justify-between items-center border-t border-border">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => refreshResourceMutation.mutate(videoModalTopic.topicId)}
                      isLoading={refreshResourceMutation.isPending}
                      className="text-xs gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Find another video
                    </Button>

                    <a
                      href={activeResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {activeResource.videoId ? 'Watch direct on YouTube ↗' : 'Search YouTube ↗'}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button variant="secondary" className="text-xs" onClick={() => setVideoModalTopic(null)}>
                Close
              </Button>
              <Button
                onClick={() => completeTopicMutation.mutate(videoModalTopic.topicId)}
                isLoading={completeTopicMutation.isPending}
                variant="primary"
                className="text-xs gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark topic complete
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Topic Detail Modal */}
      <Dialog open={!!selectedTopic} onOpenChange={(open) => !open && setSelectedTopic(null)}>
        {selectedTopic && (
          <DialogContent className="max-w-md bg-card border-border text-foreground rounded-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="blue" className="text-xs">
                  {selectedTopic.skillName}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {selectedTopic.difficulty}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {selectedTopic.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedTopic.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {selectedTopic.reason && (
                <div className="p-3 rounded-lg bg-surface-secondary/50 border border-border text-muted-foreground leading-relaxed">
                  <strong className="text-foreground font-semibold">Why this topic:</strong> {selectedTopic.reason}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-muted-foreground">Set topic progress:</span>
                  <span className="text-lg font-bold text-primary">
                    {sliderProgress}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={sliderProgress}
                  onChange={(e) => setSliderProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-secondary rounded-md appearance-none cursor-pointer accent-primary"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0% (Not started)</span>
                  <span>50% (In progress)</span>
                  <span>100% (Completed)</span>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button variant="secondary" className="text-xs" onClick={() => setSelectedTopic(null)}>
                Close
              </Button>
              <Button
                onClick={() =>
                  updateProgressMutation.mutate({
                    topicId: selectedTopic.topicId,
                    progress: sliderProgress,
                  })
                }
                isLoading={updateProgressMutation.isPending}
                variant="primary"
                className="text-xs"
              >
                Save progress
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Regenerate Confirmation Modal */}
      <Dialog open={isRegenerateModalOpen} onOpenChange={setIsRegenerateModalOpen}>
        <DialogContent className="max-w-md bg-card border-border text-foreground rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
              <RotateCw className="h-5 w-5 text-primary" />
              Regenerate learning roadmap?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              This will calculate a fresh learning sequence based on your latest skill gaps. Your completed topic progress will be automatically preserved for matching topics.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2">
            <Button variant="secondary" className="text-xs" onClick={() => setIsRegenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => regenerateMutation.mutate()}
              isLoading={regenerateMutation.isPending}
              variant="primary"
              className="text-xs"
            >
              Confirm & regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}


