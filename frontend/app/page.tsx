import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Problem } from '@/components/landing/Problem';
import { Solution } from '@/components/landing/Solution';
import { Lifecycle3D } from '@/components/landing/Lifecycle3D';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200 selection:bg-[#ffad8a]/30 selection:text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Solution />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Lifecycle3D />
        </div>
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

