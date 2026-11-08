import { useCallback, useEffect, useState } from 'react';
import { agentDashboardService } from '../services/configuredAgentServices';
import type { AgentDashboardSummary } from '../types/agent';

export function useAgentDashboard() {
  const [summary, setSummary] = useState<AgentDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await agentDashboardService.getSummary());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load agent tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { summary, loading, error, reload, mode: agentDashboardService.mode };
}
