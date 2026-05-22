import type { AppData } from '@/types/appData';
import type { Expense } from '@/types/expense';
import type { Group } from '@/types/group';
import type { GroupExpenseDetail } from '@/types/groupExpense';

import { buildDefaultSettlement } from '@/services/settlementService';

const SEED_GROUPS: Group[] = [
  { id: '1', name: 'Weekend Getaway', members: 4, balance: -42.5 },
  { id: '2', name: 'Roommates', members: 3, balance: 18.25 },
  { id: '3', name: 'Office Lunches', members: 6, balance: 0 },
  { id: '4', name: 'Birthday Party', members: 8, balance: -15.75 },
];

const SEED_EXPENSES: Expense[] = [
  {
    id: 'e1',
    name: 'Dinner at Pasta House',
    amount: -28.5,
    groupId: '1',
    groupName: 'Weekend Getaway',
    date: '2026-04-26',
    type: 'expense',
  },
  {
    id: 'e2',
    name: 'Paid to Sarah',
    amount: 45.0,
    groupId: '2',
    groupName: 'Roommates',
    date: '2026-04-25',
    type: 'payment',
  },
  {
    id: 'e3',
    name: 'Uber ride',
    amount: -15.25,
    groupId: '3',
    groupName: 'Office Lunches',
    date: '2026-04-24',
    type: 'expense',
  },
  {
    id: 'e4',
    name: 'Groceries',
    amount: -67.8,
    groupId: '2',
    groupName: 'Roommates',
    date: '2026-04-23',
    type: 'expense',
  },
];

const SEED_GROUP_EXPENSES: GroupExpenseDetail[] = [
  {
    id: 'ge1',
    groupId: '1',
    name: 'Dinner at Pasta House',
    amount: 57,
    paidBy: 'You',
    date: '2026-04-27T19:30:00',
  },
  {
    id: 'ge2',
    groupId: '1',
    name: 'Uber ride',
    amount: 22.5,
    paidBy: 'Sarah',
    date: '2026-04-26T22:15:00',
  },
  {
    id: 'ge3',
    groupId: '1',
    name: 'Groceries',
    amount: 85.4,
    paidBy: 'John',
    date: '2026-04-26T15:45:00',
  },
  {
    id: 'ge4',
    groupId: '1',
    name: 'Coffee shop',
    amount: 16.8,
    paidBy: 'Mike',
    date: '2026-04-25T09:20:00',
  },
];

/** Mock invite codes accepted by join flow */
export const INVITE_CODES: Record<string, { name: string; members: number }> = {
  DEMO: { name: 'Demo Friends', members: 5 },
  LUNCH: { name: 'Office Lunches', members: 6 },
  TRIP: { name: 'Summer Trip', members: 4 },
};

export function createSeedData(): AppData {
  const groups = SEED_GROUPS.map((g) => ({ ...g }));
  const settlements: AppData['settlements'] = {};
  for (const group of groups) {
    if (group.balance < 0) {
      settlements[group.id] = buildDefaultSettlement(group);
    }
  }

  return {
    groups,
    expenses: SEED_EXPENSES.map((e) => ({ ...e })),
    groupExpenseDetails: SEED_GROUP_EXPENSES.map((e) => ({ ...e })),
    appBalance: 150,
    activeGroupId: null,
    settlements,
    budget: {
      monthlyLimit: 1200,
      categories: [
        { name: 'Food', spent: 485.25, budget: 400, trend: '+12%' },
        { name: 'Transport', spent: 165.8, budget: 200, trend: '-8%' },
        { name: 'Housing', spent: 550, budget: 500, trend: '+5%' },
        { name: 'Other', spent: 149.45, budget: 100, trend: '+22%' },
      ],
    },
    settings: {
      currency: 'USD',
      budgetStartDay: 1,
      notifications: { debts: true, budget: true, weekly: false },
      biometric: true,
    },
    notifications: [
      {
        id: 'n1',
        title: 'Debt reminder',
        message: 'You owe $42.50 in Weekend Getaway',
        time: '2h ago',
        read: false,
      },
      {
        id: 'n2',
        title: 'Payment received',
        message: 'Sarah paid you $18.25 in Roommates',
        time: '1d ago',
        read: false,
      },
      {
        id: 'n3',
        title: 'Budget alert',
        message: 'You are $150.50 over your monthly limit',
        time: '2d ago',
        read: true,
      },
    ],
  };
}
