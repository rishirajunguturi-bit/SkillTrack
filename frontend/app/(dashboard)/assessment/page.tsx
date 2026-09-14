'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Brain,
  Clock,
  Award,
  ArrowRight,
  Search,
} from 'lucide-react';
import { assessmentService } from '@/services/assessment.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AssessmentHubPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');
  const [search, setSearch] = useState('');

  // Fetch active public assessments
  const { data: assessments = [], isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['publicAssessments'],
    queryFn: () => assessmentService.getPublicAssessments(),
  });

  // Fetch user attempt history
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['userAttemptHistory'],
    queryFn: () => assessmentService.getUserAttemptHistory(),
    enabled: activeTab === 'history',
  });

  const history = historyData?.attempts || (Array.isArray(historyData) ? historyData : []);

  // Filter assessments
  const filteredAssessments = assessments.filter((a) => {
    const title = a.title?.toLowerCase() || '';
    const skillName = (a.skillId as any)?.name?.toLowerCase() || '';
    const q = search.toLowerCase();
    return title.includes(q) || skillName.includes(q);
  });

  return (
    <PageWrapper className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Assess your technical skills"
        description="Evaluate your engineering knowledge through standardized timed assessments. Measure proficiency and identify target skill gaps."
        action={
          <Badge variant="blue" className="gap-1.5 py-1 px-3">
            <Brain className="h-3.5 w-3.5" />
            Skill assessment engine
          </Badge>
        }
      />

      {/* Tabs & Search Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-surface-secondary p-1 rounded-lg border border-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'available'
                ? 'bg-surface text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Available assessments ({assessments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'history'
                ? 'bg-surface text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            My attempt history
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skill assessment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        )}
      </div>

      {/* Available Assessments Tab */}
      {activeTab === 'available' && (
        <>
          {isLoadingAssessments ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-56 w-full rounded-xl bg-surface-secondary" />
              ))}
            </div>
          ) : filteredAssessments.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground rounded-xl">
              <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground">No assessments found</h3>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search filter or select another skill category.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((a: any) => {
                const skillName = (a.skillId as any)?.name || 'Technical Skill';
                const skillCategory = (a.skillId as any)?.category || 'Engineering';

                return (
                  <Card
                    key={a._id}
                    className="p-5 hover:border-primary/40 transition-all duration-200 flex flex-col justify-between rounded-xl"
                  >
                    <CardHeader className="p-0 space-y-3 pb-4">
                      <div className="flex justify-between items-start">
                        <Badge variant="blue" className="text-xs">
                          {skillCategory}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {a.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {a.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs text-muted-foreground">
                        {a.description || `Comprehensive evaluation covering ${skillName} concepts.`}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 pt-2 space-y-4">
                      <div className="p-3 rounded-lg bg-surface-secondary/50 border border-border flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5 text-foreground font-medium">
                          <Brain className="h-4 w-4 text-primary" />
                          20 questions
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {a.timeLimit || 20} mins
                        </span>
                      </div>

                      <Link href={`/assessment/${a._id}`} className="block">
                        <Button variant="primary" className="w-full gap-2 text-xs">
                          Start assessment
                          <ArrowRight className="h-4 w-4 text-white" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <>
          {isLoadingHistory ? (
            <Skeleton className="h-96 w-full rounded-xl bg-surface-secondary" />
          ) : history.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground rounded-xl">
              <Award className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground">No completed attempts yet</h3>
              <p className="text-xs text-muted-foreground mt-1">Start your first technical skill evaluation above!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((att: any) => {
                const skillName = (att.skillId as any)?.name || 'Technical Skill';
                const dateStr = new Date(att.startedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <Card
                    key={att._id}
                    className="p-5 hover:border-border/80 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-xl"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base text-foreground">{skillName}</span>
                        <Badge
                          variant="blue"
                          className="text-xs"
                        >
                          {att.proficiency}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Attempted on {dateStr} • {att.correctAnswers} / {att.totalQuestions || 20} correct
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-xl font-bold text-primary block">
                          {att.percentage}%
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{att.status}</span>
                      </div>

                      <Link href={`/assessment/results/${att._id}`}>
                        <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                          View results
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}


