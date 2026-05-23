import { AlertCircle, ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AmountText } from '@/components/AmountText';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAppData } from '@/contexts/AppDataContext';
import { formatCurrency } from '@/lib/formatters';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function SettlementSelectionPage() {
  const navigate = useNavigate();
  const { listGroupsWithDebts, setActiveGroup } = useAppData();
  const groupsData = listGroupsWithDebts();
  const needing = groupsData.filter((g) => g.hasDebts);
  const settled = groupsData.filter((g) => !g.hasDebts);

  const openSettlement = (groupId: string) => {
    setActiveGroup(groupId);
    navigate('/settlement');
  };

  return (
    <div
      className="flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <PageHeader
        title="Settle Debts"
        subtitle="Choose a group to settle"
        backTo="/home"
      />

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4 p-4">
          {needing.length > 0 ? (
            <>
              <div className="flex items-start gap-2 rounded-xl border border-[var(--warning-500)] bg-[var(--warning-100)] p-4">
                <AlertCircle size={20} className="mt-0.5 text-[var(--warning-500)]" aria-hidden />
                <div>
                  <p className="mb-1 text-[14px] font-semibold leading-[20px] text-[var(--warning-500)]">
                    {needing.length} group{needing.length !== 1 ? 's' : ''} with unsettled debts
                  </p>
                  <p className="text-[12px] leading-[16px] text-[var(--warning-500)]">
                    Select a group to view optimized settlement
                  </p>
                </div>
              </div>

              <section>
                <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
                  Groups with debts
                </h2>
                <div className="flex flex-col gap-3">
                  {needing.map(({ group, yourBalance, totalUnsettled }) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => openSettlement(group.id)}
                      className="rounded-xl border border-border bg-white p-4 text-left shadow-sm"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--primary-100)]">
                            <Users size={24} className="text-primary" />
                          </div>
                          <div>
                            <div className="text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
                              {group.name}
                            </div>
                            <div className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
                              {group.members} members
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={20} className="text-[var(--neutral-500)]" aria-hidden />
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <div>
                          <p className="mb-1 text-[12px] leading-[16px] text-[var(--neutral-500)]">
                            Your balance
                          </p>
                          <AmountText value={yourBalance} size="md" />
                        </div>
                        <div className="text-right">
                          <p className="mb-1 text-[12px] leading-[16px] text-[var(--neutral-500)]">
                            Total unsettled
                          </p>
                          <span className="text-[16px] font-bold leading-[24px] text-[var(--warning-500)]">
                            {formatCurrency(totalUnsettled, 'USD', { showSign: false })}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {settled.length > 0 && (
                <section>
                  <h2 className="mb-3 text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
                    Settled groups
                  </h2>
                  <div className="flex flex-col gap-3">
                    {settled.map(({ group }) => (
                      <div
                        key={group.id}
                        className="rounded-xl border border-border bg-white p-4 opacity-60 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--success-100)]">
                            <Users size={24} className="text-[var(--success-600)]" />
                          </div>
                          <div>
                            <div className="text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
                              {group.name}
                            </div>
                            <div className="text-[14px] leading-[20px] text-[var(--success-600)]">
                              All settled
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center px-4 py-16">
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-[var(--success-100)]">
                <Users size={40} className="text-[var(--success-600)]" aria-hidden />
              </div>
              <p className="mb-2 text-center text-[16px] font-semibold leading-[24px] text-[var(--neutral-900)]">
                All groups are settled!
              </p>
              <p className="text-center text-[14px] leading-[20px] text-[var(--neutral-500)]">
                You have no outstanding debts to settle
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
