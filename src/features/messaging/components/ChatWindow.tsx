import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import type { Conversation, Message } from '../types/messaging';
import { MessageBubble } from './MessageBubble';
import { MessageHeader } from './MessageHeader';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  loadingOlder: boolean;
  hasOlderMessages: boolean;
  onBack: () => void;
  onSend: (body: string) => Promise<void>;
  onLoadOlder: () => void;
}

export function ChatWindow({
  conversation,
  messages,
  loading,
  loadingOlder,
  hasOlderMessages,
  onBack,
  onSend,
  onLoadOlder,
}: ChatWindowProps) {
  if (!conversation) {
    return (
      <div className='grid min-h-[32rem] place-items-center p-5'>
        <EmptyState
          description='Select a property conversation to see its messages, or start one from a listing.'
          title='Choose a conversation'
        />
      </div>
    );
  }

  const currentUserId = conversation.participants.find(
    (participant) => participant.isCurrentUser,
  )?.id;

  return (
    <section
      aria-label={`Conversation about ${conversation.property.title}`}
      className='flex min-h-[32rem] flex-1 flex-col'
    >
      <MessageHeader conversation={conversation} onBack={onBack} />
      <div
        aria-live='polite'
        className='flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-background/50 p-3 sm:p-5'
      >
        {hasOlderMessages ? (
          <button
            className='mx-auto min-h-9 rounded-control px-3 text-xs font-semibold text-brand-primary hover:bg-brand-soft disabled:opacity-60'
            disabled={loadingOlder}
            onClick={onLoadOlder}
            type='button'
          >
            {loadingOlder ? 'Loading older messages…' : 'Load older messages'}
          </button>
        ) : null}
        {loading ? (
          <div className='flex flex-1 items-center justify-center'>
            <LoadingIndicator label='Loading messages' />
          </div>
        ) : messages.length ? (
          messages.map((message) => (
            <MessageBubble
              isOwnMessage={message.sender.id === currentUserId}
              key={message.id}
              message={message}
            />
          ))
        ) : (
          <div className='flex flex-1 items-center justify-center text-center'>
            <p className='max-w-sm text-sm leading-6 text-text-muted'>
              No messages in this conversation yet. Send a message to get started.
            </p>
          </div>
        )}
      </div>
      <MessageInput onSend={onSend} />
    </section>
  );
}
