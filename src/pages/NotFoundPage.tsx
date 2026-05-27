import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function NotFoundPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 text-center"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <p className="text-[64px] font-bold leading-none text-primary">404</p>
      <div>
        <h1 className="mb-2 text-[24px] font-bold text-[var(--neutral-900)]">Page not found</h1>
        <p className="text-[14px] text-[var(--neutral-500)]">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button asChild size="lg" className="w-full">
          <Link to="/home">Go to home</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link to="/signin">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
