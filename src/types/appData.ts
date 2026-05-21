import type { Expense } from '@/types/expense';
import type { Group } from '@/types/group';

export type AppData = {
  groups: Group[];
  expenses: Expense[];
  appBalance: number;
  activeGroupId: string | null;
};
