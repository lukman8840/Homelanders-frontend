import { describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../lib/api/client';
import { sampleProperties } from '../data/sampleProperties';
import { PropertyApiNotConfiguredError, createPropertyService } from './propertyService';

describe('property service boundary', () => {
  it('fails explicitly until a backend contract is configured', async () => {
    const service = createPropertyService(apiClient);
    const filters = {
      query: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '' as const,
      minBedrooms: '',
      minBathrooms: '',
      sortBy: 'newest' as const,
    };

    expect(service.isConfigured).toBe(false);
    await expect(service.list(filters)).rejects.toBeInstanceOf(PropertyApiNotConfiguredError);
  });

  it('delegates list and detail requests to the injected contract', async () => {
    const list = vi.fn().mockResolvedValue(sampleProperties);
    const getById = vi.fn().mockResolvedValue(sampleProperties[0]);
    const service = createPropertyService(apiClient, { list, getById });
    const filters = {
      query: 'Jabi',
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '' as const,
      minBedrooms: '',
      minBathrooms: '',
      sortBy: 'newest' as const,
    };

    await expect(service.list(filters)).resolves.toEqual(sampleProperties);
    await expect(service.getById(sampleProperties[0].id)).resolves.toEqual(sampleProperties[0]);
    expect(list).toHaveBeenCalledWith(apiClient, filters);
    expect(getById).toHaveBeenCalledWith(apiClient, sampleProperties[0].id);
  });
});
