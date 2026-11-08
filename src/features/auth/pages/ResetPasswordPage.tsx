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
import { resetPasswordSchema } from '../schemas/authSchemas';
import type { PasswordResetInput } from '../types/auth';

export function ResetPasswordPage() {
  const { service } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      resetCode: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await service.resetPassword(values);
      setSubmitSuccess('Your password has been updated. You can now sign in.');
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not reset your password. Please try again.',
      );
    }
  });

  return (
    <AuthPageCard
      description='Enter the reset code from your email and choose a new password.'
      title='Reset your password'
      footer={
        <p className='text-sm text-text-muted'>
          Need a new code? <AuthLink to='/forgot-password'>Request reset instructions</AuthLink>
        </p>
      }
    >
      <form className='grid gap-4' noValidate onSubmit={onSubmit}>
        {submitError ? <AuthFeedback kind='error'>{submitError}</AuthFeedback> : null}
        {submitSuccess ? <AuthFeedback kind='success'>{submitSuccess}</AuthFeedback> : null}
        <Input
          autoComplete='one-time-code'
          error={errors.resetCode?.message}
          label='Reset code'
          {...register('resetCode')}
        />
        <PasswordField
          error={errors.password?.message}
          hint='Use at least 8 characters.'
          label='New password'
          {...register('password')}
        />
        <PasswordField
          error={errors.confirmPassword?.message}
          label='Confirm new password'
          {...register('confirmPassword')}
        />
        <Button className='w-full' disabled={isSubmitting} type='submit'>
          {isSubmitting ? 'Updating password…' : 'Update password'}
        </Button>
      </form>
    </AuthPageCard>
  );
}
