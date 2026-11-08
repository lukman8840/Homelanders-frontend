import { z } from 'zod';

const emailSchema = z.email('Enter a valid email address.');

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s()-]+$/, 'Enter a valid phone number.')
  .refine((value) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }, 'Enter a phone number with 7 to 15 digits.');

const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters for your password.')
  .max(128, 'Password must be 128 characters or fewer.');

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Enter your email address or phone number.')
    .refine(
      (value) => emailSchema.safeParse(value).success || phoneSchema.safeParse(value).success,
      'Enter a valid email address or phone number.',
    ),
  password: z.string().min(1, 'Enter your password.'),
});

export const registrationSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Enter your first name.').max(80),
    lastName: z.string().trim().min(1, 'Enter your last name.').max(80),
    email: emailSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
    termsAccepted: z.boolean().refine((accepted) => accepted, {
      message: 'You must agree to the Terms and Conditions.',
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    resetCode: z.string().trim().min(1, 'Enter the reset code from your email.'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const emailVerificationSchema = z.object({
  email: emailSchema,
  verificationCode: z.string().trim().min(1, 'Enter the verification code.'),
});
