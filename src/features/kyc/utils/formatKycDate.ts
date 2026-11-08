export function formatKycDate(value: string | null) {
  if (!value) {
    return 'Not submitted';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(date);
}
