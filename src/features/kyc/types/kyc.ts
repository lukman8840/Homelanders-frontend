export type KycStatus = 'not_started' | 'pending' | 'under_review' | 'approved' | 'rejected';

export type KycStatusLabel = 'Not Started' | 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export interface KycStatusConfig {
  label: KycStatusLabel;
  tone: 'neutral' | 'info' | 'warning' | 'success' | 'danger';
}

export const KYC_STATUS_CONFIG: Record<KycStatus, KycStatusConfig> = {
  not_started: { label: 'Not Started', tone: 'neutral' },
  pending: { label: 'Pending', tone: 'info' },
  under_review: { label: 'Under Review', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
};

export const KYC_STATUS_MAPPING: Record<string, KycStatus> = {
  not_started: 'not_started',
  not_started_yet: 'not_started',
  pending: 'pending',
  submitted: 'pending',
  pending_review: 'pending',
  under_review: 'under_review',
  in_review: 'under_review',
  approved: 'approved',
  verified: 'approved',
  rejected: 'rejected',
  declined: 'rejected',
};

export interface KycStatusDisplay extends Omit<KycStatusConfig, 'label'> {
  label: KycStatusLabel | 'Status unavailable';
  status: KycStatus | null;
}

export type KycIdentificationType =
  'nin_slip_card' | 'national_id_card' | 'international_passport' | 'drivers_licence';

export const KYC_IDENTIFICATION_LABELS: Record<KycIdentificationType, string> = {
  nin_slip_card: 'NIN slip or card',
  national_id_card: 'National ID card',
  international_passport: 'International Passport',
  drivers_licence: "Driver's Licence",
};

export interface KycSubmissionValues {
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  residentialAddress: string;
  identificationType: string;
  identificationNumber: string;
  identityDocument: File | null;
  consent: boolean;
}

export type KycSubmissionInput = KycSubmissionValues;

export interface KycRecord {
  status: KycStatus;
  rawStatus: string;
  submittedAt: string | null;
  updatedAt: string | null;
  adminFeedback?: string;
  rejectionReason?: string;
}

export type KycServiceMode = 'mock' | 'api';
