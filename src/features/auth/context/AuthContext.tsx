import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { apiClient } from '../../../lib/api/client';
import { createAuthService, type AuthService } from '../services/authService';
import type { AuthStatus, AuthUser, LoginInput } from '../types/auth';
import { AuthContext } from './authContextStore';

interface AuthProviderProps extends PropsWithChildren {
  service?: AuthService;
}

const defaultAuthService = createAuthService(apiClient);

export function AuthProvider({ children, service = defaultAuthService }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>(
    service.isConfigured ? 'loading' : 'unconfigured',
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sessionRequestId = useRef(0);

  const refreshSession = useCallback(async () => {
    const requestId = ++sessionRequestId.current;

    if (!service.isConfigured) {
      setUser(null);
      setError(null);
      setStatus('unconfigured');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const sessionUser = await service.getSession();
      if (requestId !== sessionRequestId.current) {
        return;
      }

      setUser(sessionUser);
      setStatus(sessionUser ? 'authenticated' : 'anonymous');
    } catch (sessionError) {
      if (requestId !== sessionRequestId.current) {
        return;
      }

      setUser(null);
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : 'Unable to check your sign-in status.',
      );
      setStatus('error');
    }
  }, [service]);

  useEffect(() => {
    void refreshSession();
    return () => {
      sessionRequestId.current += 1;
    };
  }, [refreshSession]);

  const login = useCallback(
    async (input: LoginInput) => {
      const requestId = ++sessionRequestId.current;
      const authenticatedUser = await service.login(input);
      if (requestId !== sessionRequestId.current) {
        throw new Error('Your sign-in state changed during the request. Please try again.');
      }

      setUser(authenticatedUser);
      setError(null);
      setStatus('authenticated');
    },
    [service],
  );

  const logout = useCallback(async () => {
    const requestId = ++sessionRequestId.current;
    await service.logout();
    if (requestId !== sessionRequestId.current) {
      return;
    }

    setUser(null);
    setError(null);
    setStatus(service.isConfigured ? 'anonymous' : 'unconfigured');
  }, [service]);

  const value = useMemo(
    () => ({ status, user, error, service, login, logout, refreshSession }),
    [status, user, error, service, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
