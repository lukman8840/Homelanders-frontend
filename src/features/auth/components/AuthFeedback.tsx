interface AuthFeedbackProps {
  kind: 'error' | 'success' | 'info';
  children: string;
}

const kindClasses = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-900',
  info: 'border-border bg-background text-text-muted',
} as const;

export function AuthFeedback({ kind, children }: AuthFeedbackProps) {
  return (
    <p
      aria-live='polite'
      className={`rounded-control border px-3.5 py-3 text-sm leading-5 ${kindClasses[kind]}`}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
}
