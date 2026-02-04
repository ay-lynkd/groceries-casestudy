/**
 * Messages Screen
 * Integrated messaging system for seller communication
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '@/components/common';
import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

type MessageType = 'customer' | 'support' | 'system';
type MessageStatus = 'sent' | 'delivered' | 'read';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'me' | 'other';
  content: string;
  timestamp: string;
  type: MessageType;
  status?: MessageStatus;
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  type: MessageType;
  isOnline?: boolean;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantName: 'Customer Support',
    lastMessage: 'Your store verification is complete!',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    type: 'support',
    isOnline: true,
  },
  {
    id: '2',
    participantName: 'Rahul Kumar',
    lastMessage: 'Thank you for the quick delivery!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    type: 'customer',
    isOnline: false,
  },
  {
    id: '3',
    participantName: 'System Notifications',
    lastMessage: 'New order received: #ORD-2024-001',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    type: 'system',
  },
  {
    id: '4',
    participantName: 'Priya Sharma',
    lastMessage: 'Can you deliver after 6 PM?',
    lastMessageTime: 'Mon',
    unreadCount: 0,
    type: 'customer',
    isOnline: true,
  },
  {
    id: '5',
    participantName: 'Amit Singh',
    lastMessage: 'The product was damaged during delivery',
    lastMessageTime: 'Sun',
    unreadCount: 0,
    type: 'customer',
    isOnline: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      senderId: 'support',
      senderName: 'Customer Support',
      senderType: 'other',
      content: 'Hello! Welcome to Kirana Store support.',
      timestamp: '10:00 AM',
      type: 'support',
    },
    {
      id: 'm2',
      senderId: 'me',
      senderName: 'You',
      senderType: 'me',
      content: 'Hi, I submitted my documents yesterday. When will my account be verified?',
      timestamp: '10:05 AM',
      type: 'support',
      status: 'read',
    },
    {
      id: 'm3',
      senderId: 'support',
      senderName: 'Customer Support',
      senderType: 'other',
      content: 'Let me check that for you...',
      timestamp: '10:15 AM',
      type: 'support',
    },
    {
      id: 'm4',
      senderId: 'support',
      senderName: 'Customer Support',
      senderType: 'other',
      content: 'Your store verification is complete! You can now start selling.',
      timestamp: '10:30 AM',
      type: 'support',
    },
  ],
};

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (selectedConversation && mockMessages[selectedConversation]) {
      setMessages(mockMessages[selectedConversation]);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      senderType: 'me',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'customer',
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        setSelectedConversation(item.id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <View style={styles.avatarContainer}>
        <Ionicons
          name={
            item.type === 'support'
              ? 'headset'
              : item.type === 'system'
              ? 'notifications'
              : 'person'
          }
          size={theme.typography.fontSize.xl}
          color={
            item.type === 'support'
              ? theme.colors.status.info
              : item.type === 'system'
              ? theme.colors.primary.orange
              : theme.colors.status.success
          }
        />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text variant="body" fontWeight="semibold" numberOfLines={1} style={styles.name}>
            {item.participantName}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.lastMessageTime}
          </Text>
        </View>

        <View style={styles.conversationFooter}>
          <Text
            variant="body"
            color={theme.colors.text.secondary}
            numberOfLines={1}
            style={styles.lastMessage}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text variant="caption" color={theme.colors.background.primary} fontWeight="bold">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderType === 'me' ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <View
        style={item.senderType === 'me' ? [styles.messageBubble, styles.myMessageBubble] : [styles.messageBubble, styles.theirMessageBubble]}
      >
        <Text
          variant="body"
          color={
            item.senderType === 'me'
              ? theme.colors.background.primary
              : theme.colors.text.primary
          }
        >
          {item.content}
        </Text>
        <View style={styles.messageFooter}>
          <Text
            variant="caption"
            color={
              item.senderType === 'me'
                ? theme.colors.background.primary + 'CC'
                : theme.colors.text.light
            }
          >
            {item.timestamp}
          </Text>
          {item.senderType === 'me' && item.status && (
            <Ionicons
              name={item.status === 'read' ? 'checkmark-done' : 'checkmark'}
              size={theme.typography.fontSize.xs + 2}
              color={
                item.status === 'read'
                  ? theme.colors.status.info
                  : theme.colors.background.primary + 'CC'
              }
              style={{ marginLeft: theme.spacing.xs }}
            />
          )}
        </View>
      </View>
    </View>
  );

  if (selectedConversation) {
    const conversation = conversations.find((c) => c.id === selectedConversation);

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Chat Header */}
        <View style={[styles.chatHeader, { paddingTop: insets.top + theme.spacing.sm }]}>
          <TouchableOpacity
            onPress={() => setSelectedConversation(null)}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={theme.typography.fontSize.lg + 4}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>

          <View style={styles.chatHeaderInfo}>
            <Text variant="body" fontWeight="semibold">
              {conversation?.participantName}
            </Text>
            {conversation?.isOnline && (
              <Text variant="caption" color={theme.colors.status.success}>
                Online
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={theme.typography.fontSize.lg + 4}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom || theme.spacing.md }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons
              name="attach"
              size={theme.typography.fontSize.xl}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.text.light}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={theme.typography.fontSize.lg + 2}
              color={inputText.trim() ? theme.colors.background.primary : theme.colors.text.light}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Text variant="h2" fontWeight="bold">
          Messages
        </Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Ionicons
            name="create-outline"
            size={theme.typography.fontSize.lg + 4}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={theme.typography.fontSize.lg}
          color={theme.colors.text.light}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={theme.colors.text.light}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  newMessageButton: {
    padding: theme.spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md - 4,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  conversationsList: {
    paddingHorizontal: theme.spacing.lg,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  avatarContainer: {
    width: theme.spacing.xl + 8,
    height: theme.spacing.xl + 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.status.success,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  unreadBadge: {
    minWidth: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  // Chat styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  moreButton: {
    padding: theme.spacing.sm,
  },
  messagesList: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  theirMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  myMessageBubble: {
    backgroundColor: theme.colors.status.success,
    borderBottomRightRadius: theme.spacing.xs,
  },
  theirMessageBubble: {
    backgroundColor: theme.colors.background.tertiary,
    borderBottomLeftRadius: theme.spacing.xs,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },
  attachButton: {
    padding: theme.spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    maxHeight: theme.spacing.xxl,
  },
  input: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm + 2,
  },
  sendButton: {
    width: theme.spacing.xl,
    height: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.background.tertiary,
  },
});
