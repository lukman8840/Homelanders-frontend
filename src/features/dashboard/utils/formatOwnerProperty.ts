export function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSubmissionDate(date: string | null) {
  if (!date) {
    return 'Not submitted';
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(parsedDate);
}
