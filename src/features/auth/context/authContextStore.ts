import { createContext } from 'react';
import type { AuthService } from '../services/authService';
import type { AuthStatus, AuthUser, LoginInput } from '../types/auth';

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  service: AuthService;
  login(input: LoginInput): Promise<void>;
  logout(): Promise<void>;
  refreshSession(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
