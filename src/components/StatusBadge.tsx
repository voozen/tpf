import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

type Status = 'success' | 'danger' | 'warning' | 'neutral';

type StatusBadgeProps = {
  status: Status;
  label: string;
  className?: string;
};

const config: Record<
  Status,
  { variant: 'success' | 'destructive' | 'warning' | 'secondary'; icon: typeof CheckCircle2 }
> = {
  success: { variant: 'success', icon: CheckCircle2 },
  danger: { variant: 'destructive', icon: AlertCircle },
  warning: { variant: 'warning', icon: AlertCircle },
  neutral: { variant: 'secondary', icon: Info },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { variant, icon: Icon } = config[status];

  return (
    <Badge variant={variant} className={cn('gap-1 px-2 py-1', className)}>
      <Icon className="size-3.5" aria-hidden />
      <span>{label}</span>
    </Badge>
  );
}
