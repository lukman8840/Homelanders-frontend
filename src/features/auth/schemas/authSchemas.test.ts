import { describe, expect, it } from 'vitest';
import {
  emailVerificationSchema,
  loginSchema,
  registrationSchema,
  resetPasswordSchema,
} from './authSchemas';

describe('authentication schemas', () => {
  it('accepts email and phone login identifiers', () => {
    const common = { password: 'not-checked-here' };

    expect(loginSchema.safeParse({ ...common, identifier: 'buyer@example.com' }).success).toBe(
      true,
    );
    expect(loginSchema.safeParse({ ...common, identifier: '+234 801 234 5678' }).success).toBe(
      true,
    );
  });

  it('requires valid registration details, matching passwords, and accepted terms', () => {
    const validRegistration = {
      firstName: 'Ada',
      lastName: 'Okafor',
      email: 'ada@example.com',
      phoneNumber: '+234 801 234 5678',
      password: 'Securepass8',
      confirmPassword: 'Securepass8',
      termsAccepted: true,
    };

    expect(registrationSchema.safeParse(validRegistration).success).toBe(true);
    expect(
      registrationSchema.safeParse({ ...validRegistration, confirmPassword: 'different' }).success,
    ).toBe(false);
    expect(
      registrationSchema.safeParse({ ...validRegistration, termsAccepted: false }).success,
    ).toBe(false);
    expect(
      registrationSchema.safeParse({ ...validRegistration, phoneNumber: 'not a phone' }).success,
    ).toBe(false);
  });

  it('requires matching passwords and a reset code', () => {
    expect(
      resetPasswordSchema.safeParse({
        resetCode: 'code',
        password: 'new-password',
        confirmPassword: 'new-password',
      }).success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        resetCode: '',
        password: 'new-password',
        confirmPassword: 'different',
      }).success,
    ).toBe(false);
  });

  it('requires a valid email address and verification code', () => {
    expect(
      emailVerificationSchema.safeParse({
        email: 'buyer@example.com',
        verificationCode: '123456',
      }).success,
    ).toBe(true);
    expect(
      emailVerificationSchema.safeParse({ email: 'invalid', verificationCode: '' }).success,
    ).toBe(false);
  });
});
