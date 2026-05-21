import { AlertCircle } from 'lucide-react';

import { APP_FONT_FAMILY } from '@/lib/constants';

type FormErrorProps = {
  message: string;
};

export function FormError({ message }: FormErrorProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-[var(--danger-600)] bg-[var(--danger-100)] p-3"
      role="alert"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <AlertCircle size={16} className="shrink-0 text-[var(--danger-600)]" />
      <p className="text-[14px] leading-[20px] text-[var(--danger-600)]">{message}</p>
    </div>
  );
}
