import styled from 'styled-components';
import { getKycProgress } from '../utils/kycStatus';
import type { KycStatus } from '../types/kyc';

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => `${$progress}%`};
  transition: width 200ms ease;
`;

const stages = ['Submitted', 'Under Review', 'Decision'];

export function KycProgress({ status }: { status: KycStatus }) {
  const progress = getKycProgress(status);
  return (
    <div aria-label={`Identity verification progress: ${progress}%`} role='group'>
      <div aria-hidden='true' className='h-2 overflow-hidden rounded-full bg-border'>
        <ProgressFill
          $progress={progress}
          className={`h-full rounded-full ${status === 'rejected' ? 'bg-red-600' : 'bg-brand-primary'}`}
        />
      </div>
      <ol className='mt-3 grid grid-cols-3 text-xs text-text-muted'>
        {stages.map((stage, index) => (
          <li
            className={index * 50 < progress ? 'font-semibold text-text-primary' : ''}
            key={stage}
          >
            {stage}
          </li>
        ))}
      </ol>
    </div>
  );
}
