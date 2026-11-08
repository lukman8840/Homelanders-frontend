import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Container } from '../../../components/ui/Container';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PropertyDetails } from '../components/PropertyDetails';
import { findSampleProperty } from '../data/sampleProperties';

export function PropertyDetailsPage() {
  const { id } = useParams();
  const property = findSampleProperty(id);

  if (!property) {
    return (
      <Container className='py-16'>
        <EmptyState
          description='This sample listing is not in the current demonstration set.'
          title='Sample listing not found'
          action={
            <Link
              className='inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline'
              to='/properties'
            >
              <ArrowLeft aria-hidden='true' size={15} />
              Browse sample listings
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className='py-10 sm:py-14'>
      <Link
        className='mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline'
        to='/properties'
      >
        <ArrowLeft aria-hidden='true' size={16} />
        All sample listings
      </Link>
      <PropertyDetails property={property} />
    </Container>
  );
}
