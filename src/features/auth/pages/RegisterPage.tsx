import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../context/useAuth';
import { AuthFeedback } from '../components/AuthFeedback';
import { AuthLink } from '../components/AuthLink';
import { AuthPageCard } from '../components/AuthPageCard';
import { PasswordField } from '../components/PasswordField';
import { registrationSchema } from '../schemas/authSchemas';
import type { RegistrationInput } from '../types/auth';

export function RegisterPage() {
  const { service } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await service.register(values);
      setSubmitSuccess('Your registration was submitted successfully.');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'We could not complete registration. Try again.',
      );
    }
  });

  return (
    <AuthPageCard
      description='Create an account to get started with HomeLander.'
      title='Create your account'
      footer={
        <p className='text-sm text-text-muted'>
          Already have an account? <AuthLink to='/login'>Sign in</AuthLink>
        </p>
      }
    >
      <form className='grid gap-4' noValidate onSubmit={onSubmit}>
        {submitError ? <AuthFeedback kind='error'>{submitError}</AuthFeedback> : null}
        {submitSuccess ? <AuthFeedback kind='success'>{submitSuccess}</AuthFeedback> : null}
        <div className='grid gap-4 sm:grid-cols-2'>
          <Input
            autoComplete='given-name'
            error={errors.firstName?.message}
            label='First name'
            {...register('firstName')}
          />
          <Input
            autoComplete='family-name'
            error={errors.lastName?.message}
            label='Last name'
            {...register('lastName')}
          />
        </div>
        <Input
          autoComplete='email'
          error={errors.email?.message}
          label='Email address'
          placeholder='you@example.com'
          type='email'
          {...register('email')}
        />
        <Input
          autoComplete='tel'
          error={errors.phoneNumber?.message}
          hint='Include your country code if you have one.'
          label='Phone number'
          placeholder='+234 801 234 5678'
          type='tel'
          {...register('phoneNumber')}
        />
        <PasswordField
          autoComplete='new-password'
          error={errors.password?.message}
          hint='Use at least 8 characters.'
          label='Password'
          {...register('password')}
        />
        <PasswordField
          autoComplete='new-password'
          error={errors.confirmPassword?.message}
          label='Confirm password'
          {...register('confirmPassword')}
        />
        <div>
          <label className='flex items-start gap-2.5 text-sm leading-5 text-text-muted'>
            <input
              className='mt-1 size-4 shrink-0 accent-brand-primary'
              type='checkbox'
              {...register('termsAccepted')}
            />
            <span>
              I agree to the{' '}
              <span className='font-semibold text-text-primary'>Terms and Conditions</span>.
            </span>
          </label>
          {errors.termsAccepted?.message ? (
            <p className='mt-1.5 text-xs text-red-700' role='alert'>
              {errors.termsAccepted.message}
            </p>
          ) : null}
        </div>
        <Button className='mt-1 w-full' disabled={isSubmitting} type='submit'>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthPageCard>
  );
}
