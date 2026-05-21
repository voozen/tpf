import { INVITE_CODES } from '@/services/seed';
import type { AppData } from '@/types/appData';
import type { Group } from '@/types/group';

export function listGroups(data: AppData): Group[] {
  return [...data.groups];
}

export function searchGroups(data: AppData, query: string): Group[] {
  const q = query.trim().toLowerCase();
  if (!q) return listGroups(data);
  return data.groups.filter((g) => g.name.toLowerCase().includes(q));
}

export function getGroupById(data: AppData, id: string): Group | undefined {
  return data.groups.find((g) => g.id === id);
}

export function setActiveGroup(data: AppData, groupId: string | null): AppData {
  return { ...data, activeGroupId: groupId };
}

export function createGroup(data: AppData, name: string): { data: AppData; group: Group } {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Group name is required');
  }

  const group: Group = {
    id: crypto.randomUUID(),
    name: trimmed,
    members: 1,
    balance: 0,
  };

  return {
    data: {
      ...data,
      groups: [...data.groups, group],
      activeGroupId: group.id,
    },
    group,
  };
}

export function joinGroup(data: AppData, code: string): { data: AppData; group: Group } {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    throw new Error('Invite code is required');
  }

  const preset = INVITE_CODES[normalized];
  if (!preset) {
    throw new Error('Invalid invite code. Try DEMO, LUNCH, or TRIP.');
  }

  const existing = data.groups.find(
    (g) => g.name.toLowerCase() === preset.name.toLowerCase(),
  );
  if (existing) {
    return {
      data: { ...data, activeGroupId: existing.id },
      group: existing,
    };
  }

  const group: Group = {
    id: crypto.randomUUID(),
    name: preset.name,
    members: preset.members,
    balance: 0,
  };

  return {
    data: {
      ...data,
      groups: [...data.groups, group],
      activeGroupId: group.id,
    },
    group,
  };
}

export function computeTotalBalance(groups: Group[]): number {
  return groups.reduce((sum, g) => sum + g.balance, 0);
}

export function totalBalanceHint(total: number): string {
  if (total < 0) return "You owe more than you're owed";
  if (total > 0) return "You are owed more than you owe";
  return 'All settled up';
}
