import { BadgeCheck, ClipboardCheck, Clock3, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { AgentStatusBadge } from '../components/AgentStatusBadge';
import { useAgentDashboard } from '../hooks/useAgentDashboard';
import { formatAgentDate } from '../utils/formatAgentDate';
import type { AgentPropertyTask } from '../types/agent';

export function AgentDashboardPage() {
  const { summary, loading, error, reload, mode } = useAgentDashboard();
  const tasks = summary?.tasks ?? [];
  const pending = tasks.filter((task) =>
    ['assigned', 'accepted', 'in_progress'].includes(task.taskStatus),
  ).length;
  const completed = tasks.filter((task) => task.taskStatus === 'completed').length;
  const approved = tasks.filter((task) => task.finalStatus === 'verified').length;
  const rejected = tasks.filter((task) => task.finalStatus === 'rejected').length;

  return (
    <section>
      <p className='text-sm font-semibold text-brand-primary'>
        Agent workspace{mode === 'mock' ? ' · demo data' : ''}
      </p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>Welcome back</h1>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-text-muted'>
        Review assigned tasks, record physical inspections, and track final verification decisions.
      </p>
      {error ? (
        <div className='mt-5 flex flex-wrap items-center justify-between gap-3' role='alert'>
          <p className='text-sm text-red-700'>{error}</p>
          <button
            className='rounded-control border border-border bg-white px-4 py-2 text-sm font-semibold'
            onClick={() => void reload()}
            type='button'
          >
            Try again
          </button>
        </div>
      ) : null}
      {loading ? (
        <div className='flex justify-center py-16'>
          <LoadingIndicator label='Loading agent dashboard' />
        </div>
      ) : (
        <>
          <div className='mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            <Summary icon={Clock3} label='Pending tasks' value={pending} />
            <Summary icon={ClipboardCheck} label='Completed inspections' value={completed} />
            <Summary icon={BadgeCheck} label='Approved verifications' value={approved} />
            <Summary icon={XCircle} label='Rejected verifications' value={rejected} />
          </div>
          <Card className='mt-7 p-5 sm:p-7'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h2 className='text-lg font-semibold text-text-primary'>Assigned property tasks</h2>
                <p className='mt-1 text-sm text-text-muted'>
                  Inspection work awaiting or recently completed
                </p>
              </div>
              <Link
                className='text-sm font-semibold text-brand-primary hover:underline'
                to='/agent/dashboard/properties'
              >
                View assigned
              </Link>
            </div>
            {tasks.length ? (
              <ul className='mt-5 divide-y divide-border'>
                {tasks.slice(0, 4).map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </ul>
            ) : (
              <p className='mt-5 text-sm text-text-muted'>No properties have been assigned.</p>
            )}
          </Card>
          <Card className='mt-4 p-5 sm:p-7'>
            <h2 className='text-lg font-semibold text-text-primary'>Recent activity</h2>
            {summary?.recentActivity.length ? (
              <ul className='mt-4 grid gap-3'>
                {summary.recentActivity.slice(0, 5).map((activity) => (
                  <li
                    className='flex flex-col justify-between gap-1 text-sm sm:flex-row'
                    key={activity.id}
                  >
                    <span className='text-text-primary'>{activity.description}</span>
                    <time className='shrink-0 text-xs text-text-muted'>
                      {formatAgentDate(activity.date)}
                    </time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='mt-3 text-sm text-text-muted'>No recent activity.</p>
            )}
          </Card>
          {mode === 'mock' ? (
            <p className='mt-4 text-xs leading-5 text-text-muted'>
              Sample tasks are illustrative. Agent access must be authorized by the backend.
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

function TaskRow({ task }: { task: AgentPropertyTask }) {
  return (
    <li className='flex flex-col justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center'>
      <div>
        <Link
          className='font-semibold text-text-primary hover:text-brand-primary'
          to={`/agent/dashboard/properties/${task.id}`}
        >
          {task.propertyTitle}
        </Link>
        <p className='mt-1 text-sm text-text-muted'>
          {task.neighbourhood}, {task.city} · Assigned {formatAgentDate(task.assignedAt)}
        </p>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <AgentStatusBadge kind='task' rawStatus={task.rawTaskStatus} />
        <AgentStatusBadge kind='verification' rawStatus={task.rawFinalStatus} />
      </div>
    </li>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: number;
}) {
  return (
    <Card className='flex items-center gap-4 p-5'>
      <span className='grid size-11 shrink-0 place-items-center rounded-control bg-brand-soft text-brand-primary'>
        <Icon aria-hidden='true' size={20} />
      </span>
      <div>
        <p className='text-sm text-text-muted'>{label}</p>
        <p className='mt-1 text-2xl font-semibold text-text-primary'>{value}</p>
      </div>
    </Card>
  );
}
