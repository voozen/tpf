import { Check, ChevronRight, Download, Wallet, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data, updateSettings, resetData, topUp, withdraw } = useAppData();
  const [showExportConfirm, setShowExportConfirm] = useState<string | null>(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedWithdrawDestination, setSelectedWithdrawDestination] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const settings = data.settings;

  const paymentMethods = [
    { id: 'blik', name: 'BLIK', icon: '📱' },
    { id: 'card', name: 'Card ending 4242', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  ];

  const withdrawDestinations = [
    { id: 'card', name: 'Card ending 4242', icon: '💳' },
    { id: 'bank', name: 'Bank account •••• 8901', icon: '🏦' },
  ];

  const handleExport = (type: string) => {
    setShowExportConfirm(type);
  };

  const confirmExport = () => {
    toast.success(`Export started (${showExportConfirm})`);
    setShowExportConfirm(null);
  };

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

  const handleWithdraw = () => {
    const value = parseFloat(withdrawAmount);
    if (!selectedWithdrawDestination || Number.isNaN(value) || value <= 0) return;
    if (value > data.appBalance) {
      toast.error('Amount exceeds available balance');
      return;
    }
    setIsWithdrawing(true);
    setTimeout(() => {
      try {
        withdraw(value);
        setIsWithdrawing(false);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setSelectedWithdrawDestination('');
        toast.success('Withdrawal sent to your account');
      } catch (err) {
        setIsWithdrawing(false);
        toast.error(err instanceof Error ? err.message : 'Could not withdraw');
      }
    }, 1500);
  };

  const parsedWithdrawAmount = parseFloat(withdrawAmount);
  const withdrawExceedsBalance =
    !Number.isNaN(parsedWithdrawAmount) && parsedWithdrawAmount > data.appBalance;

  const handleSignOut = async () => {
    await logout();
    navigate('/signin');
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo data? This cannot be undone.')) {
      resetData();
      toast.success('Demo data reset');
    }
  };

  return (
    <div
      className="relative flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <PageHeader title="Profile & Settings">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-[24px] font-bold text-white">
            {user?.initials ?? 'U'}
          </div>
          <div>
            <p className="text-[18px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              {user?.name ?? 'User'}
            </p>
            <p className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
              {user?.email ?? ''}
            </p>
          </div>
        </div>
      </PageHeader>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-6 p-4">
          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              App balance
            </h2>
            <div className="flex items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Wallet size={20} className="text-primary" aria-hidden />
                <span className="text-[14px] font-semibold text-[var(--neutral-900)]">
                  {formatCurrency(data.appBalance, 'USD', { showSign: false })}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowTopUpModal(true)}>
                  Top up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={data.appBalance <= 0}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Preferences
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-border p-4">
                <span className="text-[14px] leading-[20px] text-[var(--neutral-900)]">
                  Default currency
                </span>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSettings({ currency: e.target.value })}
                  className="border-none bg-transparent text-[14px] font-semibold text-primary outline-none"
                  aria-label="Default currency"
                >
                  {['USD', 'EUR', 'GBP', 'PLN'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between border-b border-border p-4">
                <span className="text-[14px] leading-[20px] text-[var(--neutral-900)]">
                  Amount format
                </span>
                <span className="text-[14px] font-semibold text-primary">$1,234.56</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[14px] leading-[20px] text-[var(--neutral-900)]">
                  Budget month starts on
                </span>
                <select
                  value={String(settings.budgetStartDay)}
                  onChange={(e) =>
                    updateSettings({ budgetStartDay: parseInt(e.target.value, 10) })
                  }
                  className="border-none bg-transparent text-[14px] font-semibold text-primary outline-none"
                  aria-label="Budget month start day"
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      Day {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Notifications
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              {(
                [
                  ['debts', 'Debt reminders'],
                  ['budget', 'Budget alerts'],
                  ['weekly', 'Weekly summary'],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between border-b border-border p-4 last:border-b-0"
                >
                  <span className="text-[14px] leading-[20px] text-[var(--neutral-900)]">
                    {label}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.notifications[key]}
                    onChange={(e) =>
                      updateSettings({
                        notifications: {
                          ...settings.notifications,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    className="size-5 accent-primary"
                  />
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Export data
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              {['CSV', 'Excel'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleExport(type)}
                  className="flex w-full items-center justify-between border-b border-border p-4 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Download size={20} className="text-primary" aria-hidden />
                    <span className="text-[14px] font-semibold text-[var(--neutral-900)]">
                      Export as {type}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-[var(--neutral-500)]" aria-hidden />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Account
            </h2>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full" onClick={handleResetDemo}>
                Reset demo data
              </Button>
              <Button
                variant="outline"
                className="w-full border-[var(--danger-600)] text-[var(--danger-600)]"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          </section>
        </div>
      </div>

      {showExportConfirm && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
          role="presentation"
          onClick={() => setShowExportConfirm(null)}
        >
          <div
            className="mx-4 w-full max-w-[328px] rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="export-confirm-title"
          >
            <h2
              id="export-confirm-title"
              className="mb-2 text-[18px] font-bold text-[var(--neutral-900)]"
            >
              Export as {showExportConfirm}?
            </h2>
            <p className="mb-4 text-[14px] text-[var(--neutral-500)]">
              Your expense data will be downloaded to your device.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowExportConfirm(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={confirmExport}>
                Export
              </Button>
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
            aria-labelledby="profile-topup-title"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2
                id="profile-topup-title"
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
                  htmlFor="topup-amount"
                  className="mb-2 block text-[14px] font-semibold text-[var(--neutral-900)]"
                >
                  Amount
                </label>
                <Input
                  id="topup-amount"
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

      {showWithdrawModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => !isWithdrawing && setShowWithdrawModal(false)}
          role="presentation"
        >
          <div
            className="mx-4 w-full max-w-[328px] rounded-xl bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="profile-withdraw-title"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2
                id="profile-withdraw-title"
                className="text-[20px] font-bold text-[var(--neutral-900)]"
              >
                {isWithdrawing ? 'Processing...' : 'Withdraw funds'}
              </h2>
              {!isWithdrawing && (
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex size-8 items-center justify-center"
                  aria-label="Close"
                >
                  <X size={20} className="text-[var(--neutral-500)]" />
                </button>
              )}
            </div>
            {!isWithdrawing ? (
              <div className="p-4">
                <p className="mb-4 text-[14px] leading-[20px] text-[var(--neutral-500)]">
                  Available:{' '}
                  {formatCurrency(data.appBalance, 'USD', { showSign: false })}
                </p>
                <label
                  htmlFor="withdraw-amount"
                  className="mb-2 block text-[14px] font-semibold text-[var(--neutral-900)]"
                >
                  Amount
                </label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={data.appBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="mb-1"
                />
                {withdrawExceedsBalance && (
                  <p className="mb-3 text-[12px] leading-[16px] text-[var(--danger-600)]">
                    Amount exceeds available balance
                  </p>
                )}
                {!withdrawExceedsBalance && <div className="mb-3" />}
                <p className="mb-2 text-[14px] font-semibold text-[var(--neutral-900)]">
                  Withdraw to
                </p>
                <div className="mb-4 flex flex-col gap-2">
                  {withdrawDestinations.map((destination) => (
                    <button
                      key={destination.id}
                      type="button"
                      onClick={() => setSelectedWithdrawDestination(destination.id)}
                      className={`flex items-center gap-3 rounded-[10px] border-2 p-4 ${
                        selectedWithdrawDestination === destination.id
                          ? 'border-primary bg-[var(--primary-100)]'
                          : 'border-border'
                      }`}
                    >
                      <span aria-hidden>{destination.icon}</span>
                      <span className="text-[14px] font-semibold">{destination.name}</span>
                      {selectedWithdrawDestination === destination.id && (
                        <Check size={20} className="ml-auto text-primary" aria-hidden />
                      )}
                    </button>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={
                    !selectedWithdrawDestination ||
                    !withdrawAmount ||
                    withdrawExceedsBalance
                  }
                  onClick={handleWithdraw}
                >
                  Confirm withdrawal
                </Button>
              </div>
            ) : (
              <p className="p-8 text-center text-[14px] text-[var(--neutral-500)]">
                Processing withdrawal...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
