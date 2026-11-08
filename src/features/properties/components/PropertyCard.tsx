import { Bath, BedDouble, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { PROPERTY_TYPE_LABELS, type Property } from '../types/property';
import { PropertyImage } from './PropertyImage';
import { PropertyLocation } from './PropertyLocation';
import { PropertyPrice } from './PropertyPrice';
import { VerificationBadge } from './VerificationBadge';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className='overflow-hidden transition-shadow hover:shadow-lg'>
      <Link
        aria-label={`View sample listing: ${property.title}, ${property.location.district}, ${property.location.city}`}
        className='group block'
        to={`/properties/${property.id}`}
      >
        <div className='relative'>
          <PropertyImage
            alt={`Illustrative sample image for ${property.title} in ${property.location.district}, ${property.location.city}`}
            className='aspect-[4/3] rounded-none'
            src={property.images[0]?.src ?? ''}
          />
          <span className='absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-text-primary shadow-sm'>
            Sample listing
          </span>
          <span className='absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/95 text-brand-primary shadow-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'>
            <MoveUpRight aria-hidden='true' size={16} />
          </span>
        </div>
        <div className='p-4 sm:p-5'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <p className='text-xs font-medium text-text-muted'>
              {PROPERTY_TYPE_LABELS[property.propertyType]}
            </p>
            <VerificationBadge isSample status={property.verificationStatus} />
          </div>
          <h3 className='mt-3 text-lg font-semibold tracking-tight text-text-primary group-hover:text-brand-primary'>
            {property.title}
          </h3>
          <PropertyLocation location={property.location} />
          <div className='mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-text-muted'>
            <span className='inline-flex items-center gap-1.5'>
              <BedDouble aria-hidden='true' size={15} />
              {property.features.bedrooms} beds
            </span>
            <span className='inline-flex items-center gap-1.5'>
              <Bath aria-hidden='true' size={15} />
              {property.features.bathrooms} baths
            </span>
            <PropertyPrice
              amount={property.priceNaira}
              className='ml-auto text-sm font-bold text-brand-primary'
            />
          </div>
        </div>
      </Link>
    </Card>
  );
}
