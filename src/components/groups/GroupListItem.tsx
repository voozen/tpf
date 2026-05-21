import { ArrowRight, Users } from 'lucide-react';

import { AmountText } from '@/components/AmountText';
import { APP_FONT_FAMILY } from '@/lib/constants';
import type { Group } from '@/types/group';

type GroupListItemProps = {
  group: Group;
  onClick: () => void;
};

export function GroupListItem({ group, onClick }: GroupListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[72px] w-full items-center justify-between rounded-xl border border-border bg-white p-4 text-left shadow-sm"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--primary-100)]">
          <Users size={24} className="text-primary" />
        </div>
        <div>
          <div className="text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
            {group.name}
          </div>
          <div className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
            {group.members} members
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AmountText value={group.balance} size="md" />
        <ArrowRight size={20} className="text-[var(--neutral-500)]" />
      </div>
    </button>
  );
}
