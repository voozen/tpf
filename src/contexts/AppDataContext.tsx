import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import * as budgetService from '@/services/budgetService';
import * as expensesService from '@/services/expensesService';
import * as groupsService from '@/services/groupsService';
import { loadAppData, resetAppData, saveAppData } from '@/services/store';
import type { AppData } from '@/types/appData';
import type { Group } from '@/types/group';

type AppDataContextValue = {
  data: AppData;
  groups: Group[];
  createGroup: (name: string) => Group;
  joinGroup: (code: string) => Group;
  setActiveGroup: (groupId: string | null) => void;
  getActiveGroup: () => Group | undefined;
  resetData: () => void;
  homeBalances: ReturnType<typeof budgetService.getHomeBalances>;
  recentActivity: ReturnType<typeof expensesService.listRecentActivity>;
  reminders: ReturnType<typeof budgetService.getReminders>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadAppData());

  const persist = useCallback((next: AppData) => {
    setData(next);
    saveAppData(next);
  }, []);

  const createGroup = useCallback(
    (name: string) => {
      const result = groupsService.createGroup(data, name);
      persist(result.data);
      return result.group;
    },
    [data, persist],
  );

  const joinGroup = useCallback(
    (code: string) => {
      const result = groupsService.joinGroup(data, code);
      persist(result.data);
      return result.group;
    },
    [data, persist],
  );

  const setActiveGroup = useCallback(
    (groupId: string | null) => {
      persist(groupsService.setActiveGroup(data, groupId));
    },
    [data, persist],
  );

  const getActiveGroup = useCallback(() => {
    if (!data.activeGroupId) return undefined;
    return groupsService.getGroupById(data, data.activeGroupId);
  }, [data]);

  const resetData = useCallback(() => {
    persist(resetAppData());
  }, [persist]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      data,
      groups: groupsService.listGroups(data),
      createGroup,
      joinGroup,
      setActiveGroup,
      getActiveGroup,
      resetData,
      homeBalances: budgetService.getHomeBalances(data),
      recentActivity: expensesService.listRecentActivity(data),
      reminders: budgetService.getReminders(data),
    }),
    [data, createGroup, joinGroup, setActiveGroup, getActiveGroup, resetData],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
}
