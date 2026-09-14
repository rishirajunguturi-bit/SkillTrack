import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 bg-surface-secondary/50 text-foreground border-b border-border relative overflow-hidden transition-colors duration-150">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
        <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-foreground leading-tight">
          Ready to start building your career path?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Evaluate your technical proficiency through standardized assessments and build a placement-ready skill portfolio.
        </p>
        <div className="pt-2 flex justify-center">
          <Link href="/register">
            <Button size="lg" variant="primary" className="gap-2 px-8">
              Get started
              <ArrowRight className="h-4 w-4 text-white" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}


