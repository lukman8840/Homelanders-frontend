import type { KycRecord } from '../types/kyc';
import type { KycService } from './kycService';

const initialRecord: KycRecord = {
  status: 'rejected',
  rawStatus: 'rejected',
  submittedAt: '2026-10-12T10:00:00.000Z',
  updatedAt: '2026-10-17T10:00:00.000Z',
  adminFeedback: 'We could not match the document image to the selected document type.',
  rejectionReason: 'The uploaded identity document was unclear. Upload a clear, complete image.',
};

let currentRecord = { ...initialRecord };

export const kycMockService: KycService = {
  mode: 'mock',
  async getCurrent() {
    return { ...currentRecord };
  },
  async submit() {
    const now = new Date().toISOString();
    currentRecord = {
      status: 'pending',
      rawStatus: 'pending',
      submittedAt: now,
      updatedAt: now,
    };
    return { ...currentRecord };
  },
};

export function resetKycMockData() {
  currentRecord = { ...initialRecord };
}
