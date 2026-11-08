import { MapPin } from 'lucide-react';
import type { PropertyLocation as PropertyLocationData } from '../types/property';

interface PropertyLocationProps {
  location: PropertyLocationData;
}

export function PropertyLocation({ location }: PropertyLocationProps) {
  return (
    <span className='inline-flex items-center gap-1.5 text-sm text-text-muted'>
      <MapPin aria-hidden='true' size={15} />
      {location.district}, {location.city}
    </span>
  );
}
