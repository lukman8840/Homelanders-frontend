import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../context/useAuth';
import { AuthFeedback } from '../components/AuthFeedback';
import { AuthLink } from '../components/AuthLink';
import { AuthPageCard } from '../components/AuthPageCard';
import { passwordResetRequestSchema } from '../schemas/authSchemas';
import type { PasswordResetRequestInput } from '../types/auth';

export function ForgotPasswordPage() {
  const { service } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestInput>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await service.requestPasswordReset(values);
      setSubmitSuccess(
        'If an account matches that email, reset instructions will be sent. Check your inbox.',
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'We could not request a reset. Please try again.',
      );
    }
  });

  return (
    <AuthPageCard
      description='Enter the email address associated with your account to request reset instructions.'
      title='Forgot your password?'
      footer={
        <p className='text-sm text-text-muted'>
          Remembered it? <AuthLink to='/login'>Back to sign in</AuthLink>
        </p>
      }
    >
      <form className='grid gap-4' noValidate onSubmit={onSubmit}>
        {submitError ? <AuthFeedback kind='error'>{submitError}</AuthFeedback> : null}
        {submitSuccess ? <AuthFeedback kind='success'>{submitSuccess}</AuthFeedback> : null}
        <Input
          autoComplete='email'
          error={errors.email?.message}
          label='Email address'
          placeholder='you@example.com'
          type='email'
          {...register('email')}
        />
        <Button className='w-full' disabled={isSubmitting} type='submit'>
          {isSubmitting ? 'Requesting…' : 'Request reset instructions'}
        </Button>
      </form>
    </AuthPageCard>
  );
}
