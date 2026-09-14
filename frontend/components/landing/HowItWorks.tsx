import { UserPlus, Target, Brain, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Create your profile',
      description: 'Sign up with your academic details, branch, and current technical skills.',
      icon: UserPlus,
    },
    {
      num: '02',
      title: 'Select target role',
      description: 'Define your target career position and view industry benchmark expectations.',
      icon: Target,
    },
    {
      num: '03',
      title: 'Assess your skills',
      description: 'Take timed 20-question skill evaluations to measure your actual proficiency.',
      icon: Brain,
    },
    {
      num: '04',
      title: 'Follow your roadmap',
      description: 'Access tailored AI study modules designed to bridge your identified skill gaps.',
      icon: BookOpen,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-surface-secondary/50 border-b border-border text-foreground transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="blue" className="mb-3">
            How it works
          </Badge>
          <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
            Four simple steps to career readiness
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
            From profile registration to placement verification in four structured steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="blue" className="text-xs">
                    Step {step.num}
                  </Badge>
                  <div className="p-2 rounded-lg bg-surface-secondary text-primary border border-border">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


