import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../context/useAuth';
import { AuthFeedback } from '../components/AuthFeedback';
import { AuthPageCard } from '../components/AuthPageCard';
import { AuthLink } from '../components/AuthLink';
import { emailVerificationSchema } from '../schemas/authSchemas';
import type { EmailVerificationInput } from '../types/auth';

export function EmailVerificationPage() {
  const { service } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerificationInput>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await service.verifyEmail(values);
      setSubmitSuccess('Your email address has been verified.');
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not verify your email. Please try again.',
      );
    }
  });

  return (
    <AuthPageCard
      description='Enter your email address and the verification code you received.'
      title='Verify your email'
      footer={
        <p className='text-sm text-text-muted'>
          Need to sign in? <AuthLink to='/login'>Back to sign in</AuthLink>
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
        <Input
          autoComplete='one-time-code'
          error={errors.verificationCode?.message}
          label='Verification code'
          {...register('verificationCode')}
        />
        <Button className='w-full' disabled={isSubmitting} type='submit'>
          {isSubmitting ? 'Verifying…' : 'Verify email'}
        </Button>
      </form>
    </AuthPageCard>
  );
}
