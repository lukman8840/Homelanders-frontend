import { Link } from 'react-router-dom';
import type { PropsWithChildren } from 'react';

type DashboardLinkButtonProps = PropsWithChildren<{
  to: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}>;

const variantClasses = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover',
  secondary: 'bg-brand-soft text-brand-primary hover:bg-brand-soft',
  outline: 'border border-border bg-white text-text-primary hover:bg-background',
};

export function DashboardLinkButton({
  to,
  variant = 'primary',
  className = '',
  children,
}: DashboardLinkButtonProps) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${variantClasses[variant]} ${className}`.trim()}
      to={to}
    >
      {children}
    </Link>
  );
}
