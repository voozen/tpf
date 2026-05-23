import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/contexts/AppDataContext';
import { MOCK_MEMBERS } from '@/services/settlementService';
import { formatCurrency } from '@/lib/formatters';
import { APP_FONT_FAMILY } from '@/lib/constants';

type Participant = { id: string; name: string; selected: boolean; share: number };

export function SplitItemsPage() {
  const navigate = useNavigate();
  const { pendingReceipt, setPendingReceipt, groups, addGroupExpense } = useAppData();
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id ?? '');
  const [participants, setParticipants] = useState<Participant[]>(() =>
    MOCK_MEMBERS.slice(0, 4).map((name, i) => ({
      id: String(i + 1),
      name,
      selected: true,
      share: 25,
    })),
  );

  if (!pendingReceipt) {
    return <Navigate to="/add-receipt" replace />;
  }

  const totalAmount = pendingReceipt.amount;
  const selectedParticipants = participants.filter((p) => p.selected);
  const assignedPercent = selectedParticipants.reduce((sum, p) => sum + p.share, 0);
  const isValid = assignedPercent === 100 && selectedGroupId;

  const mockItems = useMemo(() => {
    const part = Math.round((totalAmount / 4) * 100) / 100;
    return [
      { id: 1, name: 'Item 1', amount: part },
      { id: 2, name: 'Item 2', amount: part },
      { id: 3, name: 'Item 3', amount: part },
      {
        id: 4,
        name: 'Item 4',
        amount: Math.round((totalAmount - part * 3) * 100) / 100,
      },
    ];
  }, [totalAmount]);

  const redistributeEqual = (list: Participant[]) => {
    const selected = list.filter((p) => p.selected);
    const equalShare = selected.length ? Math.floor(100 / selected.length) : 0;
    let remainder = 100 - equalShare * selected.length;
    return list.map((p) => {
      if (!p.selected) return { ...p, share: 0 };
      const share = equalShare + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder -= 1;
      return { ...p, share };
    });
  };

  const toggleParticipant = (id: string) => {
    setParticipants((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p,
      );
      return redistributeEqual(next);
    });
  };

  const setParticipantShare = (id: string, raw: string) => {
    const parsed = raw === '' ? 0 : Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    const share = Math.max(0, Math.min(100, parsed));
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, share } : p)),
    );
  };

  const handleSave = () => {
    if (!isValid) return;

    const youParticipant = selectedParticipants.find((p) => p.name === 'You');
    const yourShare = youParticipant
      ? Math.round(((totalAmount * youParticipant.share) / 100) * 100) / 100
      : 0;

    addGroupExpense(selectedGroupId, pendingReceipt, {
      yourShare,
      participantCount: selectedParticipants.length,
    });
    setPendingReceipt(null);
    toast.success('Expense saved and balances updated');
    navigate('/group-dashboard');
  };

  return (
    <div
      className="relative flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <PageHeader
        title="Split Items"
        subtitle={`Step 2 of 2 • ${pendingReceipt.name}`}
        backTo="/add-receipt"
      />

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
                Total amount
              </span>
              <span className="text-[20px] font-bold leading-[28px] text-[var(--neutral-900)]">
                {formatCurrency(totalAmount, 'USD', { showSign: false })}
              </span>
            </div>
            <div
              className={`flex items-center justify-between rounded-lg p-3 ${
                isValid ? 'bg-[var(--success-100)]' : 'bg-[var(--warning-100)]'
              }`}
            >
              <span
                className={`text-[14px] font-semibold leading-[20px] ${
                  isValid ? 'text-[var(--success-600)]' : 'text-[var(--warning-500)]'
                }`}
              >
                Assigned {assignedPercent}%
              </span>
              {isValid && (
                <Check size={20} className="text-[var(--success-600)]" aria-hidden />
              )}
            </div>
          </div>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Items
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              {mockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-border p-3 last:border-b-0"
                >
                  <span className="text-[14px] leading-[20px] text-[var(--neutral-900)]">
                    {item.name}
                  </span>
                  <span className="text-[14px] font-bold leading-[20px] text-[var(--neutral-900)]">
                    {formatCurrency(item.amount, 'USD', { showSign: false })}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Group
            </h2>
            <div className="relative">
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="h-12 w-full appearance-none rounded-[10px] border border-border bg-white px-4 pr-10 outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                aria-label="Select group"
              >
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
          </section>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Split method
            </h2>
            <div className="flex gap-2">
              {(['equal', 'custom'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSplitMode(m);
                    if (m === 'equal') {
                      setParticipants((prev) => redistributeEqual(prev));
                    }
                  }}
                  className={`h-12 flex-1 rounded-[10px] text-[14px] font-semibold ${
                    splitMode === m
                      ? 'bg-[var(--primary-100)] text-[var(--neutral-900)]'
                      : 'border border-border bg-white text-[var(--neutral-500)]'
                  }`}
                >
                  {m === 'equal' ? 'Split equally' : 'Custom share'}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Participants
            </h2>
            <div className="mb-4 flex flex-wrap gap-2">
              {participants.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleParticipant(p.id)}
                  className={`h-9 rounded-full px-4 text-[14px] font-semibold ${
                    p.selected
                      ? 'bg-[var(--primary-100)] text-[var(--neutral-900)]'
                      : 'bg-[var(--neutral-100)] text-[var(--neutral-500)]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              {selectedParticipants.map((participant) => {
                const shareAmount =
                  (totalAmount * participant.share) / 100;

                return (
                  <div
                    key={participant.id}
                    className="border-b border-border px-3 py-2.5 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                        {participant.name}
                      </span>

                      <div
                        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--neutral-200)]"
                        aria-hidden
                      >
                        <div
                          className="h-full rounded-full bg-[var(--primary-500)] transition-[width] duration-150"
                          style={{ width: `${participant.share}%` }}
                        />
                      </div>

                      <span className="w-[4.25rem] shrink-0 text-right text-[14px] font-bold tabular-nums leading-[20px] text-primary">
                        {formatCurrency(shareAmount, 'USD', { showSign: false })}
                      </span>

                      <div className="flex w-[4.25rem] shrink-0 items-center justify-end gap-0.5">
                        {splitMode === 'equal' ? (
                          <span className="flex h-8 w-[2.75rem] items-center justify-center text-[14px] font-semibold tabular-nums leading-none text-[var(--neutral-500)]">
                            {participant.share}
                          </span>
                        ) : (
                          <>
                            <label
                              htmlFor={`share-${participant.id}`}
                              className="sr-only"
                            >
                              {participant.name} share percent
                            </label>
                            <input
                              id={`share-${participant.id}`}
                              type="number"
                              inputMode="numeric"
                              min={0}
                              max={100}
                              step={1}
                              value={participant.share}
                              onChange={(e) =>
                                setParticipantShare(participant.id, e.target.value)
                              }
                              className="h-8 w-[2.75rem] shrink-0 rounded-md border border-border bg-white px-1 text-center text-[14px] font-semibold leading-none tabular-nums text-[var(--neutral-900)] outline-none [appearance:textfield] focus-visible:border-[var(--primary-500)] focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              aria-label={`${participant.name} share percent`}
                            />
                          </>
                        )}
                        <span className="w-3 shrink-0 text-[13px] font-medium text-[var(--neutral-500)]">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {splitMode === 'custom' && (
              <p className="mt-2 text-[12px] leading-[16px] text-[var(--neutral-500)]">
                Enter each person&apos;s share. All percentages must add up to 100%.
              </p>
            )}
          </section>

          {!isValid && (
            <div
              className="flex items-center gap-2 rounded-lg border border-[var(--danger-600)] bg-[var(--danger-100)] p-3"
              role="alert"
            >
              <AlertCircle size={16} className="text-[var(--danger-600)]" aria-hidden />
              <p className="text-[14px] leading-[20px] text-[var(--danger-600)]">
                Total must equal 100%. Currently {assignedPercent}%
              </p>
            </div>
          )}

          <Button size="lg" className="w-full" disabled={!isValid} onClick={handleSave}>
            Save and update balances
          </Button>
        </div>
      </div>
    </div>
  );
}
