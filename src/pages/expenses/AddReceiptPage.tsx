import { AlertCircle, Camera, ChevronDown, FileText, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppData } from '@/contexts/AppDataContext';
import { MOCK_MEMBERS } from '@/services/settlementService';
import { APP_FONT_FAMILY } from '@/lib/constants';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Other'];

export function AddReceiptPage() {
  const navigate = useNavigate();
  const { addPersonalExpense, pendingReceipt, setPendingReceipt } = useAppData();
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [expenseType, setExpenseType] = useState<'personal' | 'group'>('personal');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState('You');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!pendingReceipt) return;
    setExpenseType('group');
    setMode('manual');
    setName(pendingReceipt.name);
    setAmount(String(pendingReceipt.amount));
    setCategory(pendingReceipt.category);
    setPaidBy(pendingReceipt.paidBy);
    setNote(pendingReceipt.note);
    setErrors([]);
  }, [pendingReceipt]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setMode('manual');
      setName('Dinner at Pasta House');
      setAmount('57.00');
      toast.success('Receipt scanned');
    }, 1500);
  };

  const handleContinue = () => {
    const newErrors: string[] = [];
    if (!name.trim()) newErrors.push('Receipt name is required');
    const parsed = parseFloat(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      newErrors.push('Valid amount is required');
    }

    setErrors(newErrors);
    if (newErrors.length > 0) return;

    const receipt = {
      name: name.trim(),
      amount: parsed,
      category,
      paidBy,
      date: new Date().toISOString().slice(0, 10),
      note,
    };

    if (expenseType === 'personal') {
      addPersonalExpense(receipt);
      toast.success('Expense saved');
      navigate('/home');
    } else {
      setPendingReceipt(receipt);
      navigate('/split-items');
    }
  };

  return (
    <div
      className="relative flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <PageHeader
        title="Add Receipt"
        subtitle={`Step 1 of ${expenseType === 'personal' ? '1' : '2'}`}
      />

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4 p-4">
          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Expense type
            </h2>
            <div className="flex gap-2">
              {(['personal', 'group'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setExpenseType(type)}
                  className={`h-12 flex-1 rounded-[10px] text-[14px] font-semibold ${
                    expenseType === type
                      ? 'bg-[var(--primary-100)] text-[var(--neutral-900)]'
                      : 'border border-border bg-white text-[var(--neutral-500)]'
                  }`}
                >
                  {type === 'personal' ? 'Personal spending' : 'Group expense'}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Entry method
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('scan')}
                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] text-[14px] font-semibold ${
                  mode === 'scan'
                    ? 'bg-[var(--primary-100)] text-[var(--neutral-900)]'
                    : 'border border-border bg-white text-[var(--neutral-500)]'
                }`}
              >
                <Camera size={20} aria-hidden />
                Scan receipt
              </button>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] text-[14px] font-semibold ${
                  mode === 'manual'
                    ? 'bg-[var(--primary-100)] text-[var(--neutral-900)]'
                    : 'border border-border bg-white text-[var(--neutral-500)]'
                }`}
              >
                <FileText size={20} aria-hidden />
                Manual entry
              </button>
            </div>
          </section>

          {mode === 'scan' && !isScanning && (
            <button
              type="button"
              onClick={handleScan}
              className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-white p-12"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--primary-100)]">
                <Upload size={32} className="text-primary" aria-hidden />
              </div>
              <p className="text-center text-[14px] leading-[20px] text-[var(--neutral-500)]">
                Tap to scan receipt with OCR
              </p>
              <p className="text-center text-[12px] leading-[16px] text-[var(--neutral-400)]">
                Auto-capture receipt details instantly
              </p>
            </button>
          )}

          {isScanning && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-12">
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--primary-100)]">
                <Camera size={32} className="animate-pulse text-primary" aria-hidden />
              </div>
              <p className="text-center text-[14px] leading-[20px] text-primary">
                Scanning receipt...
              </p>
            </div>
          )}

          {mode === 'manual' && (
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="receipt-name"
                  className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
                >
                  Receipt name
                </label>
                <Input
                  id="receipt-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dinner at restaurant"
                />
              </div>

              <div>
                <label
                  htmlFor="receipt-amount"
                  className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
                >
                  Total amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-[16px] text-[var(--neutral-900)]">
                    $
                  </span>
                  <Input
                    id="receipt-amount"
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
                  htmlFor="receipt-category"
                  className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
                >
                  Category
                </label>
                <div className="relative">
                  <select
                    id="receipt-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 w-full appearance-none rounded-[10px] border border-border bg-white px-4 pr-10 outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
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

              {expenseType === 'group' && (
                <div>
                  <label
                    htmlFor="receipt-paid-by"
                    className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
                  >
                    Paid by
                  </label>
                  <div className="relative">
                    <select
                      id="receipt-paid-by"
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                      className="h-12 w-full appearance-none rounded-[10px] border border-border bg-white px-4 pr-10 outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                    >
                      {MOCK_MEMBERS.map((m) => (
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
              )}

              <div>
                <label
                  htmlFor="receipt-note"
                  className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
                >
                  Note (optional)
                </label>
                <textarea
                  id="receipt-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
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

              <Button size="lg" className="w-full" onClick={handleContinue}>
                {expenseType === 'personal' ? 'Save expense' : 'Continue to split'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
