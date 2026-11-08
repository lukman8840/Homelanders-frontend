export type MessageStatus = 'sending' | 'sent' | 'read';

export interface MessageSender {
  id: string;
  displayName: string;
}

export interface ConversationParticipant extends MessageSender {
  role: 'buyer' | 'property_owner' | 'agent';
  isCurrentUser: boolean;
}

export interface ConversationProperty {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  askingPriceNaira: number;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  body: string;
  sentAt: string;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  property: ConversationProperty;
  latestMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface MessagePage {
  messages: Message[];
  hasMore: boolean;
}
