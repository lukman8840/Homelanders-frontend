import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import type { AuthService } from '../services/authService';
import type { AuthUser } from '../types/auth';
import { ProtectedRoute, RoleBasedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
  it('does not render protected content when authentication is unconfigured', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute>
            <h1>Private dashboard</h1>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByRole('heading', { name: 'Private dashboard' })).not.toBeInTheDocument();
    expect(screen.getByText(/sign-in is not connected/i)).toBeVisible();
  });

  it('denies a normalized user role that is not included in the route policy', async () => {
    const user: AuthUser = { id: 'test-user', roles: ['buyer'] };
    const service: AuthService = {
      isConfigured: true,
      getSession: async () => user,
      login: async () => user,
      register: async () => {},
      requestPasswordReset: async () => {},
      resetPassword: async () => {},
      verifyEmail: async () => {},
      logout: async () => {},
    };

    render(
      <MemoryRouter>
        <AuthProvider service={service}>
          <RoleBasedRoute roles={['admin']}>
            <h1>Admin only</h1>
          </RoleBasedRoute>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/does not have permission/i)).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Admin only' })).not.toBeInTheDocument();
  });
});
