export type { AppData } from './appData';
export type { BudgetConfig, CategoryBudget } from './budget';
export type { Expense } from './expense';
export type { Group } from './group';
export type { GroupExpenseDetail } from './groupExpense';
export type { Notification } from './notification';
export type { PendingReceipt } from './pendingReceipt';
export type { GroupSettlement, Transfer } from './settlement';
export type { UserSettings } from './settings';

export type User = {
  id: string;
  name: string;
  email: string;
  initials: string;
};
