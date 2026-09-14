'use client';

import { CareerStatusType } from '@/services/careerStatus.service';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Briefcase,
  Search,
  AlertTriangle,
  Building,
  GraduationCap,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface CareerStatusSelectorProps {
  currentStatus: CareerStatusType;
  onStatusChange: (status: CareerStatusType) => void;
  isSaving?: boolean;
}

export function CareerStatusSelector({
  currentStatus,
  onStatusChange,
  isSaving,
}: CareerStatusSelectorProps) {
  const statuses: Array<{
    id: CareerStatusType;
    label: string;
    description: string;
    icon: any;
  }> = [
    {
      id: 'EMPLOYED',
      label: 'Employed',
      description: 'Full-time, part-time or contract employment in industry.',
      icon: Briefcase,
    },
    {
      id: 'SEEKING_EMPLOYMENT',
      label: 'Seeking employment',
      description: 'Actively preparing and applying for target job roles.',
      icon: Search,
    },
    {
      id: 'UNEMPLOYED',
      label: 'Unemployed',
      description: 'Currently not employed and identifying skill gaps.',
      icon: AlertTriangle,
    },
    {
      id: 'SELF_EMPLOYED',
      label: 'Self-employed',
      description: 'Freelancing, startup founder, or independent business owner.',
      icon: Building,
    },
    {
      id: 'APPRENTICESHIP',
      label: 'Apprenticeship',
      description: 'Structured vocational training or internship program.',
      icon: Award,
    },
    {
      id: 'HIGHER_STUDIES',
      label: 'Higher studies',
      description: 'Enrolled in post-graduate degree or specialized courses.',
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Current career status
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select your current status to unlock relevant career tools and forms.
          </p>
        </div>
        {isSaving && (
          <Badge variant="warning" className="animate-pulse text-xs bg-[#ffad8a]/20 text-[#ffad8a] border-[#ffad8a]/30">
            Updating status...
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statuses.map((item) => {
          const Icon = item.icon;
          const isSelected = currentStatus === item.id;
          return (
            <Card
              key={item.id}
              onClick={() => onStatusChange(item.id)}
              className={`p-4 cursor-pointer transition-all duration-150 border rounded-2xl relative overflow-hidden ${
                isSelected
                  ? 'border-[#ffad8a] bg-[#ffad8a]/15 shadow-md shadow-[#ffad8a]/10 ring-1 ring-[#ffad8a]/30 text-foreground'
                  : 'border-border hover:border-[#ffad8a]/40 bg-[#1c132b] text-foreground'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#ffad8a] text-[#2b1120]'
                        : 'bg-[#281a3a] text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-foreground">
                      {item.label}
                    </h3>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="h-5 w-5 text-[#ffad8a] shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


