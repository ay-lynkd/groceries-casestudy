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
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types for marketing campaigns
interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  type: "email" | "sms" | "push" | "in-app";
  status: "active" | "paused" | "scheduled" | "completed";
  audience: string; // e.g., "VIP Customers", "New Signups"
  trigger: "scheduled" | "behavioral" | "event-based";
  startDate: string;
  endDate: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenueGenerated: number;
  cost: number;
  roi: number;
}

interface AudienceSegment {
  id: string;
  name: string;
  size: number;
  description: string;
}

const AutomatedMarketingCampaigns: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [audiences, setAudiences] = useState<AudienceSegment[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCampaigns: MarketingCampaign[] = [
        {
          id: "camp-1",
          name: "Welcome Series",
          description: "Welcome email series for new customers",
          type: "email",
          status: "active",
          audience: "New Signups",
          trigger: "event-based",
          startDate: "2023-01-15",
          endDate: "2024-01-15",
          sentCount: 1245,
          openRate: 42.5,
          clickRate: 12.3,
          conversionRate: 5.2,
          revenueGenerated: 12450.75,
          cost: 245.50,
          roi: 408.2,
        },
        {
          id: "camp-2",
          name: "Abandoned Cart Recovery",
          description: "SMS reminders for abandoned carts",
          type: "sms",
          status: "active",
          audience: "Cart Abandoners",
          trigger: "behavioral",
          startDate: "2023-02-01",
          endDate: "2024-02-01",
          sentCount: 876,
          openRate: 78.2,
          clickRate: 22.1,
          conversionRate: 8.7,
          revenueGenerated: 8760.25,
          cost: 175.20,
          roi: 400.1,
        },
        {
          id: "camp-3",
          name: "Seasonal Promotion",
          description: "Summer sale push notifications",
          type: "push",
          status: "scheduled",
          audience: "Active Customers",
          trigger: "scheduled",
          startDate: "2023-10-20",
          endDate: "2023-11-15",
          sentCount: 0,
          openRate: 0,
          clickRate: 0,
          conversionRate: 0,
          revenueGenerated: 0,
          cost: 0,
          roi: 0,
        },
        {
          id: "camp-4",
          name: "VIP Loyalty Rewards",
          description: "Exclusive offers for VIP customers",
          type: "email",
          status: "paused",
          audience: "VIP Customers",
          trigger: "event-based",
          startDate: "2023-03-10",
          endDate: "2024-03-10",
          sentCount: 456,
          openRate: 56.8,
          clickRate: 18.9,
          conversionRate: 12.4,
          revenueGenerated: 15670.40,
          cost: 312.80,
          roi: 400.3,
        },
        {
          id: "camp-5",
          name: "Restock Notification",
          description: "Notify customers when products are back in stock",
          type: "push",
          status: "active",
          audience: "Interested Buyers",
          trigger: "event-based",
          startDate: "2023-05-01",
          endDate: "2024-05-01",
          sentCount: 2341,
          openRate: 35.6,
          clickRate: 8.7,
          conversionRate: 3.2,
          revenueGenerated: 7890.30,
          cost: 468.20,
          roi: 168.5,
        },
      ];

      const mockAudiences: AudienceSegment[] = [
        {
          id: "aud-1",
          name: "VIP Customers",
          size: 124,
          description: "High-value customers with frequent purchases",
        },
        {
          id: "aud-2",
          name: "New Signups",
          size: 187,
          description: "Recent sign-ups with potential for growth",
        },
        {
          id: "aud-3",
          name: "Cart Abandoners",
          size: 234,
          description: "Customers who abandoned their cart",
        },
        {
          id: "aud-4",
          name: "Inactive Users",
          size: 215,
          description: "Customers who haven't purchased in 60+ days",
        },
        {
          id: "aud-5",
          name: "Organic Lovers",
          size: 98,
          description: "Customers who primarily buy organic products",
        },
      ];

      setCampaigns(mockCampaigns);
      setAudiences(mockAudiences);
      setSelectedCampaign(mockCampaigns[0]); // Set first campaign as default
      setLoading(false);
    }, 1000);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleCreateCampaign = () => {
    Alert.alert(
      "Create Campaign",
      "Create a new automated marketing campaign would be implemented here",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => console.log("Creating campaign") },
      ]
    );
  };

  const handleStartCampaign = (campaignId: string) => {
    Alert.alert(
      "Start Campaign",
      "Are you sure you want to start this campaign?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Start", 
          onPress: () => {
            setCampaigns(campaigns.map(camp => 
              camp.id === campaignId ? { ...camp, status: "active" } : camp
            ));
          }
        },
      ]
    );
  };

  const handlePauseCampaign = (campaignId: string) => {
    Alert.alert(
      "Pause Campaign",
      "Are you sure you want to pause this campaign?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Pause", 
          onPress: () => {
            setCampaigns(campaigns.map(camp => 
              camp.id === campaignId ? { ...camp, status: "paused" } : camp
            ));
          }
        },
      ]
    );
  };

  const handleViewCampaignDetails = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      setShowCampaignDetails(true);
    }
  };

  const renderCampaignItem = ({ item }: { item: MarketingCampaign }) => {
    const statusColors = {
      active: theme.colors.status.success,
      paused: theme.colors.status.warning,
      scheduled: theme.colors.primary.orange,
      completed: theme.colors.text.light,
    };

    return (
      <TouchableOpacity
        onPress={() => setSelectedCampaign(item)}
        style={[
          styles.campaignCard,
          selectedCampaign?.id === item.id && styles.selectedCampaignCard,
        ]}
      >
        <View style={styles.campaignHeader}>
          <View style={styles.campaignInfo}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColors[item.status] }]} />
            <View>
              <Text variant="body" fontWeight="semibold">
                {item.name}
              </Text>
              <Text variant="caption" color={theme.colors.text.light}>
                {item.description}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleViewCampaignDetails(item.id)}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.text.light} />
          </TouchableOpacity>
        </View>

        <View style={styles.campaignMetrics}>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Sent
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.sentCount.toLocaleString()}
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
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              ROI
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.roi.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.campaignFooter}>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.audience} • {item.type.toUpperCase()}
          </Text>
          {item.status === "active" ? (
            <Button
              variant="outline"
              size="sm"
              onPress={() => handlePauseCampaign(item.id)}
            >
              Pause
            </Button>
          ) : item.status === "paused" ? (
            <Button
              variant="primary"
              size="sm"
              onPress={() => handleStartCampaign(item.id)}
            >
              Start
            </Button>
          ) : item.status === "scheduled" ? (
            <Button
              variant="primary"
              size="sm"
              onPress={() => handleStartCampaign(item.id)}
            >
              Start Now
            </Button>
          ) : (
            <Text variant="caption" color={theme.colors.text.light}>Completed</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCampaignDetails = () => {
    if (!selectedCampaign) return null;

    const statusColors = {
      active: theme.colors.status.success,
      paused: theme.colors.status.warning,
      scheduled: theme.colors.primary.orange,
      completed: theme.colors.text.light,
    };

    return (
      <Modal
        visible={showCampaignDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCampaignDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.campaignDetailModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                {selectedCampaign.name}
              </Text>
              <TouchableOpacity onPress={() => setShowCampaignDetails(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.campaignDetailContent}>
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Overview
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Status</Text>
                  <View style={styles.statusBadge}>
                    <View style={[styles.badgeDot, { backgroundColor: statusColors[selectedCampaign.status] }]} />
                    <Text variant="body" fontWeight="bold">{selectedCampaign.status}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Type</Text>
                  <Text variant="body" fontWeight="bold">{selectedCampaign.type.toUpperCase()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Audience</Text>
                  <Text variant="body" fontWeight="bold">{selectedCampaign.audience}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Trigger</Text>
                  <Text variant="body" fontWeight="bold">{selectedCampaign.trigger}</Text>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Performance Metrics
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Sent</Text>
                  <Text variant="body" fontWeight="bold">{selectedCampaign.sentCount.toLocaleString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Open Rate</Text>
                  <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                    {selectedCampaign.openRate}%
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Click Rate</Text>
                  <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                    {selectedCampaign.clickRate}%
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Conversion Rate</Text>
                  <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                    {selectedCampaign.conversionRate}%
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Revenue</Text>
                  <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                    ${selectedCampaign.revenueGenerated.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">ROI</Text>
                  <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                    {selectedCampaign.roi.toFixed(1)}%
                  </Text>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Schedule
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Start Date</Text>
                  <Text variant="body" fontWeight="bold">{selectedCampaign.startDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">End Date</Text>
                  <Text variant="body" fontWeight="bold">{selectedCampaign.endDate}</Text>
                </View>
              </Card>
              
              <View style={styles.modalActions}>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setShowCampaignDetails(false)}
                  style={styles.modalButton}
                >
                  Close
                </Button>
                {selectedCampaign.status === "active" ? (
                  <Button
                    variant="secondary"
                    size="md"
                    onPress={() => {
                      handlePauseCampaign(selectedCampaign.id);
                      setShowCampaignDetails(false);
                    }}
                    style={styles.modalButton}
                  >
                    Pause Campaign
                  </Button>
                ) : selectedCampaign.status === "paused" ? (
                  <Button
                    variant="primary"
                    size="md"
                    onPress={() => {
                      handleStartCampaign(selectedCampaign.id);
                      setShowCampaignDetails(false);
                    }}
                    style={styles.modalButton}
                  >
                    Resume Campaign
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onPress={() => {
                      handleStartCampaign(selectedCampaign.id);
                      setShowCampaignDetails(false);
                    }}
                    style={styles.modalButton}
                  >
                    Start Campaign
                  </Button>
                )}
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
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Marketing Campaigns
        </Text>
        <TouchableOpacity onPress={handleCreateCampaign} style={styles.addButton}>
          <Ionicons name="add" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Campaign Summary */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Campaign Summary
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Active
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.green}>
                  {campaigns.filter(c => c.status === "active").length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Scheduled
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.orange}>
                  {campaigns.filter(c => c.status === "scheduled").length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Revenue
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.purple}>
                  ${(campaigns.reduce((sum, camp) => sum + camp.revenueGenerated, 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Campaign List */}
        <Card style={styles.campaignsCard}>
          <View style={styles.cardHeader}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Campaigns
            </Text>
            <TouchableOpacity onPress={() => {
              Alert.alert("Filter Campaigns", "Show:", [
                { text: "Active", onPress: () => console.log("Filter active") },
                { text: "Paused", onPress: () => console.log("Filter paused") },
                { text: "All", onPress: () => console.log("Filter all") },
                { text: "Cancel", style: "cancel" },
              ]);
            }}>
              <Ionicons name="filter" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={campaigns}
            renderItem={renderCampaignItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.campaignsList}
          />
        </Card>

        {/* Audience Segments */}
        <Card style={styles.audienceCard}>
          <View style={styles.cardHeader}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Audience Segments
            </Text>
            <TouchableOpacity onPress={() => router.push("/analytics/customer-segmentation")}>
              <Ionicons name="settings" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.audienceList}>
            {audiences.map((audience) => (
              <View key={audience.id} style={styles.audienceItem}>
                <View style={styles.audienceInfo}>
                  <Text variant="body" fontWeight="semibold">{audience.name}</Text>
                  <Text variant="caption" color={theme.colors.text.light}>{audience.description}</Text>
                </View>
                <Text variant="body" fontWeight="bold">{audience.size} customers</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="primary"
            size="md"
            onPress={handleCreateCampaign}
            style={styles.actionButton}
          >
            Create New Campaign
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
      </ScrollView>

      {renderCampaignDetails()}
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
  campaignsCard: {
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
  campaignsList: {
    gap: theme.spacing.md,
  },
  campaignCard: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  selectedCampaignCard: {
    borderColor: theme.colors.primary.green,
    backgroundColor: theme.colors.primary.green + "10",
  },
  campaignHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  campaignInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.sm,
  },
  statusIndicator: {
    width: theme.spacing.xs + 4,
    height: theme.spacing.xs + 4,
    borderRadius: theme.borderRadius.xs,
  },
  campaignMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  metricItem: {
    alignItems: "center",
  },
  campaignFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  audienceCard: {
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  audienceList: {
    gap: theme.spacing.md,
  },
  audienceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
  },
  audienceInfo: {
    flex: 1,
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
  campaignDetailModal: {
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
  campaignDetailContent: {
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
    width: theme.spacing.xs + 4,
    height: theme.spacing.xs + 4,
    borderRadius: 4,
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

export default AutomatedMarketingCampaigns;