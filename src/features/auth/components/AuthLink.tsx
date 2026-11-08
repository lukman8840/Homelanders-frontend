import { Link } from 'react-router-dom';

interface AuthLinkProps {
  to: string;
  children: string;
}

export function AuthLink({ to, children }: AuthLinkProps) {
  return (
    <Link className='font-semibold text-brand-primary hover:underline' to={to}>
      {children}
    </Link>
  );
}
