'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Brain,
  Plus,
  Search,
  Sparkles,
  Power,
  Trash2,
  HelpCircle,
  CheckCircle,
  Edit,
  Copy,
  Eye,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  FileText,
  Clock,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import { skillService } from '@/services/skill.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
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
import { Assessment, QuestionReviewItem } from '@/types/assessment';

export default function AdminAssessmentsPage() {
  const queryClient = useQueryClient();

  // State controls
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    description: '',
    skillId: '',
    difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED',
    timeLimit: 30,
    passingScore: 70,
  });

  const [managingAssessment, setManagingAssessment] = useState<Assessment | null>(null);
  const [previewAssessment, setPreviewAssessment] = useState<Assessment | null>(null);
  const [deleteConfirmAssessment, setDeleteConfirmAssessment] = useState<Assessment | null>(null);
  const [deleteConfirmQuestionId, setDeleteConfirmQuestionId] = useState<string | null>(null);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionReviewItem | null>(null);
  const [questionForm, setQuestionForm] = useState({
    topic: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD',
    explanation: '',
  });

  const [generatingSkillId, setGeneratingSkillId] = useState<string | null>(null);

  // Queries
  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ['adminAssessments'],
    queryFn: () => adminService.getAdminAssessments(),
  });

  const { data: catalogSkills = [] } = useQuery({
    queryKey: ['catalogSkills'],
    queryFn: () => skillService.getAllSkills(),
  });

  const { data: questions = [], refetch: refetchQuestions } = useQuery({
    queryKey: ['assessmentQuestions', managingAssessment?._id || previewAssessment?._id],
    queryFn: () => adminService.getAssessmentQuestions((managingAssessment?._id || previewAssessment?._id)!),
    enabled: !!(managingAssessment || previewAssessment),
  });

  // Assessment Mutations
  const saveAssessmentMutation = useMutation({
    mutationFn: (data: Partial<Assessment>) => {
      if (editingAssessment) {
        return adminService.updateAssessment(editingAssessment._id, data);
      } else {
        return adminService.createAssessment(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
      toast.success(editingAssessment ? 'Assessment updated successfully' : 'Assessment created successfully');
      setIsAssessmentModalOpen(false);
      setEditingAssessment(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save assessment');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleAssessmentStatus(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
      toast.success(`Assessment status set to ${updated.isActive ? 'Active (Published)' : 'Inactive (Draft)'}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });

  const duplicateAssessmentMutation = useMutation({
    mutationFn: (id: string) => adminService.duplicateAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
      toast.success('Assessment duplicated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to duplicate assessment');
    },
  });

  const deleteAssessmentMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteAssessment(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
      toast.success(res.message || 'Assessment processed');
      setDeleteConfirmAssessment(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete assessment');
      setDeleteConfirmAssessment(null);
    },
  });

  // Question Mutations
  const saveQuestionMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingQuestion) {
        const qId = editingQuestion._id || editingQuestion.questionId;
        return adminService.updateQuestion(qId!, data);
      } else {
        return adminService.createQuestion(managingAssessment!._id, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
      refetchQuestions();
      toast.success(editingQuestion ? 'Question updated' : 'Question added to assessment');
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save question');
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (qId: string) => adminService.deleteQuestion(qId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
      refetchQuestions();
      toast.success('Question removed');
      setDeleteConfirmQuestionId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete question');
      setDeleteConfirmQuestionId(null);
    },
  });

  const duplicateQuestionMutation = useMutation({
    mutationFn: (qId: string) => adminService.duplicateQuestion(qId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
      refetchQuestions();
      toast.success('Question duplicated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to duplicate question');
    },
  });

  const generateAiQuestionsMutation = useMutation({
    mutationFn: (skillId: string) => adminService.generateAiQuestionsForSkill(skillId, 5),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
      if (managingAssessment) refetchQuestions();
      toast.success(`Generated ${res.createdCount} AI questions! Total in bank: ${res.totalQuestions}`);
      setGeneratingSkillId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to generate AI questions');
      setGeneratingSkillId(null);
    },
  });

  // Handlers
  const handleOpenCreateAssessment = () => {
    setEditingAssessment(null);
    setAssessmentForm({
      title: '',
      description: '',
      skillId: catalogSkills[0]?._id || '',
      difficulty: 'MEDIUM',
      timeLimit: 30,
      passingScore: 70,
    });
    setIsAssessmentModalOpen(true);
  };

  const handleOpenEditAssessment = (a: Assessment) => {
    const skillObj = (a.skillId as any) || {};
    setEditingAssessment(a);
    setAssessmentForm({
      title: a.title,
      description: a.description || '',
      skillId: skillObj._id || (typeof a.skillId === 'string' ? a.skillId : ''),
      difficulty: a.difficulty,
      timeLimit: a.timeLimit,
      passingScore: a.passingScore,
    });
    setIsAssessmentModalOpen(true);
  };

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentForm.title.trim()) return toast.error('Title is required');
    if (!assessmentForm.skillId) return toast.error('Please select a skill');
    saveAssessmentMutation.mutate(assessmentForm);
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      topic: 'General',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 'MEDIUM',
      explanation: '',
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: QuestionReviewItem) => {
    setEditingQuestion(q);
    setQuestionForm({
      topic: q.topic || 'General',
      question: q.question,
      options: [...(q.options || ['', '', '', ''])],
      correctAnswer: q.correctAnswer ?? 0,
      difficulty: q.difficulty || 'MEDIUM',
      explanation: q.explanation || '',
    });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.question.trim()) return toast.error('Question text is required');
    if (questionForm.options.some((opt) => !opt.trim())) {
      return toast.error('All 4 options must be filled');
    }
    saveQuestionMutation.mutate(questionForm);
  };

  const handleMoveQuestion = (index: number, direction: 'UP' | 'DOWN') => {
    if (!questions || questions.length < 2) return;
    const newQuestions = [...questions];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newQuestions.length) return;

    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[targetIdx];
    newQuestions[targetIdx] = temp;

    const ids = newQuestions.map((q) => (q._id || q.questionId)!);
    adminService.reorderQuestions(managingAssessment!._id, ids).then(() => {
      refetchQuestions();
      toast.success('Question reordered');
    });
  };

  // Filtered Assessments
  const filteredAssessments = assessments.filter((a) => {
    const skillName = ((a.skillId as any)?.name || '').toLowerCase();
    const title = (a.title || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query) || skillName.includes(query);

    const matchesDifficulty = difficultyFilter === 'ALL' || a.difficulty === difficultyFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && a.isActive) ||
      (statusFilter === 'INACTIVE' && !a.isActive);

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  return (
    <PageWrapper className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Brain className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            Assessment & Question Management Console
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Create, edit, publish, preview, duplicate, and manage skill assessments and question banks with zero manual database edits.
          </p>
        </div>

        <Button onClick={handleOpenCreateAssessment} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Create Assessment
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search assessment title or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="sm:col-span-3">
            <Select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              options={[
                { label: 'All Difficulties', value: 'ALL' },
                { label: 'Easy', value: 'EASY' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'Hard', value: 'HARD' },
                { label: 'Mixed', value: 'MIXED' },
              ]}
              className="text-xs"
            />
          </div>

          <div className="sm:col-span-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Published / Active', value: 'ACTIVE' },
                { label: 'Draft / Inactive', value: 'INACTIVE' },
              ]}
              className="text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Assessments Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            Assessments ({filteredAssessments.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="text-center py-12 space-y-3 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              <Brain className="h-10 w-10 text-zinc-400 mx-auto" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No assessments found matching criteria.</p>
              <Button size="sm" variant="outline" onClick={handleOpenCreateAssessment}>
                Create New Assessment
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase font-semibold text-[10px]">
                    <th className="pb-3 pr-4">Assessment Title</th>
                    <th className="pb-3 px-4">Associated Skill</th>
                    <th className="pb-3 px-4 text-center">Questions</th>
                    <th className="pb-3 px-4">Time & Pass Score</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {filteredAssessments.map((a) => {
                    const skill = (a.skillId as any) || {};
                    return (
                      <tr key={a._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="py-3 pr-4 font-bold text-zinc-900 dark:text-zinc-100">
                          <div>{a.title}</div>
                          <span className="text-[10px] text-zinc-400 font-normal">
                            Difficulty: <strong className="text-purple-600 dark:text-purple-400">{a.difficulty}</strong>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{skill.name || 'Unassigned'}</span>
                            {skill.category && (
                              <Badge variant="purple" className="text-[10px] py-0 font-semibold">
                                {skill.category}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <strong className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                            {a.questionCountInBank || 0}
                          </strong>
                          <span className="text-zinc-400 text-[10px] block">in bank</span>
                        </td>
                        <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-zinc-400" />
                            <span>{a.timeLimit} mins</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                            <Award className="h-3 w-3 text-emerald-500" />
                            <span>Pass: {a.passingScore}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={a.isActive ? 'success' : 'outline'} className="text-[10px] py-0 font-bold">
                            {a.isActive ? 'Published' : 'Draft / Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewAssessment(a)}
                              className="h-7 text-[10px] px-2 gap-1 text-teal-600 border-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                              title="Preview Assessment (Simulated Trainee View)"
                            >
                              <Eye className="h-3 w-3" />
                              Preview
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditAssessment(a)}
                              className="h-7 text-[10px] px-2 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                              title="Edit Assessment Settings"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setManagingAssessment(a)}
                              className="h-7 text-[10px] px-2 gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold"
                              title="Questions & Question Bank"
                            >
                              <HelpCircle className="h-3 w-3" />
                              Questions ({a.questionCountInBank || 0})
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => duplicateAssessmentMutation.mutate(a._id)}
                              className="h-7 text-[10px] px-2 gap-1 text-zinc-600 border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              title="Duplicate Assessment"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>

                            <Button
                              variant={a.isActive ? 'outline' : 'secondary'}
                              size="sm"
                              onClick={() => toggleStatusMutation.mutate(a._id)}
                              className={`h-7 text-[10px] px-2 gap-1 ${
                                a.isActive
                                  ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                                  : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                              }`}
                              title={a.isActive ? 'Unpublish Assessment' : 'Publish Assessment'}
                            >
                              <Power className="h-3 w-3" />
                              {a.isActive ? 'Unpublish' : 'Publish'}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirmAssessment(a)}
                              className="h-7 text-[10px] px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                              title="Delete Assessment"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE / EDIT ASSESSMENT MODAL */}
      <Dialog open={isAssessmentModalOpen} onOpenChange={setIsAssessmentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              {editingAssessment ? 'Edit Assessment Settings' : 'Create New Skill Assessment'}
            </DialogTitle>
            <DialogDescription>
              Configure title, target skill, difficulty, duration, and passing score.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAssessment} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Assessment Title *</label>
              <Input
                placeholder="e.g. Advanced Python Programming Assessment"
                value={assessmentForm.title}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Description</label>
              <Input
                placeholder="Short description of what is evaluated..."
                value={assessmentForm.description}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, description: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Associated Skill *</label>
              <Select
                value={assessmentForm.skillId}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, skillId: e.target.value })}
                options={[
                  { label: 'Select Target Skill...', value: '' },
                  ...catalogSkills.map((s) => ({ label: `${s.name} (${s.category})`, value: s._id })),
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold block mb-1">Difficulty</label>
                <Select
                  value={assessmentForm.difficulty}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, difficulty: e.target.value as any })}
                  options={[
                    { label: 'Easy', value: 'EASY' },
                    { label: 'Medium', value: 'MEDIUM' },
                    { label: 'Hard', value: 'HARD' },
                    { label: 'Mixed', value: 'MIXED' },
                  ]}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Time Limit (Mins)</label>
                <Input
                  type="number"
                  min={5}
                  max={180}
                  value={assessmentForm.timeLimit}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, timeLimit: parseInt(e.target.value) || 30 })}
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Passing Score (%)</label>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  value={assessmentForm.passingScore}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, passingScore: parseInt(e.target.value) || 70 })}
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAssessmentModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saveAssessmentMutation.isPending}>
                {editingAssessment ? 'Save Changes' : 'Create Assessment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* QUESTION BANK & BUILDER MODAL */}
      <Dialog open={!!managingAssessment} onOpenChange={() => setManagingAssessment(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
              <div>
                <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Question Bank ({questions.length}) — {managingAssessment?.title}
                </DialogTitle>
                <DialogDescription>
                  Add, edit, reorder, duplicate, and configure correct answers & explanations.
                </DialogDescription>
              </div>

              <div className="flex items-center gap-2">
                {managingAssessment && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const skillObj = (managingAssessment.skillId as any) || {};
                      const sId = skillObj._id || (typeof managingAssessment.skillId === 'string' ? managingAssessment.skillId : '');
                      if (!sId) return toast.error('No skill associated with assessment');
                      setGeneratingSkillId(sId);
                      generateAiQuestionsMutation.mutate(sId);
                    }}
                    isLoading={generatingSkillId !== null && generateAiQuestionsMutation.isPending}
                    className="h-8 text-xs gap-1.5 text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Generate +5
                  </Button>
                )}

                <Button size="sm" onClick={handleOpenAddQuestion} className="h-8 text-xs gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Add Question
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 py-2 text-xs">
            {questions.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <FileText className="h-8 w-8 text-zinc-400 mx-auto" />
                <p className="font-semibold text-zinc-600 dark:text-zinc-400">No questions in bank for this assessment yet.</p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={handleOpenAddQuestion}>
                    + Add First Question
                  </Button>
                </div>
              </div>
            ) : (
              questions.map((q, idx) => {
                const qId = q._id || q.questionId;
                return (
                  <div
                    key={qId || idx}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start gap-2">
                        <span className="font-extrabold text-purple-600 dark:text-purple-400 shrink-0 text-sm">
                          Q{idx + 1}.
                        </span>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{q.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="purple" className="text-[10px] py-0 font-mono">
                              Topic: {q.topic}
                            </Badge>
                            {q.difficulty && (
                              <Badge variant="outline" className="text-[10px] py-0">
                                {q.difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Question Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === 0}
                          onClick={() => handleMoveQuestion(idx, 'UP')}
                          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === questions.length - 1}
                          onClick={() => handleMoveQuestion(idx, 'DOWN')}
                          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditQuestion(q)}
                          className="h-7 text-xs px-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateQuestionMutation.mutate(qId!)}
                          className="h-7 text-xs px-2 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Duplicate Question"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmQuestionId(qId!)}
                          className="h-7 text-xs px-2 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswer === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border font-medium flex items-center justify-between ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold'
                                : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            <span>
                              <span className="mr-1.5 opacity-60 font-mono">[{String.fromCharCode(65 + optIdx)}]</span> {opt}
                            </span>
                            {isCorrect && <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-[11px] text-zinc-600 dark:text-zinc-300">
                        <strong className="text-purple-700 dark:text-purple-300 font-bold">Answer Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setManagingAssessment(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD / EDIT QUESTION FORM MODAL */}
      <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </DialogTitle>
            <DialogDescription>
              Specify question text, 4 options, correct answer key, and explanation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Question Text *</label>
              <Input
                placeholder="Enter the question statement..."
                value={questionForm.question}
                onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Topic / Category</label>
                <Input
                  placeholder="e.g. Data Types, Functions"
                  value={questionForm.topic}
                  onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Difficulty</label>
                <Select
                  value={questionForm.difficulty}
                  onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value as any })}
                  options={[
                    { label: 'Easy', value: 'EASY' },
                    { label: 'Medium', value: 'MEDIUM' },
                    { label: 'Hard', value: 'HARD' },
                  ]}
                />
              </div>
            </div>

            {/* Options Input */}
            <div className="space-y-2">
              <label className="font-semibold block">Answer Options & Correct Answer Key *</label>
              {questionForm.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswerKey"
                    checked={questionForm.correctAnswer === optIdx}
                    onChange={() => setQuestionForm({ ...questionForm, correctAnswer: optIdx })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="font-bold w-6 text-zinc-500">[{String.fromCharCode(65 + optIdx)}]</span>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                    value={opt}
                    onChange={(e) => {
                      const updatedOpts = [...questionForm.options];
                      updatedOpts[optIdx] = e.target.value;
                      setQuestionForm({ ...questionForm, options: updatedOpts });
                    }}
                    required
                  />
                </div>
              ))}
              <p className="text-[10px] text-zinc-400">Select radio button next to the correct answer option.</p>
            </div>

            <div>
              <label className="font-semibold block mb-1">Answer Explanation</label>
              <Input
                placeholder="Explain why the correct answer is right..."
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsQuestionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saveQuestionMutation.isPending}>
                {editingQuestion ? 'Save Question' : 'Add Question'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ASSESSMENT PREVIEW MODAL */}
      <Dialog open={!!previewAssessment} onOpenChange={() => setPreviewAssessment(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between pr-4">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-teal-600" />
                  Assessment Preview: {previewAssessment?.title}
                </DialogTitle>
                <DialogDescription>
                  Simulated Trainee View (No attempt recorded)
                </DialogDescription>
              </div>
              <Badge variant="purple" className="font-bold">
                {previewAssessment?.timeLimit} Mins | Pass: {previewAssessment?.passingScore}%
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 py-2 text-xs">
            {questions.length === 0 ? (
              <div className="text-center py-10 text-zinc-400">No questions to preview.</div>
            ) : (
              questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      Question {idx + 1}: {q.question}
                    </h4>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {q.topic}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 font-medium hover:border-purple-400 cursor-pointer transition-colors"
                      >
                        <span className="font-bold text-purple-600 dark:text-purple-400 mr-2">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewAssessment(null)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE ASSESSMENT MODAL */}
      <Dialog open={!!deleteConfirmAssessment} onOpenChange={() => setDeleteConfirmAssessment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Delete Assessment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>"{deleteConfirmAssessment?.title}"</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs space-y-1">
            <p className="font-bold">Safety Check:</p>
            <p>If student attempts exist for this assessment, it will be safely archived to preserve historical student reports and skill-gap metrics.</p>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirmAssessment(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteAssessmentMutation.mutate(deleteConfirmAssessment!._id)}
              isLoading={deleteAssessmentMutation.isPending}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE QUESTION MODAL */}
      <Dialog open={!!deleteConfirmQuestionId} onOpenChange={() => setDeleteConfirmQuestionId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Question?
            </DialogTitle>
            <DialogDescription>
              This question will be removed from the assessment question bank.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirmQuestionId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteQuestionMutation.mutate(deleteConfirmQuestionId!)}
              isLoading={deleteQuestionMutation.isPending}
            >
              Delete Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
