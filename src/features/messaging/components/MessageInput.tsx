import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { messageSchema } from '../schemas/messageSchema';

export function MessageInput({
  onSend,
  disabled = false,
}: {
  onSend: (body: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = messageSchema.safeParse({ body });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Enter a message.');
      return;
    }

    setSending(true);
    setError(null);
    try {
      await onSend(result.data.body);
      setBody('');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to send this message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form className='border-t border-border bg-white p-3 sm:p-4' onSubmit={handleSubmit}>
      <label className='sr-only' htmlFor='message-composer'>
        Write a message
      </label>
      <div className='flex items-end gap-2'>
        <textarea
          className='min-h-11 max-h-36 min-w-0 flex-1 resize-y rounded-control border border-border bg-white px-3.5 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
          disabled={disabled || sending}
          id='message-composer'
          onChange={(event) => {
            setBody(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder='Write a message…'
          value={body}
        />
        <Button
          aria-label={sending ? 'Sending message' : 'Send message'}
          className='shrink-0 px-4'
          disabled={disabled || sending}
          type='submit'
        >
          <Send aria-hidden='true' size={17} />
          <span className='hidden sm:inline'>{sending ? 'Sending…' : 'Send'}</span>
        </Button>
      </div>
      <div className='mt-1 flex min-h-5 items-center justify-between gap-3'>
        {error ? (
          <p className='text-xs text-red-700' role='alert'>
            {error}
          </p>
        ) : (
          <span className='text-xs text-text-muted'>
            Enter to send · Shift+Enter for a new line
          </span>
        )}
        {disabled ? (
          <span className='text-xs text-text-muted'>No conversation selected</span>
        ) : null}
      </div>
    </form>
  );
}
