import type { AppData } from '@/types/appData';

import { createSeedData } from '@/services/seed';

const STORAGE_KEY = 'budgetsplit_data';

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedData();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.groups || !parsed.expenses) return createSeedData();
    const seed = createSeedData();
    return {
      ...seed,
      ...parsed,
      groups: parsed.groups ?? seed.groups,
      expenses: parsed.expenses ?? seed.expenses,
      groupExpenseDetails: Array.isArray(parsed.groupExpenseDetails)
        ? parsed.groupExpenseDetails
        : seed.groupExpenseDetails,
      settlements: parsed.settlements ?? seed.settlements,
      budget: parsed.budget ?? seed.budget,
      settings: parsed.settings ?? seed.settings,
      notifications: parsed.notifications ?? seed.notifications,
    };
  } catch {
    return createSeedData();
  }
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetAppData(): AppData {
  const seed = createSeedData();
  saveAppData(seed);
  return seed;
}
