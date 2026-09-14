'use client';

import { useAuth } from '@/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/Skeleton';

import { AiAssistantDrawer } from '@/components/ai/AiAssistantDrawer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6 space-y-4">
        <div className="space-y-4 w-full max-w-md text-center">
          <div className="h-10 w-10 rounded-xl bg-[#ffad8a] animate-pulse mx-auto shadow-[0_0_20px_rgba(255,173,138,0.5)]" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-[#ffad8a]/30 selection:text-foreground transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
        <AiAssistantDrawer />
      </div>
    </div>
  );
}

