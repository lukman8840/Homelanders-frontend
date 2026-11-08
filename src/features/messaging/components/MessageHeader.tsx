import { ArrowLeft } from 'lucide-react';
import type { Conversation } from '../types/messaging';
import { PropertyConversationCard } from './PropertyConversationCard';

export function MessageHeader({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const contact =
    conversation.participants.find((participant) => !participant.isCurrentUser) ??
    conversation.participants[0];

  return (
    <header className='grid gap-3 border-b border-border p-3 sm:p-4'>
      <div className='flex min-w-0 items-center gap-3'>
        <button
          aria-label='Back to conversations'
          className='inline-flex size-10 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-background md:hidden'
          onClick={onBack}
          type='button'
        >
          <ArrowLeft aria-hidden='true' size={19} />
        </button>
        <div className='min-w-0'>
          <h2 className='truncate text-sm font-semibold text-text-primary'>
            {contact?.displayName ?? 'Property contact'}
          </h2>
          <p className='mt-0.5 text-xs text-text-muted'>About this property listing</p>
        </div>
      </div>
      <PropertyConversationCard property={conversation.property} />
    </header>
  );
}
