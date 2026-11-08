import type { ComponentPropsWithoutRef } from 'react';

type CardProps = ComponentPropsWithoutRef<'div'>;

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-surface shadow-card ${className}`.trim()}
      {...props}
    />
  );
}
