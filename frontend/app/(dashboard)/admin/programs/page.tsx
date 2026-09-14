'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { GraduationCap, Users, Briefcase, Award, Building2, Plus, Edit, Power, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProgramsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: '',
    provider: '',
    category: 'Technology & AI',
    duration: '6 Months',
    avgSalary: '₹7.5 LPA',
    placementRate: 85,
  });

  // Queries
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['adminPrograms'],
    queryFn: () => adminService.getPrograms(),
  });

  // Mutations
  const saveProgramMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingProgram) {
        return adminService.updateProgram(editingProgram._id, data);
      } else {
        return adminService.createProgram(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPrograms'] });
      toast.success(editingProgram ? 'Program updated' : 'Program created');
      setIsModalOpen(false);
      setEditingProgram(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save program');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleProgramStatus(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminPrograms'] });
      toast.success(`Program status updated to ${updated.isActive ? 'Active' : 'Inactive'}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to toggle status');
    },
  });

  const handleOpenCreate = () => {
    setEditingProgram(null);
    setForm({
      title: '',
      provider: 'National Skilling Center',
      category: 'Technology & AI',
      duration: '6 Months',
      avgSalary: '₹7.5 LPA',
      placementRate: 85,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prog: any) => {
    setEditingProgram(prog);
    setForm({
      title: prog.title,
      provider: prog.provider || 'National Skilling Center',
      category: prog.category || 'Technology & AI',
      duration: prog.duration || '6 Months',
      avgSalary: prog.avgSalary || '₹7.5 LPA',
      placementRate: prog.placementRate || 85,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Program title is required');
    saveProgramMutation.mutate(form);
  };

  const filteredPrograms = programs.filter((p: any) =>
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.provider || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <GraduationCap className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Training Program Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Manage government skilling curricula, providers, placement targets, and program activation.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Create Program
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search training programs by title or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </Card>

      {/* Programs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : filteredPrograms.length === 0 ? (
        <Card className="p-12 text-center border-dashed text-zinc-400 space-y-3">
          <GraduationCap className="h-10 w-10 mx-auto" />
          <p className="font-semibold text-zinc-600 dark:text-zinc-300 text-sm">No training programs found.</p>
          <Button size="sm" variant="outline" onClick={handleOpenCreate}>
            Create Training Program
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map((prog: any) => (
            <Card
              key={prog._id}
              className={`p-6 transition-all border ${
                prog.isActive ? 'border-zinc-200 dark:border-zinc-800' : 'border-rose-200 dark:border-rose-900/50 opacity-75'
              }`}
            >
              <CardHeader className="p-0 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-indigo-600" />
                      {prog.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1 flex items-center gap-1.5 text-zinc-500">
                      <Building2 className="h-3.5 w-3.5" />
                      {prog.provider}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={prog.isActive ? 'purple' : 'outline'} className="text-xs font-bold">
                      {prog.duration}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] font-extrabold text-zinc-400 uppercase block">Enrolled</span>
                    <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">{prog.enrolledCount || 0}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase block">Placement</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{prog.placementRate}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase block">Avg Salary</span>
                    <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{prog.avgSalary}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <Badge variant={prog.isActive ? 'success' : 'outline'} className="text-[10px]">
                    {prog.isActive ? 'Active' : 'Inactive'}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(prog)}
                      className="h-7 text-xs gap-1"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </Button>
                    <Button
                      variant={prog.isActive ? 'outline' : 'secondary'}
                      size="sm"
                      onClick={() => toggleStatusMutation.mutate(prog._id)}
                      className={`h-7 text-xs gap-1 ${
                        prog.isActive ? 'text-rose-600 border-rose-200 hover:bg-rose-50' : 'text-emerald-600'
                      }`}
                    >
                      <Power className="h-3 w-3" />
                      {prog.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE / EDIT PROGRAM MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              {editingProgram ? 'Edit Training Program' : 'Create Training Program'}
            </DialogTitle>
            <DialogDescription>
              Configure title, provider name, duration, and placement metrics.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Program Title *</label>
              <Input
                placeholder="e.g. Artificial Intelligence & Machine Learning"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Training Provider *</label>
              <Input
                placeholder="e.g. National Skilling Hub, IIT Madras"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Duration</label>
                <Input
                  placeholder="e.g. 6 Months"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Avg Salary Target</label>
                <Input
                  placeholder="e.g. ₹7.5 LPA"
                  value={form.avgSalary}
                  onChange={(e) => setForm({ ...form, avgSalary: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Target Placement Rate (%)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.placementRate}
                onChange={(e) => setForm({ ...form, placementRate: parseInt(e.target.value) || 0 })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saveProgramMutation.isPending}>
                {editingProgram ? 'Save Changes' : 'Create Program'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
