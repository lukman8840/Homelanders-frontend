import { Link, Outlet } from 'react-router-dom';
import { BrandMark } from '../../components/common/BrandMark';
import { Container } from '../../components/ui/Container';

export function AuthLayout() {
  return (
    <div className='min-h-screen bg-background py-8 sm:py-12'>
      <Container className='flex flex-col items-center'>
        <Link aria-label='HomeLander home' to='/'>
          <BrandMark />
        </Link>
        <main className='mt-8 w-full max-w-lg sm:mt-12'>
          <Outlet />
        </main>
        <p className='mt-8 text-center text-xs text-text-muted'>
          Authentication requests are not connected until the backend API contract is configured.
        </p>
      </Container>
    </div>
  );
}
