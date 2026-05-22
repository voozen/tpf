import { formatCurrency } from '@/lib/formatters';
import {
  computeTotalBalance,
  listGroups,
  totalBalanceHint,
} from '@/services/groupsService';
import type { AppData } from '@/types/appData';
import type { BudgetConfig } from '@/types/budget';
import type { UserSettings } from '@/types/settings';

export type ReminderView = {
  id: string;
  message: string;
  urgent: boolean;
};

export function getTotalSpent(budget: BudgetConfig): number {
  return budget.categories.reduce((sum, c) => sum + c.spent, 0);
}

export function getAppBalance(data: AppData): number {
  return data.appBalance;
}

export function getHomeBalances(data: AppData) {
  const total = computeTotalBalance(listGroups(data));
  return {
    totalBalance: total,
    totalBalanceHint: totalBalanceHint(total),
    appBalance: data.appBalance,
  };
}

export function getReminders(data: AppData): ReminderView[] {
  const reminders: ReminderView[] = [];

  for (const group of data.groups) {
    if (group.balance < 0) {
      reminders.push({
        id: `owe-${group.id}`,
        message: `You owe in ${group.name} ${formatCurrency(Math.abs(group.balance))}`,
        urgent: true,
      });
    } else if (group.balance > 0) {
      reminders.push({
        id: `owed-${group.id}`,
        message: `You are owed in ${group.name} ${formatCurrency(group.balance)}`,
        urgent: false,
      });
    }
  }

  if (reminders.length === 0) {
    reminders.push({
      id: 'all-settled',
      message: 'No outstanding balances in your groups',
      urgent: false,
    });
  }

  return reminders;
}

export function topUpAppBalance(data: AppData, amount: number): AppData {
  const value = Math.round(amount * 100) / 100;
  if (value <= 0) throw new Error('Amount must be greater than zero');
  return {
    ...data,
    appBalance: Math.round((data.appBalance + value) * 100) / 100,
  };
}

export function withdrawAppBalance(data: AppData, amount: number): AppData {
  const value = Math.round(amount * 100) / 100;
  if (value <= 0) throw new Error('Amount must be greater than zero');
  if (value > data.appBalance) throw new Error('Insufficient app balance');
  return {
    ...data,
    appBalance: Math.round((data.appBalance - value) * 100) / 100,
  };
}

export function getInsightsSummary(data: AppData) {
  const spent = getTotalSpent(data.budget);
  const { monthlyLimit } = data.budget;
  const overBudget = spent - monthlyLimit;
  const percentSpent = monthlyLimit > 0 ? (spent / monthlyLimit) * 100 : 0;

  return { spent, monthlyLimit, overBudget, percentSpent };
}

export function getSpendingTrend(period: 7 | 30) {
  const days = period;
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const amount = 25 + Math.sin(i * 0.8) * 15 + (i % 5) * 8;
    return { label, amount: Math.round(amount * 100) / 100 };
  });
}

export function updateSettings(data: AppData, settings: Partial<UserSettings>): AppData {
  return {
    ...data,
    settings: { ...data.settings, ...settings },
  };
}

export function markNotificationRead(data: AppData, id: string): AppData {
  return {
    ...data,
    notifications: data.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    ),
  };
}

export function markAllNotificationsRead(data: AppData): AppData {
  return {
    ...data,
    notifications: data.notifications.map((n) => ({ ...n, read: true })),
  };
}
