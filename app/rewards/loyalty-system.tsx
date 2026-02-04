import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";

const { colors, spacing, borderRadius, typography } = theme;
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types for loyalty programs and rewards
interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  type: "points" | "tier" | "cashback" | "hybrid";
  isActive: boolean;
  startDate: string;
  endDate: string;
  pointsPerDollar: number;
  redemptionRate: number; // how many points = $1
  tiers: LoyaltyTier[];
}

interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  discountRate: number; // percentage
}

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number; // in points
  category: string;
  availability: "always" | "limited" | "seasonal";
  isActive: boolean;
}

interface CustomerLoyalty {
  customerId: string;
  name: string;
  currentTier: string;
  pointsBalance: number;
  tierProgress: number; // percentage toward next tier
  nextTier: string;
  pointsUntilNextTier: number;
  totalEarned: number;
  totalRedeemed: number;
  lastActivity: string;
}

const LoyaltyRewardsSystem: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [customers, setCustomers] = useState<CustomerLoyalty[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProgram: LoyaltyProgram = {
        id: "lp-1",
        name: "Grocery Rewards Program",
        description: "Earn points on every purchase and redeem for discounts",
        type: "points",
        isActive: true,
        startDate: "2023-01-01",
        endDate: "2024-12-31",
        pointsPerDollar: 10,
        redemptionRate: 100, // 100 points = $1
        tiers: [
          {
            id: "tier-1",
            name: "Silver",
            minPoints: 0,
            benefits: ["1% cashback", "Early access to sales"],
            discountRate: 1,
          },
          {
            id: "tier-2",
            name: "Gold",
            minPoints: 1000,
            benefits: ["3% cashback", "Early access to sales", "Free delivery"],
            discountRate: 3,
          },
          {
            id: "tier-3",
            name: "Platinum",
            minPoints: 5000,
            benefits: ["5% cashback", "Early access to sales", "Free delivery", "Exclusive offers"],
            discountRate: 5,
          },
        ],
      };

      const mockRewards: Reward[] = [
        {
          id: "rew-1",
          name: "$5 Off Coupon",
          description: "Get $5 off your next purchase",
          cost: 500,
          category: "Discount",
          availability: "always",
          isActive: true,
        },
        {
          id: "rew-2",
          name: "Free Delivery",
          description: "Free delivery on your next order",
          cost: 300,
          category: "Shipping",
          availability: "always",
          isActive: true,
        },
        {
          id: "rew-3",
          name: "10% Off Entire Order",
          description: "10% discount on your entire order",
          cost: 800,
          category: "Discount",
          availability: "limited",
          isActive: true,
        },
        {
          id: "rew-4",
          name: "Free Grocery Bag",
          description: "Get a free eco-friendly grocery bag",
          cost: 200,
          category: "Merchandise",
          availability: "always",
          isActive: true,
        },
        {
          id: "rew-5",
          name: "Birthday Gift",
          description: "Special birthday offer",
          cost: 1000,
          category: "Gift",
          availability: "seasonal",
          isActive: true,
        },
      ];

      const mockCustomers: CustomerLoyalty[] = [
        {
          customerId: "cust-1",
          name: "John Smith",
          currentTier: "Gold",
          pointsBalance: 1450,
          tierProgress: 45,
          nextTier: "Platinum",
          pointsUntilNextTier: 3550,
          totalEarned: 2450,
          totalRedeemed: 1000,
          lastActivity: "2023-10-15",
        },
        {
          customerId: "cust-2",
          name: "Sarah Johnson",
          currentTier: "Silver",
          pointsBalance: 650,
          tierProgress: 65,
          nextTier: "Gold",
          pointsUntilNextTier: 350,
          totalEarned: 1200,
          totalRedeemed: 550,
          lastActivity: "2023-10-14",
        },
        {
          customerId: "cust-3",
          name: "Michael Brown",
          currentTier: "Platinum",
          pointsBalance: 7800,
          tierProgress: 0,
          nextTier: "Platinum",
          pointsUntilNextTier: 0,
          totalEarned: 9800,
          totalRedeemed: 2000,
          lastActivity: "2023-10-15",
        },
      ];

      setLoyaltyProgram(mockProgram);
      setRewards(mockRewards);
      setCustomers(mockCustomers);
      setSelectedReward(mockRewards[0]); // Set first reward as default
      setLoading(false);
    }, 1000);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleRedeemReward = (rewardId: string) => {
    Alert.alert(
      "Redeem Reward",
      "Are you sure you want to redeem this reward?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Redeem", 
          onPress: () => {
            Alert.alert("Success", "Reward redeemed successfully!");
          }
        },
      ]
    );
  };

  const handleCreateReward = () => {
    Alert.alert(
      "Create Reward",
      "Create a new loyalty reward would be implemented here",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => console.log("Creating reward") },
      ]
    );
  };

  const handleViewRewardDetails = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward) {
      setSelectedReward(reward);
      setShowRedeemModal(true);
    }
  };

  const renderRewardItem = ({ item }: { item: Reward }) => {
    const canAfford = loyaltyProgram ? item.cost <= 1450 : false; // Using first customer's points as example
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedReward(item)}
        style={[
          styles.rewardCard,
          selectedReward?.id === item.id && styles.selectedRewardCard,
        ]}
      >
        <View style={styles.rewardHeader}>
          <View>
            <Text variant="body" fontWeight="semibold">
              {item.name}
            </Text>
            <Text variant="caption" color={colors.text.light}>
              {item.description}
            </Text>
          </View>
          <View style={styles.pointsContainer}>
            <Text variant="h3" fontWeight="bold" color={colors.primary.green}>
              {item.cost}
            </Text>
            <Text variant="caption" color={colors.text.light}>
              points
            </Text>
          </View>
        </View>

        <View style={styles.rewardDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="pricetag" size={16} color={colors.text.light} />
            <Text variant="caption" style={{ marginLeft: spacing.xs }}>
              {item.category}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color={colors.text.light} />
            <Text variant="caption" style={{ marginLeft: spacing.xs }}>
              {item.availability}
            </Text>
          </View>
        </View>

        <Button
          variant={canAfford ? "primary" : "outline"}
          size="sm"
          onPress={() => handleViewRewardDetails(item.id)}
          disabled={!canAfford}
          style={styles.redeemButton}
        >
          {canAfford ? "Redeem" : "Insufficient Points"}
        </Button>
      </TouchableOpacity>
    );
  };

  const renderRedeemModal = () => {
    if (!selectedReward || !loyaltyProgram) return null;

    const canAfford = selectedReward.cost <= 1450; // Using first customer's points as example

    return (
      <Modal
        visible={showRedeemModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRedeemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.redeemModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                Redeem Reward
              </Text>
              <TouchableOpacity onPress={() => setShowRedeemModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.redeemModalContent}>
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Reward Details
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Name</Text>
                  <Text variant="body" fontWeight="bold">{selectedReward.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Description</Text>
                  <Text variant="body" fontWeight="bold">{selectedReward.description}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Cost</Text>
                  <Text variant="body" fontWeight="bold" color={colors.primary.green}>
                    {selectedReward.cost} points
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Category</Text>
                  <Text variant="body" fontWeight="bold">{selectedReward.category}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Availability</Text>
                  <Text variant="body" fontWeight="bold">{selectedReward.availability}</Text>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Your Balance
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Current Points</Text>
                  <Text variant="body" fontWeight="bold" color={colors.primary.green}>
                    1,450
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">After Redemption</Text>
                  <Text variant="body" fontWeight="bold" color={colors.primary.green}>
                    {1450 - selectedReward.cost}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Remaining</Text>
                  <Text variant="body" fontWeight="bold" color={canAfford ? theme.colors.status.success : theme.colors.status.error}>
                    {canAfford ? "Sufficient" : "Insufficient"}
                  </Text>
                </View>
              </Card>
              
              <View style={styles.modalActions}>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setShowRedeemModal(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onPress={() => {
                    handleRedeemReward(selectedReward.id);
                    setShowRedeemModal(false);
                  }}
                  style={styles.modalButton}
                  disabled={!canAfford}
                >
                  Confirm Redemption
                </Button>
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
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Loyalty Rewards
        </Text>
        <TouchableOpacity onPress={handleCreateReward} style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Content - Using FlatList as primary scrollable */}
      <FlatList
        style={styles.content}
        data={rewards}
        renderItem={renderRewardItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.rewardsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            {/* Loyalty Program Summary */}
            {loyaltyProgram && (
              <View style={styles.summaryContainer}>
                <Card style={styles.summaryCard}>
                  <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                    {loyaltyProgram.name}
                  </Text>
                  <Text variant="body" color={colors.text.light} style={styles.programDescription}>
                    {loyaltyProgram.description}
                  </Text>
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                      <Text variant="caption" color={colors.text.light}>
                        Points per $
                      </Text>
                      <Text variant="h2" fontWeight="bold" color={colors.primary.green}>
                        {loyaltyProgram.pointsPerDollar}
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text variant="caption" color={colors.text.light}>
                        Redemption Rate
                      </Text>
                      <Text variant="h2" fontWeight="bold" color={colors.primary.green}>
                        {loyaltyProgram.redemptionRate}:1
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text variant="caption" color={colors.text.light}>
                        Active Tiers
                      </Text>
                      <Text variant="h2" fontWeight="bold" color={colors.primary.purple}>
                        {loyaltyProgram.tiers.length}
                      </Text>
                    </View>
                  </View>
                </Card>
              </View>
            )}

            {/* Customer Loyalty Status */}
            {customers.length > 0 && (
              <Card style={styles.customerCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Your Status
                </Text>
                <View style={styles.customerInfo}>
                  <View style={styles.customerDetails}>
                    <Text variant="body" fontWeight="semibold">{customers[0].name}</Text>
                    <Text variant="caption" color={colors.text.light}>
                      Current Tier: {customers[0].currentTier}
                    </Text>
                  </View>
                  <View style={styles.pointsInfo}>
                    <Text variant="h2" fontWeight="bold" color={colors.primary.green}>
                      {customers[0].pointsBalance}
                    </Text>
                    <Text variant="caption" color={colors.text.light}>
                      points
                    </Text>
                  </View>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${customers[0].tierProgress}%`, backgroundColor: colors.primary.green }
                      ]} 
                    />
                  </View>
                  <Text variant="caption" color={colors.text.light}>
                    {customers[0].pointsUntilNextTier} points to {customers[0].nextTier}
                  </Text>
                </View>
              </Card>
            )}

            {/* Reward Catalog Header */}
            <Card style={styles.rewardsCard}>
              <View style={styles.cardHeader}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Reward Catalog
                </Text>
                <TouchableOpacity onPress={() => {
                  Alert.alert("Filter Rewards", "Show:", [
                    { text: "Active", onPress: () => console.log("Filter active") },
                    { text: "All", onPress: () => console.log("Filter all") },
                    { text: "Cancel", style: "cancel" },
                  ]);
                }}>
                  <Ionicons name="filter" size={20} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            </Card>
          </>
        }
        ListFooterComponent={
          <>
            {/* Loyalty Tiers */}
            {loyaltyProgram && (
              <Card style={styles.tiersCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Loyalty Tiers
                </Text>
                <View style={styles.tiersList}>
                  {loyaltyProgram.tiers.map((tier) => (
                    <View 
                      key={tier.id} 
                      style={[
                        styles.tierItem,
                        customers[0]?.currentTier === tier.name && styles.currentTierItem
                      ]}
                    >
                      <View style={styles.tierHeader}>
                        <Text variant="body" fontWeight="semibold">{tier.name}</Text>
                        <Text variant="caption" color={colors.text.light}>
                          {tier.minPoints}+ pts
                        </Text>
                      </View>
                      <View style={styles.benefitsList}>
                        {tier.benefits.map((benefit, index) => (
                          <View key={index} style={styles.benefitItem}>
                            <Ionicons name="checkmark-circle" size={12} color={colors.primary.green} />
                            <Text variant="caption" style={{ marginLeft: spacing.xs }}>
                              {benefit}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                variant="primary"
                size="md"
                onPress={handleCreateReward}
                style={styles.actionButton}
              >
                Add New Reward
              </Button>
              <Button
                variant="outline"
                size="md"
                onPress={() => router.push("/analytics/customers")}
                style={styles.actionButton}
              >
                View Analytics
              </Button>
            </View>
          </>
        }
      />

      {renderRedeemModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  addButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    padding: spacing.md,
  },
  programDescription: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  summaryItem: {
    alignItems: "center",
  },
  customerCard: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  customerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  customerDetails: {
    flex: 1,
  },
  pointsInfo: {
    alignItems: "flex-end",
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressBar: {
    height: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.xs,
    marginBottom: spacing.xs,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: spacing.xs,
  },
  rewardsCard: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  rewardsList: {
    gap: spacing.md,
  },
  rewardCard: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
  },
  selectedRewardCard: {
    borderColor: colors.primary.green,
    backgroundColor: colors.primary.green + "10",
  },
  rewardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  pointsContainer: {
    alignItems: "center",
  },
  rewardDetails: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  redeemButton: {
    alignSelf: "flex-start",
  },
  tiersCard: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  tiersList: {
    gap: spacing.md,
  },
  tierItem: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
  },
  currentTierItem: {
    borderColor: colors.primary.green,
    backgroundColor: colors.primary.green + "10",
  },
  tierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  benefitsList: {
    gap: spacing.xs,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    width: "100%",
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  redeemModal: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  redeemModalContent: {
    flex: 1,
  },
  detailCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: "auto",
  },
  modalButton: {
    flex: 1,
  },
});

export default LoyaltyRewardsSystem;