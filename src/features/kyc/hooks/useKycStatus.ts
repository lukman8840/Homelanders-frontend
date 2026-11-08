import { useCallback, useEffect, useState } from 'react';
import { kycService } from '../services/configuredKycService';
import type { KycRecord } from '../types/kyc';

export function useKycStatus() {
  const [record, setRecord] = useState<KycRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRecord(await kycService.getCurrent());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load KYC status.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { record, loading, error, reload, mode: kycService.mode };
}
