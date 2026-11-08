import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { Card } from '../../../components/ui/Card';
import { AgentStatusBadge } from '../../agents/components/AgentStatusBadge';
import { verificationService } from '../../agents/services/configuredAgentServices';
import type { AgentPropertyTask } from '../../agents/types/agent';
import { formatAgentDate, formatAgentNaira } from '../../agents/utils/formatAgentDate';

export function VerificationDetailsPage() {
  const { taskId } = useParams();
  const location = useLocation();
  const routeState =
    typeof location.state === 'object' && location.state !== null ? location.state : null;
  const [task, setTask] = useState<AgentPropertyTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    verificationService
      .getVerification(taskId ?? '')
      .then((result) => {
        if (active) setTask(result);
      })
      .catch((loadError: unknown) => {
        if (active)
          setError(
            loadError instanceof Error ? loadError.message : 'Unable to load verification details.',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [taskId]);

  if (loading) {
    return (
      <div className='flex justify-center py-16'>
        <LoadingIndicator label='Loading verification result' />
      </div>
    );
  }
  if (error || !task) {
    return (
      <div className='grid gap-4'>
        {error ? (
          <p className='text-sm text-red-700' role='alert'>
            {error}
          </p>
        ) : null}
        <EmptyState
          action={
            <Link
              className='text-sm font-semibold text-brand-primary'
              to='/agent/dashboard/properties'
            >
              Back to assigned properties
            </Link>
          }
          description='This verification result is not available for your account.'
          title='Verification not found'
        />
      </div>
    );
  }

  return (
    <section>
      <Link
        className='inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline'
        to={`/agent/dashboard/properties/${task.id}`}
      >
        <ArrowLeft aria-hidden='true' size={16} />
        Back to assigned property
      </Link>
      {routeState && 'reportFeedback' in routeState ? (
        <p
          className='mt-5 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-primary'
          role='status'
        >
          {routeState.reportFeedback === 'demo'
            ? 'Inspection report recorded in local demo only. It was not uploaded to the backend.'
            : 'Inspection report submitted. The final verification decision remains pending.'}
        </p>
      ) : null}
      <p className='mt-5 text-sm font-semibold text-brand-primary'>Verification result</p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
        {task.propertyTitle}
      </h1>
      <p className='mt-2 text-sm text-text-muted'>
        {task.address}, {task.neighbourhood}, {task.city}, {task.state}
      </p>
      <p className='mt-2 text-sm font-semibold text-text-primary'>
        {task.propertyType} · {formatAgentNaira(task.askingPriceNaira)}
      </p>

      <Card className='mt-6 border-brand-secondary/30 bg-brand-soft p-5 sm:p-6'>
        <h2 className='font-semibold text-text-primary'>Agent inspection is not final approval</h2>
        <p className='mt-2 text-sm leading-6 text-text-muted'>
          An agent records physical inspection findings. Only the authorized backend/admin workflow
          can approve and verify the property.
        </p>
      </Card>
      <div className='mt-4 grid gap-4 sm:grid-cols-2'>
        <Card className='p-5 sm:p-6'>
          <h2 className='font-semibold text-text-primary'>Document review</h2>
          <p className='mt-2 text-sm text-text-muted'>{task.documentReviewStatus}</p>
          <p className='mt-2 text-xs leading-5 text-text-muted'>
            Private ownership document contents are not surfaced in this agent result view.
          </p>
        </Card>
        <Card className='p-5 sm:p-6'>
          <h2 className='font-semibold text-text-primary'>Physical inspection</h2>
          <p className='mt-2 text-sm text-text-muted'>
            {task.inspectionStatus}
            {task.inspectionDate ? ` · ${formatAgentDate(task.inspectionDate)}` : ''}
          </p>
          {task.inspectionFindings ? (
            <p className='mt-2 text-sm leading-6 text-text-muted'>{task.inspectionFindings}</p>
          ) : null}
        </Card>
        <Card className='p-5 sm:p-6'>
          <h2 className='font-semibold text-text-primary'>Agent notes</h2>
          <p className='mt-2 text-sm leading-6 text-text-muted'>
            {task.agentNotes ?? 'No agent notes have been submitted.'}
          </p>
        </Card>
        <Card className='p-5 sm:p-6'>
          <h2 className='font-semibold text-text-primary'>Admin decision</h2>
          <p className='mt-2 text-sm leading-6 text-text-muted'>
            {task.adminDecision ?? 'No admin decision is available yet.'}
          </p>
        </Card>
      </div>
      <Card className='mt-4 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
        <div>
          <h2 className='font-semibold text-text-primary'>Final property verification</h2>
          <p className='mt-1 text-sm text-text-muted'>
            Assignment date: {formatAgentDate(task.assignedAt)}
          </p>
        </div>
        <AgentStatusBadge kind='verification' rawStatus={task.rawFinalStatus} />
      </Card>
    </section>
  );
}
