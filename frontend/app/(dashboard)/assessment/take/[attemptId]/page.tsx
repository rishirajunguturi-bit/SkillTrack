'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Brain,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { assessmentService } from '@/services/assessment.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { StartAssessmentResponse } from '@/types/assessment';

export default function AssessmentPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;

  const [assessmentData, setAssessmentData] = useState<StartAssessmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(20 * 60);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const isSubmittingRef = useRef(false);

  // Fetch assessment questions for attempt
  useEffect(() => {
    async function loadAttempt() {
      try {
        setLoading(true);
        const startRes = await assessmentService.getAttemptForPlayer(attemptId);
        setAssessmentData(startRes);

        const totalTime = (startRes.assessment.timeLimit || 20) * 60;
        const elapsed = Math.round((Date.now() - new Date(startRes.startedAt).getTime()) / 1000);
        const remaining = Math.max(0, totalTime - elapsed);
        setTimeLeftSeconds(remaining);
      } catch (err: any) {
        console.error('[Assessment Player Load Error]', err);
        const errMsg = err.response?.data?.message || err.message || 'Failed to load assessment questions.';
        toast.error(`Assessment load failed: ${errMsg}`);
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [attemptId]);

  // Countdown timer effect
  useEffect(() => {
    if (loading || !assessmentData || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, assessmentData, timeLeftSeconds]);

  // Submit Mutation
  const submitMutation = useMutation({
    mutationFn: () => {
      const formattedAnswers = Object.entries(userAnswers).map(([qId, optionIdx]) => ({
        questionId: qId,
        selectedOption: optionIdx,
      }));
      return assessmentService.submitAssessment(assessmentData!.attemptId, formattedAnswers);
    },
    onSuccess: () => {
      toast.success('Assessment submitted successfully!');
      router.push(`/assessment/results/${assessmentData!.attemptId}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit assessment.');
    },
  });

  const handleAutoSubmit = () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    toast.warning('Time is up! Submitting your assessment automatically...');
    submitMutation.mutate();
  };

  const handleSelectOption = (qId: string, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  if (loading || !assessmentData) {
    return (
      <PageWrapper className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-20 w-full rounded-xl bg-surface-secondary" />
        <Skeleton className="h-96 w-full rounded-xl bg-surface-secondary" />
      </PageWrapper>
    );
  }

  const questions = assessmentData.questions || [];
  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Format timer
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeLow = timeLeftSeconds <= 5 * 60;
  const isTimeCritical = timeLeftSeconds <= 60;

  return (
    <PageWrapper className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border text-foreground flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div>
          <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {assessmentData.assessment.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Question {currentIdx + 1} of {totalQuestions} • {answeredCount} / {totalQuestions} answered
          </p>
        </div>

        {/* Real-time Timer Display */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-semibold text-xs transition-colors border ${
            isTimeCritical
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800 animate-pulse'
              : isTimeLow
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800'
              : 'bg-surface-secondary text-primary border-border'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>{timeFormatted}</span>
        </div>
      </div>

      {/* Main Question Interface */}
      {currentQuestion && (
        <Card className="rounded-xl p-6">
          <CardHeader className="p-0 pb-4 border-b border-border space-y-3">
            <div className="flex justify-between items-center">
              <Badge variant="blue" className="text-xs">
                Topic: {currentQuestion.topic}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Difficulty: {currentQuestion.difficulty}
              </Badge>
            </div>

            <CardTitle className="text-lg font-semibold text-foreground pt-1 leading-relaxed">
              {currentIdx + 1}. {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 pt-6 space-y-4">
            {/* Options List */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((optionText, optionIdx) => {
                const isSelected = userAnswers[currentQuestion._id] === optionIdx;
                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={optionIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion._id, optionIdx)}
                    className={`w-full p-4 rounded-md text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-primary text-foreground font-semibold shadow-xs'
                        : 'bg-surface border-border hover:border-primary/40 text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-md text-xs flex items-center justify-center shrink-0 font-medium ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-surface-secondary text-muted-foreground'
                      }`}
                    >
                      {optionLetters[optionIdx]}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{optionText}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <Button
                variant="secondary"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => prev - 1)}
                className="gap-2 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {currentIdx < totalQuestions - 1 ? (
                  <Button
                    onClick={() => setCurrentIdx((prev) => prev + 1)}
                    variant="primary"
                    className="gap-2 text-xs"
                  >
                    Next question
                    <ChevronRight className="h-4 w-4 text-white" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsSubmitModalOpen(true)}
                    variant="primary"
                    className="gap-2 text-xs"
                  >
                    Review & submit
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 20-Question Quick Jump Palette */}
      <Card className="p-5 rounded-xl">
        <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center justify-between">
          <span>Question overview ({totalQuestions} total)</span>
          <span className="text-xs text-muted-foreground">Click number to jump</span>
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questions.map((q, idx) => {
            const isAnswered = userAnswers[q._id] !== undefined;
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={q._id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-9 w-full rounded-md text-xs font-medium transition-all flex items-center justify-center border ${
                  isCurrent
                    ? 'border-primary bg-primary text-white font-semibold'
                    : isAnswered
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-primary/30 text-primary'
                    : 'bg-surface-secondary/50 border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="max-w-md bg-card border-border text-card-foreground rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Submit assessment?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              You have answered <strong className="text-foreground">{answeredCount} of {totalQuestions}</strong> questions.
            </DialogDescription>
          </DialogHeader>

          {unansweredCount > 0 && (
            <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-700 dark:text-amber-300">
              You still have <strong>{unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}</strong>. Unanswered questions will be scored as incorrect.
            </div>
          )}

          <DialogFooter className="mt-4 gap-2">
            <Button variant="secondary" onClick={() => setIsSubmitModalOpen(false)} className="text-xs">
              Back to assessment
            </Button>
            <Button
              onClick={() => {
                setIsSubmitModalOpen(false);
                submitMutation.mutate();
              }}
              isLoading={submitMutation.isPending}
              variant="primary"
              className="text-xs gap-2"
            >
              <Send className="h-4 w-4 text-white" />
              Confirm & submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}


