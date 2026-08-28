export function formatMoney(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)} %`;
}

export function parseNumber(value: string): number {
  const parsed = Number(value.replace(',', '.').trim());
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function yearsFromMonths(months: number): string {
  const years = months / 12;
  if (Number.isInteger(years)) {
    return `${years} лет`;
  }

  return `${years.toFixed(1)} лет`;
}
