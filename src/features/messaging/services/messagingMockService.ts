import { sampleProperties } from '../../properties/data/sampleProperties';
import type { Conversation, ConversationProperty, Message, MessagePage } from '../types/messaging';
import type { MessagingService } from './messagingService';

const demoBuyer = {
  id: 'demo-buyer',
  displayName: 'You (demo)',
  role: 'buyer' as const,
  isCurrentUser: true,
};
const demoOwner = {
  id: 'demo-property-contact',
  displayName: 'Property contact (demo)',
  role: 'property_owner' as const,
  isCurrentUser: false,
};

const jabiProperty = sampleProperties.find((property) => property.id === 'sample-jabi-gardens')!;
const asokoroProperty = sampleProperties.find(
  (property) => property.id === 'sample-asokoro-residence',
)!;

const toConversationProperty = (
  property: (typeof sampleProperties)[number],
): ConversationProperty => ({
  id: property.id,
  title: property.title,
  imageUrl: property.images[0].src,
  location: `${property.location.district}, ${property.location.city}`,
  askingPriceNaira: property.priceNaira,
});

const initialConversations: Conversation[] = [
  {
    id: 'demo-conversation-jabi',
    participants: [demoBuyer, demoOwner],
    property: toConversationProperty(jabiProperty),
    unreadCount: 1,
    updatedAt: '2026-11-02T10:30:00.000Z',
  },
  {
    id: 'demo-conversation-asokoro',
    participants: [demoBuyer, demoOwner],
    property: toConversationProperty(asokoroProperty),
    unreadCount: 0,
    updatedAt: '2026-10-31T14:15:00.000Z',
  },
];

const initialMessages: Message[] = [
  {
    id: 'demo-message-earliest',
    conversationId: 'demo-conversation-jabi',
    sender: demoBuyer,
    body: 'I found your listing while browsing properties.',
    sentAt: '2026-10-31T08:45:00.000Z',
    status: 'read',
  },
  {
    id: 'demo-message-older',
    conversationId: 'demo-conversation-jabi',
    sender: demoBuyer,
    body: 'Hello, is the apartment still available?',
    sentAt: '2026-11-01T09:10:00.000Z',
    status: 'read',
  },
  {
    id: 'demo-message-jabi-reply',
    conversationId: 'demo-conversation-jabi',
    sender: demoOwner,
    body: 'Thanks for your interest. This is an example reply in the local demo.',
    sentAt: '2026-11-02T10:30:00.000Z',
    status: 'sent',
  },
  {
    id: 'demo-message-asokoro',
    conversationId: 'demo-conversation-asokoro',
    sender: demoBuyer,
    body: 'Could you share more details about the listing?',
    sentAt: '2026-10-31T14:15:00.000Z',
    status: 'read',
  },
];

let conversations: Conversation[] = initialConversations.map((conversation) => ({
  ...conversation,
  participants: [...conversation.participants],
  property: { ...conversation.property },
}));
let messages: Message[] = initialMessages.map((message) => ({
  ...message,
  sender: { ...message.sender },
}));
let messageSequence = 0;

function getConversation(conversationId: string) {
  const conversation = conversations.find((item) => item.id === conversationId);
  if (!conversation) {
    throw new Error('This conversation is not available in the local demo.');
  }
  return conversation;
}

function getPage(conversationId: string, beforeMessageId?: string): MessagePage {
  const conversationMessages = messages.filter(
    (message) => message.conversationId === conversationId,
  );
  if (!beforeMessageId) {
    const page = conversationMessages.slice(-2);
    return {
      messages: page.map((message) => ({ ...message })),
      hasMore: page.length < conversationMessages.length,
    };
  }

  const beforeIndex = conversationMessages.findIndex((message) => message.id === beforeMessageId);
  const end = beforeIndex < 0 ? 0 : beforeIndex;
  const start = Math.max(0, end - 2);
  return {
    messages: conversationMessages.slice(start, end).map((message) => ({ ...message })),
    hasMore: start > 0,
  };
}

export const messagingMockService: MessagingService = {
  mode: 'mock',
  async getConversations() {
    return conversations
      .slice()
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .map((conversation) => ({
        ...conversation,
        participants: [...conversation.participants],
        property: { ...conversation.property },
        latestMessage: messages
          .filter((message) => message.conversationId === conversation.id)
          .at(-1),
      }));
  },
  async startConversation(property) {
    const existing = conversations.find((conversation) => conversation.property.id === property.id);
    if (existing) {
      return {
        ...existing,
        participants: [...existing.participants],
        property: { ...existing.property },
      };
    }

    const conversation: Conversation = {
      id: `demo-conversation-${property.id}`,
      participants: [demoBuyer, demoOwner],
      property: { ...property },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };
    conversations = [conversation, ...conversations];
    return {
      ...conversation,
      participants: [...conversation.participants],
      property: { ...conversation.property },
    };
  },
  async getMessages(conversationId) {
    getConversation(conversationId);
    return getPage(conversationId);
  },
  async loadOlderMessages(conversationId, beforeMessageId) {
    getConversation(conversationId);
    return getPage(conversationId, beforeMessageId);
  },
  async sendMessage(conversationId, body) {
    getConversation(conversationId);
    const message: Message = {
      id: `demo-message-${Date.now()}-${++messageSequence}`,
      conversationId,
      sender: demoBuyer,
      body,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
    messages = [...messages, message];
    conversations = conversations.map((item) =>
      item.id === conversationId ? { ...item, updatedAt: message.sentAt, unreadCount: 0 } : item,
    );
    return { ...message, sender: { ...message.sender } };
  },
  async markConversationRead(conversationId) {
    getConversation(conversationId);
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
    );
    messages = messages.map((message) =>
      message.conversationId === conversationId && message.sender.id !== demoBuyer.id
        ? { ...message, status: 'read' }
        : message,
    );
  },
};

export function resetMessagingMockData() {
  messageSequence = 0;
  conversations = initialConversations.map((conversation) => ({
    ...conversation,
    participants: [...conversation.participants],
    property: { ...conversation.property },
  }));
  messages = initialMessages.map((message) => ({ ...message, sender: { ...message.sender } }));
}
