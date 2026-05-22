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
import * as settlementService from '@/services/settlementService';
import { loadAppData, resetAppData, saveAppData } from '@/services/store';
import type { AppData } from '@/types/appData';
import type { Group } from '@/types/group';
import type { PendingReceipt } from '@/types/pendingReceipt';
import type { UserSettings } from '@/types/settings';

type AppDataContextValue = {
  data: AppData;
  groups: Group[];
  pendingReceipt: PendingReceipt | null;
  setPendingReceipt: (receipt: PendingReceipt | null) => void;
  createGroup: (name: string) => Group;
  joinGroup: (code: string) => Group;
  setActiveGroup: (groupId: string | null) => void;
  getActiveGroup: () => Group | undefined;
  resetData: () => void;
  homeBalances: ReturnType<typeof budgetService.getHomeBalances>;
  recentActivity: ReturnType<typeof expensesService.listRecentActivity>;
  reminders: ReturnType<typeof budgetService.getReminders>;
  addPersonalExpense: (receipt: PendingReceipt) => void;
  addGroupExpense: (
    groupId: string,
    receipt: PendingReceipt,
    split: { yourShare: number; participantCount: number },
  ) => void;
  addTransfer: (params: { to: string; amount: number; groupId?: string; note?: string }) => void;
  topUp: (amount: number) => void;
  withdraw: (amount: number) => void;
  markSettlementPaid: (groupId: string, transferId: string | null) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getSettlement: (groupId: string) => ReturnType<typeof settlementService.getSettlement>;
  listGroupsWithDebts: () => ReturnType<typeof settlementService.listGroupsWithDebts>;
  listGroupExpenses: (
    groupId: string,
    filter?: expensesService.DateFilter,
  ) => ReturnType<typeof expensesService.listGroupExpenses>;
  listPersonalExpenses: (
    filter?: expensesService.DateFilter,
  ) => ReturnType<typeof expensesService.listPersonalExpenses>;
  getMemberBalances: (group: Group) => ReturnType<typeof settlementService.getMemberBalances>;
  insightsSummary: ReturnType<typeof budgetService.getInsightsSummary>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [pendingReceipt, setPendingReceipt] = useState<PendingReceipt | null>(null);

  const persist = useCallback((updater: AppData | ((prev: AppData) => AppData)) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveAppData(next);
      return next;
    });
  }, []);

  const createGroup = useCallback(
    (name: string) => {
      let created: Group | undefined;
      persist((prev) => {
        const result = groupsService.createGroup(prev, name);
        created = result.group;
        return result.data;
      });
      return created!;
    },
    [persist],
  );

  const joinGroup = useCallback(
    (code: string) => {
      let joined: Group | undefined;
      persist((prev) => {
        const result = groupsService.joinGroup(prev, code);
        joined = result.group;
        return result.data;
      });
      return joined!;
    },
    [persist],
  );

  const setActiveGroup = useCallback(
    (groupId: string | null) => {
      persist((prev) => groupsService.setActiveGroup(prev, groupId));
    },
    [persist],
  );

  const getActiveGroup = useCallback(() => {
    if (!data.activeGroupId) return undefined;
    return groupsService.getGroupById(data, data.activeGroupId);
  }, [data]);

  const resetData = useCallback(() => {
    setPendingReceipt(null);
    persist(resetAppData());
  }, [persist]);

  const addPersonalExpense = useCallback(
    (receipt: PendingReceipt) => {
      persist((prev) => expensesService.addPersonalExpense(prev, receipt));
    },
    [persist],
  );

  const addGroupExpense = useCallback(
    (
      groupId: string,
      receipt: PendingReceipt,
      split: { yourShare: number; participantCount: number },
    ) => {
      persist((prev) => {
        const withExpense = expensesService.addGroupExpense(
          prev,
          groupId,
          receipt,
          split,
        );
        return groupsService.setActiveGroup(withExpense, groupId);
      });
    },
    [persist],
  );

  const addTransfer = useCallback(
    (params: { to: string; amount: number; groupId?: string; note?: string }) => {
      persist((prev) => expensesService.addTransfer(prev, params));
    },
    [persist],
  );

  const topUp = useCallback(
    (amount: number) => {
      persist((prev) => budgetService.topUpAppBalance(prev, amount));
    },
    [persist],
  );

  const withdraw = useCallback(
    (amount: number) => {
      persist((prev) => budgetService.withdrawAppBalance(prev, amount));
    },
    [persist],
  );

  const markSettlementPaid = useCallback(
    (groupId: string, transferId: string | null) => {
      persist((prev) => settlementService.markTransferPaid(prev, groupId, transferId));
    },
    [persist],
  );

  const updateSettings = useCallback(
    (settings: Partial<UserSettings>) => {
      persist((prev) => budgetService.updateSettings(prev, settings));
    },
    [persist],
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      persist((prev) => budgetService.markNotificationRead(prev, id));
    },
    [persist],
  );

  const markAllNotificationsRead = useCallback(() => {
    persist((prev) => budgetService.markAllNotificationsRead(prev));
  }, [persist]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      data,
      groups: groupsService.listGroups(data),
      pendingReceipt,
      setPendingReceipt,
      createGroup,
      joinGroup,
      setActiveGroup,
      getActiveGroup,
      resetData,
      homeBalances: budgetService.getHomeBalances(data),
      recentActivity: expensesService.listRecentActivity(data),
      reminders: budgetService.getReminders(data),
      addPersonalExpense,
      addGroupExpense,
      addTransfer,
      topUp,
      withdraw,
      markSettlementPaid,
      updateSettings,
      markNotificationRead,
      markAllNotificationsRead,
      getSettlement: (groupId) => settlementService.getSettlement(data, groupId),
      listGroupsWithDebts: () => settlementService.listGroupsWithDebts(data),
      listGroupExpenses: (groupId, filter) =>
        expensesService.listGroupExpenses(data, groupId, filter),
      listPersonalExpenses: (filter) => expensesService.listPersonalExpenses(data, filter),
      getMemberBalances: (group) => settlementService.getMemberBalances(group),
      insightsSummary: budgetService.getInsightsSummary(data),
    }),
    [
      data,
      pendingReceipt,
      createGroup,
      joinGroup,
      setActiveGroup,
      getActiveGroup,
      resetData,
      addPersonalExpense,
      addGroupExpense,
      addTransfer,
      topUp,
      withdraw,
      markSettlementPaid,
      updateSettings,
      markNotificationRead,
      markAllNotificationsRead,
    ],
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
