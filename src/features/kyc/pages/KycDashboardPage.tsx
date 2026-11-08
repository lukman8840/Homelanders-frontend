import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { useLocation } from 'react-router-dom';
import { DashboardLinkButton } from '../../dashboard/components/DashboardLinkButton';
import { KycProgress } from '../components/KycProgress';
import { KycStatusBadge } from '../components/KycStatusBadge';
import { useKycStatus } from '../hooks/useKycStatus';
import { getKycStatus, canSubmitKyc } from '../utils/kycStatus';
import { formatKycDate } from '../utils/formatKycDate';

export function KycDashboardPage() {
  const location = useLocation();
  const routeState =
    typeof location.state === 'object' && location.state !== null ? location.state : null;
  const { record, loading, error, reload, mode } = useKycStatus();
  const status = record ? getKycStatus(record.rawStatus) : null;
  const canSubmit = status?.status ? canSubmitKyc(status.status) : false;

  return (
    <section>
      <p className='text-sm font-semibold text-brand-primary'>
        Account security{mode === 'mock' ? ' · demo data' : ''}
      </p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
        Identity verification
      </h1>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-text-muted'>
        Check your identity verification status and any review feedback. This process is separate
        from verification of a property listing.
      </p>

      {error ? (
        <div className='mt-6 flex flex-wrap items-center justify-between gap-3' role='alert'>
          <p className='text-sm text-red-700'>{error}</p>
          <Button onClick={() => void reload()} type='button' variant='outline'>
            Try again
          </Button>
        </div>
      ) : null}
      {routeState && 'submissionFeedback' in routeState ? (
        <p
          className='mt-5 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-primary'
          role='status'
        >
          {routeState.submissionFeedback === 'demo-submitted'
            ? 'Demo submission recorded in memory only. Your identity information and document were not uploaded or saved.'
            : 'Your identity verification was submitted for review.'}
        </p>
      ) : null}
      {loading ? (
        <div className='flex justify-center py-16'>
          <LoadingIndicator label='Loading identity verification status' />
        </div>
      ) : record && status ? (
        <>
          <Card className='mt-6 p-5 sm:p-7'>
            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
              <div>
                <p className='text-sm text-text-muted'>Current status</p>
                <div className='mt-2'>
                  <KycStatusBadge rawStatus={record.rawStatus} />
                </div>
              </div>
              {canSubmit ? (
                <DashboardLinkButton to='/dashboard/kyc/submit'>
                  {status.status === 'rejected' ? 'Resubmit verification' : 'Start verification'}
                  <ArrowRight aria-hidden='true' size={16} />
                </DashboardLinkButton>
              ) : null}
            </div>

            {status.status ? (
              <div className='mt-7'>
                <h2 className='mb-3 text-sm font-semibold text-text-primary'>
                  Verification progress
                </h2>
                <KycProgress status={status.status} />
              </div>
            ) : null}

            <dl className='mt-7 grid gap-4 border-t border-border pt-5 sm:grid-cols-2'>
              <DateDetail label='Date submitted' value={formatKycDate(record.submittedAt)} />
              <DateDetail label='Last updated' value={formatKycDate(record.updatedAt)} />
            </dl>
          </Card>

          {record.adminFeedback ? (
            <Card className='mt-4 p-5 sm:p-6'>
              <h2 className='font-semibold text-text-primary'>Admin feedback</h2>
              <p className='mt-2 text-sm leading-6 text-text-muted'>{record.adminFeedback}</p>
            </Card>
          ) : null}

          {record.rejectionReason ? (
            <Card className='mt-4 border-red-200 bg-red-50 p-5 sm:p-6'>
              <h2 className='font-semibold text-red-900'>Why verification was rejected</h2>
              <p className='mt-2 text-sm leading-6 text-red-800'>{record.rejectionReason}</p>
              {canSubmit ? (
                <p className='mt-2 text-sm leading-6 text-red-800'>
                  Correct the information or provide a clearer document before resubmitting.
                </p>
              ) : null}
            </Card>
          ) : null}

          {status.status === 'approved' ? (
            <Card className='mt-4 flex gap-3 p-5 sm:p-6'>
              <ShieldCheck
                aria-hidden='true'
                className='mt-0.5 shrink-0 text-brand-primary'
                size={20}
              />
              <p className='text-sm leading-6 text-text-muted'>
                Your identity verification is approved. Editing an approved submission is disabled
                here; contact support if your account needs an update.
              </p>
            </Card>
          ) : null}

          {mode === 'mock' ? (
            <p className='mt-4 text-xs leading-5 text-text-muted'>
              This status is illustrative local demo data. Identity information and documents are
              not saved or sent to a backend.
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

function DateDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className='text-xs font-medium text-text-muted'>{label}</dt>
      <dd className='mt-1 text-sm text-text-primary'>{value}</dd>
    </div>
  );
}
