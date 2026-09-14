'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
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
import { Users, Building2, MapPin, Plus, Edit, Power, Search, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCohortsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: '',
    programId: '',
    startDate: '',
    endDate: '',
    maxCapacity: 50,
    status: 'ACTIVE' as 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED',
  });

  // Queries
  const { data: cohorts = [], isLoading } = useQuery({
    queryKey: ['adminCohorts'],
    queryFn: () => adminService.getCohorts(),
  });

  const { data: programs = [] } = useQuery({
    queryKey: ['adminPrograms'],
    queryFn: () => adminService.getPrograms(),
  });

  // Mutations
  const saveCohortMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingCohort) {
        return adminService.updateCohort(editingCohort._id, data);
      } else {
        return adminService.createCohort(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCohorts'] });
      toast.success(editingCohort ? 'Cohort updated' : 'Cohort created');
      setIsModalOpen(false);
      setEditingCohort(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save cohort');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleCohortStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCohorts'] });
      toast.success('Cohort status toggled');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to toggle cohort status');
    },
  });

  const handleOpenCreate = () => {
    setEditingCohort(null);
    setForm({
      name: '',
      programId: programs[0]?._id || '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxCapacity: 50,
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCohort(c);
    const pId = typeof c.programId === 'object' ? c.programId._id : c.programId;
    setForm({
      name: c.name,
      programId: pId || '',
      startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '',
      endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : '',
      maxCapacity: c.maxCapacity || 50,
      status: c.status || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Cohort name is required');
    saveCohortMutation.mutate(form);
  };

  const filteredCohorts = cohorts.filter((c: any) => {
    const progName = (typeof c.programId === 'object' ? c.programId?.title : '') || '';
    return (
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      progName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <PageWrapper className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Users className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Trainee Cohorts & Batch Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Group trainees into structured academic batches, manage capacity limits, and monitor batch progress.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Create Cohort
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search cohorts by name or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </Card>

      {/* Cohorts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : filteredCohorts.length === 0 ? (
        <Card className="p-12 text-center border-dashed text-zinc-400 space-y-3">
          <Users className="h-10 w-10 mx-auto" />
          <p className="font-semibold text-zinc-600 dark:text-zinc-300 text-sm">No cohorts found.</p>
          <Button size="sm" variant="outline" onClick={handleOpenCreate}>
            Create New Cohort
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCohorts.map((c: any) => {
            const prog = typeof c.programId === 'object' ? c.programId : null;
            return (
              <Card key={c._id} className="p-6 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-all">
                <CardHeader className="p-0 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-600" />
                        {c.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 text-zinc-500 font-medium">
                        Program: <strong className="text-zinc-900 dark:text-zinc-200">{prog?.title || 'Unassigned'}</strong>
                      </CardDescription>
                    </div>

                    <Badge
                      variant={
                        c.status === 'ACTIVE'
                          ? 'success'
                          : c.status === 'UPCOMING'
                          ? 'purple'
                          : 'outline'
                      }
                      className="text-xs font-bold"
                    >
                      {c.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0 space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] font-extrabold text-zinc-400 uppercase block">Enrolled</span>
                      <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                        {c.currentEnrolled || 0} / {c.maxCapacity}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50">
                      <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase block">Start Date</span>
                      <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
                        {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase block">End Date</span>
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                        {c.endDate ? new Date(c.endDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="text-[11px] text-zinc-400">
                      Capacity Fill: {Math.round(((c.currentEnrolled || 0) / (c.maxCapacity || 1)) * 100)}%
                    </span>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(c)} className="h-7 text-xs gap-1">
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                      <Button
                        variant={c.status === 'ACTIVE' ? 'outline' : 'secondary'}
                        size="sm"
                        onClick={() => toggleStatusMutation.mutate(c._id)}
                        className="h-7 text-xs gap-1"
                      >
                        <Power className="h-3 w-3" />
                        {c.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT COHORT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              {editingCohort ? 'Edit Cohort' : 'Create New Cohort'}
            </DialogTitle>
            <DialogDescription>
              Associate batch with training program and set maximum enrollment capacity.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Cohort / Batch Name *</label>
              <Input
                placeholder="e.g. Batch 2026-A (Hyderabad)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Training Program</label>
              <Select
                value={form.programId}
                onChange={(e) => setForm({ ...form, programId: e.target.value })}
                options={[
                  { label: 'Select Program...', value: '' },
                  ...programs.map((p: any) => ({ label: p.title, value: p._id })),
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Start Date</label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">End Date</label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Max Capacity</label>
                <Input
                  type="number"
                  min={5}
                  max={500}
                  value={form.maxCapacity}
                  onChange={(e) => setForm({ ...form, maxCapacity: parseInt(e.target.value) || 50 })}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Status</label>
                <Select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  options={[
                    { label: 'Active', value: 'ACTIVE' },
                    { label: 'Upcoming', value: 'UPCOMING' },
                    { label: 'Completed', value: 'COMPLETED' },
                    { label: 'Archived', value: 'ARCHIVED' },
                  ]}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saveCohortMutation.isPending}>
                {editingCohort ? 'Save Changes' : 'Create Cohort'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
