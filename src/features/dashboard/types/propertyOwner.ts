export type PropertyStatus =
  'draft' | 'submitted' | 'pending_verification' | 'under_review' | 'verified' | 'rejected';

export type PropertyStatusLabel =
  'Draft' | 'Submitted' | 'Pending Verification' | 'Under Review' | 'Verified' | 'Rejected';

export interface PropertyStatusConfig {
  label: PropertyStatusLabel;
  tone: 'neutral' | 'info' | 'warning' | 'success' | 'danger';
}

export const PROPERTY_STATUS_CONFIG: Record<PropertyStatus, PropertyStatusConfig> = {
  draft: { label: 'Draft', tone: 'neutral' },
  submitted: { label: 'Submitted', tone: 'info' },
  pending_verification: { label: 'Pending Verification', tone: 'warning' },
  under_review: { label: 'Under Review', tone: 'warning' },
  verified: { label: 'Verified', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
};

export const PROPERTY_STATUS_MAPPING: Record<string, PropertyStatus> = {
  draft: 'draft',
  submitted: 'submitted',
  pending: 'pending_verification',
  pending_verification: 'pending_verification',
  awaiting_verification: 'pending_verification',
  under_review: 'under_review',
  in_review: 'under_review',
  verified: 'verified',
  rejected: 'rejected',
};

export interface PropertyStatusDisplay {
  label: PropertyStatusLabel | 'Status unavailable';
  tone: PropertyStatusConfig['tone'];
  status: PropertyStatus | null;
}

export interface PropertyFormValues {
  title: string;
  propertyType: string;
  description: string;
  askingPrice: string;
  bedrooms: string;
  bathrooms: string;
  toilets: string;
  sizeSqm: string;
  features: string;
  state: string;
  city: string;
  neighbourhood: string;
  streetAddress: string;
  locationDetails: string;
  images: File[];
  ownershipDocuments: File[];
}

export interface OwnerProperty {
  id: string;
  title: string;
  propertyType: string;
  description: string;
  askingPriceNaira: number;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  sizeSqm: number;
  features: string[];
  state: string;
  city: string;
  neighbourhood: string;
  streetAddress: string;
  locationDetails: string;
  status: PropertyStatus;
  rawStatus: string;
  submittedAt: string | null;
  updatedAt: string;
  assignedVerifier?: string;
  adminFeedback?: string;
  rejectionReason?: string;
}

export interface PropertyVerificationDetails {
  submittedAt: string | null;
  status: PropertyStatusDisplay;
  assignedVerifier?: string;
  adminFeedback?: string;
  rejectionReason?: string;
}

export type PropertyServiceMode = 'mock' | 'api';
