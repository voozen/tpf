import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FormError } from '@/components/auth/FormError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    try {
      await login('user@gmail.com', 'google-stub');
      navigate('/home', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex h-full flex-1 flex-col bg-white"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <div className="flex flex-1 flex-col justify-center gap-6 px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]">
            Sign in
          </h1>
          <p className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
            Welcome back to BudgetSplit
          </p>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="signin-email"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              Email
            </label>
            <Input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="signin-password"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              Password
            </label>
            <Input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <FormError message={error} />}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            Sign in
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
            onClick={handleGoogle}
          >
            Continue with Google
          </Button>

          <Link
            to="/forgot-password"
            className="text-[14px] leading-[20px] text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </form>

        <p className="text-center text-[14px] leading-[20px] text-[var(--neutral-500)]">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
