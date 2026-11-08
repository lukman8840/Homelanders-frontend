import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, FileText, ImagePlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { DashboardLinkButton } from '../components/DashboardLinkButton';
import { propertyOwnerService } from '../services/configuredPropertyOwnerService';
import {
  propertySubmissionSchema,
  type PropertySubmissionValues,
} from '../schemas/propertySubmissionSchema';
import type { OwnerProperty } from '../types/propertyOwner';
import { formatNaira } from '../utils/formatOwnerProperty';
import { isPropertyEditable } from '../utils/propertyStatus';

const steps = [
  'Basic information',
  'Property details',
  'Location',
  'Images & documents',
  'Review & submit',
];

const stepFields: Array<Array<keyof PropertySubmissionValues>> = [
  ['title', 'propertyType', 'description', 'askingPrice'],
  ['bedrooms', 'bathrooms', 'toilets', 'sizeSqm', 'features'],
  ['state', 'city', 'neighbourhood', 'streetAddress', 'locationDetails'],
  ['images', 'ownershipDocuments'],
  [],
];

const emptyValues: PropertySubmissionValues = {
  title: '',
  propertyType: '',
  description: '',
  askingPrice: '',
  bedrooms: '',
  bathrooms: '',
  toilets: '',
  sizeSqm: '',
  features: '',
  state: '',
  city: '',
  neighbourhood: '',
  streetAddress: '',
  locationDetails: '',
  images: [],
  ownershipDocuments: [],
};

export function PropertySubmissionPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(propertyId);
  const [step, setStep] = useState(0);
  const [loadingProperty, setLoadingProperty] = useState(editing);
  const [pageError, setPageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PropertySubmissionValues>({
    resolver: zodResolver(propertySubmissionSchema),
    defaultValues: emptyValues,
    mode: 'onTouched',
  });
  const images = watch('images');
  const documents = watch('ownershipDocuments');

  useEffect(() => {
    if (!editing || !propertyId) {
      return;
    }

    let active = true;
    propertyOwnerService
      .getById(propertyId)
      .then((property) => {
        if (!active) {
          return;
        }
        if (!property) {
          setPageError('This property could not be found.');
          return;
        }
        if (!isPropertyEditable(property.status)) {
          setPageError('Only draft or rejected properties can be edited.');
          return;
        }
        reset(mapPropertyToFormValues(property));
      })
      .catch((loadError: unknown) => {
        if (active) {
          setPageError(
            loadError instanceof Error ? loadError.message : 'Unable to load this property.',
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoadingProperty(false);
        }
      });

    return () => {
      active = false;
    };
  }, [editing, propertyId, reset]);

  useEffect(() => {
    if (typeof URL.createObjectURL !== 'function') {
      setPreviewUrls([]);
      return;
    }

    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
      setFeedback(null);
    }
  };

  const removeFile = (field: 'images' | 'ownershipDocuments', index: number) => {
    setValue(
      field,
      getValues(field).filter((_, fileIndex) => fileIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const chooseFiles = (field: 'images' | 'ownershipDocuments', selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) {
      return;
    }
    const currentFiles = getValues(field);
    setValue(field, [...currentFiles, ...Array.from(selectedFiles)], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const saveDraft = async () => {
    setSaving(true);
    setFeedback(null);
    setPageError(null);
    try {
      const property = await propertyOwnerService.saveDraft(getValues(), propertyId);
      setFeedback(
        propertyOwnerService.mode === 'mock'
          ? 'Draft saved locally in demo mode. No information was sent to the backend.'
          : 'Draft saved.',
      );
      navigate(`/dashboard/properties/${property.id}`, {
        state: {
          submissionFeedback: propertyOwnerService.mode === 'mock' ? 'draft' : 'draft-api',
        },
      });
    } catch (saveError) {
      setPageError(saveError instanceof Error ? saveError.message : 'Unable to save this draft.');
    } finally {
      setSaving(false);
    }
  };

  const submitProperty = handleSubmit(async (values) => {
    setSaving(true);
    setFeedback(null);
    setPageError(null);
    try {
      const property = await propertyOwnerService.submit(values, propertyId);
      navigate(`/dashboard/properties/${property.id}`, {
        state: {
          submissionFeedback: propertyOwnerService.mode === 'mock' ? 'demo-submitted' : 'submitted',
        },
      });
    } catch (submitError) {
      setPageError(
        submitError instanceof Error ? submitError.message : 'Unable to submit this property.',
      );
    } finally {
      setSaving(false);
    }
  });

  if (loadingProperty) {
    return (
      <div className='flex justify-center py-16'>
        <p className='text-sm text-text-muted'>Loading property information…</p>
      </div>
    );
  }

  if (pageError && editing && step === 0 && !getValues('title')) {
    return (
      <section>
        <p className='text-sm text-red-700' role='alert'>
          {pageError}
        </p>
        <DashboardLinkButton className='mt-4' to='/dashboard/properties' variant='outline'>
          <ArrowLeft aria-hidden='true' size={16} />
          Back to My properties
        </DashboardLinkButton>
      </section>
    );
  }

  const titleError = errors.title?.message;

  return (
    <section>
      <Link
        className='inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline'
        to='/dashboard/properties'
      >
        <ArrowLeft aria-hidden='true' size={16} />
        Back to My properties
      </Link>
      <p className='mt-5 text-sm font-semibold text-brand-primary'>
        Owner workspace{propertyOwnerService.mode === 'mock' ? ' · local demo' : ''}
      </p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>
        {editing ? 'Edit property' : 'Add a property'}
      </h1>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-text-muted'>
        Provide accurate details and supporting documents. A submission is not verified or published
        until it has been approved through the backend verification process.
      </p>

      <ol aria-label='Submission steps' className='mt-6 grid grid-cols-5 gap-2'>
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
        {pageError ? (
          <p className='mt-4 rounded-control bg-red-50 px-4 py-3 text-sm text-red-800' role='alert'>
            {pageError}
          </p>
        ) : null}
        {feedback ? (
          <p
            className='mt-4 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-primary'
            role='status'
          >
            {feedback}
          </p>
        ) : null}

        <form className='mt-6' noValidate onSubmit={(event) => event.preventDefault()}>
          {step === 0 ? (
            <div className='grid gap-5 sm:grid-cols-2'>
              <Input
                error={titleError}
                label='Property title'
                placeholder='e.g. Spacious family home in Asokoro'
                {...register('title')}
              />
              <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
                Property type
                <select
                  aria-invalid={Boolean(errors.propertyType)}
                  className='min-h-11 rounded-control border border-border bg-white px-3.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
                  {...register('propertyType')}
                >
                  <option value=''>Select a property type</option>
                  <option value='Apartment'>Apartment</option>
                  <option value='Detached home'>Detached home</option>
                  <option value='Terrace home'>Terrace home</option>
                  <option value='Duplex'>Duplex</option>
                  <option value='Land'>Land</option>
                </select>
                {errors.propertyType?.message ? (
                  <span className='text-xs text-red-700'>{errors.propertyType.message}</span>
                ) : null}
              </label>
              <label className='grid gap-1.5 text-sm font-medium text-text-primary sm:col-span-2'>
                Property description
                <textarea
                  aria-describedby={errors.description ? 'description-error' : undefined}
                  aria-invalid={Boolean(errors.description)}
                  className='min-h-32 rounded-control border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
                  placeholder='Describe the property and its condition, layout, and notable features.'
                  {...register('description')}
                />
                {errors.description?.message ? (
                  <span className='text-xs text-red-700' id='description-error'>
                    {errors.description.message}
                  </span>
                ) : null}
              </label>
              <Input
                error={errors.askingPrice?.message}
                label='Asking price (₦)'
                min='1'
                placeholder='e.g. 85000000'
                type='number'
                {...register('askingPrice')}
              />
            </div>
          ) : null}

          {step === 1 ? (
            <div className='grid gap-5 sm:grid-cols-2'>
              <Input
                error={errors.bedrooms?.message}
                label='Bedrooms'
                min='0'
                type='number'
                {...register('bedrooms')}
              />
              <Input
                error={errors.bathrooms?.message}
                label='Bathrooms'
                min='0'
                type='number'
                {...register('bathrooms')}
              />
              <Input
                error={errors.toilets?.message}
                label='Toilets'
                min='0'
                type='number'
                {...register('toilets')}
              />
              <Input
                error={errors.sizeSqm?.message}
                label='Property size (m²)'
                min='1'
                type='number'
                {...register('sizeSqm')}
              />
              <Input
                className='sm:col-span-2'
                hint='Separate items with commas.'
                label='Other features'
                placeholder='Parking, garden, balcony'
                {...register('features')}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className='grid gap-5 sm:grid-cols-2'>
              <Input
                error={errors.state?.message}
                label='State'
                placeholder='FCT'
                {...register('state')}
              />
              <Input
                error={errors.city?.message}
                label='City'
                placeholder='Abuja'
                {...register('city')}
              />
              <Input
                error={errors.neighbourhood?.message}
                label='Area or neighbourhood'
                placeholder='e.g. Gwarinpa'
                {...register('neighbourhood')}
              />
              <Input
                error={errors.streetAddress?.message}
                label='Street address'
                placeholder='Street and house number'
                {...register('streetAddress')}
              />
              <label className='grid gap-1.5 text-sm font-medium text-text-primary sm:col-span-2'>
                Additional location details
                <textarea
                  className='min-h-24 rounded-control border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
                  placeholder='Nearby landmarks or directions (optional)'
                  {...register('locationDetails')}
                />
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className='grid gap-6'>
              <FilePicker
                accept='image/jpeg,image/png,image/webp'
                description='JPG, PNG, or WebP · up to 10 MB per image · maximum 10 images'
                error={errors.images?.message}
                fieldId='property-images'
                icon={<ImagePlus aria-hidden='true' size={20} />}
                label='Property images'
                onSelect={(files) => chooseFiles('images', files)}
              />
              {images.length ? (
                <ul
                  aria-label='Selected image previews'
                  className='grid grid-cols-2 gap-3 sm:grid-cols-4'
                >
                  {images.map((image, index) => (
                    <li
                      className='relative overflow-hidden rounded-control border border-border'
                      key={`${image.name}-${index}`}
                    >
                      {previewUrls[index] ? (
                        <img
                          alt={`Selected property image: ${image.name}`}
                          className='h-28 w-full object-cover'
                          src={previewUrls[index]}
                        />
                      ) : (
                        <div className='grid h-28 place-items-center bg-background p-2 text-center text-xs text-text-muted'>
                          {image.name}
                        </div>
                      )}
                      <button
                        aria-label={`Remove image ${image.name}`}
                        className='absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white text-red-700 shadow-card'
                        onClick={() => removeFile('images', index)}
                        type='button'
                      >
                        <Trash2 aria-hidden='true' size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <FilePicker
                accept='application/pdf,image/jpeg,image/png'
                description='PDF, JPG, or PNG · up to 10 MB per file · maximum 5 documents. Documents are not previewed.'
                error={errors.ownershipDocuments?.message}
                fieldId='ownership-documents'
                icon={<FileText aria-hidden='true' size={20} />}
                label='Ownership documents'
                onSelect={(files) => chooseFiles('ownershipDocuments', files)}
              />
              {documents.length ? (
                <ul aria-label='Selected ownership documents' className='grid gap-2'>
                  {documents.map((document, index) => (
                    <li
                      className='flex items-center justify-between gap-3 rounded-control border border-border px-3 py-2 text-sm'
                      key={`${document.name}-${index}`}
                    >
                      <span className='flex min-w-0 items-center gap-2 text-text-primary'>
                        <FileText
                          aria-hidden='true'
                          className='shrink-0 text-text-muted'
                          size={16}
                        />
                        <span className='truncate'>{document.name}</span>
                      </span>
                      <button
                        aria-label={`Remove document ${document.name}`}
                        className='grid size-9 shrink-0 place-items-center rounded-control text-red-700 hover:bg-red-50'
                        onClick={() => removeFile('ownershipDocuments', index)}
                        type='button'
                      >
                        <Trash2 aria-hidden='true' size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className='text-xs leading-5 text-text-muted'>
                {propertyOwnerService.mode === 'mock'
                  ? 'Selected documents stay in this form only. The demo does not upload or persist their contents.'
                  : 'Documents are not previewed. The configured service adapter determines whether and how their contents are uploaded and stored.'}
              </p>
            </div>
          ) : null}

          {step === 4 ? <ReviewSummary values={getValues()} /> : null}

          <div className='mt-8 flex flex-col-reverse justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center'>
            <div className='flex flex-wrap gap-2'>
              {step > 0 ? (
                <Button
                  onClick={() => {
                    setStep((current) => current - 1);
                    setFeedback(null);
                  }}
                  type='button'
                  variant='outline'
                >
                  <ArrowLeft aria-hidden='true' size={16} />
                  Back
                </Button>
              ) : null}
              {step === steps.length - 1 ? (
                <Button
                  disabled={saving}
                  onClick={() => void saveDraft()}
                  type='button'
                  variant='outline'
                >
                  Save as draft
                </Button>
              ) : null}
            </div>
            {step < steps.length - 1 ? (
              <Button className='sm:ml-auto' onClick={() => void goNext()} type='button'>
                Continue
                <ArrowRight aria-hidden='true' size={16} />
              </Button>
            ) : (
              <Button disabled={saving} onClick={() => void submitProperty()} type='button'>
                {saving ? 'Submitting…' : editing ? 'Resubmit property' : 'Submit property'}
                <Check aria-hidden='true' size={16} />
              </Button>
            )}
          </div>
        </form>
      </Card>
      <p className='mt-4 text-xs leading-5 text-text-muted'>
        {propertyOwnerService.mode === 'mock'
          ? 'Demo mode: saving or submitting changes local sample data only. It does not send files or listing details to a backend.'
          : 'Selected files and property details are passed to the configured backend adapter. Its implementation defines any upload and storage behavior.'}
      </p>
    </section>
  );
}

function FilePicker({
  accept,
  description,
  error,
  fieldId,
  icon,
  label,
  onSelect,
}: {
  accept: string;
  description: string;
  error?: string;
  fieldId: string;
  icon: ReactNode;
  label: string;
  onSelect: (files: FileList | null) => void;
}) {
  return (
    <div>
      <label
        className='flex cursor-pointer flex-col items-center rounded-card border border-dashed border-border bg-background px-5 py-7 text-center hover:border-brand-primary'
        htmlFor={fieldId}
      >
        <span className='grid size-11 place-items-center rounded-full bg-brand-soft text-brand-primary'>
          {icon}
        </span>
        <span className='mt-3 text-sm font-semibold text-text-primary'>{label}</span>
        <span className='mt-1 text-xs text-text-muted'>{description}</span>
        <span className='mt-3 rounded-control border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary'>
          Choose files
        </span>
      </label>
      <input
        accept={accept}
        className='sr-only'
        id={fieldId}
        multiple
        onChange={(event) => {
          onSelect(event.target.files);
          event.target.value = '';
        }}
        type='file'
      />
      {error ? (
        <p className='mt-2 text-xs text-red-700' role='alert'>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ReviewSummary({ values }: { values: PropertySubmissionValues }) {
  const rows = [
    ['Property', values.title],
    ['Type', values.propertyType],
    ['Asking price', values.askingPrice ? formatNaira(Number(values.askingPrice)) : 'Not set'],
    ['Description', values.description],
    [
      'Details',
      `${values.bedrooms} bedrooms · ${values.bathrooms} bathrooms · ${values.toilets} toilets · ${values.sizeSqm} m²`,
    ],
    ['Features', values.features || 'None specified'],
    [
      'Location',
      [values.streetAddress, values.neighbourhood, values.city, values.state]
        .filter(Boolean)
        .join(', '),
    ],
    ['Images', `${values.images.length} selected`],
    ['Ownership documents', `${values.ownershipDocuments.length} selected (private)`],
  ];

  return (
    <dl className='grid gap-4 sm:grid-cols-2'>
      {rows.map(([label, value]) => (
        <div className='rounded-control bg-background p-4' key={label}>
          <dt className='text-xs font-medium text-text-muted'>{label}</dt>
          <dd className='mt-1 whitespace-pre-wrap text-sm leading-6 text-text-primary'>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function mapPropertyToFormValues(property: OwnerProperty): PropertySubmissionValues {
  return {
    title: property.title,
    propertyType: property.propertyType,
    description: property.description,
    askingPrice: property.askingPriceNaira ? String(property.askingPriceNaira) : '',
    bedrooms: property.bedrooms ? String(property.bedrooms) : '0',
    bathrooms: property.bathrooms ? String(property.bathrooms) : '0',
    toilets: property.toilets ? String(property.toilets) : '0',
    sizeSqm: property.sizeSqm ? String(property.sizeSqm) : '',
    features: property.features.join(', '),
    state: property.state,
    city: property.city,
    neighbourhood: property.neighbourhood,
    streetAddress: property.streetAddress,
    locationDetails: property.locationDetails,
    images: [],
    ownershipDocuments: [],
  };
}
