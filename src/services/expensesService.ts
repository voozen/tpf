import { formatDate } from '@/lib/formatters';
import type { AppData } from '@/types/appData';
import type { Expense } from '@/types/expense';

export type ActivityView = {
  id: string;
  name: string;
  amount: number;
  group: string;
  date: string;
  groupId: string | null;
};

export function listRecentActivity(data: AppData, limit = 10): ActivityView[] {
  return [...data.expenses]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, limit)
    .map((e) => ({
      id: e.id,
      name: e.name,
      amount: e.amount,
      group: e.groupName,
      date: formatDate(e.date),
      groupId: e.groupId,
    }));
}

export function addExpense(
  data: AppData,
  expense: Omit<Expense, 'id'>,
): { data: AppData; expense: Expense } {
  const created: Expense = { ...expense, id: crypto.randomUUID() };
  return {
    data: { ...data, expenses: [created, ...data.expenses] },
    expense: created,
  };
}
