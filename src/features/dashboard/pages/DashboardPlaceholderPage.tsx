import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';

interface DashboardPlaceholderPageProps {
  title: string;
  description: string;
}

export function DashboardPlaceholderPage({ title, description }: DashboardPlaceholderPageProps) {
  return (
    <section>
      <p className='text-sm font-semibold text-brand-primary'>Workspace preview</p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>{title}</h1>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-text-muted'>{description}</p>
      <Card className='mt-7 p-5 sm:p-7'>
        <h2 className='font-semibold text-text-primary'>Dashboard features are not enabled</h2>
        <p className='mt-2 text-sm leading-6 text-text-muted'>
          This is a layout and route scaffold only. Authentication, personal data, and property
          management will be connected after the API contracts are agreed.
        </p>
        <Link
          className='mt-4 inline-flex text-sm font-semibold text-brand-primary hover:underline'
          to='/'
        >
          Return to the marketplace
        </Link>
      </Card>
    </section>
  );
}
