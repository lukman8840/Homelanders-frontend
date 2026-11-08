import { formatMessageTime } from '../utils/formatMessageTime';
import type { Conversation } from '../types/messaging';
import { UnreadMessageBadge } from './UnreadMessageBadge';

interface ConversationItemProps {
  conversation: Conversation;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function ConversationItem({ conversation, selected, onSelect }: ConversationItemProps) {
  const preview = conversation.latestMessage?.body ?? 'No messages yet';

  return (
    <button
      aria-current={selected ? 'true' : undefined}
      className={`flex w-full items-start gap-3 rounded-control p-3 text-left transition-colors ${
        selected ? 'bg-brand-soft' : 'hover:bg-background'
      }`}
      onClick={() => onSelect(conversation.id)}
      type='button'
    >
      <img
        alt=''
        className='size-12 shrink-0 rounded-control object-cover'
        src={conversation.property.imageUrl}
      />
      <span className='min-w-0 flex-1'>
        <span className='flex items-center justify-between gap-2'>
          <span className='truncate text-sm font-semibold text-text-primary'>
            {conversation.property.title}
          </span>
          <span className='shrink-0 text-[0.7rem] text-text-muted'>
            {conversation.latestMessage ? formatMessageTime(conversation.latestMessage.sentAt) : ''}
          </span>
        </span>
        <span className='mt-1 flex items-center justify-between gap-2'>
          <span className='truncate text-xs text-text-muted'>{preview}</span>
          <UnreadMessageBadge count={conversation.unreadCount} />
        </span>
      </span>
    </button>
  );
}
