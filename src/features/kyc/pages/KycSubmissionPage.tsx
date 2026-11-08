import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Eye, EyeOff, FileText, ShieldCheck, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { DashboardLinkButton } from '../../dashboard/components/DashboardLinkButton';
import { kycService } from '../services/configuredKycService';
import { kycSubmissionSchema, KYC_DOCUMENT_MAX_SIZE } from '../schemas/kycSchema';
import type { KycSubmissionValues } from '../types/kyc';
import { KYC_IDENTIFICATION_LABELS } from '../types/kyc';
import { useKycStatus } from '../hooks/useKycStatus';
import { canSubmitKyc, getKycStatus, maskIdentificationNumber } from '../utils/kycStatus';

const steps = ['Personal information', 'Identification', 'Document preview', 'Review & submit'];
const personalFields = [
  'fullName',
  'dateOfBirth',
  'phoneNumber',
  'email',
  'residentialAddress',
] as const;
const identificationFields = [
  'identificationType',
  'identificationNumber',
  'identityDocument',
] as const;

const defaultValues: KycSubmissionValues = {
  fullName: '',
  dateOfBirth: '',
  phoneNumber: '',
  email: '',
  residentialAddress: '',
  identificationType: '' as const,
  identificationNumber: '',
  identityDocument: null,
  consent: false,
};

export function KycSubmissionPage() {
  const navigate = useNavigate();
  const { record, loading, error: statusError, reload, mode } = useKycStatus();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<KycSubmissionValues>({
    resolver: zodResolver(kycSubmissionSchema),
    defaultValues,
    mode: 'onTouched',
  });
  const identityDocument = watch('identityDocument');
  const identificationType = watch('identificationType');

  useEffect(() => {
    if (!identityDocument || typeof URL.createObjectURL !== 'function') {
      setPreviewUrl(null);
      setShowPreview(false);
      return;
    }

    const url = URL.createObjectURL(identityDocument);
    setPreviewUrl(url);
    setShowPreview(false);
    return () => URL.revokeObjectURL(url);
  }, [identityDocument]);

  const status = record ? getKycStatus(record.rawStatus) : null;
  const allowed = status?.status ? canSubmitKyc(status.status) : false;

  const continueStep = async () => {
    const fields = step === 0 ? personalFields : step === 1 ? identificationFields : [];
    if (await trigger(fields)) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
      setSubmitError(null);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!record || !getKycStatus(record.rawStatus).status || !canSubmitKyc(record.status)) {
      setSubmitError('This KYC submission cannot be changed in its current status.');
      return;
    }

    setSaving(true);
    setSubmitError(null);
    try {
      await kycService.submit(values);
      reset(defaultValues);
      navigate('/dashboard/kyc', {
        state: { submissionFeedback: mode === 'mock' ? 'demo-submitted' : 'submitted' },
      });
    } catch (submissionError) {
      setSubmitError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to submit identity verification.',
      );
    } finally {
      setSaving(false);
    }
  });

  if (loading) {
    return (
      <div className='flex justify-center py-16'>
        <LoadingIndicator label='Checking identity verification status' />
      </div>
    );
  }

  if (statusError || !record) {
    return (
      <section>
        <p className='text-sm text-red-700' role='alert'>
          {statusError ?? 'Unable to check whether identity verification can be submitted.'}
        </p>
        <Button className='mt-4' onClick={() => void reload()} type='button' variant='outline'>
          Try again
        </Button>
      </section>
    );
  }

  if (!allowed) {
    return (
      <section>
        <p className='text-sm font-semibold text-brand-primary'>Identity verification</p>
        <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
          Submission unavailable
        </h1>
        <Card className='mt-6 p-5 sm:p-7'>
          <p className='text-sm leading-6 text-text-muted'>
            Your current status is{' '}
            <span className='font-semibold text-text-primary'>
              {status?.label ?? 'Status unavailable'}
            </span>
            . You can only start verification or resubmit a rejected submission here. Approved or
            in-review identity information cannot be edited.
          </p>
          <DashboardLinkButton className='mt-4' to='/dashboard/kyc' variant='outline'>
            Back to identity verification
          </DashboardLinkButton>
        </Card>
      </section>
    );
  }

  const identityDocumentError = errors.identityDocument?.message;

  return (
    <section>
      <Link
        className='inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline'
        to='/dashboard/kyc'
      >
        <ArrowLeft aria-hidden='true' size={16} />
        Back to identity verification
      </Link>
      <p className='mt-5 text-sm font-semibold text-brand-primary'>
        Identity verification{mode === 'mock' ? ' · local demo' : ''}
      </p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
        {record.status === 'rejected' ? 'Resubmit identity verification' : 'Verify your identity'}
      </h1>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-text-muted'>
        Enter your information and choose an identity document. Identity verification is separate
        from property verification.
      </p>
      {record.rejectionReason ? (
        <Card className='mt-5 border-red-200 bg-red-50 p-4'>
          <p className='text-sm font-semibold text-red-900'>Previous review feedback</p>
          <p className='mt-1 text-sm leading-6 text-red-800'>{record.rejectionReason}</p>
        </Card>
      ) : null}

      <ol aria-label='KYC submission steps' className='mt-6 grid grid-cols-4 gap-2'>
        {steps.map((label, index) => (
          <li className='min-w-0' key={label}>
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
        <h2 className='mt-2 text-xl font-semibold text-text-primary'>{steps[step]}</h2>
        {submitError ? (
          <p className='mt-4 rounded-control bg-red-50 px-4 py-3 text-sm text-red-800' role='alert'>
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
                autoComplete='bday'
                error={errors.dateOfBirth?.message}
                label='Date of birth'
                max={new Date().toISOString().slice(0, 10)}
                type='date'
                {...register('dateOfBirth')}
              />
              <Input
                autoComplete='tel'
                error={errors.phoneNumber?.message}
                label='Phone number'
                type='tel'
                {...register('phoneNumber')}
              />
              <Input
                autoComplete='email'
                error={errors.email?.message}
                label='Email address'
                type='email'
                {...register('email')}
              />
              <label className='grid gap-1.5 text-sm font-medium text-text-primary sm:col-span-2'>
                Residential address
                <textarea
                  aria-invalid={Boolean(errors.residentialAddress)}
                  className={`min-h-24 rounded-control border bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft ${errors.residentialAddress ? 'border-red-600' : 'border-border'}`}
                  autoComplete='street-address'
                  {...register('residentialAddress')}
                />
                {errors.residentialAddress?.message ? (
                  <span className='text-xs text-red-700'>{errors.residentialAddress.message}</span>
                ) : null}
              </label>
            </div>
          ) : null}

          {step === 1 ? (
            <div className='grid gap-5 sm:grid-cols-2'>
              <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
                Identification document type
                <select
                  aria-invalid={Boolean(errors.identificationType)}
                  className={`min-h-11 rounded-control border bg-white px-3.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft ${errors.identificationType ? 'border-red-600' : 'border-border'}`}
                  {...register('identificationType')}
                >
                  <option value=''>Choose a document</option>
                  {Object.entries(KYC_IDENTIFICATION_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.identificationType?.message ? (
                  <span className='text-xs text-red-700'>{errors.identificationType.message}</span>
                ) : null}
              </label>
              <Input
                autoComplete='off'
                error={errors.identificationNumber?.message}
                hint='Only provide a number if required for your selected document.'
                label='Identification number (if required)'
                {...register('identificationNumber')}
              />
              <div className='sm:col-span-2'>
                <FilePicker
                  accept='application/pdf,image/jpeg,image/png'
                  description='PDF, JPG, or PNG · maximum 10 MB'
                  error={identityDocumentError}
                  onSelect={(file) =>
                    setValue('identityDocument', file, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  selectedFile={identityDocument}
                />
              </div>
              <p className='text-xs leading-5 text-text-muted sm:col-span-2'>
                The identification number is optional in this demo because document-specific
                requirements have not been confirmed with the backend.
              </p>
            </div>
          ) : null}

          {step === 2 ? (
            <div className='grid gap-4'>
              {identityDocument ? (
                <div className='rounded-card border border-border p-4'>
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex min-w-0 items-center gap-3'>
                      <span className='grid size-10 shrink-0 place-items-center rounded-control bg-brand-soft text-brand-primary'>
                        <FileText aria-hidden='true' size={19} />
                      </span>
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-semibold text-text-primary'>
                          {identityDocument.name}
                        </p>
                        <p className='text-xs text-text-muted'>
                          {identityDocument.type === 'application/pdf'
                            ? 'PDF document'
                            : 'Image document'}{' '}
                          · {(identityDocument.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowPreview((visible) => !visible)}
                      type='button'
                      variant='outline'
                    >
                      {showPreview ? (
                        <>
                          <EyeOff aria-hidden='true' size={16} />
                          Hide preview
                        </>
                      ) : (
                        <>
                          <Eye aria-hidden='true' size={16} />
                          Preview document
                        </>
                      )}
                    </Button>
                  </div>
                  {showPreview && previewUrl ? (
                    identityDocument.type === 'application/pdf' ? (
                      <iframe
                        className='mt-4 h-96 w-full rounded-control border border-border'
                        referrerPolicy='no-referrer'
                        sandbox='allow-same-origin'
                        src={previewUrl}
                        title='Private local identity document preview'
                      />
                    ) : (
                      <img
                        alt='Private local identity document preview'
                        className='mt-4 max-h-96 max-w-full rounded-control object-contain'
                        src={previewUrl}
                      />
                    )
                  ) : null}
                  <p className='mt-3 text-xs leading-5 text-text-muted'>
                    Preview is private to this form session and uses a temporary browser URL. It is
                    not a public property URL or a stored document.
                  </p>
                </div>
              ) : (
                <p className='text-sm text-red-700' role='alert'>
                  Select an identity document to continue.
                </p>
              )}
              {previewUrl ? (
                <button
                  className='inline-flex w-fit items-center gap-2 text-sm font-semibold text-red-700 hover:underline'
                  onClick={() => {
                    setValue('identityDocument', null, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    setShowPreview(false);
                  }}
                  type='button'
                >
                  <Trash2 aria-hidden='true' size={16} />
                  Remove document
                </button>
              ) : null}
              {errors.identityDocument?.message ? (
                <p className='text-xs text-red-700'>{errors.identityDocument.message}</p>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className='grid gap-5'>
              <ReviewSummary values={getValues()} identificationType={identificationType} />
              <label className='flex items-start gap-3 rounded-control border border-border p-4 text-sm leading-6 text-text-primary'>
                <input
                  aria-invalid={Boolean(errors.consent)}
                  className='mt-1 size-4 accent-brand-primary'
                  type='checkbox'
                  {...register('consent')}
                />
                <span>
                  I consent to the processing of the personal information and identity document I
                  provide for identity verification and review.
                  {errors.consent?.message ? (
                    <span className='mt-1 block text-xs text-red-700'>
                      {errors.consent.message}
                    </span>
                  ) : null}
                </span>
              </label>
              <div className='flex items-start gap-3 rounded-control bg-brand-soft p-4 text-sm leading-6 text-brand-primary'>
                <ShieldCheck aria-hidden='true' className='mt-0.5 shrink-0' size={18} />
                <p>
                  Identity information and documents are sensitive. They are never saved in browser
                  storage by this form. In demo mode, submitting will not upload or retain them.
                </p>
              </div>
            </div>
          ) : null}

          <div className='mt-8 flex flex-col-reverse justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center'>
            <div>
              {step > 0 ? (
                <Button
                  onClick={() => {
                    setStep((current) => current - 1);
                    setSubmitError(null);
                  }}
                  type='button'
                  variant='outline'
                >
                  <ArrowLeft aria-hidden='true' size={16} />
                  Back
                </Button>
              ) : null}
            </div>
            {step < steps.length - 1 ? (
              <Button className='sm:ml-auto' onClick={() => void continueStep()} type='button'>
                Continue
                <ArrowRight aria-hidden='true' size={16} />
              </Button>
            ) : (
              <Button disabled={saving} onClick={() => void onSubmit()} type='button'>
                {saving ? 'Submitting…' : 'Submit for review'}
              </Button>
            )}
          </div>
        </form>
      </Card>
      {mode === 'mock' ? (
        <p className='mt-4 text-xs leading-5 text-text-muted'>
          Demo only: the form records an in-memory sample status. Your identity information and
          document are not uploaded or saved.
        </p>
      ) : null}
    </section>
  );
}

function FilePicker({
  accept,
  description,
  error,
  onSelect,
  selectedFile,
}: {
  accept: string;
  description: string;
  error?: string;
  onSelect: (file: File | null) => void;
  selectedFile: File | null;
}) {
  return (
    <div>
      <label
        className='grid gap-2 text-sm font-medium text-text-primary'
        htmlFor='kyc-identity-document'
      >
        Upload identity document
        <span className='flex cursor-pointer flex-col items-center rounded-card border border-dashed border-border bg-background px-5 py-6 text-center hover:border-brand-primary'>
          <FileText aria-hidden='true' className='text-brand-primary' size={22} />
          <span className='mt-2 text-sm font-semibold'>
            {selectedFile ? 'Choose a replacement document' : 'Choose a document'}
          </span>
          <span className='mt-1 text-xs text-text-muted'>{description}</span>
        </span>
        <input
          accept={accept}
          className='sr-only'
          id='kyc-identity-document'
          onChange={(event) => {
            onSelect(event.target.files?.[0] ?? null);
            event.target.value = '';
          }}
          type='file'
        />
      </label>
      {selectedFile ? (
        <div className='mt-3 flex items-center justify-between gap-3 rounded-control bg-brand-soft px-3 py-2 text-sm text-brand-primary'>
          <span className='truncate'>{selectedFile.name}</span>
          <button
            aria-label='Remove selected identity document'
            className='grid size-8 shrink-0 place-items-center rounded-control hover:bg-white'
            onClick={() => onSelect(null)}
            type='button'
          >
            <Trash2 aria-hidden='true' size={16} />
          </button>
        </div>
      ) : null}
      {error ? (
        <p className='mt-2 text-xs text-red-700' role='alert'>
          {error}
        </p>
      ) : null}
      <p className='mt-2 text-xs text-text-muted'>
        Maximum file size: {KYC_DOCUMENT_MAX_SIZE / 1024 / 1024} MB.
      </p>
    </div>
  );
}

function ReviewSummary({
  values,
  identificationType,
}: {
  values: KycSubmissionValues;
  identificationType: string;
}) {
  const rows = [
    ['Full name', values.fullName || 'Not entered'],
    ['Date of birth', values.dateOfBirth || 'Not entered'],
    ['Phone number', values.phoneNumber || 'Not entered'],
    ['Email', values.email || 'Not entered'],
    ['Residential address', values.residentialAddress || 'Not entered'],
    [
      'Identification type',
      Object.entries(KYC_IDENTIFICATION_LABELS).find(([key]) => key === identificationType)?.[1] ??
        'Not selected',
    ],
    ['Identification number', maskIdentificationNumber(values.identificationNumber)],
    ['Identity document', values.identityDocument?.name ?? 'Not selected'],
  ];

  return (
    <dl className='grid gap-3 sm:grid-cols-2'>
      {rows.map(([label, value]) => (
        <div className='rounded-control bg-background p-4' key={label}>
          <dt className='text-xs font-medium text-text-muted'>{label}</dt>
          <dd className='mt-1 break-words text-sm text-text-primary'>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
