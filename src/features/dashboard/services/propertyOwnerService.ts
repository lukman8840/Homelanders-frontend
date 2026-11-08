import type { AxiosInstance } from 'axios';
import { apiClient } from '../../../lib/api/client';
import type {
  OwnerProperty,
  PropertyFormValues,
  PropertyServiceMode,
} from '../types/propertyOwner';

export interface PropertyOwnerService {
  readonly mode: PropertyServiceMode;
  list(): Promise<OwnerProperty[]>;
  getById(id: string): Promise<OwnerProperty | null>;
  saveDraft(input: PropertyFormValues, id?: string): Promise<OwnerProperty>;
  submit(input: PropertyFormValues, id?: string): Promise<OwnerProperty>;
}

/**
 * Implement this adapter only after the backend confirms its routes, request/response
 * contract, verification statuses, and upload/storage rules.
 */
export interface PropertyOwnerApiContract {
  list(client: AxiosInstance): Promise<OwnerProperty[]>;
  getById(client: AxiosInstance, id: string): Promise<OwnerProperty | null>;
  saveDraft(client: AxiosInstance, input: PropertyFormValues, id?: string): Promise<OwnerProperty>;
  submit(client: AxiosInstance, input: PropertyFormValues, id?: string): Promise<OwnerProperty>;
}

export class PropertyOwnerApiNotConfiguredError extends Error {
  constructor() {
    super('Property owner submissions are not connected to the backend yet.');
    this.name = 'PropertyOwnerApiNotConfiguredError';
  }
}

export function createPropertyOwnerApiService(
  client: AxiosInstance,
  contract?: PropertyOwnerApiContract,
): PropertyOwnerService {
  if (!contract) {
    const unavailable = async (): Promise<never> => {
      throw new PropertyOwnerApiNotConfiguredError();
    };

    return {
      mode: 'api',
      list: unavailable,
      getById: unavailable,
      saveDraft: unavailable,
      submit: unavailable,
    };
  }

  return {
    mode: 'api',
    list: () => contract.list(client),
    getById: (id) => contract.getById(client, id),
    saveDraft: (input, id) => contract.saveDraft(client, input, id),
    submit: (input, id) => contract.submit(client, input, id),
  };
}

export const propertyOwnerApiService = createPropertyOwnerApiService(apiClient);
