import { z } from 'zod';

const photoSchema = z
  .instanceof(File, { message: 'Select a valid inspection photo.' })
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'Use a JPG, PNG, or WebP inspection photo.',
  )
  .refine((file) => file.size <= 10 * 1024 * 1024, 'Each photo must be 10 MB or smaller.');

export const inspectionSchema = z.object({
  inspectionDate: z
    .string()
    .min(1, 'Enter the inspection date.')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Enter a valid inspection date.')
    .refine(
      (value) => value <= new Date().toISOString().slice(0, 10),
      'Date cannot be in the future.',
    ),
  outcome: z
    .string()
    .refine(
      (value) => ['satisfactory', 'issues_found', 'unable_to_verify'].includes(value),
      'Select an inspection outcome.',
    ),
  conditionObservations: z.string().trim().min(20, 'Add at least 20 characters of observations.'),
  locationConfirmed: z
    .boolean()
    .refine(Boolean, 'Confirm whether the location matches the assigned property.'),
  supportingPhotos: z.array(photoSchema).max(10, 'Add no more than 10 inspection photos.'),
  additionalNotes: z.string(),
});

export type InspectionFormValues = z.infer<typeof inspectionSchema>;
export type InspectionFormInput = z.input<typeof inspectionSchema>;
