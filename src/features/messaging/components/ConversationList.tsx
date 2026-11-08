import { useMemo, useState } from 'react';
import { Input } from '../../../components/ui/Input';
import type { Conversation } from '../types/messaging';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelect,
}: ConversationListProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return conversations;
    return conversations.filter((conversation) =>
      [
        conversation.property.title,
        conversation.property.location,
        conversation.latestMessage?.body ?? '',
      ]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalized),
    );
  }, [conversations, query]);

  return (
    <section aria-label='Conversations' className='flex min-h-[32rem] flex-col'>
      <div className='border-b border-border p-4'>
        <h2 className='text-lg font-semibold text-text-primary'>Conversations</h2>
        <div className='mt-3'>
          <Input
            label='Search conversations'
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search by property or message'
            type='search'
            value={query}
          />
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className='grid gap-1 overflow-y-auto p-2'>
          {filtered.map((conversation) => (
            <ConversationItem
              conversation={conversation}
              key={conversation.id}
              onSelect={onSelect}
              selected={conversation.id === selectedConversationId}
            />
          ))}
        </div>
      ) : (
        <p className='p-5 text-sm leading-6 text-text-muted'>
          {conversations.length
            ? 'No conversations match your search.'
            : 'No conversations yet. Start one from a property listing.'}
        </p>
      )}
    </section>
  );
}
