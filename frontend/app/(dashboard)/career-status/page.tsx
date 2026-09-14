'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { careerStatusService, CareerStatusType } from '@/services/careerStatus.service';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { Skeleton } from '@/components/ui/Skeleton';
import { Briefcase, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { CareerStatusSelector } from '@/components/career-status/CareerStatusSelector';
import { CareerOutcomeSection } from '@/components/career-status/CareerOutcomeSection';
import { PlacementJourneySection } from '@/components/career-status/PlacementJourneySection';
import { EmploymentDocumentsSection } from '@/components/career-status/EmploymentDocumentsSection';
import { SalaryGrowthSection } from '@/components/career-status/SalaryGrowthSection';
import { UnemploymentSection } from '@/components/career-status/UnemploymentSection';
import { SeekingEmploymentSection } from '@/components/career-status/SeekingEmploymentSection';
import { SelfEmploymentSection } from '@/components/career-status/SelfEmploymentSection';
import { ApprenticeshipSection } from '@/components/career-status/ApprenticeshipSection';
import { HigherStudiesSection } from '@/components/career-status/HigherStudiesSection';

export default function UnifiedCareerStatusPage() {
  const queryClient = useQueryClient();

  const { data: statusData, isLoading } = useQuery({
    queryKey: ['myCareerStatus'],
    queryFn: () => careerStatusService.getMyCareerStatus(),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => careerStatusService.updateMyCareerStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCareerStatus'] });
      toast.success('Career status updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update status');
    },
  });

  const uploadDocMutation = useMutation({
    mutationFn: (formData: FormData) =>
      careerStatusService.addEmploymentDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCareerStatus'] });
    },
  });

  const deleteDocMutation = useMutation({
    mutationFn: (docId: string) => careerStatusService.deleteEmploymentDocument(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCareerStatus'] });
      toast.success('Document evidence removed.');
    },
  });

  if (isLoading) {
    return (
      <PageWrapper className="space-y-6">
        <Skeleton className="h-36 w-full rounded-sm" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-sm" />
          <Skeleton className="h-28 rounded-sm" />
          <Skeleton className="h-28 rounded-sm" />
        </div>
        <Skeleton className="h-64 rounded-sm" />
      </PageWrapper>
    );
  }

  const currentStatus: CareerStatusType = statusData?.currentStatus || 'SEEKING_EMPLOYMENT';

  const handleStatusChange = (newStatus: CareerStatusType) => {
    if (newStatus === currentStatus) return;
    updateMutation.mutate({ currentStatus: newStatus });
  };

  const handleSectionUpdate = (sectionKey: string, details: any) => {
    updateMutation.mutate({ [sectionKey]: details });
  };

  return (
    <PageWrapper className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1c132b] text-foreground shadow-xl border border-white/10 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffad8a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffad8a]/15 text-[#ffad8a] border border-[#ffad8a]/30 text-xs font-semibold uppercase tracking-wider">
          <Zap className="h-3.5 w-3.5 text-[#ffad8a]" />
          <span>Unified Career Workspace</span>
        </div>
        <h1 className="font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
          Career Status <span className="text-[#ffad8a]">Hub</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
          Keep your current career status updated and access career information relevant to your current situation.
        </p>
      </div>

      {/* Career Status Selector */}
      <CareerStatusSelector
        currentStatus={currentStatus}
        onStatusChange={handleStatusChange}
        isSaving={updateMutation.isPending}
      />

      {/* Conditional Rendering based on currentStatus */}
      <motion.div
        key={currentStatus}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-8"
      >
        {currentStatus === 'EMPLOYED' && (
          <>
            <CareerOutcomeSection
              employmentDetails={statusData?.employmentDetails}
              onUpdate={(details) => handleSectionUpdate('employmentDetails', details)}
              isUpdating={updateMutation.isPending}
            />

            <PlacementJourneySection
              placementJourney={statusData?.placementJourney}
            />

            <EmploymentDocumentsSection
              documents={statusData?.employmentDocuments || []}
              onUpload={(doc) => uploadDocMutation.mutate(doc)}
              onDelete={(docId) => deleteDocMutation.mutate(docId)}
              isUploading={uploadDocMutation.isPending}
            />

            <SalaryGrowthSection
              salaryDetails={statusData?.salaryDetails}
              onUpdate={(details) => handleSectionUpdate('salaryDetails', details)}
              isUpdating={updateMutation.isPending}
            />
          </>
        )}

        {currentStatus === 'UNEMPLOYED' && (
          <UnemploymentSection
            unemploymentDetails={statusData?.unemploymentDetails}
            onUpdate={(details) => handleSectionUpdate('unemploymentDetails', details)}
            isUpdating={updateMutation.isPending}
          />
        )}

        {currentStatus === 'SEEKING_EMPLOYMENT' && (
          <SeekingEmploymentSection
            seekingEmploymentDetails={statusData?.seekingEmploymentDetails}
            onUpdate={(details) => handleSectionUpdate('seekingEmploymentDetails', details)}
            isUpdating={updateMutation.isPending}
          />
        )}

        {currentStatus === 'SELF_EMPLOYED' && (
          <SelfEmploymentSection
            selfEmploymentDetails={statusData?.selfEmploymentDetails}
            onUpdate={(details) => handleSectionUpdate('selfEmploymentDetails', details)}
            isUpdating={updateMutation.isPending}
          />
        )}

        {currentStatus === 'APPRENTICESHIP' && (
          <ApprenticeshipSection
            apprenticeshipDetails={statusData?.apprenticeshipDetails}
            onUpdate={(details) => handleSectionUpdate('apprenticeshipDetails', details)}
            isUpdating={updateMutation.isPending}
          />
        )}

        {currentStatus === 'HIGHER_STUDIES' && (
          <HigherStudiesSection
            higherStudiesDetails={statusData?.higherStudiesDetails}
            onUpdate={(details) => handleSectionUpdate('higherStudiesDetails', details)}
            isUpdating={updateMutation.isPending}
          />
        )}
      </motion.div>
    </PageWrapper>
  );
}

