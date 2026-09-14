'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { assessmentService } from '@/services/assessment.service';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';

export default function AssessmentStartConfigPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['assessmentDetails', id],
    queryFn: () => assessmentService.getAssessmentById(id),
  });

  const startMutation = useMutation({
    mutationFn: () => assessmentService.startAssessment(id),
    onSuccess: (res) => {
      toast.success('Assessment started! Good luck!');
      router.push(`/assessment/take/${res.attemptId}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to start assessment.');
    },
  });

  if (isLoading) {
    return (
      <PageWrapper className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-64 w-full rounded-xl bg-surface-secondary" />
      </PageWrapper>
    );
  }

  const assessment = data?.assessment;
  const skill = (assessment?.skillId as any) || {};

  return (
    <PageWrapper className="max-w-3xl mx-auto space-y-6">
      <Card className="overflow-hidden rounded-xl">
        <div className="bg-surface-secondary/50 p-6 sm:p-8 space-y-2 border-b border-border">
          <Badge variant="blue" className="text-xs">
            {skill.category || 'Skill assessment'}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">{assessment?.title}</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">{assessment?.description || `Evaluate your proficiency in ${skill.name || 'this skill'}.`}</p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface border border-border text-center">
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Questions</span>
              <strong className="text-lg font-bold text-primary">
                20 questions
              </strong>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Time limit</span>
              <strong className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {assessment?.timeLimit || 20} mins
              </strong>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Passing score</span>
              <strong className="text-lg font-bold text-foreground">
                {assessment?.passingScore || 60}%
              </strong>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Difficulty</span>
              <strong className="text-lg font-bold text-foreground">
                {assessment?.difficulty || 'Mixed'}
              </strong>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Assessment guidelines & rules
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>The assessment contains <strong className="text-foreground">exactly 20 conceptual multiple-choice questions</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>You have <strong className="text-foreground">{assessment?.timeLimit || 20} minutes</strong> to complete all 20 questions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Unanswered questions upon timer expiry will be evaluated as incorrect.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Retaking the assessment will serve a new randomized 20-question combination.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button
              onClick={() => startMutation.mutate()}
              isLoading={startMutation.isPending}
              variant="primary"
              className="gap-2 text-xs px-6"
            >
              Start assessment now
              <ArrowRight className="h-4 w-4 text-white" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}


