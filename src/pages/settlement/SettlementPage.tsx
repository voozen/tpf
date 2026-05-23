import {
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/contexts/AppDataContext';
import { formatCurrency } from '@/lib/formatters';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function SettlementPage() {
  const navigate = useNavigate();
  const { getActiveGroup, getSettlement, markSettlementPaid, data } = useAppData();
  const group = getActiveGroup();
  const [showRawDebts, setShowRawDebts] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!group) {
    return <Navigate to="/settlement-selection" replace />;
  }

  const settlement = getSettlement(group.id);
  const transfers = settlement.transfers;
  const rawDebts = settlement.rawDebts;
  const allPaid = transfers.length === 0 || transfers.every((t) => t.paid);
  const totalSaved = Math.max(0, rawDebts.length - transfers.length);

  const paymentMethods = [
    {
      id: 'balance',
      name: `App Balance (${formatCurrency(data.appBalance, 'USD', { showSign: false })})`,
      icon: '💰',
    },
    { id: 'blik', name: 'BLIK', icon: '📱' },
    { id: 'card', name: 'Card ending 4242', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  ];

  const payAmount =
    selectedTransferId !== null
      ? transfers.find((t) => t.id === selectedTransferId)?.amount ?? 0
      : transfers
          .filter((t) => t.from === 'You' && !t.paid)
          .reduce((sum, t) => sum + t.amount, 0);

  const openPay = (transferId: string | null) => {
    setSelectedTransferId(transferId);
    setSelectedPaymentMethod('');
    setShowPaymentModal(true);
  };

  const handleProcessPayment = () => {
    if (!selectedPaymentMethod) return;
    setIsProcessing(true);
    setTimeout(() => {
      markSettlementPaid(group.id, selectedTransferId);
      setIsProcessing(false);
      setShowPaymentModal(false);
      setSelectedTransferId(null);
      setSelectedPaymentMethod('');
      toast.success('Payment marked as completed');
    }, 1500);
  };

  return (
    <div
      className="relative flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <PageHeader
        title="Settlement"
        subtitle={group.name}
        backTo="/settlement-selection"
      />

      <div className="flex-1 overflow-auto">
        {!allPaid ? (
          <div className="flex flex-col gap-4 p-4">
            {transfers.length > 0 && (
              <div className="rounded-xl border border-[var(--success-600)] bg-[var(--success-100)] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[14px] font-semibold leading-[20px] text-[var(--success-600)]">
                    Optimized transfers
                  </span>
                  {totalSaved > 0 && (
                    <span className="text-[12px] font-semibold leading-[16px] text-[var(--success-600)]">
                      Saved {totalSaved} transfers
                    </span>
                  )}
                </div>
                <p className="text-[12px] leading-[16px] text-[var(--success-600)]">
                  Before: {rawDebts.length} transfers • After: {transfers.length} transfers
                </p>
              </div>
            )}

            <section>
              <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
                Suggested transfers (optimized)
              </h2>
              <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                {transfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="border-b border-border p-4 last:border-b-0"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex flex-1 items-center gap-2">
                        <span className="text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                          {transfer.from}
                        </span>
                        <ArrowRight size={16} className="text-[var(--neutral-500)]" aria-hidden />
                        <span className="text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                          {transfer.to}
                        </span>
                      </div>
                      <span className="text-[16px] font-bold leading-[24px] text-primary">
                        {formatCurrency(transfer.amount, 'USD', { showSign: false })}
                      </span>
                    </div>
                    {transfer.from === 'You' && !transfer.paid && (
                      <Button
                        className="h-10 w-full gap-2"
                        onClick={() => openPay(transfer.id)}
                      >
                        <CreditCard size={16} aria-hidden />
                        Pay now
                      </Button>
                    )}
                    {transfer.from !== 'You' && !transfer.paid && (
                      <div className="flex h-10 w-full items-center justify-center rounded-[10px] bg-[var(--neutral-100)] text-[14px] font-semibold text-[var(--neutral-500)]">
                        Waiting for payment
                      </div>
                    )}
                    {transfer.paid && (
                      <div className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--success-100)] text-[14px] font-semibold text-[var(--success-600)]">
                        <Check size={16} aria-hidden />
                        Payment completed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {rawDebts.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setShowRawDebts(!showRawDebts)}
                  className="flex items-center justify-between rounded-lg border border-border bg-white p-3"
                  aria-expanded={showRawDebts}
                >
                  <span className="text-[14px] leading-[20px] text-[var(--neutral-900)]">
                    All raw debts ({rawDebts.length})
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-[var(--neutral-500)] transition-transform ${showRawDebts ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>

                {showRawDebts && (
                  <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                    {rawDebts.map((debt) => (
                      <div
                        key={debt.id}
                        className="flex items-center justify-between border-b border-border p-3 last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] leading-[16px] text-[var(--neutral-500)]">
                            {debt.from}
                          </span>
                          <ArrowRight size={14} className="text-[var(--neutral-400)]" aria-hidden />
                          <span className="text-[12px] leading-[16px] text-[var(--neutral-500)]">
                            {debt.to}
                          </span>
                        </div>
                        <span className="text-[12px] leading-[16px] text-[var(--neutral-500)]">
                          {formatCurrency(debt.amount, 'USD', { showSign: false })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {transfers.some((t) => t.from === 'You' && !t.paid) && (
              <Button size="lg" className="w-full gap-2" onClick={() => openPay(null)}>
                <CreditCard size={20} aria-hidden />
                Pay all debts
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center px-4 py-16">
            <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-[var(--success-100)]">
              <Check size={40} className="text-[var(--success-600)]" aria-hidden />
            </div>
            <p className="mb-2 text-center text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Group is fully settled
            </p>
            <p className="mb-6 text-center text-[14px] leading-[20px] text-[var(--neutral-500)]">
              All debts have been marked as paid
            </p>
            <Button variant="outline" onClick={() => navigate('/expenses')}>
              Back to expenses
            </Button>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => !isProcessing && setShowPaymentModal(false)}
          role="presentation"
        >
          <div
            className="mx-4 w-full max-w-[328px] rounded-xl bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="payment-modal-title"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2
                id="payment-modal-title"
                className="text-[20px] font-bold leading-[28px] text-[var(--neutral-900)]"
              >
                {isProcessing ? 'Processing payment...' : 'Select payment method'}
              </h2>
              {!isProcessing && (
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex size-8 items-center justify-center"
                  aria-label="Close"
                >
                  <X size={20} className="text-[var(--neutral-500)]" />
                </button>
              )}
            </div>

            {!isProcessing ? (
              <div className="p-4">
                <div className="mb-4">
                  <p className="mb-1 text-[14px] leading-[20px] text-[var(--neutral-500)]">
                    Amount to pay
                  </p>
                  <p className="text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]">
                    {formatCurrency(payAmount, 'USD', { showSign: false })}
                  </p>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`flex items-center gap-3 rounded-[10px] border-2 p-4 ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary bg-[var(--primary-100)]'
                          : 'border-border bg-white'
                      }`}
                    >
                      <span className="text-[24px]" aria-hidden>
                        {method.icon}
                      </span>
                      <span className="text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                        {method.name}
                      </span>
                      {selectedPaymentMethod === method.id && (
                        <Check size={20} className="ml-auto text-primary" aria-hidden />
                      )}
                    </button>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={!selectedPaymentMethod}
                  onClick={handleProcessPayment}
                >
                  Confirm payment
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 p-8">
                <div className="flex size-16 items-center justify-center rounded-full bg-[var(--primary-100)]">
                  <CreditCard size={32} className="animate-pulse text-primary" aria-hidden />
                </div>
                <p className="text-center text-[14px] leading-[20px] text-[var(--neutral-500)]">
                  Securely processing your payment...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
