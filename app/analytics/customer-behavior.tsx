import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Linking,
    Modal,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types for customer behavior data
interface CustomerBehavior {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  avgOrderValue: number;
  visitFrequency: string;
  preferredCategory: string;
  engagementScore: number;
  loyaltyTier: "bronze" | "silver" | "gold" | "platinum";
  cartAbandonmentRate: number;
  wishlistItems: number;
  favoriteStores: number;
  socialShares: number;
}

interface BehaviorMetric {
  id: string;
  title: string;
  value: string;
  trend: "up" | "down" | "stable";
  change: number;
}

const CustomerBehaviorTracking: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [customers, setCustomers] = useState<CustomerBehavior[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerBehavior | null>(null);
  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetric[]>([]);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter">("month");
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCustomers: CustomerBehavior[] = [
        {
          id: "1",
          name: "Rakesh Kumar",
          email: "rakesh.kumar@email.com",
          phone: "+91 98765 43210",
          totalSpent: 12450,
          ordersCount: 24,
          lastOrderDate: "2024-01-15",
          avgOrderValue: 519,
          visitFrequency: "Weekly",
          preferredCategory: "Groceries",
          engagementScore: 85,
          loyaltyTier: "gold",
          cartAbandonmentRate: 12,
          wishlistItems: 8,
          favoriteStores: 3,
          socialShares: 5,
        },
        {
          id: "2",
          name: "Priya Sharma",
          email: "priya.sharma@email.com",
          phone: "+91 98765 12345",
          totalSpent: 8760,
          ordersCount: 18,
          lastOrderDate: "2024-01-14",
          avgOrderValue: 487,
          visitFrequency: "Bi-weekly",
          preferredCategory: "Household",
          engagementScore: 72,
          loyaltyTier: "silver",
          cartAbandonmentRate: 18,
          wishlistItems: 12,
          favoriteStores: 5,
          socialShares: 3,
        },
        {
          id: "3",
          name: "Vijay Singh",
          email: "vijay.singh@email.com",
          phone: "+91 98765 67890",
          totalSpent: 15670,
          ordersCount: 32,
          lastOrderDate: "2024-01-13",
          avgOrderValue: 490,
          visitFrequency: "Daily",
          preferredCategory: "Personal Care",
          engagementScore: 92,
          loyaltyTier: "platinum",
          cartAbandonmentRate: 8,
          wishlistItems: 5,
          favoriteStores: 2,
          socialShares: 7,
        },
        {
          id: "4",
          name: "Anita Desai",
          email: "anita.desai@email.com",
          phone: "+91 98765 54321",
          totalSpent: 6540,
          ordersCount: 14,
          lastOrderDate: "2024-01-12",
          avgOrderValue: 467,
          visitFrequency: "Monthly",
          preferredCategory: "Snacks",
          engagementScore: 65,
          loyaltyTier: "bronze",
          cartAbandonmentRate: 25,
          wishlistItems: 15,
          favoriteStores: 4,
          socialShares: 2,
        },
        {
          id: "5",
          name: "Manoj Patel",
          email: "manoj.patel@email.com",
          phone: "+91 98765 98765",
          totalSpent: 9870,
          ordersCount: 21,
          lastOrderDate: "2024-01-11",
          avgOrderValue: 470,
          visitFrequency: "Weekly",
          preferredCategory: "Beverages",
          engagementScore: 78,
          loyaltyTier: "silver",
          cartAbandonmentRate: 15,
          wishlistItems: 6,
          favoriteStores: 3,
          socialShares: 4,
        },
      ];

      const mockMetrics: BehaviorMetric[] = [
        {
          id: "1",
          title: "Engagement Score",
          value: "78.2",
          trend: "up",
          change: 12.5,
        },
        {
          id: "2",
          title: "Avg. Session Time",
          value: "8m 42s",
          trend: "up",
          change: 8.3,
        },
        {
          id: "3",
          title: "Cart Abandonment",
          value: "16.4%",
          trend: "down",
          change: -5.2,
        },
        {
          id: "4",
          title: "Return Visitors",
          value: "64.7%",
          trend: "up",
          change: 7.8,
        },
      ];

      setCustomers(mockCustomers);
      setBehaviorMetrics(mockMetrics);
      setSelectedCustomer(mockCustomers[0]); // Set first customer as default
      setLoading(false);
    }, 1000);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getLoyaltyColor = (tier: CustomerBehavior["loyaltyTier"]): string => {
    switch (tier) {
      case "bronze": return theme.colors.status.warning;
      case "silver": return theme.colors.primary.purple;
      case "gold": return theme.colors.primary.orange;
      case "platinum": return theme.colors.primary.green;
      default: return theme.colors.text.primary;
    }
  };

  const getLoyaltyBg = (tier: CustomerBehavior["loyaltyTier"]): string => {
    switch (tier) {
      case "bronze": return theme.colors.status.warning + "20";
      case "silver": return theme.colors.primary.purple + "20";
      case "gold": return theme.colors.primary.orange + "20";
      case "platinum": return theme.colors.primary.green + "20";
      default: return theme.colors.background.secondary;
    }
  };

  const handleSendMessage = (customerId: string, phone?: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer?.phone) {
      Alert.alert(
        "Message Customer",
        `Contact ${customer.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "WhatsApp", onPress: () => Linking.openURL(`https://wa.me/91${customer.phone.replace(/\s/g, '').replace(/^\+91/, '')}`) },
          { text: "Call", onPress: () => Linking.openURL(`tel:${customer.phone.replace(/\s/g, '')}`) },
        ]
      );
    } else {
      Alert.alert("Message Customer", `No phone number available for this customer.`);
    }
  };

  const handleViewProfile = (customerId: string) => {
    setShowCustomerDetails(true);
  };

  const renderCustomerItem = ({ item }: { item: CustomerBehavior }) => (
    <TouchableOpacity
      onPress={() => setSelectedCustomer(item)}
      style={[
        styles.customerCard,
        selectedCustomer?.id === item.id && styles.selectedCustomerCard,
      ]}
    >
      <View style={styles.customerHeader}>
        <View style={styles.customerAvatar}>
          <Text variant="body" fontWeight="bold" color={theme.colors.background.primary}>
            {item.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.customerInfo}>
          <Text variant="body" fontWeight="semibold">
            {item.name}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.email}
          </Text>
        </View>
        <View style={styles.customerActions}>
          <TouchableOpacity
            onPress={() => handleSendMessage(item.id)}
            style={styles.actionButton}
          >
            <Ionicons name="chatbubble-ellipses" size={16} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleViewProfile(item.id)}
            style={styles.actionButton}
          >
            <Ionicons name="information-circle" size={16} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.customerMetrics}>
        <View style={styles.metricItem}>
          <Text variant="caption" color={theme.colors.text.light}>
            Spent
          </Text>
          <Text variant="body" fontWeight="bold">
            ₹{item.totalSpent.toLocaleString()}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text variant="caption" color={theme.colors.text.light}>
            Orders
          </Text>
          <Text variant="body" fontWeight="bold">
            {item.ordersCount}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text variant="caption" color={theme.colors.text.light}>
            Tier
          </Text>
          <View
            style={[
              styles.loyaltyBadge,
              { backgroundColor: getLoyaltyBg(item.loyaltyTier) }
            ]}
          >
            <Text
              variant="caption"
              fontWeight="medium"
              color={getLoyaltyColor(item.loyaltyTier)}
            >
              {item.loyaltyTier}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBehaviorMetric = ({ item }: { item: BehaviorMetric }) => (
    <Card style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text variant="body" color={theme.colors.text.light}>
          {item.title}
        </Text>
        <View style={styles.metricTrend}>
          <Ionicons
            name={
              item.trend === "up" ? "arrow-up" :
              item.trend === "down" ? "arrow-down" : "remove"
            }
            size={16}
            color={
              item.trend === "up" ? theme.colors.status.success :
              item.trend === "down" ? theme.colors.status.error : theme.colors.text.light
            }
          />
          <Text
            variant="caption"
            fontWeight="medium"
            color={
              item.trend === "up" ? theme.colors.status.success :
              item.trend === "down" ? theme.colors.status.error : theme.colors.text.light
            }
          >
            {Math.abs(item.change)}%
          </Text>
        </View>
      </View>
      <Text variant="h2" fontWeight="bold" style={styles.metricValue}>
        {item.value}
      </Text>
    </Card>
  );

  const renderCustomerBehaviorInsights = () => {
    if (!selectedCustomer) return null;

    return (
      <View style={styles.behaviorInsightsContainer}>
        <Card style={styles.behaviorCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Behavior Insights
          </Text>
          <View style={styles.insightRow}>
            <View style={styles.insightItem}>
              <Ionicons name="time" size={20} color={theme.colors.primary.orange} />
              <Text variant="body" style={styles.insightText}>
                {selectedCustomer.visitFrequency} visitor
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="heart" size={20} color={theme.colors.primary.orange} />
              <Text variant="body" style={styles.insightText}>
                Prefers {selectedCustomer.preferredCategory}
              </Text>
            </View>
          </View>
          <View style={styles.insightRow}>
            <View style={styles.insightItem}>
              <Ionicons name="cart" size={20} color={theme.colors.primary.green} />
              <Text variant="body" style={styles.insightText}>
                {selectedCustomer.cartAbandonmentRate}% cart abandonment
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="star" size={20} color={theme.colors.primary.orange} />
              <Text variant="body" style={styles.insightText}>
                Engagement: {selectedCustomer.engagementScore}%
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.behaviorCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Shopping Patterns
          </Text>
          <View style={styles.patternItem}>
            <Text variant="body" fontWeight="semibold">Average Order Value</Text>
            <Text variant="body">₹{selectedCustomer.avgOrderValue}</Text>
          </View>
          <View style={styles.patternItem}>
            <Text variant="body" fontWeight="semibold">Wishlist Items</Text>
            <Text variant="body">{selectedCustomer.wishlistItems}</Text>
          </View>
          <View style={styles.patternItem}>
            <Text variant="body" fontWeight="semibold">Favorite Stores</Text>
            <Text variant="body">{selectedCustomer.favoriteStores}</Text>
          </View>
          <View style={styles.patternItem}>
            <Text variant="body" fontWeight="semibold">Social Shares</Text>
            <Text variant="body">{selectedCustomer.socialShares}</Text>
          </View>
        </Card>

        <Card style={styles.behaviorCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Recommendations
          </Text>
          <View style={styles.recommendationItem}>
            <Ionicons name="gift" size={20} color={theme.colors.primary.green} />
            <Text variant="body" style={styles.recommendationText}>
              Send personalized offers for {selectedCustomer.preferredCategory}
            </Text>
          </View>
          <View style={styles.recommendationItem}>
            <Ionicons name="notifications" size={20} color={theme.colors.primary.purple} />
            <Text variant="body" style={styles.recommendationText}>
              Target with retargeting campaign for cart abandonment
            </Text>
          </View>
          <View style={styles.recommendationItem}>
            <Ionicons name="pricetag" size={20} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.recommendationText}>
              Recommend products based on past purchases
            </Text>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Customer Behavior
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const html = `
              <h1>Customer Behavior Report</h1>
              <table border="1" cellpadding="5">
                <tr><th>Customer</th><th>Total Spent</th><th>Orders</th><th>Engagement</th></tr>
                ${customers.map(c => `<tr><td>${c.name}</td><td>₹${c.totalSpent}</td><td>${c.ordersCount}</td><td>${c.engagementScore}%</td></tr>`).join('')}
              </table>
            `;
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri, { dialogTitle: "Customer Behavior Report" });
          }}
          style={styles.exportButton}
        >
          <Ionicons name="download" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        <TouchableOpacity
          style={[
            styles.timeframeButton,
            timeframe === "week" && styles.activeTimeframeButton,
          ]}
          onPress={() => setTimeframe("week")}
        >
          <Text
            variant="caption"
            fontWeight="medium"
            color={timeframe === "week" ? "#FFFFFF" : theme.colors.text.primary}
          >
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timeframeButton,
            timeframe === "month" && styles.activeTimeframeButton,
          ]}
          onPress={() => setTimeframe("month")}
        >
          <Text
            variant="caption"
            fontWeight="medium"
            color={timeframe === "month" ? "#FFFFFF" : theme.colors.text.primary}
          >
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timeframeButton,
            timeframe === "quarter" && styles.activeTimeframeButton,
          ]}
          onPress={() => setTimeframe("quarter")}
        >
          <Text
            variant="caption"
            fontWeight="medium"
            color={timeframe === "quarter" ? "#FFFFFF" : theme.colors.text.primary}
          >
            Quarter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Behavior Metrics - Horizontal scroll */}
      <View style={styles.metricsContainer}>
        <FlatList
          data={behaviorMetrics}
          renderItem={renderBehaviorMetric}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsList}
        />
      </View>

      {/* Customer List - Main scrollable */}
      <Card style={styles.customersCard}>
        <FlatList
          data={customers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.customersList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={
            <View style={styles.cardHeader}>
              <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                Top Customers
              </Text>
              <TouchableOpacity onPress={() => {
                Alert.alert("Filter Customers", "Show:", [
                  { text: "High Value", onPress: () => console.log("Filter high value") },
                  { text: "At Risk", onPress: () => console.log("Filter at risk") },
                  { text: "All", onPress: () => console.log("Filter all") },
                  { text: "Cancel", style: "cancel" },
                ]);
              }}>
                <Ionicons name="filter" size={20} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={
            selectedCustomer ? (
              <View style={styles.behaviorInsightsContainer}>
                {renderCustomerBehaviorInsights()}
              </View>
            ) : null
          }
        />
      </Card>

      {/* Customer Detail Modal */}
      <Modal
        visible={showCustomerDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomerDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.customerDetailModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                Customer Profile
              </Text>
              <TouchableOpacity onPress={() => setShowCustomerDetails(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            {selectedCustomer && (
              <View style={styles.customerDetailContent}>
                <View style={styles.customerDetailHeader}>
                  <View style={styles.largeAvatar}>
                    <Text variant="h2" fontWeight="bold" color={theme.colors.background.primary}>
                      {selectedCustomer.name.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text variant="h3" fontWeight="bold">
                      {selectedCustomer.name}
                    </Text>
                    <Text variant="body" color={theme.colors.text.light}>
                      {selectedCustomer.email}
                    </Text>
                    <Text variant="body" color={theme.colors.text.light}>
                      {selectedCustomer.phone}
                    </Text>
                  </View>
                </View>
                
                <Card style={styles.detailCard}>
                  <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                    Purchase History
                  </Text>
                  <View style={styles.detailRow}>
                    <Text variant="body">Total Spent</Text>
                    <Text variant="body" fontWeight="bold">₹{selectedCustomer.totalSpent.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Orders Count</Text>
                    <Text variant="body" fontWeight="bold">{selectedCustomer.ordersCount}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Avg Order Value</Text>
                    <Text variant="body" fontWeight="bold">₹{selectedCustomer.avgOrderValue}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Last Order</Text>
                    <Text variant="body" fontWeight="bold">{selectedCustomer.lastOrderDate}</Text>
                  </View>
                </Card>
                
                <Card style={styles.detailCard}>
                  <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                    Behavior Metrics
                  </Text>
                  <View style={styles.detailRow}>
                    <Text variant="body">Engagement Score</Text>
                    <Text variant="body" fontWeight="bold">{selectedCustomer.engagementScore}%</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Visit Frequency</Text>
                    <Text variant="body" fontWeight="bold">{selectedCustomer.visitFrequency}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Cart Abandonment</Text>
                    <Text variant="body" fontWeight="bold">{selectedCustomer.cartAbandonmentRate}%</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Preferred Category</Text>
                    <Text variant="body" fontWeight="bold">{selectedCustomer.preferredCategory}</Text>
                  </View>
                </Card>
                
                <View style={styles.modalActions}>
                  <Button
                    variant="outline"
                    size="md"
                    onPress={() => setShowCustomerDetails(false)}
                    style={styles.modalButton}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onPress={() => {
                      handleSendMessage(selectedCustomer.id);
                      setShowCustomerDetails(false);
                    }}
                    style={styles.modalButton}
                  >
                    Message
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  exportButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  timeframeContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
  },
  timeframeButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  activeTimeframeButton: {
    backgroundColor: theme.colors.primary.green,
  },
  metricsContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  metricsList: {
    gap: theme.spacing.md,
  },
  metricCard: {
    width: theme.spacing.xxl * 3 + theme.spacing.lg,
    padding: theme.spacing.md,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  metricTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  metricValue: {
    marginTop: theme.spacing.sm,
  },
  customersCard: {
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  customersList: {
    gap: theme.spacing.md,
  },
  customerCard: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  selectedCustomerCard: {
    borderColor: theme.colors.primary.green,
    backgroundColor: theme.colors.primary.green + "10",
  },
  customerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.green,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  customerInfo: {
    flex: 1,
  },
  customerActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
  customerMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    alignItems: "center",
  },
  loyaltyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  behaviorInsightsContainer: {
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xxl * 2 + theme.spacing.lg, // Space for potential footer
  },
  behaviorCard: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  insightText: {
    flex: 1,
  },
  patternItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  recommendationText: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  customerDetailModal: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: "80%",
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
  customerDetailContent: {
    flex: 1,
  },
  customerDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  largeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary.green,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
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
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: "auto",
  },
  modalButton: {
    flex: 1,
  },
});

export default CustomerBehaviorTracking;