'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CollegeSelect } from '@/components/ui/CollegeSelect';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { getGraduationYearOptions } from '@/lib/yearUtils';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    college: z.string().min(2, 'College selection is required'),
    degree: z.string().min(1, 'Degree is required'),
    branch: z.string().min(1, 'Branch is required'),
    graduationYear: z.coerce.number().min(1990, 'Please select a valid graduation year').max(2100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      college: '',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: new Date().getFullYear() + 1,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created successfully! Welcome to SkillTrack AI.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground relative transition-colors duration-150">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg space-y-6">
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
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Start identifying skill gaps and building placement readiness.
          </p>
        </div>

        <Card className="border border-border bg-card rounded-xl shadow-xs">
          <CardContent className="pt-6 space-y-5">
            {/* Google Auth Button */}
            <GoogleAuthButton />

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="bg-card px-3 text-xs text-muted-foreground relative">
                or register with email
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full name"
                placeholder="e.g. Sarthak Sharma"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="College / university email"
                type="email"
                placeholder="sarthak@college.edu"
                {...register('email')}
                error={errors.email?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>

              {/* Searchable Engineering College Selector */}
              <Controller
                name="college"
                control={control}
                render={({ field }) => (
                  <CollegeSelect
                    label="College / university name"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.college?.message}
                  />
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Degree"
                  options={[
                    { label: 'B.Tech', value: 'B.Tech' },
                    { label: 'B.E.', value: 'B.E.' },
                    { label: 'M.Tech', value: 'M.Tech' },
                    { label: 'BCA', value: 'BCA' },
                    { label: 'MCA', value: 'MCA' },
                    { label: 'B.Sc Computer Science', value: 'B.Sc CS' },
                  ]}
                  {...register('degree')}
                  error={errors.degree?.message}
                />

                <Select
                  label="Graduation year"
                  options={getGraduationYearOptions()}
                  {...register('graduationYear')}
                  error={errors.graduationYear?.message}
                />
              </div>

              <Select
                label="Branch / major"
                options={[
                  { label: 'Computer Science & Engineering', value: 'Computer Science & Engineering' },
                  { label: 'Information Technology', value: 'Information Technology' },
                  { label: 'Electronics & Communication', value: 'Electronics & Communication' },
                  { label: 'Electrical Engineering', value: 'Electrical Engineering' },
                  { label: 'Data Science & AI', value: 'Data Science & AI' },
                  { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
                  { label: 'Other Engineering Branch', value: 'Other' },
                ]}
                {...register('branch')}
                error={errors.branch?.message}
              />

              <Button type="submit" size="lg" variant="primary" className="w-full gap-2 mt-2" isLoading={isLoading}>
                Create account
                <ArrowRight className="h-4 w-4 text-white" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border py-4 bg-surface-secondary/50 rounded-b-xl">
            <p className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


