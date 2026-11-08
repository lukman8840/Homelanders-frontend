import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';

export function NotFoundPage() {
  return (
    <Container className='flex flex-col items-start py-24'>
      <p className='text-sm font-semibold text-brand-primary'>404 · Page not found</p>
      <h1 className='mt-3 text-4xl font-semibold tracking-tight text-text-primary'>
        This is not the place.
      </h1>
      <p className='mt-3 max-w-md text-text-muted'>
        This page may have moved. Find your way back home.
      </p>
      <Link
        className='mt-7 inline-flex min-h-11 items-center rounded-control bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover'
        to='/'
      >
        Back to HomeLander
      </Link>
    </Container>
  );
}
