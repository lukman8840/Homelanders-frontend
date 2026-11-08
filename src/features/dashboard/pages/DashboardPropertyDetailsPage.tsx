import { ArrowLeft, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { Card } from '../../../components/ui/Card';
import { DashboardLinkButton } from '../components/DashboardLinkButton';
import { PropertyStatusBadge } from '../components/PropertyStatusBadge';
import { VerificationProgress } from '../components/VerificationProgress';
import { propertyOwnerService } from '../services/configuredPropertyOwnerService';
import type { OwnerProperty } from '../types/propertyOwner';
import { formatNaira, formatSubmissionDate } from '../utils/formatOwnerProperty';
import { getPropertyStatus, isPropertyEditable } from '../utils/propertyStatus';

export function DashboardPropertyDetailsPage() {
  const { propertyId } = useParams();
  const location = useLocation();
  const routeState = location.state as { submissionFeedback?: string } | null;
  const [property, setProperty] = useState<OwnerProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    propertyOwnerService
      .getById(propertyId ?? '')
      .then((result) => {
        if (active) {
          setProperty(result);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error ? loadError.message : 'Unable to load this property.',
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [propertyId]);

  if (loading) {
    return (
      <div className='flex justify-center py-16'>
        <LoadingIndicator label='Loading property details' />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className='grid gap-5'>
        <p className='text-sm text-red-700' role='alert'>
          {error ?? 'This property could not be found.'}
        </p>
        <EmptyState
          action={
            <DashboardLinkButton to='/dashboard/properties' variant='outline'>
              Back to My properties
            </DashboardLinkButton>
          }
          description='The listing may have been removed or is no longer available for this account.'
          title='Property not found'
        />
      </div>
    );
  }

  const displayStatus = getPropertyStatus(property.rawStatus);
  const editable = isPropertyEditable(property.status);

  return (
    <section>
      <Link
        className='inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline'
        to='/dashboard/properties'
      >
        <ArrowLeft aria-hidden='true' size={16} />
        Back to My properties
      </Link>
      <div className='mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
        <div>
          <p className='text-sm font-semibold text-brand-primary'>
            Property verification{propertyOwnerService.mode === 'mock' ? ' · demo' : ''}
          </p>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
            {property.title}
          </h1>
          <p className='mt-2 text-sm text-text-muted'>
            {property.neighbourhood}, {property.city}, {property.state}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <PropertyStatusBadge rawStatus={property.rawStatus} />
          {editable ? (
            <DashboardLinkButton
              className='min-h-10 px-4'
              to={`/dashboard/properties/${property.id}/edit`}
              variant='outline'
            >
              <Pencil aria-hidden='true' size={15} />
              Edit
            </DashboardLinkButton>
          ) : null}
        </div>
      </div>
      {routeState?.submissionFeedback === 'demo-submitted' ? (
        <p
          className='mt-5 rounded-control bg-blue-50 px-4 py-3 text-sm text-blue-900'
          role='status'
        >
          Demo submission recorded locally only. It has not been sent to or verified by the backend.
        </p>
      ) : null}
      {routeState?.submissionFeedback === 'submitted' ? (
        <p
          className='mt-5 rounded-control bg-blue-50 px-4 py-3 text-sm text-blue-900'
          role='status'
        >
          Your property was submitted. Verification is separate and it is not shown as verified
          unless the backend returns an approved verification status.
        </p>
      ) : null}
      {routeState?.submissionFeedback === 'draft' ? (
        <p
          className='mt-5 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-primary'
          role='status'
        >
          {propertyOwnerService.mode === 'mock'
            ? 'Draft saved locally in demo mode. No information was sent to the backend.'
            : 'Your draft was saved.'}
        </p>
      ) : null}
      {routeState?.submissionFeedback === 'draft-api' ? (
        <p
          className='mt-5 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-primary'
          role='status'
        >
          Your draft was saved.
        </p>
      ) : null}

      <Card className='mt-6 p-5 sm:p-7'>
        <h2 className='text-lg font-semibold text-text-primary'>Verification progress</h2>
        <p className='mt-1 text-sm text-text-muted'>
          Submission date: {formatSubmissionDate(property.submittedAt)}
        </p>
        {displayStatus.status ? (
          <div className='mt-6'>
            <VerificationProgress status={displayStatus.status} />
          </div>
        ) : (
          <p className='mt-5 text-sm text-text-muted'>
            Progress is unavailable until this backend status is mapped.
          </p>
        )}
        {property.assignedVerifier ? (
          <p className='mt-5 text-sm text-text-muted'>
            Assigned verification team:{' '}
            <span className='font-medium text-text-primary'>{property.assignedVerifier}</span>
          </p>
        ) : (
          <p className='mt-5 text-sm text-text-muted'>No verifier has been assigned yet.</p>
        )}
      </Card>

      {property.rejectionReason ? (
        <Card className='mt-4 border-red-200 bg-red-50 p-5 sm:p-7'>
          <h2 className='font-semibold text-red-900'>
            Changes needed before this property can proceed
          </h2>
          <p className='mt-2 text-sm leading-6 text-red-800'>{property.rejectionReason}</p>
          <p className='mt-2 text-sm leading-6 text-red-800'>
            Update the listing and provide a clear, complete ownership document before resubmitting.
          </p>
          {editable ? (
            <DashboardLinkButton
              className='mt-4'
              to={`/dashboard/properties/${property.id}/edit`}
              variant='outline'
            >
              <Pencil aria-hidden='true' size={15} />
              Update and resubmit
            </DashboardLinkButton>
          ) : null}
        </Card>
      ) : null}

      {property.adminFeedback ? (
        <Card className='mt-4 p-5 sm:p-7'>
          <h2 className='font-semibold text-text-primary'>Admin feedback</h2>
          <p className='mt-2 text-sm leading-6 text-text-muted'>{property.adminFeedback}</p>
        </Card>
      ) : null}

      <Card className='mt-4 p-5 sm:p-7'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <h2 className='text-lg font-semibold text-text-primary'>Property information</h2>
          <p className='text-lg font-semibold text-brand-primary'>
            {property.askingPriceNaira ? formatNaira(property.askingPriceNaira) : 'Price not set'}
          </p>
        </div>
        <p className='mt-3 text-sm leading-6 text-text-muted'>{property.description}</p>
        <dl className='mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2'>
          <DetailItem label='Property type' value={property.propertyType} />
          <DetailItem label='Property size' value={`${property.sizeSqm} m²`} />
          <DetailItem
            label='Bedrooms · bathrooms · toilets'
            value={`${property.bedrooms} · ${property.bathrooms} · ${property.toilets}`}
          />
          <DetailItem
            label='Street address'
            value={`${property.streetAddress}${property.locationDetails ? `, ${property.locationDetails}` : ''}`}
          />
          <DetailItem label='Features' value={property.features.join(', ') || 'None specified'} />
        </dl>
      </Card>
      <p className='mt-4 text-xs leading-5 text-text-muted'>
        This is illustrative local data. Only a backend-approved verification status should be shown
        as verified or published publicly.
      </p>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className='text-xs font-medium text-text-muted'>{label}</dt>
      <dd className='mt-1 text-sm text-text-primary'>{value}</dd>
    </div>
  );
}
