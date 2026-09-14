'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminService } from '@/services/admin.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import {
  Users,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Brain,
  Building2,
  LineChart as LineChartIcon,
  Award,
  Zap,
  Target,
  Plus,
  ArrowRight,
  Layers,
  HelpCircle,
  FileText,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function AdminControlCenterPage() {
  // Fetch real platform metrics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => adminService.getDashboardStats(),
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ['adminAssessments'],
    queryFn: () => adminService.getAdminAssessments(),
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['adminSkills'],
    queryFn: () => adminService.getAdminSkills(),
  });

  const { data: programs = [] } = useQuery({
    queryKey: ['adminPrograms'],
    queryFn: () => adminService.getPrograms(),
  });

  const { data: cohorts = [] } = useQuery({
    queryKey: ['adminCohorts'],
    queryFn: () => adminService.getCohorts(),
  });

  const publishedAssessments = assessments.filter((a) => a.isActive);
  const totalQuestionsInBank = assessments.reduce((acc, a) => acc + (a.questionCountInBank || 0), 0);
  const activePrograms = programs.filter((p) => p.isActive);
  const activeCohorts = cohorts.filter((c) => c.status === 'ACTIVE');

  return (
    <PageWrapper className="space-y-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-6 sm:p-8 rounded-3xl bg-zinc-900 dark:bg-zinc-950 text-white shadow-xl border border-zinc-800 relative overflow-hidden"
      >
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
            <span>Platform Administration & Content Control Console</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Admin Control Center ⚡
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-3xl">
            Real-time management of skill assessments, question banks, skill catalog, training programs, cohorts, and trainee accounts.
          </p>
        </div>
      </motion.div>

      {/* Real Platform Statistics Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {/* 1. Total Students */}
        <motion.div variants={cardItemVariants}>
          <Card className="hover:border-purple-400 transition-all border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                Trainees
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {statsLoading ? '...' : stats?.totalStudents || 0}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Active accounts</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. Total Assessments */}
        <motion.div variants={cardItemVariants}>
          <Card className="hover:border-indigo-400 transition-all border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                Assessments
              </CardTitle>
              <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {assessments.length}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">{publishedAssessments.length} Published</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Question Bank */}
        <motion.div variants={cardItemVariants}>
          <Card className="hover:border-emerald-400 transition-all border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                Question Bank
              </CardTitle>
              <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {totalQuestionsInBank}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Validated items</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 4. Skill Catalog */}
        <motion.div variants={cardItemVariants}>
          <Card className="hover:border-amber-400 transition-all border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                Skill Catalog
              </CardTitle>
              <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {skills.length}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Competency skills</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 5. Programs & Cohorts */}
        <motion.div variants={cardItemVariants}>
          <Card className="hover:border-sky-400 transition-all border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                Programs / Cohorts
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">
                {activePrograms.length} / {cohorts.length}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Active curricula & batches</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Launch & Content Management Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Module 1: Assessment Console */}
        <Card className="p-5 hover:border-purple-500/60 transition-all border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Assessments & Questions</h3>
                <p className="text-[11px] text-zinc-500">{assessments.length} total assessments configured</p>
              </div>
            </div>
            <Badge variant="purple" className="text-[10px]">{publishedAssessments.length} Published</Badge>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Create skill evaluations, configure pass thresholds, build 4-choice questions, and generate AI question sets via Gemini.
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
            <Link href="/admin/assessments" className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs justify-between gap-2 text-purple-600 border-purple-200">
                <span>Manage Assessments Console</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Module 2: Skill Catalog Console */}
        <Card className="p-5 hover:border-amber-500/60 transition-all border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Skill Catalog Management</h3>
                <p className="text-[11px] text-zinc-500">{skills.length} skills in database catalog</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">Catalog</Badge>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Define skilling competencies, categories, descriptions, and preserve user assessment relationships cleanly.
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
            <Link href="/admin/skills" className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs justify-between gap-2 text-amber-600 border-amber-200">
                <span>Manage Skill Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Module 3: Training Programs & Cohorts */}
        <Card className="p-5 hover:border-indigo-500/60 transition-all border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Training & Cohorts</h3>
                <p className="text-[11px] text-zinc-500">{programs.length} programs, {cohorts.length} cohorts</p>
              </div>
            </div>
            <Badge variant="success" className="text-[10px]">Active</Badge>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Manage government training programs, training providers, cohort batch limits, and start/end dates.
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 gap-2">
            <Link href="/admin/programs" className="w-1/2">
              <Button variant="outline" size="sm" className="w-full text-[11px] justify-between text-indigo-600 border-indigo-200">
                <span>Programs</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
            <Link href="/admin/cohorts" className="w-1/2">
              <Button variant="outline" size="sm" className="w-full text-[11px] justify-between text-indigo-600 border-indigo-200">
                <span>Cohorts</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
