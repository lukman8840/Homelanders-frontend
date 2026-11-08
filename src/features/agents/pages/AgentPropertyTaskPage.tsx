import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck, FileLock2 } from 'lucide-react';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { agentDashboardService } from '../services/configuredAgentServices';
import type { AgentPropertyTask } from '../types/agent';
import { AgentStatusBadge } from '../components/AgentStatusBadge';
import { formatAgentDate, formatAgentNaira } from '../utils/formatAgentDate';

export function AgentPropertyTaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<AgentPropertyTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTask = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTask(await agentDashboardService.getTask(taskId ?? ''));
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Unable to load this assigned task.',
      );
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    void loadTask();
  }, [loadTask]);

  const updateStatus = async (status: AgentPropertyTask['taskStatus']) => {
    setSaving(true);
    setError(null);
    try {
      setTask(await agentDashboardService.updateTaskStatus(taskId ?? '', status));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update this task.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center py-16'>
        <LoadingIndicator label='Loading assigned property' />
      </div>
    );
  }
  if (error && !task) {
    return (
      <section>
        <p className='text-sm text-red-700' role='alert'>
          {error}
        </p>
        <Button className='mt-4' onClick={() => void loadTask()} type='button' variant='outline'>
          Try again
        </Button>
      </section>
    );
  }
  if (!task) {
    return (
      <EmptyState
        action={
          <Link className='font-semibold text-brand-primary' to='/agent/dashboard/properties'>
            Back to assignments
          </Link>
        }
        description='This task may no longer be assigned to your account.'
        title='Assigned task not found'
      />
    );
  }

  const canAccept = task.taskStatus === 'assigned';
  const canStart = task.taskStatus === 'accepted';
  const canInspect = task.taskStatus === 'accepted' || task.taskStatus === 'in_progress';

  return (
    <section>
      <Link
        className='inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline'
        to='/agent/dashboard/properties'
      >
        <ArrowLeft aria-hidden='true' size={16} />
        Back to assigned properties
      </Link>
      <p className='mt-5 text-sm font-semibold text-brand-primary'>Assignment · demo</p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
        {task.propertyTitle}
      </h1>
      <div className='mt-3 flex flex-wrap gap-2'>
        <AgentStatusBadge kind='task' rawStatus={task.rawTaskStatus} />
        <AgentStatusBadge kind='verification' rawStatus={task.rawFinalStatus} />
      </div>
      {error ? (
        <p className='mt-4 text-sm text-red-700' role='alert'>
          {error}
        </p>
      ) : null}
      <div className='mt-6 grid gap-4 lg:grid-cols-2'>
        <Card className='p-5 sm:p-6'>
          <h2 className='font-semibold text-text-primary'>Property details</h2>
          <dl className='mt-4 grid gap-4 sm:grid-cols-2'>
            <Detail label='Property type' value={task.propertyType} />
            <Detail label='Asking price' value={formatAgentNaira(task.askingPriceNaira)} />
            <Detail label='Address' value={task.address} />
            <Detail label='Area' value={`${task.neighbourhood}, ${task.city}, ${task.state}`} />
            <Detail label='Assigned date' value={formatAgentDate(task.assignedAt)} />
          </dl>
        </Card>
        <Card className='p-5 sm:p-6'>
          <h2 className='font-semibold text-text-primary'>Inspection instructions</h2>
          <p className='mt-2 text-sm leading-6 text-text-muted'>{task.inspectionInstructions}</p>
          <div className='mt-5 rounded-control border border-border p-4'>
            <div className='flex items-center gap-2 font-semibold text-text-primary'>
              <FileLock2 aria-hidden='true' size={17} />
              Ownership documents
            </div>
            <p className='mt-2 text-sm leading-6 text-text-muted'>
              Document status: {task.documentReviewStatus}. Private ownership documents are not
              displayed or linked here. Access must be granted by an authorized backend workflow.
            </p>
          </div>
        </Card>
      </div>
      <Card className='mt-4 p-5 sm:p-6'>
        <h2 className='font-semibold text-text-primary'>Task actions</h2>
        <p className='mt-2 text-sm leading-6 text-text-muted'>
          Submitting an inspection report completes the agent task only. The final verification
          decision remains with the authorized admin/backend process.
        </p>
        <div className='mt-4 flex flex-wrap gap-3'>
          {canAccept ? (
            <Button disabled={saving} onClick={() => void updateStatus('accepted')} type='button'>
              {saving ? 'Accepting…' : 'Accept task'}
            </Button>
          ) : null}
          {canStart ? (
            <Button
              disabled={saving}
              onClick={() => void updateStatus('in_progress')}
              type='button'
            >
              {saving ? 'Updating…' : 'Start inspection'}
            </Button>
          ) : null}
          {canInspect ? (
            <Button
              onClick={() => navigate(`/agent/dashboard/tasks/${task.id}/inspection`)}
              type='button'
            >
              <ClipboardCheck aria-hidden='true' size={17} />
              Submit inspection report
            </Button>
          ) : null}
          <Button
            onClick={() => navigate(`/agent/dashboard/verification/${task.id}`)}
            type='button'
            variant='outline'
          >
            View verification result
          </Button>
        </div>
      </Card>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className='text-xs font-medium text-text-muted'>{label}</dt>
      <dd className='mt-1 text-sm text-text-primary'>{value}</dd>
    </div>
  );
}
