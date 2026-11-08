import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import type { ComponentPropsWithoutRef } from 'react';

type PasswordFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'label' | 'type'> & {
  label: string;
  hint?: string;
  error?: string;
};

export function PasswordField({ label, hint, error, ...props }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className='relative'>
      <Input
        autoComplete='new-password'
        className='pr-12'
        error={error}
        hint={hint}
        label={label}
        type={isVisible ? 'text' : 'password'}
        {...props}
      />
      <button
        aria-label={
          isVisible ? `Hide ${label.toLocaleLowerCase()}` : `Show ${label.toLocaleLowerCase()}`
        }
        className='absolute right-2 top-[2.05rem] grid size-9 place-items-center rounded-lg text-text-muted hover:bg-background hover:text-text-primary'
        onClick={() => setIsVisible((visible) => !visible)}
        type='button'
      >
        {isVisible ? <EyeOff aria-hidden='true' size={17} /> : <Eye aria-hidden='true' size={17} />}
      </button>
    </div>
  );
}
