import { Loader2, Wallet } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function SplashPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? '/home' : '/onboarding', { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div
      className="flex h-full flex-1 flex-col items-center justify-center bg-white"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-primary">
          <Wallet size={48} className="text-white" />
        </div>
        <div className="text-center">
          <h1 className="mb-2 text-[32px] font-bold leading-[40px] text-[var(--neutral-900)]">
            BudgetSplit
          </h1>
          <p className="text-[16px] leading-[24px] text-[var(--neutral-500)]">
            Split smarter. Track better.
          </p>
        </div>
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    </div>
  );
}
