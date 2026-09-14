import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface py-14 text-xs border-t border-border text-foreground transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-white font-medium">
                <Zap className="h-4 w-4 fill-white text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                SkillTrack <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Engineering skill evaluation and career readiness platform for students, colleges, and enterprise teams.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Skill Assessments</a></li>
              <li><a href="#features" className="hover:text-foreground transition-colors">Skill Gap Analysis</a></li>
              <li><a href="#features" className="hover:text-foreground transition-colors">Study Roadmap</a></li>
              <li><a href="#features" className="hover:text-foreground transition-colors">Readiness Score</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Get started</Link></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a></li>
              <li><a href="#solution" className="hover:text-foreground transition-colors">Solution</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><span className="hover:text-foreground cursor-pointer">Trainee workspace</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Trainer portal</span></li>
              <li><span className="hover:text-foreground cursor-pointer">System status</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Documentation</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center text-muted-foreground text-xs">
          <p>© {new Date().getFullYear()} SkillTrack AI. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-medium text-foreground">Engineering Career Readiness Platform</p>
        </div>
      </div>
    </footer>
  );
}


