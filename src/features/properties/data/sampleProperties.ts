import type { Property } from '../types/property';

const image = (id: string, src: string, alt: string) => ({ id, src, alt });

const sharedFeatures = {
  parkingSpaces: 2,
  floorAreaSqm: 180,
  amenities: ['Fitted kitchen', 'Secure parking', 'Water storage'],
};

export const sampleProperties: Property[] = [
  {
    id: 'sample-aso-drive',
    title: 'Light-filled family home',
    description:
      'Illustrative sample listing for a spacious family home in a quiet Abuja neighbourhood. This example includes open living areas, a fitted kitchen, and a private outdoor space.',
    location: {
      address: 'Example address · Aso Drive',
      district: 'Maitama',
      city: 'Abuja',
      state: 'Federal Capital Territory',
      country: 'Nigeria',
    },
    priceNaira: 285_000_000,
    propertyType: 'detached-home',
    images: [
      image(
        'living-room',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of a bright living room',
      ),
      image(
        'exterior',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of a modern home exterior',
      ),
      image(
        'kitchen',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of a fitted kitchen',
      ),
    ],
    features: { ...sharedFeatures, bedrooms: 4, bathrooms: 4, floorAreaSqm: 320 },
    verificationStatus: 'unverified',
    listingInfo: {
      reference: 'SAMPLE-001',
      listedAt: '2026-01-15',
      transactionType: 'sale',
    },
  },
  {
    id: 'sample-gwarinpa-court',
    title: 'Calm, modern terrace',
    description:
      'Illustrative sample listing for a modern terrace with practical living spaces in Gwarinpa.',
    location: {
      address: 'Example address · 3rd Avenue',
      district: 'Gwarinpa',
      city: 'Abuja',
      state: 'Federal Capital Territory',
      country: 'Nigeria',
    },
    priceNaira: 118_000_000,
    propertyType: 'terrace-home',
    images: [
      image(
        'terrace-main',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of a modern terrace home',
      ),
      image(
        'terrace-interior',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of a terrace living area',
      ),
    ],
    features: { ...sharedFeatures, bedrooms: 3, bathrooms: 3, floorAreaSqm: 210 },
    verificationStatus: 'unverified',
    listingInfo: {
      reference: 'SAMPLE-002',
      listedAt: '2026-01-12',
      transactionType: 'sale',
    },
  },
  {
    id: 'sample-jabi-residence',
    title: 'A bright city apartment',
    description:
      'Illustrative sample listing for an airy apartment close to everyday amenities in Jabi.',
    location: {
      address: 'Example address · Jabi Lake area',
      district: 'Jabi',
      city: 'Abuja',
      state: 'Federal Capital Territory',
      country: 'Nigeria',
    },
    priceNaira: 76_000_000,
    propertyType: 'apartment',
    images: [
      image(
        'apartment-main',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of a bright apartment',
      ),
      image(
        'apartment-living',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of an apartment living room',
      ),
    ],
    features: { ...sharedFeatures, bedrooms: 2, bathrooms: 2, floorAreaSqm: 115 },
    verificationStatus: 'unverified',
    listingInfo: {
      reference: 'SAMPLE-003',
      listedAt: '2026-01-10',
      transactionType: 'sale',
    },
  },
  {
    id: 'sample-wuse-courtyard',
    title: 'Room to grow in Wuse',
    description:
      'Illustrative sample listing for a family home with generous rooms and a shared courtyard.',
    location: {
      address: 'Example address · Zone 4',
      district: 'Wuse',
      city: 'Abuja',
      state: 'Federal Capital Territory',
      country: 'Nigeria',
    },
    priceNaira: 198_000_000,
    propertyType: 'duplex',
    images: [
      image(
        'wuse-main',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of a family home',
      ),
    ],
    features: { ...sharedFeatures, bedrooms: 5, bathrooms: 4, floorAreaSqm: 280 },
    verificationStatus: 'unverified',
    listingInfo: {
      reference: 'SAMPLE-004',
      listedAt: '2026-01-08',
      transactionType: 'sale',
    },
  },
  {
    id: 'sample-asokoro-residence',
    title: 'Quiet Asokoro residence',
    description:
      'Illustrative sample listing for a private residence with a flexible guest room and garden.',
    location: {
      address: 'Example address · Asokoro District',
      district: 'Asokoro',
      city: 'Abuja',
      state: 'Federal Capital Territory',
      country: 'Nigeria',
    },
    priceNaira: 340_000_000,
    propertyType: 'detached-home',
    images: [
      image(
        'asokoro-main',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of a quiet detached home',
      ),
    ],
    features: { ...sharedFeatures, bedrooms: 4, bathrooms: 5, floorAreaSqm: 350 },
    verificationStatus: 'unverified',
    listingInfo: {
      reference: 'SAMPLE-005',
      listedAt: '2026-01-05',
      transactionType: 'sale',
    },
  },
  {
    id: 'sample-jabi-gardens',
    title: 'Easy-living Jabi apartment',
    description:
      'Illustrative sample listing for a compact apartment with a balcony and shared garden.',
    location: {
      address: 'Example address · Jabi District',
      district: 'Jabi',
      city: 'Abuja',
      state: 'Federal Capital Territory',
      country: 'Nigeria',
    },
    priceNaira: 92_000_000,
    propertyType: 'apartment',
    images: [
      image(
        'jabi-gardens-main',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
        'Illustrative sample image of an apartment with a bright interior',
      ),
    ],
    features: { ...sharedFeatures, bedrooms: 2, bathrooms: 1, floorAreaSqm: 98 },
    verificationStatus: 'unverified',
    listingInfo: {
      reference: 'SAMPLE-006',
      listedAt: '2026-01-02',
      transactionType: 'sale',
    },
  },
];

export function findSampleProperty(id: string | undefined) {
  return sampleProperties.find((property) => property.id === id);
}
