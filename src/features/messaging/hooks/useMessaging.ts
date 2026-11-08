import { useCallback, useEffect, useState } from 'react';
import { findSampleProperty } from '../../properties/data/sampleProperties';
import { messagingService } from '../services/configuredMessagingService';
import { messagingRealtimeService } from '../services/messagingService';
import type { Conversation, ConversationProperty, Message } from '../types/messaging';

function toConversationProperty(
  property: NonNullable<ReturnType<typeof findSampleProperty>>,
): ConversationProperty {
  return {
    id: property.id,
    title: property.title,
    imageUrl: property.images[0].src,
    location: `${property.location.district}, ${property.location.city}`,
    askingPriceNaira: property.priceNaira,
  };
}

export function useMessaging(propertyId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let items = await messagingService.getConversations();
      let propertyConversation: Conversation | null = null;
      if (propertyId) {
        const property = findSampleProperty(propertyId);
        if (!property) {
          setError('That listing is not available, so a conversation could not be started.');
        } else {
          propertyConversation = await messagingService.startConversation(
            toConversationProperty(property),
          );
          items = await messagingService.getConversations();
        }
      }

      setConversations(items);
      if (propertyConversation) {
        const page = await messagingService.getMessages(propertyConversation.id);
        await messagingService.markConversationRead(propertyConversation.id);
        setSelectedConversationId(propertyConversation.id);
        setMessages(page.messages);
        setHasOlderMessages(page.hasMore);
        items = await messagingService.getConversations();
        setConversations(items);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Unable to load your conversations.',
      );
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    if (!selectedConversationId) return undefined;
    return messagingRealtimeService.subscribe(selectedConversationId, (message) => {
      setMessages((current) =>
        current.some((item) => item.id === message.id) ? current : [...current, message],
      );
    });
  }, [selectedConversationId]);

  const selectConversation = useCallback(async (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setLoadingMessages(true);
    setError(null);
    try {
      const page = await messagingService.getMessages(conversationId);
      await messagingService.markConversationRead(conversationId);
      setMessages(page.messages);
      setHasOlderMessages(page.hasMore);
      setConversations(await messagingService.getConversations());
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Unable to load this conversation.',
      );
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const deselectConversation = useCallback(() => {
    setSelectedConversationId(null);
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (body: string) => {
      if (!selectedConversationId)
        throw new Error('Choose a conversation before sending a message.');
      const message = await messagingService.sendMessage(selectedConversationId, body);
      setMessages((current) => [...current, message]);
      setConversations((current) =>
        current
          .map((conversation) =>
            conversation.id === selectedConversationId
              ? {
                  ...conversation,
                  latestMessage: message,
                  updatedAt: message.sentAt,
                  unreadCount: 0,
                }
              : conversation,
          )
          .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
      );
    },
    [selectedConversationId],
  );

  const loadOlderMessages = useCallback(async () => {
    if (!selectedConversationId || !messages.length || !hasOlderMessages) return;
    setLoadingOlderMessages(true);
    setError(null);
    try {
      const page = await messagingService.loadOlderMessages(selectedConversationId, messages[0].id);
      setMessages((current) => [...page.messages, ...current]);
      setHasOlderMessages(page.hasMore);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load older messages.');
    } finally {
      setLoadingOlderMessages(false);
    }
  }, [hasOlderMessages, messages, selectedConversationId]);

  const retry = useCallback(async () => {
    if (selectedConversationId) {
      await selectConversation(selectedConversationId);
      return;
    }
    await initialize();
  }, [initialize, selectConversation, selectedConversationId]);

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ?? null;

  return {
    conversations,
    selectedConversation,
    selectedConversationId,
    messages,
    hasOlderMessages,
    loading,
    loadingMessages,
    loadingOlderMessages,
    error,
    mode: messagingService.mode,
    initialize,
    retry,
    selectConversation,
    deselectConversation,
    sendMessage,
    loadOlderMessages,
  };
}
