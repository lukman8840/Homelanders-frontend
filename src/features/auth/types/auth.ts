export type AuthRole = 'buyer' | 'property-owner' | 'agent-applicant' | 'approved-agent' | 'admin';

export interface AuthUser {
  id: string;
  displayName?: string;
  roles: AuthRole[];
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface RegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface PasswordResetRequestInput {
  email: string;
}

export interface PasswordResetInput {
  resetCode: string;
  password: string;
  confirmPassword: string;
}

export interface EmailVerificationInput {
  email: string;
  verificationCode: string;
}

export type AuthStatus = 'unconfigured' | 'loading' | 'anonymous' | 'authenticated' | 'error';
