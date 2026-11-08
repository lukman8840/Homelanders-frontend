import { MessageSquare } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingIndicator } from '../../../components/feedback/LoadingIndicator';
import { Card } from '../../../components/ui/Card';
import { ChatWindow } from '../components/ChatWindow';
import { ConversationList } from '../components/ConversationList';
import { useMessaging } from '../hooks/useMessaging';

export function MessagingPage() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId') ?? undefined;
  const messaging = useMessaging(propertyId);
  const hasSelection = messaging.selectedConversation !== null;

  return (
    <section>
      <p className='text-sm font-semibold text-brand-primary'>Account workspace</p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-text-primary'>Messages</h1>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-text-muted'>
        Keep property enquiries together with the listing they are about.
      </p>

      {messaging.mode === 'mock' ? (
        <p className='mt-4 rounded-control border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900'>
          Demo messaging only: messages stay in this browser session and are not delivered to
          property owners or other users.
        </p>
      ) : null}

      {messaging.error ? (
        <div className='mt-4 flex flex-wrap items-center justify-between gap-3 rounded-control border border-red-200 bg-red-50 px-4 py-3'>
          <p className='text-sm text-red-800' role='alert'>
            {messaging.error}
          </p>
          <button
            className='text-sm font-semibold text-red-800 underline'
            onClick={() => void messaging.retry()}
            type='button'
          >
            Try again
          </button>
        </div>
      ) : null}

      <Card className='mt-6 overflow-hidden p-0'>
        {messaging.loading ? (
          <div className='flex min-h-[32rem] items-center justify-center'>
            <LoadingIndicator label='Loading conversations' />
          </div>
        ) : messaging.conversations.length === 0 ? (
          <div className='p-5 sm:p-8'>
            <EmptyState
              description='When you contact a property owner or agent, your property-specific conversation will appear here.'
              title='No conversations yet'
              action={
                <span className='inline-flex items-center gap-2 text-sm text-text-muted'>
                  <MessageSquare aria-hidden='true' size={16} />
                  Browse properties to start an enquiry
                </span>
              }
            />
          </div>
        ) : (
          <div className='grid min-h-[32rem] md:grid-cols-[19rem_minmax(0,1fr)]'>
            <div
              className={
                hasSelection
                  ? 'hidden border-r border-border md:block'
                  : 'block border-r border-border'
              }
            >
              <ConversationList
                conversations={messaging.conversations}
                onSelect={(id) => void messaging.selectConversation(id)}
                selectedConversationId={messaging.selectedConversationId}
              />
            </div>
            <div
              className={
                hasSelection ? 'flex min-h-[32rem] min-w-0' : 'hidden min-h-[32rem] min-w-0 md:flex'
              }
            >
              <ChatWindow
                conversation={messaging.selectedConversation}
                hasOlderMessages={messaging.hasOlderMessages}
                loading={messaging.loadingMessages}
                loadingOlder={messaging.loadingOlderMessages}
                messages={messaging.messages}
                onBack={messaging.deselectConversation}
                onLoadOlder={() => void messaging.loadOlderMessages()}
                onSend={messaging.sendMessage}
              />
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
