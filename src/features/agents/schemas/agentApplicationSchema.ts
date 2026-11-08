import { z } from 'zod';

export const AGENT_DOCUMENT_MAX_SIZE = 10 * 1024 * 1024;
const allowedDocumentTypes = ['application/pdf', 'image/jpeg', 'image/png'];

const supportingDocumentSchema = z
  .instanceof(File, { message: 'Select a valid supporting document.' })
  .refine((file) => allowedDocumentTypes.includes(file.type), 'Use a PDF, JPG, or PNG document.')
  .refine((file) => file.size <= AGENT_DOCUMENT_MAX_SIZE, 'Each file must be 10 MB or smaller.');

export const agentApplicationSchema = z.object({
  fullName: z.string().trim().min(3, 'Enter your full name.'),
  email: z.email('Enter a valid email address.'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Enter your phone number.')
    .refine((value) => {
      const digits = value.replace(/\D/g, '').length;
      return /^\+?[\d\s()-]+$/.test(value) && digits >= 7 && digits <= 15;
    }, 'Enter a valid phone number.'),
  residentialAddress: z.string().trim().min(8, 'Enter your residential address.'),
  state: z.string().trim().min(1, 'Enter your state.'),
  city: z.string().trim().min(1, 'Enter your city.'),
  professionalExperience: z.string().trim().min(2, 'Describe your professional experience.'),
  previousRealEstateExperience: z
    .string()
    .trim()
    .min(10, 'Tell us about your previous real estate experience.'),
  introduction: z.string().trim().min(20, 'Add a short introduction of at least 20 characters.'),
  supportingDocuments: z.array(supportingDocumentSchema).max(5, 'Add no more than 5 documents.'),
});

export type AgentApplicationFormValues = z.infer<typeof agentApplicationSchema>;
