import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { DashboardLinkButton } from '../components/DashboardLinkButton';
import { PropertyStatusBadge } from '../components/PropertyStatusBadge';
import { useOwnerProperties } from '../hooks/useOwnerProperties';
import { formatNaira, formatSubmissionDate } from '../utils/formatOwnerProperty';
import { isPropertyEditable } from '../utils/propertyStatus';

const statusOptions = [
  ['all', 'All statuses'],
  ['draft', 'Draft'],
  ['submitted', 'Submitted'],
  ['pending_verification', 'Pending Verification'],
  ['under_review', 'Under Review'],
  ['verified', 'Verified'],
  ['rejected', 'Rejected'],
];

export function DashboardPropertiesPage() {
  const { properties, loading, error, reload, mode } = useOwnerProperties();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const filteredProperties = useMemo(() => {
    const search = query.trim().toLowerCase();
    return properties.filter((property) => {
      const matchesSearch =
        !search ||
        [property.title, property.neighbourhood, property.city, property.state]
          .join(' ')
          .toLowerCase()
          .includes(search);
      return matchesSearch && (statusFilter === 'all' || property.status === statusFilter);
    });
  }, [properties, query, statusFilter]);

  return (
    <section>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
        <div>
          <p className='text-sm font-semibold text-brand-primary'>
            Owner workspace{mode === 'mock' ? ' · demo data' : ''}
          </p>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
            My properties
          </h1>
          <p className='mt-2 text-sm leading-6 text-text-muted'>
            Manage your listings and follow each verification update.
          </p>
        </div>
        <DashboardLinkButton className='w-fit' to='/dashboard/properties/new'>
          <Plus aria-hidden='true' size={17} />
          Add property
        </DashboardLinkButton>
      </div>

      <div className='mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]'>
        <div className='relative'>
          <Search
            aria-hidden='true'
            className='pointer-events-none absolute left-3.5 top-3.5 text-text-muted'
            size={17}
          />
          <Input
            className='pl-10'
            label='Search properties'
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search title or location'
            value={query}
          />
        </div>
        <label className='grid content-start gap-1.5 text-sm font-medium text-text-primary'>
          Filter by status
          <select
            className='min-h-11 w-full rounded-control border border-border bg-white px-3.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <div className='mt-5 flex flex-wrap items-center justify-between gap-3' role='alert'>
          <p className='text-sm text-red-700'>{error}</p>
          <button
            className='rounded-control border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary hover:bg-background'
            onClick={() => void reload()}
            type='button'
          >
            Try again
          </button>
        </div>
      ) : null}
      {loading ? (
        <div className='flex justify-center py-16'>
          <LoadingIndicator label='Loading your properties' />
        </div>
      ) : filteredProperties.length ? (
        <ul className='mt-5 grid gap-4'>
          {filteredProperties.map((property) => (
            <li key={property.id}>
              <Card className='p-5 sm:p-6'>
                <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
                  <div className='min-w-0'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <Link
                        className='text-lg font-semibold text-text-primary hover:text-brand-primary'
                        to={`/dashboard/properties/${property.id}`}
                      >
                        {property.title}
                      </Link>
                      <PropertyStatusBadge rawStatus={property.rawStatus} />
                    </div>
                    <p className='mt-1 text-sm text-text-muted'>
                      {property.neighbourhood}, {property.city}, {property.state}
                    </p>
                    <p className='mt-3 text-sm font-semibold text-text-primary'>
                      {property.askingPriceNaira
                        ? formatNaira(property.askingPriceNaira)
                        : 'Price not set'}
                    </p>
                    <p className='mt-1 text-xs text-text-muted'>
                      {property.bedrooms} bedrooms · {property.bathrooms} bathrooms ·{' '}
                      {property.sizeSqm} m² ·{' '}
                      {property.submittedAt
                        ? `Submitted ${formatSubmissionDate(property.submittedAt)}`
                        : 'Draft · not submitted'}
                    </p>
                  </div>
                  <div className='flex shrink-0 flex-wrap gap-2'>
                    <DashboardLinkButton
                      className='min-h-10 px-4'
                      to={`/dashboard/properties/${property.id}`}
                      variant='outline'
                    >
                      View details
                    </DashboardLinkButton>
                    {isPropertyEditable(property.status) ? (
                      <DashboardLinkButton
                        className='min-h-10 px-4'
                        to={`/dashboard/properties/${property.id}/edit`}
                        variant='secondary'
                      >
                        Edit
                      </DashboardLinkButton>
                    ) : null}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <div className='mt-5'>
          <EmptyState
            action={
              query || statusFilter !== 'all' ? (
                <button
                  className='rounded-control border border-border bg-white px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-background'
                  onClick={() => {
                    setQuery('');
                    setStatusFilter('all');
                  }}
                  type='button'
                >
                  Clear filters
                </button>
              ) : (
                <DashboardLinkButton to='/dashboard/properties/new'>
                  <Plus aria-hidden='true' size={17} />
                  Add your first property
                </DashboardLinkButton>
              )
            }
            description={
              query || statusFilter !== 'all'
                ? 'Try another search or clear the selected status.'
                : 'Start a submission to keep your properties and verification updates together.'
            }
            title={query || statusFilter !== 'all' ? 'No matching properties' : 'No properties yet'}
          />
        </div>
      )}
      {mode === 'mock' ? (
        <p className='mt-4 text-xs leading-5 text-text-muted'>
          Local demo records only. Submitted listings remain unverified until backend review
          approves them.
        </p>
      ) : null}
    </section>
  );
}
