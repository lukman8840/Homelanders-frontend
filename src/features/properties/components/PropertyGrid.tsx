import { EmptyState } from '../../../components/feedback/EmptyState';
import { Button } from '../../../components/ui/Button';
import { PropertyCard } from './PropertyCard';
import type { Property } from '../types/property';

type PropertyGridStatus = 'success' | 'loading' | 'error';

interface PropertyGridProps {
  properties: Property[];
  status?: PropertyGridStatus;
  error?: string;
  onRetry?(): void;
}

export function PropertyGrid({
  properties,
  status = 'success',
  error,
  onRetry,
}: PropertyGridProps) {
  if (status === 'loading') {
    return (
      <div
        aria-label='Loading sample properties'
        className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
        role='status'
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div
            aria-hidden='true'
            className='overflow-hidden rounded-card border border-border bg-white'
            key={index}
          >
            <div className='aspect-[4/3] animate-pulse bg-brand-soft motion-reduce:animate-none' />
            <div className='grid gap-3 p-5'>
              <div className='h-3 w-1/3 animate-pulse rounded bg-brand-soft motion-reduce:animate-none' />
              <div className='h-5 w-3/4 animate-pulse rounded bg-brand-soft motion-reduce:animate-none' />
              <div className='h-3 w-1/2 animate-pulse rounded bg-brand-soft motion-reduce:animate-none' />
            </div>
          </div>
        ))}
        <span className='sr-only'>Loading properties</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <EmptyState
        action={
          onRetry ? (
            <Button onClick={onRetry} type='button' variant='outline'>
              Try again
            </Button>
          ) : undefined
        }
        description={error ?? 'Properties could not be loaded. Please try again.'}
        title='Unable to load properties'
      />
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        description='Try another Abuja district or clear the search to see all illustrative listings.'
        title='No sample listings match'
      />
    );
  }

  return (
    <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
