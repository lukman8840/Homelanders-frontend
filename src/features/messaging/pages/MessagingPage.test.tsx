import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConversationList } from '../components/ConversationList';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { messageSchema } from '../schemas/messageSchema';
import { resetMessagingMockData } from '../services/messagingMockService';
import type { Conversation, Message } from '../types/messaging';
import { MessagingPage } from './MessagingPage';

afterEach(() => {
  resetMessagingMockData();
});

describe('messaging module', () => {
  it('renders property conversations, unread indicators, and searchable results', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ConversationList
          conversations={sampleConversations}
          onSelect={vi.fn()}
          selectedConversationId={null}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Light-filled family home')).toBeVisible();
    expect(screen.getByLabelText('1 unread message')).toBeVisible();
    await user.type(screen.getByLabelText('Search conversations'), 'Asokoro');
    expect(screen.getByText('Quiet Asokoro residence')).toBeVisible();
    expect(screen.queryByText('Light-filled family home')).not.toBeInTheDocument();
  });

  it('renders a message bubble with sender, time and read state', () => {
    const { container } = render(<MessageBubble isOwnMessage message={sampleMessage} />);

    expect(screen.getByText('A question about the listing')).toBeVisible();
    expect(screen.getByText('Sent')).toBeVisible();
    expect(container.querySelector('time')).toHaveAttribute('dateTime', sampleMessage.sentAt);
  });

  it('validates that messages are not empty after trimming', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn().mockResolvedValue(undefined);
    render(<MessageInput onSend={onSend} />);

    expect(messageSchema.safeParse({ body: '  ' }).success).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Write a message before sending.');
    expect(onSend).not.toHaveBeenCalled();
  });

  it('sends a message, clears the composer, and supports returning to the list', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/dashboard/messages']}>
        <MessagingPage />
      </MemoryRouter>,
    );

    const conversation = await screen.findByRole('button', {
      name: /Easy-living Jabi apartment/,
    });
    await user.click(conversation);
    expect(await screen.findByText(/Hello, is the apartment still available/)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Back to conversations' })).toBeVisible();

    const composer = screen.getByLabelText('Write a message');
    await user.type(composer, 'Could I arrange a viewing?');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    const chat = screen.getByRole('region', {
      name: 'Conversation about Easy-living Jabi apartment',
    });
    expect(await within(chat).findByText('Could I arrange a viewing?')).toBeVisible();
    expect(composer).toHaveValue('');

    await user.click(screen.getByRole('button', { name: 'Back to conversations' }));
    expect(screen.getByRole('heading', { name: 'Conversations' })).toBeVisible();
  });

  it('shows an empty message state for a newly started property conversation', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/messages?propertyId=sample-jabi-residence']}>
        <MessagingPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/No messages in this conversation yet/)).toBeVisible();
    expect(screen.getAllByText('A bright city apartment')).toHaveLength(2);
    expect(screen.getByLabelText('Write a message')).toBeEnabled();
  });

  it('loads older messages on request', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/dashboard/messages']}>
        <MessagingPage />
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole('button', { name: /Easy-living Jabi apartment/ }));
    expect(await screen.findByRole('button', { name: 'Load older messages' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Load older messages' }));
    expect(await screen.findByText('Hello, is the apartment still available?')).toBeVisible();
  });

  it('shows the empty conversations state when there are no conversations', () => {
    render(
      <MemoryRouter>
        <ConversationList conversations={[]} onSelect={vi.fn()} selectedConversationId={null} />
      </MemoryRouter>,
    );

    expect(
      screen.getByText('No conversations yet. Start one from a property listing.'),
    ).toBeVisible();
  });
});

const sampleMessage: Message = {
  id: 'message-example',
  conversationId: 'conversation-example',
  sender: { id: 'demo-buyer', displayName: 'You (demo)' },
  body: 'A question about the listing',
  sentAt: '2026-11-02T10:30:00.000Z',
  status: 'sent',
};

const sampleConversations: Conversation[] = [
  {
    id: 'conversation-jabi',
    participants: [
      {
        id: 'demo-buyer',
        displayName: 'You (demo)',
        role: 'buyer',
        isCurrentUser: true,
      },
      {
        id: 'demo-owner',
        displayName: 'Property contact (demo)',
        role: 'property_owner',
        isCurrentUser: false,
      },
    ],
    property: {
      id: 'sample-jabi-gardens',
      title: 'Light-filled family home',
      imageUrl: '/sample-property.jpg',
      location: 'Jabi, Abuja',
      askingPriceNaira: 92_000_000,
    },
    latestMessage: sampleMessage,
    unreadCount: 1,
    updatedAt: sampleMessage.sentAt,
  },
  {
    id: 'conversation-asokoro',
    participants: [
      {
        id: 'demo-buyer',
        displayName: 'You (demo)',
        role: 'buyer',
        isCurrentUser: true,
      },
      {
        id: 'demo-owner',
        displayName: 'Property contact (demo)',
        role: 'property_owner',
        isCurrentUser: false,
      },
    ],
    property: {
      id: 'sample-asokoro-residence',
      title: 'Quiet Asokoro residence',
      imageUrl: '/sample-property.jpg',
      location: 'Asokoro, Abuja',
      askingPriceNaira: 340_000_000,
    },
    unreadCount: 0,
    updatedAt: '2026-11-01T10:30:00.000Z',
  },
];
