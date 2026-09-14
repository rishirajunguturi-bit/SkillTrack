'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { userService } from '@/services/user.service';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { StatCard } from '@/components/ui/StatCard';
import { Progress } from '@/components/ui/Progress';
import {
  ArrowRight,
  Brain,
  Award,
  BookOpen,
  Code,
  Building,
  Target,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userService.getProfile(),
  });

  const skills = profileData?.skills || [];
  const skillsAddedCount = skills.length;
  const skillsToImprove = skills.filter((s) => s.proficiency < 65);
  const avgProficiency =
    skillsAddedCount > 0
      ? Math.round(skills.reduce((acc, curr) => acc + curr.proficiency, 0) / skillsAddedCount)
      : 78;

  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Sarthak';

  if (isLoading) {
    return (
      <PageWrapper className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="space-y-8">
      {/* Top Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {greetingTime}, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's an overview of your career readiness and learning progress.
          </p>
        </div>
        <Link href="/assessment">
          <Button variant="primary" className="gap-2">
            <Brain className="h-4 w-4" />
            <span>Take assessment</span>
          </Button>
        </Link>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Career readiness"
          value={`${avgProficiency}%`}
          change="+8% this month"
          changeType="positive"
          icon={Briefcase}
          subtitle="based on skill profile"
        />
        <StatCard
          title="Skill progress"
          value={`${skillsAddedCount} skills`}
          change={`${skillsToImprove.length} to improve`}
          changeType={skillsToImprove.length > 0 ? 'neutral' : 'positive'}
          icon={Target}
          subtitle="tracked in matrix"
        />
        <StatCard
          title="Assessment score"
          value="84%"
          change="Top 15%"
          changeType="positive"
          icon={Award}
          subtitle="latest test result"
        />
        <StatCard
          title="Interview readiness"
          value="Ready"
          change="3 mock rounds done"
          changeType="positive"
          icon={Brain}
          subtitle="proctored sessions"
        />
      </div>

      {/* Main Grid: Skill Progress & Recent Activity / Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Skill Progress Overview & AI Study Plan */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Progress Bar Card */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Skill progress</CardTitle>
                <CardDescription>Target role: {user?.targetRole || 'Software Engineer'}</CardDescription>
              </div>
              <Link href="/progress">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 space-y-5 pt-2">
              {skills.length > 0 ? (
                skills.slice(0, 4).map((skill) => {
                  const skillName = typeof skill.skillId === 'object' ? skill.skillId?.name : (skill as any).name || 'Skill';
                  return (
                    <div key={skill._id || skillName} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-foreground">{skillName}</span>
                        <span className="text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <Progress value={skill.proficiency} />
                    </div>
                  );
                })
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-foreground">Data Structures & Algorithms</span>
                      <span className="text-muted-foreground">82%</span>
                    </div>
                    <Progress value={82} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-foreground">System Design</span>
                      <span className="text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-foreground">Web Development & React</span>
                      <span className="text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-foreground">Database Systems & SQL</span>
                      <span className="text-muted-foreground">74%</span>
                    </div>
                    <Progress value={74} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Study Plan Summary */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI study plan
                </CardTitle>
                <CardDescription>Tailored weekly action plan to address skill gaps</CardDescription>
              </div>
              <Link href="/study-plan">
                <Button variant="outline" size="sm">
                  View roadmap
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 pt-2 space-y-3">
              <div className="p-3.5 rounded-2xl border border-white/10 bg-[#281a3a]/40 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-foreground">Graph Algorithms & Dynamic Programming</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Complete 5 practice problems on BFS/DFS traversal and shortest paths.</p>
                </div>
                <Badge variant="warning" className="text-[11px] bg-[#ffad8a]/20 text-[#ffad8a] border-[#ffad8a]/30">Due today</Badge>
              </div>

              <div className="p-3.5 rounded-2xl border border-white/10 bg-[#281a3a]/40 flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#ffad8a] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-foreground">Mock System Design Interview</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Practice designing a scalable URL shortener service.</p>
                </div>
                <Badge variant="secondary" className="text-[11px]">Upcoming</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Career Status & Recommended Actions */}
        <div className="space-y-6">
          {/* Career Status Card */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Career status</CardTitle>
              <CardDescription>Placement Journey milestone</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-2 space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#ffad8a]/10 border border-[#ffad8a]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ffad8a]">Current Phase</span>
                  <Badge variant="warning" className="bg-[#ffad8a]/20 text-[#ffad8a] border-[#ffad8a]/30">Assessment & Prep</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your skill matrix is 78% ready for software engineering campus drives.
                </p>
              </div>
              <Link href="/career-status">
                <Button variant="secondary" className="w-full text-xs gap-1">
                  Track journey <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recommended Actions */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Recommended actions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2 space-y-2.5">
              <Link href="/assessment" className="block">
                <div className="p-3 rounded-lg border border-border hover:bg-surface-secondary transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">Take DSA Assessment</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </Link>

              <Link href="/company-insights" className="block">
                <div className="p-3 rounded-lg border border-border hover:bg-surface-secondary transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">Explore Company Trends</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </Link>

              <Link href="/profile" className="block">
                <div className="p-3 rounded-lg border border-border hover:bg-surface-secondary transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">Update Resume & Skills</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}


