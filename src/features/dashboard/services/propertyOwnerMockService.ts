import type { OwnerProperty, PropertyFormValues, PropertyStatus } from '../types/propertyOwner';
import type { PropertyOwnerService } from './propertyOwnerService';

const initialProperties: OwnerProperty[] = [
  {
    id: 'demo-verified',
    title: 'Family home near Aso Drive',
    propertyType: 'Detached home',
    description: 'A spacious family home in a quiet neighbourhood.',
    askingPriceNaira: 285000000,
    bedrooms: 4,
    bathrooms: 3,
    toilets: 4,
    sizeSqm: 320,
    features: ['Garden', 'Parking'],
    state: 'FCT',
    city: 'Abuja',
    neighbourhood: 'Asokoro',
    streetAddress: 'Example address, Aso Drive',
    locationDetails: '',
    status: 'verified',
    rawStatus: 'verified',
    submittedAt: '2026-09-10T09:00:00.000Z',
    updatedAt: '2026-09-14T09:00:00.000Z',
    assignedVerifier: 'HomeLander verification team',
    adminFeedback: 'Ownership details reviewed and approved.',
  },
  {
    id: 'demo-review',
    title: 'Bright apartment in Jabi',
    propertyType: 'Apartment',
    description: 'A well-maintained apartment close to local amenities.',
    askingPriceNaira: 92000000,
    bedrooms: 3,
    bathrooms: 2,
    toilets: 3,
    sizeSqm: 140,
    features: ['Balcony', 'Lift'],
    state: 'FCT',
    city: 'Abuja',
    neighbourhood: 'Jabi',
    streetAddress: 'Example address, Jabi',
    locationDetails: '',
    status: 'under_review',
    rawStatus: 'under_review',
    submittedAt: '2026-10-25T10:00:00.000Z',
    updatedAt: '2026-10-29T10:00:00.000Z',
    assignedVerifier: 'HomeLander verification team',
  },
  {
    id: 'demo-pending',
    title: 'Modern terrace in Gwarinpa',
    propertyType: 'Terrace home',
    description: 'A modern terrace with practical family living spaces.',
    askingPriceNaira: 145000000,
    bedrooms: 4,
    bathrooms: 3,
    toilets: 4,
    sizeSqm: 210,
    features: ['Boys quarters', 'Parking'],
    state: 'FCT',
    city: 'Abuja',
    neighbourhood: 'Gwarinpa',
    streetAddress: 'Example address, Gwarinpa',
    locationDetails: '',
    status: 'pending_verification',
    rawStatus: 'pending_verification',
    submittedAt: '2026-10-31T10:00:00.000Z',
    updatedAt: '2026-10-31T10:00:00.000Z',
  },
  {
    id: 'demo-rejected',
    title: 'Wuse two-bedroom flat',
    propertyType: 'Apartment',
    description: 'A convenient flat with a flexible living area.',
    askingPriceNaira: 68000000,
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    sizeSqm: 105,
    features: ['Parking'],
    state: 'FCT',
    city: 'Abuja',
    neighbourhood: 'Wuse',
    streetAddress: 'Example address, Wuse',
    locationDetails: '',
    status: 'rejected',
    rawStatus: 'rejected',
    submittedAt: '2026-10-12T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
    rejectionReason: 'The submitted ownership document was not legible.',
    adminFeedback: 'Please upload a clear, complete copy of the ownership document.',
  },
  {
    id: 'demo-draft',
    title: 'Duplex listing in Maitama',
    propertyType: 'Duplex',
    description: 'A draft property listing awaiting final details.',
    askingPriceNaira: 0,
    bedrooms: 5,
    bathrooms: 4,
    toilets: 5,
    sizeSqm: 360,
    features: ['Garden'],
    state: 'FCT',
    city: 'Abuja',
    neighbourhood: 'Maitama',
    streetAddress: 'Example address, Maitama',
    locationDetails: '',
    status: 'draft',
    rawStatus: 'draft',
    submittedAt: null,
    updatedAt: '2026-10-30T10:00:00.000Z',
  },
];

let properties = initialProperties.map((property) => ({ ...property }));

export const propertyOwnerMockService: PropertyOwnerService = {
  mode: 'mock',
  async list() {
    return properties.map((property) => ({ ...property }));
  },
  async getById(id) {
    const property = properties.find((item) => item.id === id);
    return property ? { ...property } : null;
  },
  async saveDraft(input, id) {
    return save(input, id, 'draft');
  },
  async submit(input, id) {
    return save(input, id, 'submitted');
  },
};

function save(input: PropertyFormValues, id: string | undefined, status: PropertyStatus) {
  const existing = id ? properties.find((property) => property.id === id) : undefined;

  if (id && !existing) {
    throw new Error('This property could not be found in the local demo data.');
  }

  if (existing && existing.status !== 'draft' && existing.status !== 'rejected') {
    throw new Error('Only draft or rejected properties can be edited in this demo.');
  }

  const timestamp = new Date().toISOString();
  const property: OwnerProperty = {
    id: existing?.id ?? `demo-${crypto.randomUUID()}`,
    title: input.title.trim(),
    propertyType: input.propertyType,
    description: input.description.trim(),
    askingPriceNaira: Number(input.askingPrice),
    bedrooms: Number(input.bedrooms),
    bathrooms: Number(input.bathrooms),
    toilets: Number(input.toilets),
    sizeSqm: Number(input.sizeSqm),
    features: input.features
      .split(',')
      .map((feature) => feature.trim())
      .filter(Boolean),
    state: input.state.trim(),
    city: input.city.trim(),
    neighbourhood: input.neighbourhood.trim(),
    streetAddress: input.streetAddress.trim(),
    locationDetails: input.locationDetails.trim(),
    status,
    rawStatus: status,
    submittedAt: status === 'draft' ? (existing?.submittedAt ?? null) : timestamp,
    updatedAt: timestamp,
  };

  properties = existing
    ? properties.map((item) => (item.id === existing.id ? property : item))
    : [property, ...properties];

  return Promise.resolve({ ...property });
}

export function resetPropertyOwnerMockData() {
  properties = initialProperties.map((property) => ({ ...property }));
}
