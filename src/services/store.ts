import type { AppData } from '@/types/appData';

import { createSeedData } from '@/services/seed';

const STORAGE_KEY = 'budgetsplit_data';

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedData();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.groups || !parsed.expenses) return createSeedData();
    return parsed;
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
