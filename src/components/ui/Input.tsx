import { useId, type ComponentPropsWithoutRef } from 'react';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  hint?: string;
  error?: string;
}

export function Input({ id, label, hint, error, className = '', ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <div className='grid gap-1.5'>
      <label className='text-sm font-medium text-text-primary' htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-describedby={hint || error ? descriptionId : undefined}
        aria-invalid={error ? true : undefined}
        className={`min-h-11 w-full rounded-control border border-border bg-white px-3.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-soft ${error ? 'border-red-600 focus:border-red-600 focus:ring-red-100' : ''} ${className}`.trim()}
        id={inputId}
        {...props}
      />
      {error || hint ? (
        <p className={`text-xs ${error ? 'text-red-700' : 'text-text-muted'}`} id={descriptionId}>
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
