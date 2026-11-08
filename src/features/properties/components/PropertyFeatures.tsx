import { Bath, BedDouble, CarFront, Ruler } from 'lucide-react';
import type { PropertyFeatures as PropertyFeaturesData } from '../types/property';

interface PropertyFeaturesProps {
  features: PropertyFeaturesData;
}

const numberFormatter = new Intl.NumberFormat('en-NG');

export function PropertyFeatures({ features }: PropertyFeaturesProps) {
  const items = [
    { icon: BedDouble, label: 'Bedrooms', value: features.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: features.bathrooms },
    { icon: CarFront, label: 'Parking spaces', value: features.parkingSpaces },
    {
      icon: Ruler,
      label: 'Floor area',
      value: `${numberFormatter.format(features.floorAreaSqm)} m²`,
    },
  ];

  return (
    <div>
      <h2 className='font-semibold text-text-primary'>Property features</h2>
      <dl className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {items.map(({ icon: Icon, label, value }) => (
          <div className='rounded-control border border-border bg-white p-3' key={label}>
            <dt className='inline-flex items-center gap-1.5 text-xs text-text-muted'>
              <Icon aria-hidden='true' size={15} />
              {label}
            </dt>
            <dd className='mt-1 text-sm font-semibold text-text-primary'>{value}</dd>
          </div>
        ))}
      </dl>
      {features.amenities.length ? (
        <ul aria-label='Amenities' className='mt-4 flex flex-wrap gap-2'>
          {features.amenities.map((amenity) => (
            <li
              className='rounded-full border border-border bg-white px-3 py-1 text-xs text-text-muted'
              key={amenity}
            >
              {amenity}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
