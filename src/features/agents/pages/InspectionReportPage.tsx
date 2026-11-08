import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { agentDashboardService, inspectionService } from '../services/configuredAgentServices';
import {
  inspectionSchema,
  type InspectionFormInput,
  type InspectionFormValues,
} from '../schemas/inspectionSchema';
import type { AgentPropertyTask } from '../types/agent';
import { AgentStatusBadge } from '../components/AgentStatusBadge';

const initialValues: InspectionFormValues = {
  inspectionDate: new Date().toISOString().slice(0, 10),
  outcome: '',
  conditionObservations: '',
  locationConfirmed: false,
  supportingPhotos: [],
  additionalNotes: '',
};

export function InspectionReportPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<AgentPropertyTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<InspectionFormInput, unknown, InspectionFormValues>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });
  const photos = watch('supportingPhotos');

  useEffect(() => {
    let active = true;
    agentDashboardService
      .getTask(taskId ?? '')
      .then((result) => {
        if (active) setTask(result);
      })
      .catch((loadError: unknown) => {
        if (active)
          setError(loadError instanceof Error ? loadError.message : 'Unable to load this task.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [taskId]);

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      await inspectionService.submit(taskId ?? '', values);
      navigate(`/agent/dashboard/verification/${taskId}`, {
        state: { reportFeedback: inspectionService.mode === 'mock' ? 'demo' : 'submitted' },
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to submit the inspection report.',
      );
    } finally {
      setSaving(false);
    }
  });

  if (loading) {
    return (
      <div className='flex justify-center py-16'>
        <LoadingIndicator label='Loading inspection task' />
      </div>
    );
  }
  if (error && !task) {
    return (
      <p className='text-sm text-red-700' role='alert'>
        {error}
      </p>
    );
  }
  if (!task) {
    return <p className='text-sm text-text-muted'>This inspection task is not available.</p>;
  }
  if (!['accepted', 'in_progress'].includes(task.taskStatus)) {
    return (
      <section>
        <h1 className='text-2xl font-semibold text-text-primary'>Inspection report unavailable</h1>
        <p className='mt-3 text-sm text-text-muted'>
          Accept this assigned task before reporting an inspection.
        </p>
        <Link
          className='mt-4 inline-block text-sm font-semibold text-brand-primary'
          to={`/agent/dashboard/properties/${task.id}`}
        >
          Back to task
        </Link>
      </section>
    );
  }

  return (
    <section>
      <Link
        className='inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline'
        to={`/agent/dashboard/properties/${task.id}`}
      >
        <ArrowLeft aria-hidden='true' size={16} />
        Back to task
      </Link>
      <p className='mt-5 text-sm font-semibold text-brand-primary'>Physical inspection</p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
        Inspection report
      </h1>
      <Card className='mt-5 p-5 sm:p-6'>
        <h2 className='font-semibold text-text-primary'>{task.propertyTitle}</h2>
        <p className='mt-1 text-sm text-text-muted'>
          {task.address}, {task.neighbourhood}, {task.city}, {task.state}
        </p>
        <div className='mt-3 flex flex-wrap gap-2'>
          <AgentStatusBadge kind='task' rawStatus={task.rawTaskStatus} />
          <AgentStatusBadge kind='verification' rawStatus={task.rawFinalStatus} />
        </div>
      </Card>
      {error ? (
        <p className='mt-4 text-sm text-red-700' role='alert'>
          {error}
        </p>
      ) : null}
      <Card className='mt-4 p-5 sm:p-7'>
        <form className='grid gap-5' noValidate onSubmit={(event) => event.preventDefault()}>
          <Input
            error={errors.inspectionDate?.message}
            label='Inspection date'
            max={new Date().toISOString().slice(0, 10)}
            type='date'
            {...register('inspectionDate')}
          />
          <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
            Inspection outcome
            <select
              aria-invalid={Boolean(errors.outcome)}
              className='min-h-11 rounded-control border border-border bg-white px-3.5 text-sm'
              {...register('outcome')}
            >
              <option value=''>Select outcome</option>
              <option value='satisfactory'>Satisfactory</option>
              <option value='issues_found'>Issues found</option>
              <option value='unable_to_verify'>Unable to verify</option>
            </select>
            {errors.outcome?.message ? (
              <span className='text-xs text-red-700'>{errors.outcome.message}</span>
            ) : null}
          </label>
          <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
            Property condition observations
            <textarea
              aria-invalid={Boolean(errors.conditionObservations)}
              className='min-h-28 rounded-control border border-border bg-white px-3.5 py-3 text-sm'
              {...register('conditionObservations')}
            />
            {errors.conditionObservations?.message ? (
              <span className='text-xs text-red-700'>{errors.conditionObservations.message}</span>
            ) : null}
          </label>
          <label className='flex items-start gap-3 text-sm leading-6 text-text-primary'>
            <input
              className='mt-1 size-4 accent-brand-primary'
              type='checkbox'
              {...register('locationConfirmed')}
            />
            I confirm whether the inspected location matches the assigned property.
          </label>
          {errors.locationConfirmed?.message ? (
            <p className='text-xs text-red-700'>{errors.locationConfirmed.message}</p>
          ) : null}
          <div>
            <label
              className='grid gap-2 text-sm font-medium text-text-primary'
              htmlFor='inspection-photos'
            >
              Supporting inspection photos (optional)
              <span className='cursor-pointer rounded-card border border-dashed border-border bg-background px-4 py-5 text-center text-sm text-text-muted'>
                Choose JPG, PNG or WebP photos · max 10 MB each, up to 10 photos
              </span>
            </label>
            <input
              accept='image/jpeg,image/png,image/webp'
              className='sr-only'
              id='inspection-photos'
              multiple
              onChange={(event) => {
                setValue('supportingPhotos', [...photos, ...Array.from(event.target.files ?? [])], {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                event.target.value = '';
              }}
              type='file'
            />
            {errors.supportingPhotos?.message ? (
              <p className='mt-2 text-xs text-red-700'>{errors.supportingPhotos.message}</p>
            ) : null}
            <ul className='mt-3 grid gap-2'>
              {photos.map((photo, index) => (
                <li
                  className='flex items-center justify-between rounded-control border border-border px-3 py-2 text-sm'
                  key={`${photo.name}-${index}`}
                >
                  <span className='truncate'>{photo.name}</span>
                  <button
                    aria-label={`Remove ${photo.name}`}
                    className='grid size-8 shrink-0 place-items-center text-red-700'
                    onClick={() =>
                      setValue(
                        'supportingPhotos',
                        getValues('supportingPhotos').filter((_, fileIndex) => fileIndex !== index),
                        { shouldDirty: true, shouldValidate: true },
                      )
                    }
                    type='button'
                  >
                    <Trash2 aria-hidden='true' size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
            Additional notes
            <textarea
              className='min-h-24 rounded-control border border-border bg-white px-3.5 py-3 text-sm'
              {...register('additionalNotes')}
            />
          </label>
          <p className='rounded-control bg-brand-soft p-4 text-sm leading-6 text-brand-primary'>
            An inspection report records the agent&apos;s findings. It does not approve or verify
            the property. Final approval remains with the authorized admin/backend process.
          </p>
          <Button disabled={saving} onClick={() => void onSubmit()} type='button'>
            {saving ? 'Submitting report…' : 'Submit inspection report'}
          </Button>
        </form>
      </Card>
    </section>
  );
}
