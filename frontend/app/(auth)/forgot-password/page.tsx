'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Zap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { authService } from '@/services/auth.service';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const msg = await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success(msg);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Unable to process reset request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground relative transition-colors duration-150">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-xs">
              <Zap className="h-4 w-4 fill-white text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-foreground">
              SkillTrack <span className="text-primary">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your registered email address to receive recovery steps.
          </p>
        </div>

        <Card className="border border-border bg-card rounded-xl shadow-xs">
          <CardContent className="pt-6">
            {isSubmitted ? (
              <div className="text-center py-4 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">Check your inbox</h3>
                <p className="text-xs text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                </p>
                <Button variant="secondary" className="w-full mt-4 text-xs" onClick={() => setIsSubmitted(false)}>
                  Send again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered email address"
                  type="email"
                  placeholder="sarthak@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" size="lg" variant="primary" className="w-full gap-2 mt-2" isLoading={isLoading}>
                  Send reset link
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border py-4 bg-surface-secondary/50 rounded-b-xl">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


