import type { ReactNode } from 'react';

type MobileShellProps = {
  children: ReactNode;
  className?: string;
};

export function MobileShell({ children, className = '' }: MobileShellProps) {
  return (
    <div
      className={`mx-auto flex h-screen w-full min-w-[360px] max-w-[430px] flex-col bg-[var(--app-bg)] ${className}`}
    >
      {children}
    </div>
  );
}
