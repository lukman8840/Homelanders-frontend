export type PropertyType = 'apartment' | 'detached-home' | 'terrace-home' | 'duplex';

export type PropertyVerificationStatus = 'verified' | 'pending' | 'unverified';

export interface PropertyImage {
  id: string;
  src: string;
  alt: string;
}

export interface PropertyLocation {
  address: string;
  district: string;
  city: string;
  state: string;
  country: string;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  floorAreaSqm: number;
  amenities: string[];
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: PropertyLocation;
  priceNaira: number;
  propertyType: PropertyType;
  images: [PropertyImage, ...PropertyImage[]];
  features: PropertyFeatures;
  verificationStatus: PropertyVerificationStatus;
  listingInfo: {
    reference: string;
    listedAt: string;
    transactionType: 'sale';
  };
}

export interface PropertyFilters {
  query: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: PropertyType | '';
  minBedrooms: string;
  minBathrooms: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Apartment',
  'detached-home': 'Detached home',
  'terrace-home': 'Terrace home',
  duplex: 'Duplex',
};

export const ABUJA_DISTRICTS = ['Asokoro', 'Gwarinpa', 'Jabi', 'Maitama', 'Wuse'] as const;
