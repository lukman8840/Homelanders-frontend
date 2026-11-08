import { Link } from 'react-router-dom';
import { formatMessagePrice } from '../utils/formatMessageTime';
import type { ConversationProperty } from '../types/messaging';

export function PropertyConversationCard({ property }: { property: ConversationProperty }) {
  return (
    <Link
      className='flex min-w-0 items-center gap-3 rounded-control border border-border bg-white p-2 hover:bg-background'
      to={`/properties/${encodeURIComponent(property.id)}`}
    >
      <img
        alt=''
        className='size-14 shrink-0 rounded-control object-cover'
        src={property.imageUrl}
      />
      <span className='min-w-0'>
        <span className='block truncate text-sm font-semibold text-text-primary'>
          {property.title}
        </span>
        <span className='mt-0.5 block truncate text-xs text-text-muted'>{property.location}</span>
        <span className='mt-0.5 block text-xs font-semibold text-brand-primary'>
          {formatMessagePrice(property.askingPriceNaira)}
        </span>
      </span>
      <span className='ml-auto shrink-0 text-xs font-semibold text-brand-primary'>View</span>
    </Link>
  );
}
