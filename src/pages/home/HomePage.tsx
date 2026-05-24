import {
  AlertCircle,
  ArrowRightLeft,
  Bell,
  Check,
  Receipt,
  Send,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AmountText } from '@/components/AmountText';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    homeBalances,
    recentActivity,
    reminders,
    setActiveGroup,
    data,
    topUp,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const unreadCount = data.notifications.filter((n) => !n.read).length;

  const paymentMethods = [
    { id: 'blik', name: 'BLIK', icon: '📱' },
    { id: 'card', name: 'Card ending 4242', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  ];

  const handleTopUp = () => {
    const value = parseFloat(topUpAmount);
    if (!selectedPaymentMethod || Number.isNaN(value) || value <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      topUp(value);
      setIsProcessing(false);
      setShowTopUpModal(false);
      setTopUpAmount('');
      setSelectedPaymentMethod('');
      toast.success('App balance topped up');
    }, 1500);
  };

  return (
    <div
      className="relative flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <PageHeader
        title="Home"
        actions={
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="relative flex size-10 items-center justify-center rounded-full bg-[var(--neutral-100)]"
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : 'Notifications'
              }
            >
              <Bell size={20} className="text-[var(--neutral-900)]" aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 size-2 rounded-full bg-[var(--danger-600)]" />
              )}
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
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-6 p-4">
          <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <p className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
                Total balance
              </p>
              <p className="text-right text-[14px] leading-[20px] text-[var(--neutral-500)]">
                App Balance
              </p>

              <div className="flex min-h-[40px] items-end">
                <AmountText value={homeBalances.totalBalance} />
              </div>
              <div className="flex min-h-[40px] items-end justify-end">
                <AmountText
                  value={homeBalances.appBalance}
                  size="display"
                  showSign={false}
                />
              </div>

              <p className="text-[12px] leading-[16px] text-[var(--neutral-500)]">
                {homeBalances.totalBalanceHint}
              </p>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(true)}
                  className="text-[12px] font-semibold leading-[16px] text-primary"
                >
                  Top up
                </button>
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
                  <Receipt size={20} className="text-primary" aria-hidden />
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
                  <Send size={20} className="text-[var(--success-600)]" aria-hidden />
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
                  <ArrowRightLeft size={20} className="text-[var(--warning-500)]" aria-hidden />
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
                      navigate(item.groupId ? '/group-dashboard' : '/expenses');
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
                    aria-hidden
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

      {showNotifications && (
        <div
          className="absolute inset-0 z-50 flex flex-col bg-black/50"
          role="presentation"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="mt-auto max-h-[80%] rounded-t-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="notifications-title"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2
                id="notifications-title"
                className="text-[20px] font-bold text-[var(--neutral-900)]"
              >
                Notifications
              </h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[12px] font-semibold text-primary"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="flex size-8 items-center justify-center"
                  aria-label="Close notifications"
                >
                  <X size={20} className="text-[var(--neutral-500)]" />
                </button>
              </div>
            </div>
            <div className="max-h-[400px] overflow-auto">
              {data.notifications.length === 0 ? (
                <p className="p-6 text-center text-[14px] text-[var(--neutral-500)]">
                  No notifications
                </p>
              ) : (
                data.notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markNotificationRead(n.id)}
                    className={`w-full border-b border-border p-4 text-left ${
                      !n.read ? 'bg-[var(--primary-100)]/40' : ''
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-[var(--neutral-900)]">
                        {n.title}
                      </span>
                      <span className="text-[12px] text-[var(--neutral-400)]">{n.time}</span>
                    </div>
                    <p className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
                      {n.message}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showTopUpModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => !isProcessing && setShowTopUpModal(false)}
          role="presentation"
        >
          <div
            className="mx-4 w-full max-w-[328px] rounded-xl bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="home-topup-title"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2
                id="home-topup-title"
                className="text-[20px] font-bold text-[var(--neutral-900)]"
              >
                {isProcessing ? 'Processing...' : 'Top up balance'}
              </h2>
              {!isProcessing && (
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="flex size-8 items-center justify-center"
                  aria-label="Close"
                >
                  <X size={20} className="text-[var(--neutral-500)]" />
                </button>
              )}
            </div>
            {!isProcessing ? (
              <div className="p-4">
                <label
                  htmlFor="home-topup-amount"
                  className="mb-2 block text-[14px] font-semibold text-[var(--neutral-900)]"
                >
                  Amount
                </label>
                <Input
                  id="home-topup-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="0.00"
                  className="mb-4"
                />
                <div className="mb-4 flex flex-col gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`flex items-center gap-3 rounded-[10px] border-2 p-4 ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary bg-[var(--primary-100)]'
                          : 'border-border'
                      }`}
                    >
                      <span aria-hidden>{method.icon}</span>
                      <span className="text-[14px] font-semibold">{method.name}</span>
                      {selectedPaymentMethod === method.id && (
                        <Check size={20} className="ml-auto text-primary" aria-hidden />
                      )}
                    </button>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!selectedPaymentMethod || !topUpAmount}
                  onClick={handleTopUp}
                >
                  Confirm top up
                </Button>
              </div>
            ) : (
              <p className="p-8 text-center text-[14px] text-[var(--neutral-500)]">
                Processing payment...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
