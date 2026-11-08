import {
  House,
  IdCard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  UserRoundCheck,
  UserRound,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BrandMark } from '../../components/common/BrandMark';
import { Container } from '../../components/ui/Container';
import { useAuth } from '../../features/auth/context/useAuth';

const dashboardLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/properties', label: 'My properties', icon: House, end: false },
  { to: '/dashboard/properties/new', label: 'Add property', icon: Plus, end: true },
  { to: '/dashboard/kyc', label: 'Identity verification', icon: IdCard, end: false },
  {
    to: '/dashboard/agent-application',
    label: 'Agent application',
    icon: UserRoundCheck,
    end: false,
  },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare, end: false },
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound, end: false },
];

export function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Unable to sign out right now.');
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-border bg-white'>
        <Container className='flex h-[4.5rem] items-center justify-between'>
          <NavLink aria-label='HomeLander home' to='/'>
            <BrandMark />
          </NavLink>
          <NavLink className='text-sm font-medium text-brand-primary hover:underline' to='/'>
            Back to marketplace
          </NavLink>
        </Container>
      </header>
      <Container className='grid gap-6 py-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10 md:py-10'>
        <aside aria-label='Dashboard navigation' className='md:sticky md:top-6 md:self-start'>
          {logoutError ? (
            <p className='mb-3 text-xs leading-5 text-red-700' role='alert'>
              {logoutError}
            </p>
          ) : null}
          <nav className='flex gap-2 overflow-x-auto rounded-card border border-border bg-white p-2 md:flex-col md:p-3'>
            {dashboardLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-2.5 rounded-control px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-brand-soft text-brand-primary'
                      : 'text-text-muted hover:bg-background hover:text-text-primary'
                  }`
                }
                end={end}
                key={to}
                to={to}
              >
                <Icon aria-hidden='true' size={17} />
                {label}
              </NavLink>
            ))}
            <button
              className='inline-flex shrink-0 items-center gap-2.5 rounded-control px-3 py-2.5 text-left text-sm font-medium text-text-muted hover:bg-background hover:text-text-primary'
              onClick={() => void handleLogout()}
              type='button'
            >
              <LogOut aria-hidden='true' size={17} />
              Logout
            </button>
          </nav>
        </aside>
        <main className='min-w-0'>
          <Outlet />
        </main>
      </Container>
    </div>
  );
}
