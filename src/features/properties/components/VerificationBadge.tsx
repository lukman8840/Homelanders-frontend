import { BadgeCheck, CircleHelp } from 'lucide-react';
import type { PropertyVerificationStatus } from '../types/property';

interface VerificationBadgeProps {
  status: PropertyVerificationStatus;
  isSample?: boolean;
}

const verificationLabels: Record<PropertyVerificationStatus, string> = {
  verified: 'Verified',
  pending: 'Verification pending',
  unverified: 'Not verified',
};

export function VerificationBadge({ status, isSample = false }: VerificationBadgeProps) {
  const isVerified = status === 'verified';
  const Icon = isVerified ? BadgeCheck : CircleHelp;
  const label = verificationLabels[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isVerified ? 'bg-brand-soft text-brand-primary' : 'bg-stone-100 text-stone-700'
      }`}
      title={
        isSample
          ? 'Illustrative sample status only; it does not indicate real-world verification.'
          : 'Property verification status'
      }
    >
      <Icon aria-hidden='true' size={13} />
      {isSample ? `Example · ${label.toLocaleLowerCase()}` : label}
    </span>
  );
}
