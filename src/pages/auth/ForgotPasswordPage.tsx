import { ChevronLeft, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FormError } from '@/components/auth/FormError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setEmailSent(true);
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
            Reset password
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-6 px-4">
        {!emailSent ? (
          <>
            <div>
              <h2 className="mb-2 text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]">
                Forgot password?
              </h2>
              <p className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
                Enter your email and we&apos;ll send you a link to reset your password
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
                >
                  Email
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {error && <FormError message={error} />}

              <Button type="submit" size="lg" className="w-full">
                Send reset link
              </Button>
            </form>

            <p className="text-center text-[14px] leading-[20px] text-[var(--neutral-500)]">
              Remember your password?{' '}
              <Link to="/signin" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-[var(--success-100)]">
              <Mail size={40} className="text-[var(--success-600)]" />
            </div>

            <div className="text-center">
              <h2 className="mb-2 text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]">
                Check your email
              </h2>
              <p className="mb-1 text-[14px] leading-[20px] text-[var(--neutral-500)]">
                We&apos;ve sent a password reset link to
              </p>
              <p className="text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                {email}
              </p>
            </div>

            <div className="w-full rounded-xl border border-[var(--primary-500)] bg-[var(--primary-100)] p-4">
              <p className="text-center text-[12px] leading-[16px] text-primary">
                Click the link in the email to reset your password. The link will expire in 24
                hours.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3">
              <Button size="lg" className="w-full" onClick={() => navigate('/signin')}>
                Back to sign in
              </Button>
              <button
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="text-[14px] font-semibold leading-[20px] text-primary"
              >
                Didn&apos;t receive the email? Resend
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
