import { formatDate } from '@/lib/formatters';
import type { AppData } from '@/types/appData';
import type { Expense } from '@/types/expense';
import type { GroupExpenseDetail } from '@/types/groupExpense';
import type { PendingReceipt } from '@/types/pendingReceipt';

import { getGroupById } from '@/services/groupsService';
import { ensureSettlement } from '@/services/settlementService';

export type ActivityView = {
  id: string;
  name: string;
  amount: number;
  group: string;
  date: string;
  groupId: string | null;
};

export type DateFilter = 'all' | 'month' | 'week';

export type GroupExpenseSplit = {
  /** Your portion of the total in currency */
  yourShare: number;
  participantCount: number;
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

function matchesDateFilter(isoDate: string, filter: DateFilter, now = new Date()): boolean {
  if (filter === 'all') return true;
  const d = new Date(isoDate);
  if (filter === 'week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function listPersonalExpenses(
  data: AppData,
  filter: DateFilter = 'all',
): Expense[] {
  return data.expenses
    .filter((e) => e.groupId === null)
    .filter((e) => matchesDateFilter(e.date, filter))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function listGroupExpenses(
  data: AppData,
  groupId: string,
  filter: DateFilter = 'all',
): GroupExpenseDetail[] {
  const now = new Date();
  return (data.groupExpenseDetails ?? [])
    .filter((e) => e.groupId === groupId)
    .filter((e) => matchesDateFilter(e.date, filter, now))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function formatExpenseDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
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

export function addPersonalExpense(
  data: AppData,
  receipt: PendingReceipt,
): AppData {
  const today = new Date().toISOString().slice(0, 10);
  const amount = -Math.abs(receipt.amount);
  const { data: withExpense } = addExpense(data, {
    name: receipt.name,
    amount,
    groupId: null,
    groupName: 'Personal',
    date: today,
    type: 'expense',
  });

  const categories = withExpense.budget.categories.map((c) =>
    c.name === receipt.category
      ? { ...c, spent: Math.round((c.spent + Math.abs(amount)) * 100) / 100 }
      : c,
  );

  return { ...withExpense, budget: { ...withExpense.budget, categories } };
}

export function addGroupExpense(
  data: AppData,
  groupId: string,
  receipt: PendingReceipt,
  split: GroupExpenseSplit,
): AppData {
  const group = getGroupById(data, groupId);
  if (!group) throw new Error('Group not found');

  const yourShare = Math.round(split.yourShare * 100) / 100;
  const today = new Date().toISOString();
  const existingDetails = data.groupExpenseDetails ?? [];

  const detail: GroupExpenseDetail = {
    id: crypto.randomUUID(),
    groupId,
    name: receipt.name,
    amount: receipt.amount,
    paidBy: receipt.paidBy,
    date: today,
  };

  const balanceDelta =
    receipt.paidBy === 'You'
      ? Math.round((receipt.amount - yourShare) * 100) / 100
      : -yourShare;

  const activityAmount = balanceDelta;

  const { data: withExpense } = addExpense(data, {
    name: receipt.name,
    amount: activityAmount,
    groupId,
    groupName: group.name,
    date: today.slice(0, 10),
    type: 'expense',
  });

  const groups = withExpense.groups.map((g) =>
    g.id === groupId
      ? { ...g, balance: Math.round((g.balance + balanceDelta) * 100) / 100 }
      : g,
  );

  let next: AppData = {
    ...withExpense,
    groups,
    groupExpenseDetails: [detail, ...existingDetails],
  };

  next = ensureSettlement(next, groupId);
  return next;
}

export function addTransfer(
  data: AppData,
  params: { to: string; amount: number; groupId?: string; note?: string },
): AppData {
  const group = params.groupId ? getGroupById(data, params.groupId) : undefined;
  const groupName = group?.name ?? 'Transfer';

  const { data: withExpense } = addExpense(data, {
    name: params.note?.trim() ? `Transfer to ${params.to}: ${params.note}` : `Paid to ${params.to}`,
    amount: -Math.abs(params.amount),
    groupId: params.groupId ?? null,
    groupName,
    date: new Date().toISOString().slice(0, 10),
    type: 'payment',
  });

  if (!group) return withExpense;

  const groups = withExpense.groups.map((g) =>
    g.id === group.id
      ? { ...g, balance: Math.round((g.balance + params.amount) * 100) / 100 }
      : g,
  );

  return { ...withExpense, groups };
}
