import { apiClient } from '../../../lib/api/client';
import { describe, expect, it } from 'vitest';
import { createAuthRoleMapper } from './authRoleMapping';
import { AuthNotConfiguredError, createAuthService } from './authService';

describe('authentication service boundary', () => {
  it('rejects auth actions explicitly when no backend contract is configured', async () => {
    const service = createAuthService(apiClient);

    expect(service.isConfigured).toBe(false);
    await expect(
      service.login({ identifier: 'buyer@example.com', password: 'password' }),
    ).rejects.toBeInstanceOf(AuthNotConfiguredError);
  });

  it('maps backend role values only through caller-provided configuration', () => {
    const mapRoles = createAuthRoleMapper({
      marketplace_customer: ['buyer'],
      owner_review_pending: ['property-owner', 'agent-applicant'],
    });

    expect(mapRoles(['marketplace_customer', 'owner_review_pending', 'unknown'])).toEqual([
      'buyer',
      'property-owner',
      'agent-applicant',
    ]);
  });
});
