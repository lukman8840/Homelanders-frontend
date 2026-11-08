import { z } from 'zod';
import type { KycIdentificationType } from '../types/kyc';

export const KYC_DOCUMENT_MAX_SIZE = 10 * 1024 * 1024;
export const KYC_DOCUMENT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;

const identificationTypes: KycIdentificationType[] = [
  'nin_slip_card',
  'national_id_card',
  'international_passport',
  'drivers_licence',
];

const identityDocumentSchema = z
  .instanceof(File, { message: 'Select an identity document.' })
  .refine(
    (file) => (KYC_DOCUMENT_MIME_TYPES as readonly string[]).includes(file.type),
    'Use a PDF, JPG, or PNG identity document.',
  )
  .refine(
    (file) => file.size <= KYC_DOCUMENT_MAX_SIZE,
    'The identity document must be 10 MB or smaller.',
  );

export const kycSubmissionSchema = z.object({
  fullName: z.string().trim().min(3, 'Enter your full name.'),
  dateOfBirth: z
    .string()
    .min(1, 'Enter your date of birth.')
    .refine(isValidDateOfBirth, 'Enter a valid date of birth that is not in the future.'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Enter your phone number.')
    .refine(isValidPhoneNumber, 'Enter a valid phone number.'),
  email: z.email('Enter a valid email address.'),
  residentialAddress: z.string().trim().min(8, 'Enter your residential address.'),
  identificationType: z
    .string()
    .refine(
      (value) => identificationTypes.includes(value as KycIdentificationType),
      'Choose an identification document type.',
    ),
  identificationNumber: z.string(),
  identityDocument: identityDocumentSchema
    .nullable()
    .refine(Boolean, 'Upload your identity document.'),
  consent: z
    .boolean()
    .refine(Boolean, 'Consent is required before submitting your identity verification.'),
});

function isValidDateOfBirth(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value <= new Date().toISOString().slice(0, 10)
  );
}

function isValidPhoneNumber(value: string) {
  const digitCount = value.replace(/\D/g, '').length;
  return /^\+?[\d\s()-]+$/.test(value) && digitCount >= 7 && digitCount <= 15;
}

export type KycSubmissionFormValues = z.infer<typeof kycSubmissionSchema>;
