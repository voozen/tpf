import type { AppData } from '@/types/appData';
import type { Expense } from '@/types/expense';
import type { Group } from '@/types/group';

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

/** Mock invite codes accepted by join flow */
export const INVITE_CODES: Record<string, { name: string; members: number }> = {
  DEMO: { name: 'Demo Friends', members: 5 },
  LUNCH: { name: 'Office Lunches', members: 6 },
  TRIP: { name: 'Summer Trip', members: 4 },
};

export function createSeedData(): AppData {
  return {
    groups: SEED_GROUPS.map((g) => ({ ...g })),
    expenses: SEED_EXPENSES.map((e) => ({ ...e })),
    appBalance: 150,
    activeGroupId: null,
  };
}
