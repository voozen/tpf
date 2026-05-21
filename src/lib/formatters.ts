const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LOCALE = 'en-US';

export function formatCurrency(
  value: number,
  currency: string = DEFAULT_CURRENCY,
  options?: { showSign?: boolean },
): string {
  const formatted = new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Math.abs(value));

  if (!options?.showSign || value === 0) return formatted;
  if (value > 0) return `+${formatted}`;
  return `-${formatted}`;
}

export function formatDate(isoOrDisplay: string): string {
  const parsed = Date.parse(isoOrDisplay);
  if (Number.isNaN(parsed)) return isoOrDisplay;
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(parsed));
}
