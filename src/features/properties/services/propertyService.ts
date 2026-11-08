import type { AxiosInstance } from 'axios';
import type { Property, PropertyFilters } from '../types/property';

export interface PropertyService {
  readonly isConfigured: boolean;
  list(filters: PropertyFilters): Promise<Property[]>;
  getById(id: string): Promise<Property | null>;
}

/**
 * TODO(property API): define paths, query serialization, pagination, and response normalization
 * after the property API contract is agreed with the backend team.
 */
export interface PropertyApiContract {
  list(client: AxiosInstance, filters: PropertyFilters): Promise<Property[]>;
  getById(client: AxiosInstance, id: string): Promise<Property | null>;
}

export class PropertyApiNotConfiguredError extends Error {
  constructor() {
    super('Property listings are not connected to the backend yet.');
    this.name = 'PropertyApiNotConfiguredError';
  }
}

export function createPropertyService(
  client: AxiosInstance,
  contract?: PropertyApiContract,
): PropertyService {
  if (!contract) {
    const unavailable = async (): Promise<never> => {
      throw new PropertyApiNotConfiguredError();
    };

    return {
      isConfigured: false,
      list: unavailable,
      getById: unavailable,
    };
  }

  return {
    isConfigured: true,
    list: (filters) => contract.list(client, filters),
    getById: (id) => contract.getById(client, id),
  };
}
