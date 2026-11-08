import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { Card } from '../../../components/ui/Card';
import { useAgentDashboard } from '../hooks/useAgentDashboard';
import { AgentStatusBadge } from '../components/AgentStatusBadge';
import { formatAgentDate, formatAgentNaira } from '../utils/formatAgentDate';

type View = 'all' | 'open' | 'completed';

export function AgentTasksPage({ view = 'all' }: { view?: View }) {
  const { summary, loading, error, reload, mode } = useAgentDashboard();
  const location = useLocation();
  const state =
    typeof location.state === 'object' && location.state !== null ? location.state : null;
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (state && 'taskFeedback' in state) {
      setFeedback(String(state.taskFeedback));
    }
  }, [state]);

  const tasks = useMemo(() => {
    const all = summary?.tasks ?? [];
    if (view === 'open')
      return all.filter(
        (task) => task.taskStatus !== 'completed' && task.taskStatus !== 'cancelled',
      );
    if (view === 'completed') return all.filter((task) => task.taskStatus === 'completed');
    return all;
  }, [summary, view]);

  const title =
    view === 'completed'
      ? 'Completed tasks'
      : view === 'open'
        ? 'Verification tasks'
        : 'Assigned properties';

  return (
    <section>
      <p className='text-sm font-semibold text-brand-primary'>
        Agent workspace{mode === 'mock' ? ' · demo' : ''}
      </p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>{title}</h1>
      <p className='mt-2 text-sm leading-6 text-text-muted'>
        Agent inspections are reports for review. Completing a task does not approve or verify a
        property.
      </p>
      {feedback ? (
        <p
          className='mt-4 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-primary'
          role='status'
        >
          {feedback}
        </p>
      ) : null}
      {error ? (
        <div className='mt-5 flex items-center justify-between gap-3' role='alert'>
          <p className='text-sm text-red-700'>{error}</p>
          <button
            className='text-sm font-semibold text-brand-primary'
            onClick={() => void reload()}
            type='button'
          >
            Try again
          </button>
        </div>
      ) : null}
      {loading ? (
        <div className='flex justify-center py-16'>
          <LoadingIndicator label='Loading assigned properties' />
        </div>
      ) : tasks.length ? (
        <ul className='mt-5 grid gap-4'>
          {tasks.map((task) => (
            <li key={task.id}>
              <Card className='p-5 sm:p-6'>
                <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
                  <div>
                    <Link
                      className='text-lg font-semibold text-text-primary hover:text-brand-primary'
                      to={`/agent/dashboard/properties/${task.id}`}
                    >
                      {task.propertyTitle}
                    </Link>
                    <p className='mt-1 text-sm text-text-muted'>
                      {task.address}, {task.neighbourhood}, {task.city}, {task.state}
                    </p>
                    <p className='mt-2 text-sm text-text-primary'>
                      {task.propertyType} · {formatAgentNaira(task.askingPriceNaira)}
                    </p>
                    <p className='mt-1 text-xs text-text-muted'>
                      Assigned {formatAgentDate(task.assignedAt)}
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <AgentStatusBadge kind='task' rawStatus={task.rawTaskStatus} />
                    <AgentStatusBadge kind='verification' rawStatus={task.rawFinalStatus} />
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <div className='mt-5'>
          <EmptyState
            description={
              view === 'completed'
                ? 'Completed inspection reports will appear here.'
                : 'No tasks are currently assigned.'
            }
            title={view === 'completed' ? 'No completed tasks' : 'No assigned properties'}
          />
        </div>
      )}
    </section>
  );
}

export function AgentCommissionsPage() {
  return (
    <section>
      <p className='text-sm font-semibold text-brand-primary'>Agent workspace</p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>Commissions</h1>
      <Card className='mt-6 p-6'>
        <p className='text-sm leading-6 text-text-muted'>
          Commission terms and payment workflows are not part of this phase. No earnings or payment
          information is shown.
        </p>
      </Card>
    </section>
  );
}
