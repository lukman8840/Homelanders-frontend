import type { Message } from '../types/messaging';
import { formatMessageDateTime } from '../utils/formatMessageTime';

export function MessageBubble({
  message,
  isOwnMessage,
}: {
  message: Message;
  isOwnMessage: boolean;
}) {
  return (
    <article className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
          isOwnMessage
            ? 'rounded-br-sm bg-brand-primary text-white'
            : 'rounded-bl-sm border border-border bg-white text-text-primary'
        }`}
      >
        {!isOwnMessage ? (
          <p className='mb-1 text-[0.7rem] font-semibold opacity-75'>
            {message.sender.displayName}
          </p>
        ) : null}
        <p className='whitespace-pre-wrap break-words text-sm leading-6'>{message.body}</p>
        <div className='mt-1 flex items-center justify-end gap-1.5'>
          <time
            className={`text-[0.65rem] ${isOwnMessage ? 'text-white/75' : 'text-text-muted'}`}
            dateTime={message.sentAt}
          >
            {formatMessageDateTime(message.sentAt)}
          </time>
          {isOwnMessage ? (
            <span className='text-[0.65rem] text-white/75'>
              {message.status === 'read'
                ? 'Read'
                : message.status === 'sending'
                  ? 'Sending'
                  : 'Sent'}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
