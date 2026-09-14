'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Brain, Briefcase, BarChart3, CheckCircle2, RefreshCw, Zap } from 'lucide-react';

interface Stage {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const STAGES: Stage[] = [
  { id: 'train', label: 'TRAIN', description: 'Curriculum & Institutional Skill Impartation', icon: Award, color: '#2563EB' },
  { id: 'assess', label: 'ASSESS', description: 'Standardized Competency & Gap Evaluation', icon: Brain, color: '#D97706' },
  { id: 'learn', label: 'LEARN', description: 'Adaptive & Personalization Pathways', icon: Zap, color: '#059669' },
  { id: 'employ', label: 'EMPLOY', description: 'Direct Corporate & Placement Alignment', icon: Briefcase, color: '#4F46E5' },
  { id: 'verify', label: 'VERIFY', description: 'Tamper-proof Outcome & Skill Certification', icon: ShieldCheck, color: '#15803D' },
  { id: 'analyze', label: 'ANALYZE', description: 'Government Impact Intelligence & Data', icon: BarChart3, color: '#D97706' },
  { id: 'improve', label: 'IMPROVE', description: 'Iterative Skill Policy & Training Refinement', icon: RefreshCw, color: '#2563EB' },
  { id: 'scale', label: 'SCALE', description: 'State & National Skilling Mission Expansion', icon: CheckCircle2, color: '#15803D' },
];

export function Lifecycle3D() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isRotating]);

  return (
    <div className="w-full py-8 px-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Skilling Outcome Lifecycle</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          National Skilling & Placement Intelligence Loop
        </h3>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          SkillTrack AI tracks, evaluates, and verifies candidate progression at every step of the skilling pipeline for maximum institutional accountability.
        </p>

        {/* 3D Interactive Node Ring */}
        <div 
          className="relative my-10 h-72 sm:h-80 flex items-center justify-center perspective-1000"
          onMouseEnter={() => setIsRotating(false)}
          onMouseLeave={() => setIsRotating(true)}
        >
          {/* Central Hub */}
          <div className="absolute z-20 flex flex-col items-center justify-center h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-slate-800 border-2 border-amber-500/50 shadow-[0_0_30px_rgba(217,119,6,0.25)] text-center p-2">
            <div className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">SkillTrack</div>
            <div className="text-xs font-black text-white mt-0.5">CORE AI</div>
            <div className="text-[9px] text-slate-400 mt-1">{STAGES[activeStage].label}</div>
          </div>

          {/* Node Orbit Circle */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <circle cx="50%" cy="50%" r="120" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-blue-400" />
          </svg>

          {/* Orbiting Nodes */}
          {STAGES.map((stage, idx) => {
            const angle = (idx / STAGES.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 125; // Ring radius
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isActive = idx === activeStage;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStage(idx);
                  setIsRotating(false);
                }}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                className={`absolute z-30 flex flex-col items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 border-white text-white scale-110 shadow-[0_0_20px_rgba(37,99,235,0.6)] ring-2 ring-blue-400'
                    : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:scale-105'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[9px] font-extrabold tracking-wider mt-0.5">{stage.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Box */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 max-w-lg mx-auto transition-all duration-200">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-sm">
            <span>Stage {activeStage + 1} of {STAGES.length}:</span>
            <span className="text-white font-bold tracking-wide">{STAGES[activeStage].label}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{STAGES[activeStage].description}</p>
        </div>
      </div>
    </div>
  );
}
