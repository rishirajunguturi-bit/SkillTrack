import { Brain, SearchCheck, BookOpen, LineChart, Award, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function Features() {
  const features = [
    {
      icon: Brain,
      title: 'Adaptive Skill Assessments',
      description: 'Timed multiple-choice evaluations covering algorithms, software architecture, and core CS fundamentals.',
    },
    {
      icon: SearchCheck,
      title: 'Industry Skill Gap Detection',
      description: 'Compare your evaluated technical skill proficiencies directly against hiring criteria for target roles.',
    },
    {
      icon: BookOpen,
      title: 'Personalized Study Plans',
      description: 'Curated learning modules structured around your specific skill gaps to maximize placement readiness.',
    },
    {
      icon: LineChart,
      title: 'Competency & Progress Analytics',
      description: 'Monitor your growth metrics with clear progress tracking, performance history, and outcome trends.',
    },
    {
      icon: Award,
      title: 'Placement & Career Tracking',
      description: 'Track your career journey from skill gap evaluation to mock interviews and verified job offers.',
    },
    {
      icon: Sparkles,
      title: 'AI Proctored Practice',
      description: 'Interactive AI-driven interview and assessment engine providing actionable instant feedback.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-background border-b border-border text-foreground transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="blue" className="mb-3">
            Core capabilities
          </Badge>
          <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
            Everything you need for placement success
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
            Designed for students and educational institutions preparing candidates for competitive technical roles.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} className="p-6 hover:border-primary/40 transition-colors">
                <CardHeader className="p-0 pb-3">
                  <div className="h-10 w-10 rounded-lg bg-surface-secondary flex items-center justify-center text-primary mb-3 border border-border">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {feat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {feat.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}


