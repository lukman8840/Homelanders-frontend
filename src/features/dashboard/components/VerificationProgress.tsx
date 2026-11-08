import styled from 'styled-components';
import type { PropertyStatus } from '../types/propertyOwner';

const progressByStatus: Record<PropertyStatus, number> = {
  draft: 0,
  submitted: 25,
  pending_verification: 50,
  under_review: 75,
  verified: 100,
  rejected: 100,
};

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => `${$progress}%`};
  transition: width 200ms ease;
`;

const progressLabels = ['Submitted', 'Pending verification', 'Under review', 'Decision'];

interface VerificationProgressProps {
  status: PropertyStatus;
}

export function VerificationProgress({ status }: VerificationProgressProps) {
  const progress = progressByStatus[status];

  return (
    <div aria-label={`Verification progress: ${progress}%`} role='group'>
      <div aria-hidden='true' className='h-2 overflow-hidden rounded-full bg-border'>
        <ProgressFill
          $progress={progress}
          className={`h-full rounded-full ${status === 'rejected' ? 'bg-red-600' : 'bg-brand-primary'}`}
        />
      </div>
      <ol className='mt-3 grid grid-cols-2 gap-2 text-xs text-text-muted sm:grid-cols-4'>
        {progressLabels.map((label, index) => (
          <li
            className={index * 25 < progress ? 'font-semibold text-text-primary' : ''}
            key={label}
          >
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
