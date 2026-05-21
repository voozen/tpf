import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FormError } from '@/components/auth/FormError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(name, email, password);
      navigate('/home', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    try {
      await signUp('John Doe', 'user@gmail.com', 'google-stub');
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
      <header className="border-b border-border px-4 pb-4 pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="flex size-8 items-center justify-center"
            aria-label="Back to sign in"
          >
            <ChevronLeft size={24} className="text-[var(--neutral-900)]" />
          </button>
          <h1 className="text-[20px] font-bold leading-[28px] text-[var(--neutral-900)]">
            Create account
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-6 overflow-auto px-4 pb-8">
        <div>
          <h2 className="mb-2 text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]">
            Sign up
          </h2>
          <p className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
            Create your BudgetSplit account
          </p>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="signup-name"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              Full name
            </label>
            <Input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              Email
            </label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label
              htmlFor="signup-confirm"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              Confirm password
            </label>
            <Input
              id="signup-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
          </div>

          {error && <FormError message={error} />}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            Create account
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
        </form>

        <p className="text-center text-[14px] leading-[20px] text-[var(--neutral-500)]">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-[12px] leading-[16px] text-[var(--neutral-400)]">
          By creating an account, you agree to our{' '}
          <span className="text-primary">Terms of Service</span> and{' '}
          <span className="text-primary">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
