import type { PropsWithChildren, ReactNode } from 'react';
import { Card } from '../../../components/ui/Card';

interface AuthPageCardProps extends PropsWithChildren {
  eyebrow?: string;
  title: string;
  description: string;
  footer?: ReactNode;
}

export function AuthPageCard({
  eyebrow = 'HomeLander account',
  title,
  description,
  footer,
  children,
}: AuthPageCardProps) {
  return (
    <Card className='p-6 sm:p-8'>
      <p className='text-sm font-semibold text-brand-primary'>{eyebrow}</p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>{title}</h1>
      <p className='mt-3 text-sm leading-6 text-text-muted'>{description}</p>
      <div className='mt-6'>{children}</div>
      {footer ? <div className='mt-6 border-t border-border pt-5'>{footer}</div> : null}
    </Card>
  );
}
