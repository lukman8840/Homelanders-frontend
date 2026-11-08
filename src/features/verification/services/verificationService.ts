import type { AxiosInstance } from 'axios';
import { apiClient } from '../../../lib/api/client';
import type { AgentPropertyTask, AgentServiceMode } from '../../agents/types/agent';

export interface VerificationService {
  readonly mode: AgentServiceMode;
  getVerification(id: string): Promise<AgentPropertyTask | null>;
}

export interface VerificationApiContract {
  getVerification(client: AxiosInstance, id: string): Promise<AgentPropertyTask | null>;
}

export class VerificationApiNotConfiguredError extends Error {
  constructor() {
    super('Property verification details are not connected to the backend yet.');
    this.name = 'VerificationApiNotConfiguredError';
  }
}

export function createVerificationService(
  client: AxiosInstance,
  contract?: VerificationApiContract,
): VerificationService {
  if (!contract) {
    return {
      mode: 'api',
      async getVerification() {
        throw new VerificationApiNotConfiguredError();
      },
    };
  }
  return {
    mode: 'api',
    getVerification: (id) => contract.getVerification(client, id),
  };
}

export const verificationApiService = createVerificationService(apiClient);
