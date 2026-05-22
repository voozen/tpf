import type { BudgetConfig } from '@/types/budget';
import type { Expense } from '@/types/expense';
import type { Group } from '@/types/group';
import type { GroupExpenseDetail } from '@/types/groupExpense';
import type { Notification } from '@/types/notification';
import type { GroupSettlement } from '@/types/settlement';
import type { UserSettings } from '@/types/settings';

export type AppData = {
  groups: Group[];
  expenses: Expense[];
  groupExpenseDetails: GroupExpenseDetail[];
  appBalance: number;
  activeGroupId: string | null;
  settlements: Record<string, GroupSettlement>;
  budget: BudgetConfig;
  settings: UserSettings;
  notifications: Notification[];
};
