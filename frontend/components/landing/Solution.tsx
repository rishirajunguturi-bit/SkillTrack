import { CheckCircle2, ShieldCheck, Target } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function Solution() {
  const differentiators = [
    {
      title: '20-Question Timed Assessments',
      description: 'Standardized evaluations measuring core engineering concepts across all active skills.',
    },
    {
      title: 'Target Role Skill Gap Analysis',
      description: 'Objective gap detection mapping your evaluated proficiencies against hiring requirements.',
    },
    {
      title: 'Adaptive Learning Pathways',
      description: 'Structured, step-by-step study modules tailored specifically to close identified skill gaps.',
    },
    {
      title: 'Real-Time Competency Analytics',
      description: 'Track growth with dynamic proficiency trends, topic breakdowns, and placement readiness scores.',
    },
  ];

  return (
    <section id="solution" className="py-20 bg-background border-b border-border text-foreground transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <Badge variant="blue">
              Why SkillTrack AI
            </Badge>
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground leading-tight">
              A structured roadmap to engineering placement success
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              SkillTrack AI replaces guesswork with data-driven clarity. We help you systematically build skills, bridge gaps, and prove your readiness for technical selection rounds.
            </p>

            <div className="pt-4 space-y-4">
              {differentiators.map((sol, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground text-base">
                      {sol.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {sol.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="p-6 sm:p-8 rounded-xl bg-card border border-border shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-primary text-white font-medium">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Competency scorecard breakdown</h3>
                  <p className="text-muted-foreground text-xs">Standardized evaluation metrics</p>
                </div>
              </div>

              <div className="space-y-3 bg-surface-secondary/50 p-4 rounded-lg text-xs border border-border">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-foreground font-medium">Data Structures & Algorithms</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Advanced (85%)</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-foreground font-medium">Web Architecture & Node.js</span>
                  <span className="font-semibold text-primary">Proficient (70%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-medium">System Design & Databases</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Skill gap (40%)</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Verified 20-question evaluation metric</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


