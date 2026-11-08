import { getKycStatus } from '../utils/kycStatus';

const toneClasses = {
  neutral: 'bg-background text-text-muted',
  info: 'bg-blue-50 text-blue-800',
  warning: 'bg-amber-50 text-amber-800',
  success: 'bg-green-50 text-green-800',
  danger: 'bg-red-50 text-red-800',
};

export function KycStatusBadge({ rawStatus }: { rawStatus: string }) {
  const status = getKycStatus(rawStatus);
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[status.tone]}`}
    >
      {status.label}
    </span>
  );
}
