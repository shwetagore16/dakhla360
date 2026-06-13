'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading');

  useEffect(() => {
    const stored = localStorage.getItem('auth-storage');
    if (!stored) {
      setStatus('unauth');
      router.replace('/login');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.isAuthenticated && parsed?.state?.token) {
        setStatus('auth');
      } else {
        setStatus('unauth');
        router.replace('/login');
      }
    } catch {
      setStatus('unauth');
      router.replace('/login');
    }
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauth') {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8892A4] text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}