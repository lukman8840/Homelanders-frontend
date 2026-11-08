import { BadgeInfo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { PropertyGallery } from './PropertyGallery';
import { PropertyLocation } from './PropertyLocation';
import { PropertyPrice } from './PropertyPrice';
import { PropertyFeatures } from './PropertyFeatures';
import { VerificationBadge } from './VerificationBadge';
import { PROPERTY_TYPE_LABELS, type Property } from '../types/property';

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const navigate = useNavigate();
  const listedAt = new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(property.listingInfo.listedAt));

  return (
    <article>
      <PropertyGallery images={property.images} />
      <div className='mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-primary'>
              Illustrative sample listing
            </span>
            <VerificationBadge isSample status={property.verificationStatus} />
          </div>
          <h1 className='mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl'>
            {property.title}
          </h1>
          <PropertyLocation location={property.location} />
          <PropertyPrice
            amount={property.priceNaira}
            className='mt-4 block text-2xl font-bold text-brand-primary'
          />
          <div className='mt-7'>
            <PropertyFeatures features={property.features} />
          </div>
          <section className='mt-8 border-t border-border pt-6'>
            <h2 className='font-semibold text-text-primary'>About this home</h2>
            <p className='mt-2 text-sm leading-7 text-text-muted'>{property.description}</p>
            <h3 className='mt-5 text-sm font-semibold text-text-primary'>Full location</h3>
            <p className='mt-2 text-sm leading-6 text-text-muted'>
              {property.location.address}, {property.location.district}, {property.location.city},{' '}
              {property.location.state}, {property.location.country}
            </p>
          </section>
          <section className='mt-8 border-t border-border pt-6'>
            <h2 className='font-semibold text-text-primary'>Listing information</h2>
            <dl className='mt-3 grid gap-3 text-sm sm:grid-cols-2'>
              <div>
                <dt className='text-text-muted'>Reference</dt>
                <dd className='mt-0.5 font-medium text-text-primary'>
                  {property.listingInfo.reference}
                </dd>
              </div>
              <div>
                <dt className='text-text-muted'>Listed</dt>
                <dd className='mt-0.5 font-medium text-text-primary'>{listedAt}</dd>
              </div>
              <div>
                <dt className='text-text-muted'>Property type</dt>
                <dd className='mt-0.5 font-medium text-text-primary'>
                  {PROPERTY_TYPE_LABELS[property.propertyType]}
                </dd>
              </div>
              <div>
                <dt className='text-text-muted'>Transaction</dt>
                <dd className='mt-0.5 font-medium capitalize text-text-primary'>
                  For {property.listingInfo.transactionType}
                </dd>
              </div>
            </dl>
          </section>
        </div>
        <aside className='h-fit rounded-card border border-border bg-white p-5 shadow-card lg:sticky lg:top-6'>
          <p className='text-sm font-semibold text-text-primary'>Interested in this property?</p>
          <p className='mt-2 text-sm leading-6 text-text-muted'>
            Start a property-specific conversation. Demo listings do not connect to a real owner or
            agent.
          </p>
          <Button
            className='mt-4 w-full'
            onClick={() =>
              navigate(`/dashboard/messages?propertyId=${encodeURIComponent(property.id)}`)
            }
            type='button'
          >
            Contact owner or agent
          </Button>
          <p className='mt-3 inline-flex items-start gap-1.5 text-xs leading-5 text-text-muted'>
            <BadgeInfo aria-hidden='true' className='mt-0.5 shrink-0' size={14} />
            This sample is not a real offer and has not been independently verified.
          </p>
        </aside>
      </div>
    </article>
  );
}
