'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Brain, Target, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32 border-b border-border bg-background text-foreground transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <Badge variant="warning" className="px-3.5 py-1 text-xs font-semibold bg-[#ffad8a]/15 text-[#ffad8a] border-[#ffad8a]/30">
            <Sparkles className="h-3.5 w-3.5 text-[#ffad8a]" />
            <span>AI-powered career readiness platform</span>
          </Badge>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-foreground max-w-4xl mx-auto leading-tight"
        >
          Bridge the gap between education and career success.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          AI-powered skill evaluation, gap analysis, and placement readiness tracking for students and institutions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2">
              Get started
              <ArrowRight className="h-4 w-4 text-[#2b1120]" />
            </Button>
          </Link>
          <a href="#solution" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Schedule demo
            </Button>
          </a>
        </motion.div>

        {/* Hero Product Console Preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-14 max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#1c132b] p-4 sm:p-6 shadow-2xl text-left relative overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400/60" />
              <div className="h-3 w-3 rounded-full bg-amber-400/60" />
              <div className="h-3 w-3 rounded-full bg-emerald-400/60" />
              <span className="text-xs font-medium text-muted-foreground ml-2">SkillTrack AI • Dashboard Preview</span>
            </div>
            <Badge variant="warning" className="text-xs bg-[#ffad8a]/15 text-[#ffad8a] border-[#ffad8a]/30">Live platform</Badge>
          </div>

          {/* Console Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#281a3a]/60 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#ffad8a] text-[#2b1120] font-bold">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground">Target role</h4>
                  <p className="font-extrabold text-base text-foreground">Software Engineer</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Placement readiness</span>
                  <span className="text-[#ffad8a] font-extrabold">78%</span>
                </div>
                <div className="h-2 rounded-full bg-[#100a18] border border-white/10 overflow-hidden">
                  <div className="h-full bg-[#ffad8a] rounded-full w-[78%]" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#281a3a]/60 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#ffad8a] text-[#2b1120] font-bold">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground">Skill gap analysis</h4>
                  <p className="font-extrabold text-base text-foreground">3 Priority Gaps</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge variant="warning" className="text-xs bg-[#ffad8a]/20 text-[#ffad8a] border-[#ffad8a]/30">System Design</Badge>
                <Badge variant="secondary" className="text-xs">Docker</Badge>
                <Badge variant="secondary" className="text-xs">PostgreSQL</Badge>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#281a3a]/60 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#ffad8a] text-[#2b1120] font-bold">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground">Evaluations</h4>
                  <p className="font-extrabold text-base text-foreground">20-Question Assessments</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>DSA & Architecture Verified</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


