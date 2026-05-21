export type Expense = {
  id: string;
  name: string;
  amount: number;
  groupId: string | null;
  groupName: string;
  date: string;
  type: 'expense' | 'payment';
};
