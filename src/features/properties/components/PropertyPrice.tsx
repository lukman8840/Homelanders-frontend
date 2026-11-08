interface PropertyPriceProps {
  amount: number;
  className?: string;
}

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export function PropertyPrice({ amount, className = '' }: PropertyPriceProps) {
  return <span className={className}>{nairaFormatter.format(amount)}</span>;
}
