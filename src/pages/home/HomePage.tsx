import {
  AlertCircle,
  ArrowRightLeft,
  Bell,
  Receipt,
  Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AmountText } from '@/components/AmountText';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { homeBalances, recentActivity, reminders, setActiveGroup } = useAppData();

  return (
    <div
      className="flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <header className="border-b border-border bg-white px-4 pb-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]">
            Home
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-full bg-[var(--neutral-100)]"
              aria-label="Notifications (coming soon)"
              disabled
            >
              <Bell size={20} className="text-[var(--neutral-900)]" />
              <span className="absolute right-1 top-1 size-2 rounded-full bg-[var(--danger-600)]" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex size-10 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-white"
              aria-label="Open profile"
            >
              {user?.initials ?? 'U'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-6 p-4">
          <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-2 text-[14px] leading-[20px] text-[var(--neutral-500)]">
                  Total balance
                </p>
                <AmountText value={homeBalances.totalBalance} />
                <p className="mt-1 text-[12px] leading-[16px] text-[var(--neutral-500)]">
                  {homeBalances.totalBalanceHint}
                </p>
              </div>
              <div className="text-right">
                <p className="mb-2 text-[14px] leading-[20px] text-[var(--neutral-500)]">
                  App Balance
                </p>
                <AmountText
                  value={homeBalances.appBalance}
                  size="lg"
                  showSign={false}
                />
                <p className="mt-1 text-[12px] font-semibold leading-[16px] text-[var(--neutral-400)]">
                  Top up (coming soon)
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[18px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Quick actions
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => navigate('/add-receipt')}
                className="flex min-h-[88px] flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--primary-100)]">
                  <Receipt size={20} className="text-primary" />
                </div>
                <span className="text-center text-[12px] font-medium leading-[16px] text-[var(--neutral-900)]">
                  Add receipt
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/settlement-selection')}
                className="flex min-h-[88px] flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--success-100)]">
                  <Send size={20} className="text-[var(--success-600)]" />
                </div>
                <span className="text-center text-[12px] font-medium leading-[16px] text-[var(--neutral-900)]">
                  Settle debt
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/add-transfer')}
                className="flex min-h-[88px] flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--warning-100)]">
                  <ArrowRightLeft size={20} className="text-[var(--warning-500)]" />
                </div>
                <span className="text-center text-[12px] font-medium leading-[16px] text-[var(--neutral-900)]">
                  Add transfer
                </span>
              </button>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[18px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Recent activity
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              {recentActivity.length === 0 ? (
                <p className="p-4 text-center text-[14px] text-[var(--neutral-500)]">
                  No activity yet. Add a receipt to get started.
                </p>
              ) : (
                recentActivity.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.groupId) setActiveGroup(item.groupId);
                      navigate('/group-dashboard');
                    }}
                    className="w-full border-b border-border p-4 text-left last:border-b-0"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                        {item.name}
                      </span>
                      <AmountText value={item.amount} size="md" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] leading-[16px] text-[var(--neutral-500)]">
                        {item.group}
                      </span>
                      <span className="text-[12px] leading-[16px] text-[var(--neutral-400)]">
                        {item.date}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[18px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Reminders
            </h2>
            <div className="flex flex-col gap-2">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center gap-2 rounded-lg p-3 ${
                    reminder.urgent
                      ? 'border border-[var(--danger-600)] bg-[var(--danger-100)]'
                      : 'border border-[var(--warning-500)] bg-[var(--warning-100)]'
                  }`}
                >
                  <AlertCircle
                    size={16}
                    className={
                      reminder.urgent
                        ? 'text-[var(--danger-600)]'
                        : 'text-[var(--warning-500)]'
                    }
                  />
                  <span
                    className={`text-[14px] leading-[20px] ${
                      reminder.urgent
                        ? 'text-[var(--danger-600)]'
                        : 'text-[var(--warning-500)]'
                    }`}
                  >
                    {reminder.message}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
