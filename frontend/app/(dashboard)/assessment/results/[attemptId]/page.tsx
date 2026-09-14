'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Brain,
  HelpCircle,
} from 'lucide-react';
import { assessmentService } from '@/services/assessment.service';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';

export default function AssessmentResultsPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;
  const [showReview, setShowReview] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['attemptResults', attemptId],
    queryFn: () => assessmentService.getAttemptResults(attemptId),
  });

  if (isLoading) {
    return (
      <PageWrapper className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-64 w-full rounded-xl bg-surface-secondary" />
        <Skeleton className="h-96 w-full rounded-xl bg-surface-secondary" />
      </PageWrapper>
    );
  }

  const attempt = data?.attempt;
  const review = data?.review || [];
  const assessment = (attempt?.assessmentId as any) || {};
  const skill = (attempt?.skillId as any) || {};

  const mins = Math.floor((attempt?.timeTaken || 0) / 60);
  const secs = (attempt?.timeTaken || 0) % 60;
  const percentage = attempt?.percentage || 0;

  const topicPerf = attempt?.topicPerformance || [];

  return (
    <PageWrapper className="max-w-4xl mx-auto space-y-8">
      {/* Top Results Banner */}
      <Card className="overflow-hidden rounded-xl">
        <div className="p-6 sm:p-8 bg-surface-secondary/50 text-foreground flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-border">
          <div className="space-y-2">
            <Badge variant="blue" className="gap-1.5 py-1 px-3">
              <Award className="h-3.5 w-3.5" />
              Assessment evaluation completed
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{skill.name || 'Skill'} Assessment Results</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{assessment.title || 'Technical skill evaluation'}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface border border-border text-center min-w-[140px] shadow-xs">
            <span className="text-3xl sm:text-4xl font-extrabold text-primary">{percentage}%</span>
            <Badge
              variant="blue"
              className="mt-1 text-xs"
            >
              {attempt?.proficiency || 'Beginner'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface border border-border text-center">
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Correct answers</span>
              <strong className="text-lg font-bold text-primary">
                {attempt?.correctAnswers} / {attempt?.totalQuestions || 20}
              </strong>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Time elapsed</span>
              <strong className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {mins}m {secs}s
              </strong>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Passing score</span>
              <strong className="text-lg font-bold text-foreground">
                {assessment.passingScore || 60}%
              </strong>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Result status</span>
              <span className={`text-lg font-bold block ${percentage >= (assessment.passingScore || 60) ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {percentage >= (assessment.passingScore || 60) ? 'Passed' : 'Retake suggested'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            <Button
              onClick={async () => {
                try {
                  const newRes = await assessmentService.startAssessment(assessment._id || attempt?.assessmentId);
                  router.push(`/assessment/take/${newRes.attemptId}`);
                } catch (err: any) {
                  toast.error(err.response?.data?.message || 'Failed to initialize retake attempt.');
                }
              }}
              variant="primary"
              className="gap-2 text-xs"
            >
              <RotateCcw className="h-4 w-4" />
              Retake assessment
            </Button>

            <Link href="/learning">
              <Button variant="secondary" className="gap-2 text-xs">
                <BookOpen className="h-4 w-4" />
                View recommended learning
              </Button>
            </Link>

            <Link href="/skill-gap">
              <Button variant="secondary" className="gap-2 text-xs">
                Analyze skill gap
                <ArrowRight className="h-4 w-4 text-primary" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Topic Performance Analysis */}
      {topicPerf.length > 0 && (
        <Card className="rounded-xl">
          <CardHeader className="p-6 pb-4 border-b border-border">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Brain className="h-5 w-5 text-primary" />
              Topic breakdown ({attempt?.totalQuestions || 20} questions analyzed)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Detailed proficiency analysis across individual skill domains.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {topicPerf.map((tp: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-secondary/50 border border-border space-y-2">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-foreground">{tp.topic}</span>
                    <span className="text-primary font-semibold">{tp.percentage}% ({tp.correct}/{tp.questionsAttempted})</span>
                  </div>
                  <Progress value={tp.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Review Section */}
      <Card className="rounded-xl">
        <CardHeader className="p-6 cursor-pointer" onClick={() => setShowReview(!showReview)}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <HelpCircle className="h-5 w-5 text-primary" />
                Detailed question review ({review.length} questions)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Inspect full question breakdowns, your answers, and explanations.
              </CardDescription>
            </div>
            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${showReview ? 'rotate-180' : ''}`} />
          </div>
        </CardHeader>

        {showReview && (
          <CardContent className="p-6 space-y-6 pt-2 border-t border-border">
            {review.map((item: any, idx: number) => {
              const isCorrect = item.isCorrect;
              const questionText = typeof item.question === 'string' ? item.question : item.question?.question || '';
              const topic = item.topic || (typeof item.question === 'object' ? item.question?.topic : '') || 'General';
              const options: string[] = item.options || (typeof item.question === 'object' ? item.question?.options : []) || [];
              const correctAnswer: number = item.correctAnswer ?? (typeof item.question === 'object' ? item.question?.correctAnswer : 0);
              const selectedOption: number = item.selectedOption ?? item.userAnswer;
              const explanation: string = item.explanation || (typeof item.question === 'object' ? item.question?.explanation : '');
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border space-y-3 ${
                    isCorrect
                      ? 'bg-surface border-border'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        Question {idx + 1} of {review.length} • {topic}
                      </span>
                      <h4 className="font-semibold text-base text-foreground leading-relaxed">
                        {questionText}
                      </h4>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </div>

                  {/* Options Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {options.map((opt: string, optIdx: number) => {
                      const isUserSelected = selectedOption === optIdx;
                      const isCorrectAnswer = correctAnswer === optIdx;

                      let style = 'bg-surface border-border text-muted-foreground';
                      if (isCorrectAnswer) {
                        style = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold';
                      } else if (isUserSelected && !isCorrectAnswer) {
                        style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-medium line-through';
                      }

                      return (
                        <div key={optIdx} className={`p-2.5 rounded-md border flex items-center gap-2 ${style}`}>
                          <span className="font-medium text-xs px-1.5 py-0.5 rounded bg-surface-secondary text-foreground">
                            {optionLetters[optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  {explanation && (
                    <div className="p-3 rounded-md bg-surface-secondary/50 border border-border text-xs text-muted-foreground space-y-1">
                      <strong className="text-foreground block font-medium">Explanation:</strong>
                      <p>{explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>
    </PageWrapper>
  );
}


