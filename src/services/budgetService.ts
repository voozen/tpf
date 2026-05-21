import { formatCurrency } from '@/lib/formatters';
import {
  computeTotalBalance,
  listGroups,
  totalBalanceHint,
} from '@/services/groupsService';
import type { AppData } from '@/types/appData';

export type ReminderView = {
  id: string;
  message: string;
  urgent: boolean;
};

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
