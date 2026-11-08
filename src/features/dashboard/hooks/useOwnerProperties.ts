import { useCallback, useEffect, useState } from 'react';
import { propertyOwnerService } from '../services/configuredPropertyOwnerService';
import type { OwnerProperty } from '../types/propertyOwner';

export function useOwnerProperties() {
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProperties(await propertyOwnerService.list());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load your properties.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { properties, loading, error, reload, mode: propertyOwnerService.mode };
}
