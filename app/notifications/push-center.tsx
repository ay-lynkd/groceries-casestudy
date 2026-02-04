import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types for push notifications
interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: "promotional" | "transactional" | "alert" | "reminder";
  audience: string; // e.g., "All Users", "VIP Customers", etc.
  scheduledTime?: string;
  sentTime: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  sentCount: number;
  openCount: number;
  openRate: number;
  clickCount: number;
  clickRate: number;
  revenueImpact?: number;
}

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  type: "promotional" | "transactional" | "alert" | "reminder";
  category: string;
  isDefault: boolean;
}

const PushNotificationCenter: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<PushNotification | null>(null);
  const [showNotificationDetails, setShowNotificationDetails] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    body: "",
    type: "promotional" as const,
    audience: "All Users",
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockNotifications: PushNotification[] = [
        {
          id: "notif-1",
          title: "Special Weekend Sale",
          body: "Get 20% off on all organic products this weekend!",
          type: "promotional",
          audience: "All Users",
          scheduledTime: "2023-10-20T10:00:00Z",
          sentTime: "2023-10-20T10:00:00Z",
          status: "sent",
          sentCount: 1245,
          openCount: 876,
          openRate: 70.4,
          clickCount: 342,
          clickRate: 27.5,
          revenueImpact: 12450.75,
        },
        {
          id: "notif-2",
          title: "Order Delivered",
          body: "Your order #ORD-7894 has been delivered successfully",
          type: "transactional",
          audience: "Order Recipients",
          sentTime: "2023-10-19T15:30:00Z",
          status: "sent",
          sentCount: 234,
          openCount: 189,
          openRate: 80.8,
          clickCount: 45,
          clickRate: 19.2,
        },
        {
          id: "notif-3",
          title: "Low Stock Alert",
          body: "Basmati Rice 10kg is running low on stock",
          type: "alert",
          audience: "Admin Team",
          sentTime: "2023-10-19T09:15:00Z",
          status: "sent",
          sentCount: 5,
          openCount: 5,
          openRate: 100,
          clickCount: 3,
          clickRate: 60,
        },
        {
          id: "notif-4",
          title: "Payment Reminder",
          body: "Your subscription payment is due in 2 days",
          type: "reminder",
          audience: "Subscribers",
          scheduledTime: "2023-10-22T09:00:00Z",
          sentTime: "2023-10-22T09:00:00Z",
          status: "scheduled",
          sentCount: 0,
          openCount: 0,
          openRate: 0,
          clickCount: 0,
          clickRate: 0,
        },
        {
          id: "notif-5",
          title: "Welcome Bonus",
          body: "Welcome to our store! Get 15% off your first order",
          type: "promotional",
          audience: "New Users",
          sentTime: "2023-10-18T12:00:00Z",
          status: "sent",
          sentCount: 187,
          openCount: 142,
          openRate: 76.0,
          clickCount: 89,
          clickRate: 47.6,
          revenueImpact: 2450.30,
        },
      ];

      const mockTemplates: NotificationTemplate[] = [
        {
          id: "tmpl-1",
          name: "Promotional Offer",
          title: "Special Offer Inside!",
          body: "Check out our latest deals and promotions",
          type: "promotional",
          category: "Sales",
          isDefault: true,
        },
        {
          id: "tmpl-2",
          name: "Order Update",
          title: "Order Status Changed",
          body: "Your order {{order_id}} status is now {{status}}",
          type: "transactional",
          category: "Orders",
          isDefault: true,
        },
        {
          id: "tmpl-3",
          name: "Low Stock Alert",
          title: "Low Stock Warning",
          body: "{{product_name}} is running low on stock",
          type: "alert",
          category: "Inventory",
          isDefault: true,
        },
        {
          id: "tmpl-4",
          name: "Payment Reminder",
          title: "Payment Due Soon",
          body: "Your payment for {{subscription}} is due in {{days}} days",
          type: "reminder",
          category: "Billing",
          isDefault: true,
        },
      ];

      setNotifications(mockNotifications);
      setTemplates(mockTemplates);
      setSelectedNotification(mockNotifications[0]); // Set first notification as default
      setLoading(false);
    }, 1000);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.body) {
      Alert.alert("Error", "Please fill in the title and body of the notification");
      return;
    }

    Alert.alert(
      "Send Notification",
      `Are you sure you want to send this notification to ${newNotification.audience}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send", 
          onPress: () => {
            // Add new notification to the list
            const notification: PushNotification = {
              id: `notif-${notifications.length + 1}`,
              title: newNotification.title,
              body: newNotification.body,
              type: newNotification.type,
              audience: newNotification.audience,
              sentTime: new Date().toISOString(),
              status: "sent",
              sentCount: 0, // Would be updated after sending
              openCount: 0,
              openRate: 0,
              clickCount: 0,
              clickRate: 0,
            };
            
            setNotifications([notification, ...notifications]);
            setShowComposeModal(false);
            setNewNotification({
              title: "",
              body: "",
              type: "promotional",
              audience: "All Users",
            });
          }
        },
      ]
    );
  };

  const handleScheduleNotification = () => {
    if (!newNotification.title || !newNotification.body) {
      Alert.alert("Error", "Please fill in the title and body of the notification");
      return;
    }

    Alert.alert(
      "Schedule Notification",
      `When would you like to send this notification?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Schedule", 
          onPress: () => {
            // Add scheduled notification to the list
            const notification: PushNotification = {
              id: `notif-${notifications.length + 1}`,
              title: newNotification.title,
              body: newNotification.body,
              type: newNotification.type,
              audience: newNotification.audience,
              scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
              sentTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
              status: "scheduled",
              sentCount: 0,
              openCount: 0,
              openRate: 0,
              clickCount: 0,
              clickRate: 0,
            };
            
            setNotifications([notification, ...notifications]);
            setShowComposeModal(false);
            setNewNotification({
              title: "",
              body: "",
              type: "promotional",
              audience: "All Users",
            });
          }
        },
      ]
    );
  };

  const handleUseTemplate = (template: NotificationTemplate) => {
    setNewNotification({
      ...newNotification,
      title: template.title,
      body: template.body,
      type: template.type as 'promotional',
    });
  };

  const handleViewNotificationDetails = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      setSelectedNotification(notification);
      setShowNotificationDetails(true);
    }
  };

  const renderNotificationItem = ({ item }: { item: PushNotification }) => {
    const statusColors = {
      draft: theme.colors.text.light,
      scheduled: theme.colors.primary.orange,
      sent: theme.colors.status.success,
      failed: theme.colors.status.error,
    };

    return (
      <TouchableOpacity
        onPress={() => setSelectedNotification(item)}
        style={[
          styles.notificationCard,
          selectedNotification?.id === item.id && styles.selectedNotificationCard,
        ]}
      >
        <View style={styles.notificationHeader}>
          <View style={styles.notificationInfo}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColors[item.status] }]} />
            <View>
              <Text variant="body" fontWeight="semibold">
                {item.title}
              </Text>
              <Text variant="caption" color={theme.colors.text.light} numberOfLines={1}>
                {item.body}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleViewNotificationDetails(item.id)}>
            <Ionicons name="information-circle-outline" size={theme.typography.fontSize.lg + 2} color={theme.colors.text.light} />
          </TouchableOpacity>
        </View>

        <View style={styles.notificationMetrics}>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Sent
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.sentCount}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Open
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.openRate}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Click
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.clickRate}%
            </Text>
          </View>
        </View>

        <View style={styles.notificationFooter}>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.type} • {item.audience}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.status === "scheduled" && item.scheduledTime ? new Date(item.scheduledTime).toLocaleDateString() : 
             new Date(item.sentTime).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNotificationDetails = () => {
    if (!selectedNotification) return null;

    const statusColors = {
      draft: theme.colors.text.light,
      scheduled: theme.colors.primary.orange,
      sent: theme.colors.status.success,
      failed: theme.colors.status.error,
    };

    return (
      <Modal
        visible={showNotificationDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotificationDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationDetailModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                Notification Details
              </Text>
              <TouchableOpacity onPress={() => setShowNotificationDetails(false)}>
                <Ionicons name="close" size={theme.typography.fontSize['2xl']} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.notificationDetailContent}>
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Content
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Title</Text>
                  <Text variant="body" fontWeight="bold">{selectedNotification.title}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Body</Text>
                  <Text variant="body" fontWeight="bold">{selectedNotification.body}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Type</Text>
                  <Text variant="body" fontWeight="bold">{selectedNotification.type}</Text>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Delivery
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Audience</Text>
                  <Text variant="body" fontWeight="bold">{selectedNotification.audience}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Status</Text>
                  <View style={styles.statusBadge}>
                    <View style={[styles.badgeDot, { backgroundColor: statusColors[selectedNotification.status] }]} />
                    <Text variant="body" fontWeight="bold">{selectedNotification.status}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Sent Time</Text>
                  <Text variant="body" fontWeight="bold">
                    {selectedNotification.scheduledTime && selectedNotification.status === "scheduled"
                      ? `Scheduled: ${new Date(selectedNotification.scheduledTime).toLocaleString()}`
                      : `Sent: ${new Date(selectedNotification.sentTime).toLocaleString()}`}
                  </Text>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Performance
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Sent Count</Text>
                  <Text variant="body" fontWeight="bold">{selectedNotification.sentCount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Open Count</Text>
                  <Text variant="body" fontWeight="bold">{selectedNotification.openCount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Open Rate</Text>
                  <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                    {selectedNotification.openRate}%
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Click Rate</Text>
                  <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                    {selectedNotification.clickRate}%
                  </Text>
                </View>
                {selectedNotification.revenueImpact !== undefined && (
                  <View style={styles.detailRow}>
                    <Text variant="body">Revenue Impact</Text>
                    <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                      ${selectedNotification.revenueImpact.toFixed(2)}
                    </Text>
                  </View>
                )}
              </Card>
              
              <View style={styles.modalActions}>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setShowNotificationDetails(false)}
                  style={styles.modalButton}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onPress={() => {
                    Alert.alert("Resend", "Resend this notification to the same audience?");
                    setShowNotificationDetails(false);
                  }}
                  style={styles.modalButton}
                >
                  Resend
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderComposeModal = () => {
    return (
      <Modal
        visible={showComposeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowComposeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.composeModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                Compose Notification
              </Text>
              <TouchableOpacity onPress={() => setShowComposeModal(false)}>
                <Ionicons name="close" size={theme.typography.fontSize['2xl']} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.composeModalContent}>
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Content
                </Text>
                <View style={styles.inputGroup}>
                  <Text variant="body">Title</Text>
                  <Card style={styles.inputCard}>
                    <TextInput
                      value={newNotification.title}
                      onChangeText={(text) => setNewNotification({...newNotification, title: text})}
                      placeholder="Notification title"
                      style={styles.input}
                    />
                  </Card>
                </View>
                <View style={styles.inputGroup}>
                  <Text variant="body">Body</Text>
                  <Card style={styles.inputCard}>
                    <TextInput
                      value={newNotification.body}
                      onChangeText={(text) => setNewNotification({...newNotification, body: text})}
                      placeholder="Notification message"
                      style={styles.textarea}
                      multiline
                      numberOfLines={3}
                    />
                  </Card>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Targeting
                </Text>
                <View style={styles.inputGroup}>
                  <Text variant="body">Audience</Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => {
                      Alert.alert("Select Audience", "Choose audience:", [
                        { text: "All Users", onPress: () => setNewNotification({...newNotification, audience: "All Users"}) },
                        { text: "New Users", onPress: () => setNewNotification({...newNotification, audience: "New Users"}) },
                        { text: "VIP Customers", onPress: () => setNewNotification({...newNotification, audience: "VIP Customers"}) },
                        { text: "Cancel", style: "cancel" },
                      ]);
                    }}
                  >
                    <Text variant="body">{newNotification.audience}</Text>
                    <Ionicons name="chevron-down" size={theme.typography.fontSize.lg + 2} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputGroup}>
                  <Text variant="body">Type</Text>
                  <View style={styles.typeSelector}>
                    {(['promotional', 'transactional', 'alert', 'reminder'] as const).map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeOption,
                          newNotification.type === type && styles.selectedTypeOption
                        ]}
                        onPress={() => setNewNotification({...newNotification, type: type as 'promotional'})}
                      >
                        <Text variant="caption">{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Templates
                </Text>
                <View style={styles.templatesList}>
                  {templates.map(template => (
                    <TouchableOpacity
                      key={template.id}
                      style={styles.templateItem}
                      onPress={() => handleUseTemplate(template)}
                    >
                      <View>
                        <Text variant="body" fontWeight="semibold">{template.name}</Text>
                        <Text variant="caption" color={theme.colors.text.light}>{template.body}</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={theme.typography.fontSize.base} color={theme.colors.text.light} />
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
              
              <View style={styles.modalActions}>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setShowComposeModal(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <View style={styles.sendOptions}>
                  <Button
                    variant="secondary"
                    size="md"
                    onPress={handleScheduleNotification}
                    style={styles.sendOptionButton}
                  >
                    Schedule
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onPress={handleSendNotification}
                    style={styles.sendOptionButton}
                  >
                    Send Now
                  </Button>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={theme.typography.fontSize['2xl']} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Push Notifications
        </Text>
        <TouchableOpacity onPress={() => setShowComposeModal(true)} style={styles.addButton}>
          <Ionicons name="add" size={theme.typography.fontSize['2xl']} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.content}
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.notificationsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary.green]} />}
        ListHeaderComponent={
          <>
            {/* Notifications Summary */}
            <View style={styles.summaryContainer}>
              <Card style={styles.summaryCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Notification Summary
                </Text>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text variant="caption" color={theme.colors.text.light}>
                      Total Sent
                    </Text>
                    <Text variant="h2" fontWeight="bold" color={theme.colors.primary.green}>
                      {notifications.filter(n => n.status === "sent").length}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text variant="caption" color={theme.colors.text.light}>
                      Scheduled
                    </Text>
                    <Text variant="h2" fontWeight="bold" color={theme.colors.primary.orange}>
                      {notifications.filter(n => n.status === "scheduled").length}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text variant="caption" color={theme.colors.text.light}>
                      Avg. Open Rate
                    </Text>
                    <Text variant="h2" fontWeight="bold" color={theme.colors.primary.purple}>
                      {notifications.length > 0 
                        ? (notifications.reduce((sum, n) => sum + n.openRate, 0) / notifications.length).toFixed(1) + "%" 
                        : "0%"}
                    </Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Notification List Header */}
            <Card style={styles.notificationsCard}>
              <View style={styles.cardHeader}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Notifications
                </Text>
                <TouchableOpacity onPress={() => {
                  Alert.alert("Filter Notifications", "Show:", [
                    { text: "Sent", onPress: () => console.log("Filter sent") },
                    { text: "Scheduled", onPress: () => console.log("Filter scheduled") },
                    { text: "All", onPress: () => console.log("Filter all") },
                    { text: "Cancel", style: "cancel" },
                  ]);
                }}>
                  <Ionicons name="filter" size={theme.typography.fontSize.lg + 2} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>
            </Card>
          </>
        }
        ListFooterComponent={
          /* Action Buttons */
          <View style={styles.actionButtons}>
            <Button
              variant="primary"
              size="md"
              onPress={() => setShowComposeModal(true)}
              style={styles.actionButton}
            >
              Create New Notification
            </Button>
            <Button
              variant="outline"
              size="md"
              onPress={() => router.push("/analytics/dashboard")}
              style={styles.actionButton}
            >
              View Analytics
            </Button>
          </View>
        }
      />

      {renderNotificationDetails()}
      {renderComposeModal()}
    </View>
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
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  addButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    padding: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },
  summaryItem: {
    alignItems: "center",
  },
  notificationsCard: {
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginTop: 0,
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  notificationsList: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  notificationCard: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  selectedNotificationCard: {
    borderColor: theme.colors.primary.green,
    backgroundColor: theme.colors.primary.green + "10",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  notificationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.sm,
  },
  statusIndicator: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
  },
  notificationMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  metricItem: {
    alignItems: "center",
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  actionButtons: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    width: "100%",
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  notificationDetailModal: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: "80%",
  },
  composeModal: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  notificationDetailContent: {
    flex: 1,
  },
  composeModalContent: {
    flex: 1,
  },
  detailCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  badgeDot: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
  },
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: "auto",
  },
  modalButton: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputCard: {
    padding: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  input: {
    height: theme.spacing.xl + 8,
    paddingHorizontal: theme.spacing.sm,
  },
  textarea: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  typeOption: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  selectedTypeOption: {
    backgroundColor: theme.colors.primary.green + "20",
    borderColor: theme.colors.primary.green,
  },
  templatesList: {
    gap: theme.spacing.sm,
  },
  templateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  sendOptions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flex: 2,
  },
  sendOptionButton: {
    flex: 1,
  },
});

export default PushNotificationCenter;
