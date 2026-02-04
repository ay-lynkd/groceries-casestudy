import { Loading, Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Message {
  id: string;
  sender: "customer" | "seller";
  content: string;
  timestamp: string;
  read: boolean;
}

interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
}

interface OrderInfo {
  id: string;
  items: string;
  total: number;
  status: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
}

interface CustomerCommunicationProps {
  orderId: string;
  customerInfo: CustomerInfo;
  orderInfo: OrderInfo;
  initialMessages?: Message[];
}

// Mock data for demonstration
const mockCustomerInfo: CustomerInfo = {
  id: "1",
  name: "Rakesh Kumar",
  phone: "+91 98765 43210",
  email: "rakesh.kumar@email.com",
  avatar: "https://i.pravatar.cc/100?img=1",
};

const mockOrderInfo: OrderInfo = {
  id: "ORD-2024-001234",
  items: "Basmati Rice 10kg, Moong Dal 1kg, Fortune Oil 1L",
  total: 1040,
  status: "processing",
  statusHistory: [
    { status: "Order Placed", timestamp: "10:00 AM" },
    { status: "Order Confirmed", timestamp: "10:15 AM" },
    { status: "Preparing", timestamp: "10:30 AM" },
    { status: "Ready for Pickup", timestamp: "11:00 AM" },
    { status: "Out for Delivery", timestamp: "11:30 AM" },
    { status: "Delivered", timestamp: "12:00 PM" },
  ],
};

const mockInitialMessages: Message[] = [
  {
    id: "1",
    sender: "customer",
    content: "Hi, I wanted to know when my order will be delivered?",
    timestamp: "10:30 AM",
    read: true,
  },
  {
    id: "2",
    sender: "seller",
    content: "Hello! Your order is being prepared and will be delivered within 2-3 hours.",
    timestamp: "10:35 AM",
    read: true,
  },
  {
    id: "3",
    sender: "customer",
    content: "Great! Can you please confirm the exact delivery time?",
    timestamp: "10:40 AM",
    read: true,
  },
];

const CustomerCommunicationScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCustomerInfo(mockCustomerInfo);
      setOrderInfo(mockOrderInfo);
      setMessages(mockInitialMessages);
      setLoading(false);
    };

    loadData();
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newMsg: Message = {
        id: Date.now().toString(),
        sender: "seller",
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
      };

      setMessages((prev) => [...prev, newMsg]);
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleCallCustomer = () => {
    if (!customerInfo?.phone) return;
    const phoneNumber = customerInfo.phone.replace(/\s/g, '');
    Alert.alert(
      "Call Customer",
      `Calling ${customerInfo?.name} at ${customerInfo?.phone}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL(`tel:${phoneNumber}`) },
      ]
    );
  };

  const handleWhatsAppCustomer = () => {
    if (!customerInfo?.phone) return;
    const phoneNumber = customerInfo.phone.replace(/\s/g, '').replace(/^\+91/, '');
    Alert.alert(
      "WhatsApp Customer",
      `Opening WhatsApp chat with ${customerInfo?.name}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open", onPress: () => Linking.openURL(`https://wa.me/91${phoneNumber}`) },
      ]
    );
  };

  const markAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Loading fullScreen />
      </View>
    );
  }

  if (!customerInfo || !orderInfo) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle"
            size={48}
            color={theme.colors.status.error}
          />
          <Text variant="h3" fontWeight="bold" style={styles.errorTitle}>
            Communication Error
          </Text>
          <Text
            variant="body"
            color={theme.colors.text.secondary}
            align="center"
            style={styles.errorText}
          >
            Unable to load customer communication details.
          </Text>
          <Button
            variant="primary"
            size="md"
            onPress={() => router.back()}
            style={styles.errorButton}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  const unreadMessages = messages.filter(
    (msg) => msg.sender === "customer" && !msg.read
  ).length;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text variant="h2" fontWeight="bold" numberOfLines={1}>
            Chat with {customerInfo.name}
          </Text>
          {unreadMessages > 0 && (
            <View style={styles.unreadBadge}>
              <Text variant="caption" fontWeight="bold" color={theme.colors.background.primary}>
                {unreadMessages}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleCallCustomer}
            style={styles.actionButton}
            accessibilityLabel="Call customer"
            accessibilityHint="Make a phone call to the customer"
          >
            <Ionicons
              name="call"
              size={20}
              color={theme.colors.primary.green}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleWhatsAppCustomer}
            style={styles.actionButton}
            accessibilityLabel="WhatsApp customer"
            accessibilityHint="Open WhatsApp chat with customer"
          >
            <Ionicons
              name="logo-whatsapp"
              size={20}
              color={theme.colors.primary.green}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Customer and Order Info */}
      <View style={styles.infoCard}>
        <View style={styles.customerInfo}>
          <View style={styles.avatarPlaceholder}>
            {customerInfo.avatar ? (
              <Ionicons
                name="person-circle"
                size={40}
                color={theme.colors.text.secondary}
              />
            ) : (
              <Text variant="h3" fontWeight="bold" color={theme.colors.text.secondary}>
                {customerInfo.name.charAt(0)}
              </Text>
            )}
          </View>
          <View style={styles.customerDetails}>
            <Text variant="body" fontWeight="semibold">
              {customerInfo.name}
            </Text>
            <Text variant="caption" color={theme.colors.text.secondary}>
              {customerInfo.phone}
            </Text>
          </View>
        </View>
        <View style={styles.orderInfo}>
          <Text variant="caption" color={theme.colors.text.secondary}>
            Order #{orderInfo.id}
          </Text>
          <Text variant="caption" color={theme.colors.primary.green} fontWeight="medium">
            {orderInfo.items}
          </Text>
          <Text variant="caption" color={theme.colors.text.secondary}>
            ₹{orderInfo.total.toFixed(2)} • {orderInfo.status}
          </Text>
          
          {/* Status History Section */}
          {orderInfo.statusHistory && orderInfo.statusHistory.length > 0 && (
            <View style={styles.statusHistoryContainer}>
              <Text style={styles.statusHistoryTitle}>Status Updates:</Text>
              {orderInfo.statusHistory.slice(-3).map((history, index) => (
                <View key={index} style={styles.statusHistoryItem}>
                  <Ionicons name="checkmark-circle" size={12} color={theme.colors.primary.green} />
                  <Text variant="caption" color={theme.colors.text.secondary} style={styles.statusHistoryText}>
                    {history.status} at {history.timestamp}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Messages List */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === "seller" && styles.ownMessageContainer,
            ]}
          >
            <Card
              style={message.sender === "seller" ? styles.ownMessageCard : styles.messageCard}
            >
              <Text
                variant="body"
                style={[
                  styles.messageText,
                  message.sender === "seller" && styles.ownMessageText,
                ]}
              >
                {message.content}
              </Text>
              <View
                style={[
                  styles.messageMeta,
                  message.sender === "seller" && styles.ownMessageMeta,
                ]}
              >
                <Text
                  variant="caption"
                  color={theme.colors.text.light}
                  style={styles.timestamp}
                >
                  {message.timestamp}
                </Text>
                {message.sender === "customer" && (
                  <TouchableOpacity
                    onPress={() => markAsRead(message.id)}
                    accessibilityLabel="Mark as read"
                  >
                    <Ionicons
                      name={message.read ? "checkmark-done" : "checkmark"}
                      size={16}
                      color={
                        message.read
                          ? theme.colors.status.success
                          : theme.colors.text.light
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            style={styles.messageInput}
            multiline
            maxLength={500}
            textAlignVertical="center"
          />
          <Button
            variant="primary"
            size="md"
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            style={styles.sendButton}
            accessibilityLabel="Send message"
          >
            {sending ? (
              <Loading size="small" color={theme.colors.background.primary} />
            ) : (
              <Ionicons name="send" size={20} color={theme.colors.background.primary} />
            )}
          </Button>
        </View>
        <Text variant="caption" color={theme.colors.text.light} style={styles.inputHint}>
          Press send or return to send
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: theme.spacing.md,
  },
  unreadBadge: {
    backgroundColor: theme.colors.status.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
  },
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  errorTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    marginBottom: theme.spacing.xl,
  },
  errorButton: {
    width: "100%",
    maxWidth: 200,
  },
  infoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  customerDetails: {
    flex: 1,
  },
  orderInfo: {
    alignItems: "flex-end",
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing.md,
  },
  messageContainer: {
    marginBottom: theme.spacing.md,
    maxWidth: "80%",
  },
  ownMessageContainer: {
    alignSelf: "flex-end",
  },
  messageCard: {
    backgroundColor: theme.colors.background.card,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  ownMessageCard: {
    backgroundColor: theme.colors.primary.green,
    borderBottomRightRadius: theme.borderRadius.sm,
    borderBottomLeftRadius: theme.borderRadius.md,
  },
  messageText: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  ownMessageText: {
    color: theme.colors.background.primary,
  },
  messageMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ownMessageMeta: {
    justifyContent: "flex-end",
  },
  timestamp: {
    marginRight: theme.spacing.sm,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
  },
  messageInput: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 0,
    minWidth: 0,
  },
  inputHint: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  statusHistoryContainer: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
  },
  statusHistoryTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  statusHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  statusHistoryText: {
    marginLeft: theme.spacing.xs,
  },
});

export default CustomerCommunicationScreen;