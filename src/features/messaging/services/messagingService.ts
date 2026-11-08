import type { AxiosInstance } from 'axios';
import { apiClient } from '../../../lib/api/client';
import type { Conversation, ConversationProperty, Message, MessagePage } from '../types/messaging';

export interface MessagingService {
  readonly mode: 'api' | 'mock';
  getConversations(): Promise<Conversation[]>;
  startConversation(property: ConversationProperty): Promise<Conversation>;
  getMessages(conversationId: string): Promise<MessagePage>;
  loadOlderMessages(conversationId: string, beforeMessageId: string): Promise<MessagePage>;
  sendMessage(conversationId: string, body: string): Promise<Message>;
  markConversationRead(conversationId: string): Promise<void>;
}

export interface MessagingApiContract {
  getConversations(client: AxiosInstance): Promise<Conversation[]>;
  startConversation(client: AxiosInstance, property: ConversationProperty): Promise<Conversation>;
  getMessages(client: AxiosInstance, conversationId: string): Promise<MessagePage>;
  loadOlderMessages(
    client: AxiosInstance,
    conversationId: string,
    beforeMessageId: string,
  ): Promise<MessagePage>;
  sendMessage(client: AxiosInstance, conversationId: string, body: string): Promise<Message>;
  markConversationRead(client: AxiosInstance, conversationId: string): Promise<void>;
}

export class MessagingApiNotConfiguredError extends Error {
  constructor() {
    super('Messaging is not connected to the backend yet.');
    this.name = 'MessagingApiNotConfiguredError';
  }
}

export function createMessagingService(
  client: AxiosInstance,
  contract?: MessagingApiContract,
): MessagingService {
  if (!contract) {
    const unavailable = async (): Promise<never> => {
      throw new MessagingApiNotConfiguredError();
    };
    return {
      mode: 'api',
      getConversations: unavailable,
      startConversation: unavailable,
      getMessages: unavailable,
      loadOlderMessages: unavailable,
      sendMessage: unavailable,
      markConversationRead: unavailable,
    };
  }

  return {
    mode: 'api',
    getConversations: () => contract.getConversations(client),
    startConversation: (property) => contract.startConversation(client, property),
    getMessages: (conversationId) => contract.getMessages(client, conversationId),
    loadOlderMessages: (conversationId, beforeMessageId) =>
      contract.loadOlderMessages(client, conversationId, beforeMessageId),
    sendMessage: (conversationId, body) => contract.sendMessage(client, conversationId, body),
    markConversationRead: (conversationId) => contract.markConversationRead(client, conversationId),
  };
}

export const messagingApiService = createMessagingService(apiClient);

export interface MessagingRealtimeService {
  subscribe(conversationId: string, onMessage: (message: Message) => void): () => void;
}

export const messagingRealtimeService: MessagingRealtimeService = {
  subscribe() {
    return () => undefined;
  },
};
