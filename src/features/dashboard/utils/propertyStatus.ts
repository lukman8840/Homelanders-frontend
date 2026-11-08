import {
  PROPERTY_STATUS_CONFIG,
  PROPERTY_STATUS_MAPPING,
  type PropertyStatus,
  type PropertyStatusConfig,
  type PropertyStatusDisplay,
} from '../types/propertyOwner';

export function getPropertyStatus(
  rawStatus: string,
  mapping: Record<string, PropertyStatus> = PROPERTY_STATUS_MAPPING,
  config: Record<PropertyStatus, PropertyStatusConfig> = PROPERTY_STATUS_CONFIG,
): PropertyStatusDisplay {
  const status = mapping[rawStatus.trim().toLowerCase().replaceAll('-', '_')] ?? null;

  if (!status) {
    return { label: 'Status unavailable', tone: 'neutral', status: null };
  }

  return { ...config[status], status };
}

export function isPropertyEditable(status: PropertyStatus) {
  return status === 'draft' || status === 'rejected';
}

export function isAwaitingVerification(status: PropertyStatus) {
  return status === 'submitted' || status === 'pending_verification' || status === 'under_review';
}
