import { Calendar, ChevronLeft, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { AmountText } from '@/components/AmountText';
import { pageHeaderStyles } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/contexts/AppDataContext';
import { formatExpenseDate } from '@/services/expensesService';
import type { DateFilter } from '@/services/expensesService';
import { APP_FONT_FAMILY } from '@/lib/constants';
import { formatCurrency } from '@/lib/formatters';

type Tab = 'expenses' | 'balances' | 'settlement';

export function GroupDashboardPage() {
  const navigate = useNavigate();
  const {
    getActiveGroup,
    listGroupExpenses,
    getMemberBalances,
    setActiveGroup,
  } = useAppData();
  const group = getActiveGroup();
  const [activeTab, setActiveTab] = useState<Tab>('expenses');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const filterLabel = useMemo(() => {
    if (dateFilter === 'month') return 'This month';
    if (dateFilter === 'week') return 'Last 7 days';
    return 'All time';
  }, [dateFilter]);

  if (!group) {
    return <Navigate to="/expenses" replace />;
  }

  const expenses = listGroupExpenses(group.id, dateFilter);
  const balances = getMemberBalances(group);

  const handleDateFilterChange = (label: string) => {
    if (label === 'This month') setDateFilter('month');
    else if (label === 'Last 7 days') setDateFilter('week');
    else setDateFilter('all');
  };

  return (
    <div
      className="flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <header className={pageHeaderStyles.shell}>
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="flex size-8 shrink-0 items-center justify-center"
            aria-label="Back to expenses"
          >
            <ChevronLeft size={24} className="text-[var(--neutral-900)]" />
          </button>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--primary-100)]">
                <Users size={16} className="text-primary" />
              </div>
              <h1 className={pageHeaderStyles.titleMd}>{group.name}</h1>
            </div>
            <p className={pageHeaderStyles.subtitle}>
              {group.members} members
            </p>
          </div>
        </div>

        <div className={`${pageHeaderStyles.footer} flex items-center gap-2`}>
          <Calendar size={16} className="text-[var(--neutral-500)]" aria-hidden />
          <select
            value={filterLabel}
            onChange={(e) => handleDateFilterChange(e.target.value)}
            className="border-none bg-transparent text-[14px] leading-[20px] text-[var(--neutral-900)] outline-none"
            aria-label="Filter by date"
          >
            <option>All time</option>
            <option>This month</option>
            <option>Last 7 days</option>
          </select>
        </div>

        <div className={`${pageHeaderStyles.footer} rounded-xl bg-[var(--app-bg)] p-4`}>
          <p className="mb-1 text-[12px] leading-[16px] text-[var(--neutral-500)]">
            Your group balance
          </p>
          <AmountText value={group.balance} size="lg" />
        </div>

        <div className={`${pageHeaderStyles.footer} flex border-b border-border`} role="tablist">
          {(['expenses', 'balances', 'settlement'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 border-b-2 pb-2 text-[14px] font-semibold leading-[20px] capitalize ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-[var(--neutral-500)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {activeTab === 'expenses' && (
          <div className="p-4">
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              {expenses.length === 0 ? (
                <p className="p-4 text-center text-[14px] text-[var(--neutral-500)]">
                  No expenses in this period
                </p>
              ) : (
                expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="border-b border-border p-4 last:border-b-0"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                        {expense.name}
                      </span>
                      <span className="text-[16px] font-bold leading-[24px] text-[var(--neutral-900)]">
                        {formatCurrency(expense.amount, 'USD', { showSign: false })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] leading-[16px] text-[var(--neutral-500)]">
                        Paid by {expense.paidBy}
                      </span>
                      <span className="text-[12px] leading-[16px] text-[var(--neutral-400)]">
                        {formatExpenseDate(expense.date)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="p-4">
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              {balances.map((balance) => (
                <div
                  key={balance.person}
                  className="flex items-center justify-between border-b border-border p-4 last:border-b-0"
                >
                  <span className="text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                    {balance.person}
                  </span>
                  <AmountText value={balance.amount} size="md" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settlement' && (
          <div className="p-4">
            <p className="mb-4 text-center text-[14px] leading-[20px] text-[var(--neutral-500)]">
              View optimized settlement in Settlement screen
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                setActiveGroup(group.id);
                navigate('/settlement');
              }}
            >
              Go to settlement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
