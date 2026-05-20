import { cn } from '@/components/ui/utils';
import { APP_FONT_FAMILY } from '@/lib/constants';

type AmountTextProps = {
  value: number;
  currency?: string;
  className?: string;
  showSign?: boolean;
  size?: 'display' | 'lg' | 'md';
};

const sizeClasses = {
  display: 'text-[32px] leading-[40px]',
  lg: 'text-[24px] leading-[32px]',
  md: 'text-[16px] leading-[24px]',
} as const;

export function AmountText({
  value,
  currency = 'USD',
  className,
  showSign = true,
  size = 'display',
}: AmountTextProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Math.abs(value));

  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const colorClass =
    value > 0
      ? 'text-[var(--success-600)]'
      : value < 0
        ? 'text-[var(--danger-600)]'
        : 'text-[var(--neutral-900)]';

  const display =
    showSign && value !== 0 ? `${sign}${formatted}` : formatted;

  return (
    <span
      className={cn('font-bold', sizeClasses[size], colorClass, className)}
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      {display}
    </span>
  );
}
