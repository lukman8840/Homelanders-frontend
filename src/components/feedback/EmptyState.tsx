import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center rounded-card border border-dashed border-border bg-white px-6 py-12 text-center'>
      <span className='grid size-12 place-items-center rounded-full bg-brand-soft text-brand-primary'>
        <SearchX aria-hidden='true' size={21} />
      </span>
      <h2 className='mt-4 text-lg font-semibold text-text-primary'>{title}</h2>
      <p className='mt-2 max-w-md text-sm leading-6 text-text-muted'>{description}</p>
      {action ? <div className='mt-5'>{action}</div> : null}
    </div>
  );
}
