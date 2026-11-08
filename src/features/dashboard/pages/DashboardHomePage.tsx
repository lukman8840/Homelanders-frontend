import { ArrowRight, BadgeCheck, Clock3, Plus, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { DashboardLinkButton } from '../components/DashboardLinkButton';
import { PropertyStatusBadge } from '../components/PropertyStatusBadge';
import { useOwnerProperties } from '../hooks/useOwnerProperties';
import { formatSubmissionDate } from '../utils/formatOwnerProperty';
import { isAwaitingVerification } from '../utils/propertyStatus';

export function DashboardHomePage() {
  const { properties, loading, error, reload, mode } = useOwnerProperties();
  const submitted = properties.filter((property) => property.status !== 'draft');
  const verified = properties.filter((property) => property.status === 'verified').length;
  const awaiting = properties.filter((property) => isAwaitingVerification(property.status)).length;
  const rejected = properties.filter((property) => property.status === 'rejected').length;
  const recent = submitted
    .slice()
    .sort(
      (left, right) =>
        new Date(right.submittedAt ?? 0).getTime() - new Date(left.submittedAt ?? 0).getTime(),
    )
    .slice(0, 4);

  return (
    <section>
      <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
        <div>
          <p className='text-sm font-semibold text-brand-primary'>
            Owner workspace{mode === 'mock' ? ' · demo data' : ''}
          </p>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
            Welcome back
          </h1>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-text-muted'>
            Track your property submissions and verification progress in one place.
          </p>
        </div>
        <DashboardLinkButton className='w-fit' to='/dashboard/properties/new'>
          <Plus aria-hidden='true' size={17} />
          Add a property
        </DashboardLinkButton>
      </div>

      {error ? (
        <div className='mt-6 flex flex-wrap items-center justify-between gap-3' role='alert'>
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
          <LoadingIndicator label='Loading owner dashboard' />
        </div>
      ) : (
        <>
          <div className='mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            <SummaryCard icon={Clock3} label='Properties submitted' value={submitted.length} />
            <SummaryCard icon={BadgeCheck} label='Verified properties' value={verified} />
            <SummaryCard icon={Clock3} label='Awaiting verification' value={awaiting} />
            <SummaryCard icon={XCircle} label='Rejected properties' value={rejected} />
          </div>

          <Card className='mt-7 p-5 sm:p-7'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h2 className='text-lg font-semibold text-text-primary'>Recent submissions</h2>
                <p className='mt-1 text-sm text-text-muted'>Latest updates to your listings</p>
              </div>
              <Link
                className='inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline'
                to='/dashboard/properties'
              >
                View all <ArrowRight aria-hidden='true' size={16} />
              </Link>
            </div>
            {recent.length ? (
              <ul className='mt-5 divide-y divide-border'>
                {recent.map((property) => (
                  <li
                    className='flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between'
                    key={property.id}
                  >
                    <div className='min-w-0'>
                      <Link
                        className='font-semibold text-text-primary hover:text-brand-primary'
                        to={`/dashboard/properties/${property.id}`}
                      >
                        {property.title}
                      </Link>
                      <p className='mt-1 text-sm text-text-muted'>
                        {property.neighbourhood}, {property.city} · Submitted{' '}
                        {formatSubmissionDate(property.submittedAt)}
                      </p>
                    </div>
                    <PropertyStatusBadge rawStatus={property.rawStatus} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className='mt-5 text-sm text-text-muted'>No submitted properties yet.</p>
            )}
          </Card>
          {mode === 'mock' ? (
            <p className='mt-4 text-xs leading-5 text-text-muted'>
              These example records are local demo data. A property is not publicly verified unless
              the backend verification process approves it.
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: number;
}) {
  return (
    <Card className='flex items-center gap-4 p-5'>
      <span className='grid size-11 shrink-0 place-items-center rounded-control bg-brand-soft text-brand-primary'>
        <Icon aria-hidden='true' size={20} />
      </span>
      <div>
        <p className='text-sm text-text-muted'>{label}</p>
        <p className='mt-1 text-2xl font-semibold text-text-primary'>{value}</p>
      </div>
    </Card>
  );
}
