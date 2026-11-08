import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { AuthNotConfiguredError } from '../services/authService';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ResetPasswordPage } from './ResetPasswordPage';
import { EmailVerificationPage } from './EmailVerificationPage';

function renderAuthPage(page: ReactNode) {
  return render(
    <MemoryRouter>
      <AuthProvider>{page}</AuthProvider>
    </MemoryRouter>,
  );
}

describe('authentication pages', () => {
  it('shows accessible login validation and explains auth is not configured on submit', async () => {
    const user = userEvent.setup();
    renderAuthPage(<LoginPage />);

    expect(screen.getByLabelText('Email address or phone number')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Enter your email address or phone number.')).toBeVisible();

    await user.type(screen.getByLabelText('Email address or phone number'), 'buyer@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      new AuthNotConfiguredError().message,
    );
  });

  it('shows registration requirements and password mismatch validation', async () => {
    const user = userEvent.setup();
    renderAuthPage(<RegisterPage />);

    expect(screen.getByLabelText('First name')).toBeVisible();
    expect(screen.getByLabelText('Phone number')).toBeVisible();
    expect(screen.getByRole('checkbox')).toBeVisible();

    await user.type(screen.getByLabelText('First name'), 'Ada');
    await user.type(screen.getByLabelText('Last name'), 'Okafor');
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await user.type(screen.getByLabelText('Phone number'), '+234 801 234 5678');
    await user.type(screen.getByLabelText('Password'), 'Securepass8');
    await user.type(screen.getByLabelText('Confirm password'), 'Differentpass8');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Passwords do not match.')).toBeVisible();
  });

  it('provides reset, new-password, and email-verification forms', async () => {
    const user = userEvent.setup();

    const resetView = renderAuthPage(<ForgotPasswordPage />);
    expect(screen.getByLabelText('Email address')).toBeVisible();
    resetView.unmount();

    const passwordView = renderAuthPage(<ResetPasswordPage />);
    expect(screen.getByLabelText('Reset code')).toBeVisible();
    expect(screen.getByLabelText('New password')).toBeVisible();
    passwordView.unmount();

    renderAuthPage(<EmailVerificationPage />);
    expect(screen.getByLabelText('Verification code')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Verify email' }));
    expect(await screen.findByText('Enter a valid email address.')).toBeVisible();
  });
});
