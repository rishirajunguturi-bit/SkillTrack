import { Brain, Target, BookOpen, LineChart } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function Problem() {
  const workflowSteps = [
    {
      step: '01',
      icon: Brain,
      title: 'Skill assessments',
      description: 'Quantify actual engineering proficiency through standardized technical evaluations.',
    },
    {
      step: '02',
      icon: Target,
      title: 'Gap identification',
      description: 'Compare current technical skills directly against requirements for your target engineering role.',
    },
    {
      step: '03',
      icon: BookOpen,
      title: 'Targeted learning',
      description: 'Follow structured, step-by-step study modules tailored specifically to close identified gaps.',
    },
    {
      step: '04',
      icon: LineChart,
      title: 'Readiness analytics',
      description: 'Measure progress with real-time competency trends, growth metrics, and topic-level mastery scores.',
    },
  ];

  return (
    <section className="py-20 bg-surface-secondary/50 border-b border-border text-foreground transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="blue" className="mb-3">
            Career readiness workflow
          </Badge>
          <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
            Four steps to placement readiness
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            SkillTrack AI replaces generic advice with objective assessment data, helping you systematically build placement-ready skills.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-border bg-card shadow-xs transition-all hover:border-primary/40 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="blue" className="text-xs">
                    Step {item.step}
                  </Badge>
                  <div className="p-2 rounded-lg bg-surface-secondary text-primary border border-border">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


