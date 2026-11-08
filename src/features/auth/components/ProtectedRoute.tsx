import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import type { PropsWithChildren, ReactNode } from 'react';
import { Button } from '../../../components/ui/Button';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { useAuth } from '../context/useAuth';
import type { AuthRole } from '../types/auth';
import { AuthFeedback } from './AuthFeedback';

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { status, error, refreshSession } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className='flex justify-center py-16'>
        <LoadingIndicator label='Checking your sign-in status' />
      </div>
    );
  }

  if (status === 'authenticated') {
    return children ?? <Outlet />;
  }

  if (status === 'error') {
    return (
      <div className='mx-auto grid max-w-lg gap-4 px-5 py-12'>
        <AuthFeedback kind='error'>{error ?? 'Unable to check your sign-in status.'}</AuthFeedback>
        <Button className='justify-self-start' onClick={() => void refreshSession()} type='button'>
          Try again
        </Button>
      </div>
    );
  }

  if (status === 'anonymous') {
    return <Navigate replace state={{ from: location }} to='/login' />;
  }

  return (
    <div className='mx-auto grid max-w-lg gap-4 px-5 py-12'>
      <AuthFeedback kind='info'>
        This area requires an account. Sign-in is not connected until the authentication API is
        configured.
      </AuthFeedback>
      <Link className='text-sm font-semibold text-brand-primary hover:underline' to='/login'>
        Go to sign in
      </Link>
    </div>
  );
}

interface RoleBasedRouteProps extends PropsWithChildren {
  roles: readonly AuthRole[];
}

function RoleAccess({ roles, children }: RoleBasedRouteProps) {
  const { user } = useAuth();
  const hasAccess = user?.roles.some((role) => roles.includes(role)) ?? false;

  if (!hasAccess) {
    return (
      <div className='mx-auto max-w-lg px-5 py-12'>
        <AuthFeedback kind='error'>
          Your account does not have permission to view this page.
        </AuthFeedback>
      </div>
    );
  }

  return children ?? <Outlet />;
}

export function RoleBasedRoute({ roles, children }: RoleBasedRouteProps) {
  return (
    <ProtectedRoute>
      <RoleAccess roles={roles}>{children}</RoleAccess>
    </ProtectedRoute>
  );
}
