'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingFeedbackService } from '@/services/trainingFeedback.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/ui/PageHeader';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function TrainingFeedbackPage() {
  const queryClient = useQueryClient();
  const [relevance, setRelevance] = useState(5);
  const [practical, setPractical] = useState(4);
  const [interview, setInterview] = useState(4);
  const [industry, setIndustry] = useState(4);
  const [comments, setComments] = useState('');

  const { data: feedbackData } = useQuery({
    queryKey: ['studentFeedback'],
    queryFn: () => trainingFeedbackService.getStudentFeedback(),
  });

  const submitMutation = useMutation({
    mutationFn: (payload: any) => trainingFeedbackService.submitFeedback(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentFeedback'] });
      toast.success('Training feedback submitted! Thank you for evaluating curriculum relevance.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      trainingRelevance: relevance,
      practicalExposure: practical,
      interviewPrep: interview,
      industryExposure: industry,
      skillsTrained: ['Java', 'SQL', 'React', 'REST APIs'],
      skillsUsed: ['Java', 'SQL', 'REST APIs'],
      skillsMissing: ['Spring Boot', 'Docker'],
      comments,
    });
  };

  return (
    <PageWrapper className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Training Feedback & Skills Evaluation"
        description="Evaluate how relevant your training was to your target/current job role and highlight skills used vs missing in industry."
        badge={
          <Badge variant="blue" className="gap-1.5 py-1 px-3">
            <MessageSquare className="h-3.5 w-3.5" />
            Training relevance & skill alignment
          </Badge>
        }
      />

      {/* Effectiveness Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-xl text-center">
          <span className="text-xs font-medium text-muted-foreground block">Training effectiveness score</span>
          <span className="text-4xl font-extrabold text-primary mt-2 block">88%</span>
          <p className="text-xs text-muted-foreground mt-1">High career relevance alignment</p>
        </Card>

        <Card className="p-6 rounded-xl md:col-span-2 space-y-2 text-xs">
          <span className="text-base font-semibold text-foreground block">Skills trained vs currently used in industry</span>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-muted-foreground font-medium block mb-2">Trained & utilized</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="blue" className="text-xs font-medium">Java</Badge>
                <Badge variant="blue" className="text-xs font-medium">SQL</Badge>
                <Badge variant="blue" className="text-xs font-medium">REST APIs</Badge>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground font-medium block mb-2">Missing for current role</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="rose" className="text-xs font-medium">Spring Boot</Badge>
                <Badge variant="rose" className="text-xs font-medium">Docker</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Feedback Form */}
      <Card className="p-6 rounded-xl">
        <CardHeader className="p-0 pb-4 border-b border-border mb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Submit training evaluation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">Overall training relevance (1-5 Stars)</label>
              <select
                value={relevance}
                onChange={(e) => setRelevance(Number(e.target.value))}
                className="w-full sm:w-64 px-3 py-2 rounded-md border border-input bg-surface text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value={5}>★★★★★ (5 Stars - Highly relevant)</option>
                <option value={4}>★★★★☆ (4 Stars - Relevant)</option>
                <option value={3}>★★★☆☆ (3 Stars - Partially relevant)</option>
                <option value={2}>★★☆☆☆ (2 Stars - Marginally relevant)</option>
                <option value={1}>★☆☆☆☆ (1 Star - Not relevant)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Feedback & recommendations</label>
              <textarea
                rows={3}
                placeholder="Which topics should be improved? Was practical exposure sufficient?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-surface text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <Button type="submit" isLoading={submitMutation.isPending} variant="primary" className="text-xs flex items-center gap-2">
              <Send className="h-4 w-4" /> Submit feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}


