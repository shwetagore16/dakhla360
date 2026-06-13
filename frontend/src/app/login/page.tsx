'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-8 h-8 text-[#00D4FF]" />
            <span className="text-2xl font-bold text-white">Dakhla<span className="text-[#00D4FF]">360</span></span>
          </div>
          <p className="text-[#8892A4] text-sm">Asset Verification Platform</p>
        </div>

        <div className="bg-[#12141A] border border-[#1E2130] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-[#8892A4] text-sm mb-6">Sign in to your account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-[#8892A4] mb-1 block">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm text-[#8892A4] mb-1 block">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00D4FF] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-[#8892A4] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[#8892A4] text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#00D4FF] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}