import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PageHeader } from '@/components/layout/PageHeader';
import { useAppData } from '@/contexts/AppDataContext';
import { getSpendingTrend } from '@/services/budgetService';
import { formatCurrency } from '@/lib/formatters';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function InsightsPage() {
  const { data, insightsSummary } = useAppData();
  const [period, setPeriod] = useState<7 | 30>(30);
  const { spent, monthlyLimit, overBudget, percentSpent } = insightsSummary;
  const chartData = getSpendingTrend(period);

  return (
    <div
      className="flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <PageHeader title="Insights" />

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-6 p-4">
          <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="mb-1 text-[14px] leading-[20px] text-[var(--neutral-500)]">
                  Monthly limit
                </p>
                <p className="text-[20px] font-bold leading-[28px] text-[var(--neutral-900)]">
                  {formatCurrency(monthlyLimit, 'USD', { showSign: false })}
                </p>
              </div>
              <div className="text-right">
                <p className="mb-1 text-[14px] leading-[20px] text-[var(--neutral-500)]">
                  Spent
                </p>
                <p className="text-[20px] font-bold leading-[28px] text-[var(--danger-600)]">
                  {formatCurrency(spent, 'USD', { showSign: false })}
                </p>
              </div>
            </div>
            <div className="mb-2 h-3 overflow-hidden rounded-full bg-[var(--neutral-200)]">
              <div
                className="h-full rounded-full bg-[var(--danger-600)]"
                style={{ width: `${Math.min(percentSpent, 100)}%` }}
              />
            </div>
            {overBudget > 0 && (
              <p className="text-[12px] leading-[16px] text-[var(--danger-600)]">
                {formatCurrency(overBudget, 'USD', { showSign: false })} over budget (
                {percentSpent.toFixed(0)}%)
              </p>
            )}
          </section>

          {overBudget > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-[var(--danger-600)] bg-[var(--danger-100)] p-4">
              <AlertTriangle
                size={20}
                className="mt-0.5 text-[var(--danger-600)]"
                aria-hidden
              />
              <div>
                <p className="mb-1 text-[14px] font-semibold leading-[20px] text-[var(--danger-600)]">
                  Over budget warning
                </p>
                <p className="text-[12px] leading-[16px] text-[var(--danger-600)]">
                  Try reducing Food and Other spending to get back on track
                </p>
              </div>
            </div>
          )}

          <section>
            <h2 className="mb-3 text-[18px] font-semibold leading-[24px] text-[var(--neutral-900)]">
              Category breakdown
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              {data.budget.categories.map((category) => {
                const categoryPercent =
                  category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
                const isOver = category.spent > category.budget;
                const trendUp = category.trend.startsWith('+');

                return (
                  <div
                    key={category.name}
                    className="border-b border-border p-4 last:border-b-0"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                          {category.name}
                        </span>
                        <div
                          className={`flex items-center gap-1 rounded-full px-2 py-1 ${
                            trendUp ? 'bg-[var(--danger-100)]' : 'bg-[var(--success-100)]'
                          }`}
                        >
                          {trendUp ? (
                            <TrendingUp size={12} className="text-[var(--danger-600)]" aria-hidden />
                          ) : (
                            <TrendingDown
                              size={12}
                              className="text-[var(--success-600)]"
                              aria-hidden
                            />
                          )}
                          <span
                            className={`text-[10px] font-semibold leading-[14px] ${
                              trendUp ? 'text-[var(--danger-600)]' : 'text-[var(--success-600)]'
                            }`}
                          >
                            {category.trend}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-[14px] font-bold leading-[20px] ${
                            isOver ? 'text-[var(--danger-600)]' : 'text-[var(--neutral-900)]'
                          }`}
                        >
                          {formatCurrency(category.spent, 'USD', { showSign: false })}
                        </p>
                        <p className="text-[12px] leading-[16px] text-[var(--neutral-500)]">
                          of {formatCurrency(category.budget, 'USD', { showSign: false })}
                        </p>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--neutral-200)]">
                      <div
                        className={`h-full rounded-full ${
                          isOver ? 'bg-[var(--danger-600)]' : 'bg-[var(--primary-500)]'
                        }`}
                        style={{ width: `${Math.min(categoryPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold leading-[24px] text-[var(--neutral-900)]">
                Spending trend
              </h2>
              <div className="flex gap-2" role="group" aria-label="Chart period">
                {([7, 30] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`h-7 rounded-full px-3 text-[12px] font-semibold leading-[16px] ${
                      period === p
                        ? 'bg-[var(--primary-100)] text-[var(--neutral-900)]'
                        : 'bg-[var(--neutral-100)] text-[var(--neutral-500)]'
                    }`}
                  >
                    {p} days
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[180px] rounded-xl border border-border bg-white p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: 'var(--neutral-500)' }}
                    interval={period === 30 ? 4 : 0}
                  />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--neutral-500)' }} />
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(Number(value ?? 0), 'USD', { showSign: false })
                    }
                  />
                  <Bar dataKey="amount" fill="var(--primary-500)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
              Forecast
            </h3>
            <p className="mb-3 text-[14px] leading-[20px] text-[var(--neutral-500)]">
              At this rate, you&apos;ll spend{' '}
              <span className="font-bold text-[var(--danger-600)]">
                {formatCurrency(spent * 1.1, 'USD', { showSign: false })}
              </span>{' '}
              this month
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-[var(--warning-100)] p-2">
              <AlertTriangle size={16} className="text-[var(--warning-500)]" aria-hidden />
              <span className="text-[12px] leading-[16px] text-[var(--warning-500)]">
                High risk of exceeding budget by month end
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
