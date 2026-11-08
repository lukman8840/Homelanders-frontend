import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, FileText, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { AgentStatusBadge } from '../components/AgentStatusBadge';
import {
  agentApplicationSchema,
  type AgentApplicationFormValues,
} from '../schemas/agentApplicationSchema';
import { AGENT_DOCUMENT_MAX_SIZE } from '../schemas/agentApplicationSchema';
import { agentApplicationService } from '../services/configuredAgentServices';
import type { AgentApplicationRecord } from '../types/agent';
import { getAgentApplicationStatus } from '../utils/agentStatuses';
import { formatAgentDate } from '../utils/formatAgentDate';

const steps = ['Your details', 'Experience & documents', 'Review'];
const initialValues: AgentApplicationFormValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  residentialAddress: '',
  state: '',
  city: '',
  professionalExperience: '',
  previousRealEstateExperience: '',
  introduction: '',
  supportingDocuments: [],
};

export function AgentApplicationPage() {
  const [application, setApplication] = useState<AgentApplicationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AgentApplicationFormValues>({
    resolver: zodResolver(agentApplicationSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });
  const documents = watch('supportingDocuments');

  const loadApplication = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setApplication(await agentApplicationService.getCurrent());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load application status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplication();
  }, []);

  const displayStatus = application ? getAgentApplicationStatus(application.rawStatus) : null;
  const editable = displayStatus?.status === 'not_applied' || displayStatus?.status === 'rejected';

  const continueStep = async () => {
    const fields =
      step === 0
        ? (['fullName', 'email', 'phoneNumber', 'residentialAddress', 'state', 'city'] as const)
        : step === 1
          ? ([
              'professionalExperience',
              'previousRealEstateExperience',
              'introduction',
              'supportingDocuments',
            ] as const)
          : [];
    if (await trigger(fields)) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
      setSubmitError(null);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setSubmitError(null);
    try {
      const updated = await agentApplicationService.submit(values);
      setApplication(updated);
      setSuccess(true);
      reset(initialValues);
      setStep(0);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your application.');
    } finally {
      setSaving(false);
    }
  });

  if (loading) {
    return (
      <div className='flex justify-center py-16'>
        <LoadingIndicator label='Loading agent application status' />
      </div>
    );
  }

  if (loadError || !application || !displayStatus) {
    return (
      <section>
        <p className='text-sm text-red-700' role='alert'>
          {loadError ?? 'Agent application status is unavailable.'}
        </p>
        <Button
          className='mt-4'
          onClick={() => void loadApplication()}
          type='button'
          variant='outline'
        >
          Try again
        </Button>
      </section>
    );
  }

  return (
    <section>
      <Link
        className='inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline'
        to='/dashboard'
      >
        <ArrowLeft aria-hidden='true' size={16} />
        User dashboard
      </Link>
      <p className='mt-5 text-sm font-semibold text-brand-primary'>
        Agent program{agentApplicationService.mode === 'mock' ? ' · demo' : ''}
      </p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
        Agent application
      </h1>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-text-muted'>
        Apply to become a HomeLander agent. Agent privileges are granted only after backend
        approval; applying does not grant agent access.
      </p>

      <Card className='mt-6 p-5 sm:p-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <p className='text-sm font-medium text-text-muted'>Application status</p>
            <div className='mt-2'>
              <AgentStatusBadge kind='application' rawStatus={application.rawStatus} />
            </div>
          </div>
          <div className='text-sm text-text-muted'>
            Submitted: {formatAgentDate(application.submittedAt)} · Updated:{' '}
            {formatAgentDate(application.updatedAt)}
          </div>
        </div>
        {application.adminFeedback ? (
          <p className='mt-4 text-sm leading-6 text-text-muted'>
            <span className='font-semibold text-text-primary'>Admin feedback: </span>
            {application.adminFeedback}
          </p>
        ) : null}
        {application.rejectionReason ? (
          <p className='mt-3 text-sm leading-6 text-red-800'>
            <span className='font-semibold'>Rejection reason: </span>
            {application.rejectionReason}
          </p>
        ) : null}
      </Card>

      {success ? (
        <p
          className='mt-5 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-primary'
          role='status'
        >
          {agentApplicationService.mode === 'mock'
            ? 'Demo application recorded in memory only. It was not sent to the backend.'
            : 'Your application was submitted for review.'}
        </p>
      ) : null}

      {!editable ? (
        <Card className='mt-5 p-5 sm:p-6'>
          <p className='text-sm leading-6 text-text-muted'>
            {displayStatus.status === 'approved'
              ? 'Your application is approved. Agent privileges still depend on backend authorization.'
              : displayStatus.status === 'pending' || displayStatus.status === 'under_review'
                ? 'Your application is being reviewed. Editing and resubmission are unavailable while it is under consideration.'
                : 'The application status is not mapped. Contact support before resubmitting.'}
          </p>
        </Card>
      ) : (
        <>
          {application.rejectionReason ? (
            <h2 className='mt-6 text-xl font-semibold text-text-primary'>Correct and resubmit</h2>
          ) : (
            <h2 className='mt-6 text-xl font-semibold text-text-primary'>
              Apply to become an agent
            </h2>
          )}
          <ol aria-label='Agent application steps' className='mt-5 grid grid-cols-3 gap-2'>
            {steps.map((label, index) => (
              <li key={label}>
                <div
                  aria-current={index === step ? 'step' : undefined}
                  className={`h-1.5 rounded-full ${index <= step ? 'bg-brand-primary' : 'bg-border'}`}
                />
                <span className='mt-2 hidden text-xs text-text-muted sm:block'>
                  {index + 1}. {label}
                </span>
                <span className='mt-2 block text-xs text-text-muted sm:hidden'>{index + 1}</span>
              </li>
            ))}
          </ol>
          <Card className='mt-4 p-5 sm:p-7'>
            <p className='text-xs font-semibold uppercase tracking-wide text-brand-primary'>
              Step {step + 1} of {steps.length}
            </p>
            <h3 className='mt-2 text-xl font-semibold text-text-primary'>{steps[step]}</h3>
            {submitError ? (
              <p
                className='mt-4 rounded-control bg-red-50 px-4 py-3 text-sm text-red-800'
                role='alert'
              >
                {submitError}
              </p>
            ) : null}
            <form className='mt-6' noValidate onSubmit={(event) => event.preventDefault()}>
              {step === 0 ? (
                <div className='grid gap-5 sm:grid-cols-2'>
                  <Input
                    autoComplete='name'
                    error={errors.fullName?.message}
                    label='Full name'
                    {...register('fullName')}
                  />
                  <Input
                    autoComplete='email'
                    error={errors.email?.message}
                    label='Email address'
                    type='email'
                    {...register('email')}
                  />
                  <Input
                    autoComplete='tel'
                    error={errors.phoneNumber?.message}
                    label='Phone number'
                    type='tel'
                    {...register('phoneNumber')}
                  />
                  <Input error={errors.state?.message} label='State' {...register('state')} />
                  <Input error={errors.city?.message} label='City' {...register('city')} />
                  <label className='grid gap-1.5 text-sm font-medium text-text-primary sm:col-span-2'>
                    Residential address
                    <textarea
                      aria-invalid={Boolean(errors.residentialAddress)}
                      autoComplete='street-address'
                      className='min-h-24 rounded-control border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
                      {...register('residentialAddress')}
                    />
                    {errors.residentialAddress?.message ? (
                      <span className='text-xs text-red-700'>
                        {errors.residentialAddress.message}
                      </span>
                    ) : null}
                  </label>
                </div>
              ) : null}
              {step === 1 ? (
                <div className='grid gap-5'>
                  <Input
                    error={errors.professionalExperience?.message}
                    hint='Describe your professional background.'
                    label='Professional experience'
                    {...register('professionalExperience')}
                  />
                  <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
                    Previous real estate experience
                    <textarea
                      aria-invalid={Boolean(errors.previousRealEstateExperience)}
                      className='min-h-24 rounded-control border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
                      {...register('previousRealEstateExperience')}
                    />
                    {errors.previousRealEstateExperience?.message ? (
                      <span className='text-xs text-red-700'>
                        {errors.previousRealEstateExperience.message}
                      </span>
                    ) : null}
                  </label>
                  <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
                    Short personal introduction
                    <textarea
                      aria-invalid={Boolean(errors.introduction)}
                      className='min-h-24 rounded-control border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
                      {...register('introduction')}
                    />
                    {errors.introduction?.message ? (
                      <span className='text-xs text-red-700'>{errors.introduction.message}</span>
                    ) : null}
                  </label>
                  <div>
                    <label
                      className='grid gap-2 text-sm font-medium text-text-primary'
                      htmlFor='agent-documents'
                    >
                      Supporting documents (optional until requirements are confirmed)
                      <span className='flex cursor-pointer flex-col items-center rounded-card border border-dashed border-border bg-background px-5 py-6 text-center hover:border-brand-primary'>
                        <FileText aria-hidden='true' className='text-brand-primary' size={22} />
                        <span className='mt-2 text-sm font-semibold'>Choose PDF, JPG or PNG</span>
                        <span className='mt-1 text-xs text-text-muted'>
                          Maximum 10 MB per file, up to 5 documents.
                        </span>
                      </span>
                    </label>
                    <input
                      accept='application/pdf,image/jpeg,image/png'
                      className='sr-only'
                      id='agent-documents'
                      multiple
                      onChange={(event) => {
                        setValue(
                          'supportingDocuments',
                          [...documents, ...Array.from(event.target.files ?? [])],
                          { shouldDirty: true, shouldValidate: true },
                        );
                        event.target.value = '';
                      }}
                      type='file'
                    />
                    {errors.supportingDocuments?.message ? (
                      <p className='mt-2 text-xs text-red-700'>
                        {errors.supportingDocuments.message}
                      </p>
                    ) : null}
                    {documents.length ? (
                      <ul className='mt-3 grid gap-2'>
                        {documents.map((file, index) => (
                          <li
                            className='flex items-center justify-between gap-2 rounded-control border border-border px-3 py-2 text-sm'
                            key={`${file.name}-${index}`}
                          >
                            <span className='truncate'>{file.name}</span>
                            <button
                              aria-label={`Remove ${file.name}`}
                              className='grid size-8 shrink-0 place-items-center rounded-control text-red-700 hover:bg-red-50'
                              onClick={() =>
                                setValue(
                                  'supportingDocuments',
                                  documents.filter((_, fileIndex) => fileIndex !== index),
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
                    ) : null}
                    <p className='mt-2 text-xs text-text-muted'>
                      Selected file contents remain in this form only and are not uploaded in demo
                      mode. Each file is limited to {AGENT_DOCUMENT_MAX_SIZE / 1024 / 1024} MB.
                    </p>
                  </div>
                </div>
              ) : null}
              {step === 2 ? <ApplicationReview values={getValues()} /> : null}
              <div className='mt-8 flex justify-between gap-3 border-t border-border pt-5'>
                <div>
                  {step > 0 ? (
                    <Button
                      onClick={() => setStep((current) => current - 1)}
                      type='button'
                      variant='outline'
                    >
                      <ArrowLeft aria-hidden='true' size={16} />
                      Back
                    </Button>
                  ) : null}
                </div>
                {step < steps.length - 1 ? (
                  <Button onClick={() => void continueStep()} type='button'>
                    Continue
                    <ArrowRight aria-hidden='true' size={16} />
                  </Button>
                ) : (
                  <Button disabled={saving} onClick={() => void onSubmit()} type='button'>
                    {saving ? 'Submitting…' : 'Submit application'}
                  </Button>
                )}
              </div>
            </form>
          </Card>
          {agentApplicationService.mode === 'mock' ? (
            <p className='mt-4 text-xs leading-5 text-text-muted'>
              Demo mode: submission changes only a local sample status. Your application fields and
              files are not retained or sent to the backend.
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

function ApplicationReview({ values }: { values: AgentApplicationFormValues }) {
  const rows = [
    ['Full name', values.fullName],
    ['Email', values.email],
    ['Phone', values.phoneNumber],
    ['Address', `${values.residentialAddress}, ${values.city}, ${values.state}`],
    ['Professional experience', values.professionalExperience],
    ['Real estate experience', values.previousRealEstateExperience],
    ['Introduction', values.introduction],
    ['Supporting documents', `${values.supportingDocuments.length} selected`],
  ];
  return (
    <dl className='grid gap-3 sm:grid-cols-2'>
      {rows.map(([label, value]) => (
        <div className='rounded-control bg-background p-4' key={label}>
          <dt className='text-xs font-medium text-text-muted'>{label}</dt>
          <dd className='mt-1 whitespace-pre-wrap break-words text-sm text-text-primary'>
            {value || 'Not entered'}
          </dd>
        </div>
      ))}
    </dl>
  );
}
