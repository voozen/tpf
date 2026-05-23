import { AlertCircle, Check, ChevronDown, CreditCard, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppData } from '@/contexts/AppDataContext';
import { MOCK_MEMBERS } from '@/services/settlementService';
import { formatCurrency } from '@/lib/formatters';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function AddTransferPage() {
  const navigate = useNavigate();
  const { groups, addTransfer, data } = useAppData();
  const [from] = useState('You');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [groupId, setGroupId] = useState('');
  const [note, setNote] = useState('');
  const [paymentType, setPaymentType] = useState<'immediate' | 'scheduled'>('immediate');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const recipients = MOCK_MEMBERS.filter((m) => m !== from);

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

  const validate = () => {
    const newErrors: string[] = [];
    if (!to) newErrors.push('Please select who receives the payment');
    if (from === to) newErrors.push('Sender and receiver cannot be the same');
    const parsed = parseFloat(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      newErrors.push('Valid amount is required');
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const finishTransfer = () => {
    addTransfer({
      to,
      amount: parseFloat(amount),
      groupId: groupId || undefined,
      note,
    });
    toast.success('Transfer recorded');
    navigate('/home');
  };

  const handleSave = () => {
    if (!validate()) return;
    if (paymentType === 'immediate') {
      setShowPaymentModal(true);
    } else {
      finishTransfer();
    }
  };

  const handleProcessPayment = () => {
    if (!selectedPaymentMethod) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);
      finishTransfer();
    }, 1500);
  };

  return (
    <div
      className="relative flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <PageHeader
        title="Add Transfer"
        subtitle="Record a payment between members"
        backTo="/home"
      />

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="rounded-xl border border-[var(--primary-500)] bg-[var(--primary-100)] p-4">
            <p className="text-[12px] leading-[16px] text-primary">
              Send money directly to another person. Pay immediately or schedule for later.
            </p>
          </div>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Payment timing
            </h2>
            <div className="flex gap-2">
              {(['immediate', 'scheduled'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPaymentType(type)}
                  className={`h-12 flex-1 rounded-[10px] text-[14px] font-semibold ${
                    paymentType === type
                      ? 'bg-[var(--primary-100)] text-[var(--neutral-900)]'
                      : 'border border-border bg-white text-[var(--neutral-500)]'
                  }`}
                >
                  {type === 'immediate' ? 'Pay now' : 'Schedule'}
                </button>
              ))}
            </div>
          </section>

          <div>
            <label
              htmlFor="transfer-to"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              To (receiver)
            </label>
            <div className="relative">
              <select
                id="transfer-to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-12 w-full appearance-none rounded-[10px] border border-border bg-white px-4 pr-10 outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
              >
                <option value="">Select recipient</option>
                {recipients.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="pointer-events-none absolute right-3 top-3 text-[var(--neutral-500)]"
                aria-hidden
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="transfer-amount"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-[16px]">$</span>
              <Input
                id="transfer-amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="transfer-group"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              Group (optional)
            </label>
            <div className="relative">
              <select
                id="transfer-group"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="h-12 w-full appearance-none rounded-[10px] border border-border bg-white px-4 pr-10 outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
              >
                <option value="">No group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="pointer-events-none absolute right-3 top-3 text-[var(--neutral-500)]"
                aria-hidden
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="transfer-note"
              className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
            >
              Note (optional)
            </label>
            <textarea
              id="transfer-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              rows={2}
              className="w-full resize-none rounded-[10px] border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
            />
          </div>

          {errors.map((error) => (
            <div
              key={error}
              className="flex items-center gap-2 rounded-lg border border-[var(--danger-600)] bg-[var(--danger-100)] p-3"
              role="alert"
            >
              <AlertCircle size={16} className="text-[var(--danger-600)]" aria-hidden />
              <p className="text-[14px] leading-[20px] text-[var(--danger-600)]">{error}</p>
            </div>
          ))}

          <Button size="lg" className="w-full" onClick={handleSave}>
            {paymentType === 'immediate' ? 'Continue to payment' : 'Schedule transfer'}
          </Button>
        </div>
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
            aria-labelledby="transfer-payment-title"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2
                id="transfer-payment-title"
                className="text-[20px] font-bold leading-[28px] text-[var(--neutral-900)]"
              >
                {isProcessing ? 'Processing...' : 'Select payment method'}
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
                <p className="mb-4 text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]">
                  {formatCurrency(parseFloat(amount) || 0, 'USD', { showSign: false })}
                </p>
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
                  disabled={!selectedPaymentMethod}
                  onClick={handleProcessPayment}
                >
                  Confirm payment
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 p-8">
                <CreditCard size={32} className="animate-pulse text-primary" aria-hidden />
                <p className="text-center text-[14px] text-[var(--neutral-500)]">
                  Processing payment...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
