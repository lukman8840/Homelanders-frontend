import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../context/useAuth';
import { AuthFeedback } from '../components/AuthFeedback';
import { AuthLink } from '../components/AuthLink';
import { AuthPageCard } from '../components/AuthPageCard';
import { PasswordField } from '../components/PasswordField';
import { loginSchema } from '../schemas/authSchemas';
import type { LoginInput } from '../types/auth';

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const returnPath = (location.state as LoginLocationState | null)?.from?.pathname ?? '/dashboard';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login(values);
      navigate(returnPath, { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'We could not sign you in. Please try again.',
      );
    }
  });

  return (
    <AuthPageCard
      description='Sign in to continue to your HomeLander account.'
      title='Welcome back'
      footer={
        <p className='text-sm text-text-muted'>
          New to HomeLander? <AuthLink to='/register'>Create an account</AuthLink>
        </p>
      }
    >
      <form className='grid gap-4' noValidate onSubmit={onSubmit}>
        {submitError ? <AuthFeedback kind='error'>{submitError}</AuthFeedback> : null}
        <Input
          autoComplete='username'
          error={errors.identifier?.message}
          label='Email address or phone number'
          placeholder='you@example.com or +234…'
          {...register('identifier')}
        />
        <div className='grid gap-2'>
          <PasswordField
            autoComplete='current-password'
            error={errors.password?.message}
            label='Password'
            {...register('password')}
          />
          <Link
            className='justify-self-end text-sm font-medium text-brand-primary hover:underline'
            to='/forgot-password'
          >
            Forgot password?
          </Link>
        </div>
        <Button className='mt-1 w-full' disabled={isSubmitting} type='submit'>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthPageCard>
  );
}
