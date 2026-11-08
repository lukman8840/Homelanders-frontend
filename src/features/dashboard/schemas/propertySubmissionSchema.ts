import { z } from 'zod';

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const documentMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
const maxFileSize = 10 * 1024 * 1024;

const imageFileSchema = z
  .instanceof(File, { message: 'Select a valid image file.' })
  .refine((file) => imageMimeTypes.includes(file.type), 'Use a JPG, PNG, or WebP image.')
  .refine((file) => file.size <= maxFileSize, 'Each image must be 10 MB or smaller.');

const ownershipDocumentSchema = z
  .instanceof(File, { message: 'Select a valid document file.' })
  .refine(
    (file) => documentMimeTypes.includes(file.type),
    'Use a PDF, JPG, or PNG ownership document.',
  )
  .refine((file) => file.size <= maxFileSize, 'Each document must be 10 MB or smaller.');

export const propertySubmissionSchema = z.object({
  title: z.string().trim().min(5, 'Enter a property title with at least 5 characters.'),
  propertyType: z.string().min(1, 'Choose a property type.'),
  description: z.string().trim().min(30, 'Add a description of at least 30 characters.'),
  askingPrice: z
    .string()
    .min(1, 'Enter an asking price.')
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'Enter a valid price.'),
  bedrooms: z.string().min(1, 'Enter the number of bedrooms.').refine(isNonNegativeNumber),
  bathrooms: z.string().min(1, 'Enter the number of bathrooms.').refine(isNonNegativeNumber),
  toilets: z.string().min(1, 'Enter the number of toilets.').refine(isNonNegativeNumber),
  sizeSqm: z
    .string()
    .min(1, 'Enter the property size.')
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'Enter a valid size.'),
  features: z.string(),
  state: z.string().trim().min(1, 'Enter a state.'),
  city: z.string().trim().min(1, 'Enter a city.'),
  neighbourhood: z.string().trim().min(1, 'Enter an area or neighbourhood.'),
  streetAddress: z.string().trim().min(5, 'Enter a street address.'),
  locationDetails: z.string(),
  images: z
    .array(imageFileSchema)
    .min(1, 'Add at least one property image.')
    .max(10, 'You can add up to 10 property images.'),
  ownershipDocuments: z
    .array(ownershipDocumentSchema)
    .min(1, 'Add at least one supporting ownership document.')
    .max(5, 'You can add up to 5 supporting documents.'),
});

function isNonNegativeNumber(value: string) {
  return Number.isInteger(Number(value)) && Number(value) >= 0;
}

export type PropertySubmissionValues = z.infer<typeof propertySubmissionSchema>;
