import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { APP_FONT_FAMILY } from '@/lib/constants';
import { cn } from '@/components/ui/utils';

export const pageHeaderStyles = {
  shell: 'border-b border-border bg-white px-4 py-4',
  title: 'text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]',
  titleMd: 'text-[20px] font-bold leading-[28px] text-[var(--neutral-900)]',
  subtitle: 'mt-1 text-[14px] leading-[20px] text-[var(--neutral-500)]',
  footer: 'mt-4',
} as const;

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  titleSize?: 'lg' | 'md';
  backTo?: string;
  onBack?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  subtitle,
  titleSize = 'lg',
  backTo,
  onBack,
  actions,
  children,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const hasBack = Boolean(backTo || onBack);

  const handleBack = () => {
    if (onBack) onBack();
    else if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <header
      className={cn(pageHeaderStyles.shell, className)}
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <div className="flex items-start gap-3">
        {hasBack && (
          <button
            type="button"
            onClick={handleBack}
            className="flex size-8 shrink-0 items-center justify-center"
            aria-label="Go back"
          >
            <ChevronLeft size={24} className="text-[var(--neutral-900)]" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h1
              className={
                titleSize === 'md' ? pageHeaderStyles.titleMd : pageHeaderStyles.title
              }
            >
              {title}
            </h1>
            {actions}
          </div>
          {subtitle && <p className={pageHeaderStyles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {children && <div className={pageHeaderStyles.footer}>{children}</div>}
    </header>
  );
}
