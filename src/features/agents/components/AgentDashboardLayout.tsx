import {
  BadgeCheck,
  ClipboardCheck,
  ClipboardList,
  Coins,
  LayoutDashboard,
  UserRound,
} from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Container } from '../../../components/ui/Container';

const links = [
  { to: '/agent/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  {
    to: '/agent/dashboard/properties',
    label: 'Assigned Properties',
    icon: ClipboardList,
    end: true,
  },
  { to: '/agent/dashboard/tasks', label: 'Verification Tasks', icon: ClipboardCheck, end: true },
  { to: '/agent/dashboard/completed', label: 'Completed Tasks', icon: BadgeCheck, end: true },
  { to: '/agent/dashboard/commissions', label: 'Commissions', icon: Coins, end: true },
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound, end: false },
];

export function AgentDashboardLayout() {
  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-border bg-white'>
        <Container className='flex h-[4.5rem] items-center justify-between'>
          <Link className='font-semibold text-brand-primary' to='/agent/dashboard'>
            HomeLander · Agent workspace
          </Link>
          <Link className='text-sm font-medium text-brand-primary hover:underline' to='/dashboard'>
            User dashboard
          </Link>
        </Container>
      </header>
      <Container className='grid gap-6 py-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10 md:py-10'>
        <aside aria-label='Agent navigation' className='md:sticky md:top-6 md:self-start'>
          <nav className='flex gap-2 overflow-x-auto rounded-card border border-border bg-white p-2 md:flex-col md:p-3'>
            {links.map(({ to, label, icon: Icon, end }) => (
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
          </nav>
        </aside>
        <main className='min-w-0'>
          <Outlet />
        </main>
      </Container>
    </div>
  );
}
