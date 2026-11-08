import {
  KYC_STATUS_CONFIG,
  KYC_STATUS_MAPPING,
  type KycStatus,
  type KycStatusConfig,
  type KycStatusDisplay,
} from '../types/kyc';

export function getKycStatus(
  rawStatus: string,
  mapping: Record<string, KycStatus> = KYC_STATUS_MAPPING,
  config: Record<KycStatus, KycStatusConfig> = KYC_STATUS_CONFIG,
): KycStatusDisplay {
  const key = rawStatus.trim().toLowerCase().replaceAll('-', '_').replaceAll(' ', '_');
  const status = mapping[key] ?? null;

  return status
    ? { ...config[status], status }
    : { label: 'Status unavailable', tone: 'neutral', status: null };
}

export function getKycProgress(status: KycStatus) {
  const progress: Record<KycStatus, number> = {
    not_started: 0,
    pending: 50,
    under_review: 75,
    approved: 100,
    rejected: 100,
  };
  return progress[status];
}

export function canSubmitKyc(status: KycStatus) {
  return status === 'not_started' || status === 'rejected';
}

export function maskIdentificationNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Not provided';
  }
  return `•••• ${trimmed.slice(-4)}`;
}
