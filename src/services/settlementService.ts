import type { AppData } from '@/types/appData';
import type { Group } from '@/types/group';
import type { GroupSettlement, Transfer } from '@/types/settlement';

const MOCK_MEMBERS = ['You', 'Sarah', 'John', 'Mike'];

function makeTransfer(
  id: string,
  from: string,
  to: string,
  amount: number,
  paid = false,
): Transfer {
  return { id, from, to, amount, paid };
}

export function buildDefaultSettlement(group: Group): GroupSettlement {
  const debt = Math.abs(group.balance);
  if (group.balance >= 0 || debt < 1) {
    return { transfers: [], rawDebts: [] };
  }

  const transfers: Transfer[] = [
    makeTransfer(`${group.id}-t1`, 'You', 'John', Math.round(debt * 0.55 * 100) / 100),
    makeTransfer(`${group.id}-t2`, 'You', 'Sarah', Math.round(debt * 0.45 * 100) / 100),
  ];

  const rawDebts: Transfer[] = [
    ...transfers,
    makeTransfer(`${group.id}-r1`, 'Mike', 'John', 8.5),
    makeTransfer(`${group.id}-r2`, 'Mike', 'Sarah', 12),
  ];

  return { transfers, rawDebts };
}

export function getSettlement(data: AppData, groupId: string): GroupSettlement {
  const existing = data.settlements[groupId];
  if (existing) return existing;

  const group = data.groups.find((g) => g.id === groupId);
  if (!group) return { transfers: [], rawDebts: [] };
  return buildDefaultSettlement(group);
}

export function listGroupsWithDebts(data: AppData) {
  return data.groups.map((group) => {
    const settlement = getSettlement(data, group.id);
    const unpaid = settlement.transfers.filter((t) => !t.paid);
    const totalUnsettled = unpaid.reduce((sum, t) => sum + t.amount, 0);

    return {
      group,
      yourBalance: group.balance,
      totalUnsettled:
        Math.round(totalUnsettled * 100) / 100 || Math.round(Math.abs(group.balance) * 2 * 100) / 100,
      hasDebts: group.balance !== 0,
    };
  });
}

export function markTransferPaid(
  data: AppData,
  groupId: string,
  transferId: string | null,
): AppData {
  const settlement = getSettlement(data, groupId);
  const idsToPay =
    transferId === null
      ? settlement.transfers.filter((t) => t.from === 'You' && !t.paid).map((t) => t.id)
      : [transferId];

  let paidTotal = 0;
  const transfers = settlement.transfers.map((t) => {
    if (idsToPay.includes(t.id) && !t.paid) {
      paidTotal += t.amount;
      return { ...t, paid: true };
    }
    return t;
  });

  const groups = data.groups.map((g) => {
    if (g.id !== groupId) return g;
    return { ...g, balance: Math.min(0, g.balance + paidTotal) };
  });

  return {
    ...data,
    groups,
    settlements: {
      ...data.settlements,
      [groupId]: { ...settlement, transfers },
    },
  };
}

export function ensureSettlement(data: AppData, groupId: string): AppData {
  if (data.settlements[groupId]) return data;
  const group = data.groups.find((g) => g.id === groupId);
  if (!group) return data;
  return {
    ...data,
    settlements: {
      ...data.settlements,
      [groupId]: buildDefaultSettlement(group),
    },
  };
}

export function getMemberBalances(group: Group) {
  const names = MOCK_MEMBERS.slice(0, Math.min(group.members, MOCK_MEMBERS.length));
  const youBalance = group.balance;
  const others = names.filter((n) => n !== 'You');
  const perOther = others.length
    ? Math.round((Math.abs(youBalance) / others.length) * 100) / 100
    : 0;

  return names.map((person) => {
    if (person === 'You') return { person, amount: youBalance };
    const sign = youBalance < 0 ? 1 : -1;
    return { person, amount: sign * perOther };
  });
}

export { MOCK_MEMBERS };
