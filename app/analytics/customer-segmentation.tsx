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
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as DocumentPicker from "expo-document-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types for customer segments
interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  avgOrderValue: number;
  conversionRate: number;
  growthRate: number;
  color: string;
  criteria: string[];
  createdAt: string;
  isActive: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  location: string;
  registrationDate: string;
}

const CustomerSegmentationSystem: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment | null>(null);
  const [showSegmentDetails, setShowSegmentDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockSegments: CustomerSegment[] = [
        {
          id: "seg-1",
          name: "VIP Customers",
          description: "High-value customers with frequent purchases",
          customerCount: 124,
          avgOrderValue: 245.50,
          conversionRate: 85.2,
          growthRate: 12.5,
          color: theme.colors.primary.green,
          criteria: [
            "Total spent > $1000",
            "Orders > 20",
            "Last order < 30 days",
          ],
          createdAt: "2023-01-15",
          isActive: true,
        },
        {
          id: "seg-2",
          name: "Budget Shoppers",
          description: "Price-sensitive customers who shop for deals",
          customerCount: 342,
          avgOrderValue: 89.20,
          conversionRate: 42.7,
          growthRate: 8.3,
          color: theme.colors.primary.green,
          criteria: [
            "Average order < $100",
            "Frequently buy discounted items",
          ],
          createdAt: "2023-02-20",
          isActive: true,
        },
        {
          id: "seg-3",
          name: "New Customers",
          description: "Recent sign-ups with potential for growth",
          customerCount: 187,
          avgOrderValue: 65.30,
          conversionRate: 28.9,
          growthRate: 25.1,
          color: theme.colors.primary.orange,
          criteria: [
            "Registration < 30 days",
            "First purchase completed",
          ],
          createdAt: "2023-03-10",
          isActive: true,
        },
        {
          id: "seg-4",
          name: "Inactive Users",
          description: "Customers who haven't purchased in 60+ days",
          customerCount: 215,
          avgOrderValue: 0,
          conversionRate: 5.2,
          growthRate: -3.2,
          color: theme.colors.text.light,
          criteria: [
            "Last order > 60 days ago",
            "No engagement in 30 days",
          ],
          createdAt: "2023-01-05",
          isActive: true,
        },
        {
          id: "seg-5",
          name: "Organic Lovers",
          description: "Customers who primarily buy organic products",
          customerCount: 98,
          avgOrderValue: 156.80,
          conversionRate: 72.1,
          growthRate: 18.7,
          color: theme.colors.primary.purple,
          criteria: [
            "70%+ organic purchases",
            "Subscribed to organic newsletter",
          ],
          createdAt: "2023-04-02",
          isActive: true,
        },
      ];

      const mockCustomers: Customer[] = [
        {
          id: "cust-1",
          name: "John Smith",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          segment: "VIP Customers",
          totalOrders: 42,
          totalSpent: 2450.75,
          lastOrderDate: "2023-10-15",
          location: "New York, NY",
          registrationDate: "2022-03-10",
        },
        {
          id: "cust-2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "+1 (555) 987-6543",
          segment: "Budget Shoppers",
          totalOrders: 18,
          totalSpent: 1250.20,
          lastOrderDate: "2023-10-12",
          location: "Los Angeles, CA",
          registrationDate: "2022-08-22",
        },
        {
          id: "cust-3",
          name: "Michael Brown",
          email: "michael@example.com",
          phone: "+1 (555) 456-7890",
          segment: "New Customers",
          totalOrders: 3,
          totalSpent: 245.50,
          lastOrderDate: "2023-10-14",
          location: "Chicago, IL",
          registrationDate: "2023-09-20",
        },
      ];

      setSegments(mockSegments);
      setCustomers(mockCustomers);
      setSelectedSegment(mockSegments[0]); // Set first segment as default
      setLoading(false);
    }, 1000);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleCreateSegment = () => {
    Alert.alert(
      "Create Segment",
      "Create a new customer segment would be implemented here",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => console.log("Creating segment") },
      ]
    );
  };

  const handleEditSegment = (segmentId: string) => {
    Alert.alert(
      "Edit Segment",
      `Editing segment ${segmentId} would be implemented here`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: () => console.log("Saving segment") },
      ]
    );
  };

  const handleDeleteSegment = (segmentId: string) => {
    Alert.alert(
      "Delete Segment",
      "Are you sure you want to delete this segment?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setSegments(segments.filter(seg => seg.id !== segmentId));
            if (selectedSegment?.id === segmentId) {
              setSelectedSegment(segments.length > 1 ? segments[0] : null);
            }
          }
        },
      ]
    );
  };

  const renderSegmentItem = ({ item }: { item: CustomerSegment }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedSegment(item)}
        style={[
          styles.segmentCard,
          selectedSegment?.id === item.id && styles.selectedSegmentCard,
        ]}
      >
        <View style={styles.segmentHeader}>
          <View style={styles.segmentInfo}>
            <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
            <View>
              <Text variant="body" fontWeight="semibold">
                {item.name}
              </Text>
              <Text variant="caption" color={theme.colors.text.light}>
                {item.description}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleEditSegment(item.id)}>
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text.light} />
          </TouchableOpacity>
        </View>

        <View style={styles.segmentMetrics}>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Customers
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.customerCount}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Avg Order
            </Text>
            <Text variant="body" fontWeight="bold">
              ${item.avgOrderValue.toFixed(2)}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Growth
            </Text>
            <Text 
              variant="body" 
              fontWeight="bold"
              color={item.growthRate >= 0 ? theme.colors.status.success : theme.colors.status.error}
            >
              {item.growthRate >= 0 ? '+' : ''}{item.growthRate.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.segmentFooter}>
          <Text variant="caption" color={theme.colors.text.light}>
            Conversion: {item.conversionRate}%
          </Text>
          <TouchableOpacity 
            onPress={() => {
              setSelectedSegment(item);
              setShowSegmentDetails(true);
            }}
          >
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.text.light} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSegmentDetails = () => {
    if (!selectedSegment) return null;

    return (
      <Modal
        visible={showSegmentDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSegmentDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.segmentDetailModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                {selectedSegment.name}
              </Text>
              <TouchableOpacity onPress={() => setShowSegmentDetails(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.segmentDetailContent}>
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Overview
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Description</Text>
                  <Text variant="body" fontWeight="bold">{selectedSegment.description}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Customers</Text>
                  <Text variant="body" fontWeight="bold">{selectedSegment.customerCount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Avg Order Value</Text>
                  <Text variant="body" fontWeight="bold">${selectedSegment.avgOrderValue.toFixed(2)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Conversion Rate</Text>
                  <Text variant="body" fontWeight="bold">{selectedSegment.conversionRate}%</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Growth Rate</Text>
                  <Text 
                    variant="body" 
                    fontWeight="bold"
                    color={selectedSegment.growthRate >= 0 ? theme.colors.status.success : theme.colors.status.error}
                  >
                    {selectedSegment.growthRate >= 0 ? '+' : ''}{selectedSegment.growthRate.toFixed(1)}%
                  </Text>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Segmentation Criteria
                </Text>
                {selectedSegment.criteria.map((criterion, index) => (
                  <View key={index} style={styles.criterionItem}>
                    <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary.green} />
                    <Text variant="body" style={{ marginLeft: theme.spacing.sm }}>
                      {criterion}
                    </Text>
                  </View>
                ))}
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Actions
                </Text>
                <Button
                  variant="primary"
                  size="md"
                  onPress={() => router.push("/marketing/automated-campaigns")}
                  style={styles.actionButton}
                >
                  Launch Marketing Campaign
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onPress={async () => {
                    const html = `<h1>${selectedSegment?.name} - Customer List</h1><p>Customers: ${selectedSegment?.customerCount}</p>`;
                    const { uri } = await Print.printToFileAsync({ html });
                    await Sharing.shareAsync(uri, { dialogTitle: "Export Customer List" });
                  }}
                  style={styles.actionButton}
                >
                  Export Customer List
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => {
                    Alert.alert("Edit Segment", "This would open the segment editor for: " + selectedSegment?.name);
                  }}
                  style={styles.actionButton}
                >
                  Edit Segmentation Criteria
                </Button>
              </Card>
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
          Customer Segments
        </Text>
        <TouchableOpacity onPress={handleCreateSegment} style={styles.addButton}>
          <Ionicons name="add" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Segments Summary */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Segment Summary
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Total Segments
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.green}>
                  {segments.length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Total Customers
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.green}>
                  {segments.reduce((sum, seg) => sum + seg.customerCount, 0)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Active Segments
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.purple}>
                  {segments.filter(s => s.isActive).length}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Segment List */}
        <Card style={styles.segmentsCard}>
          <View style={styles.cardHeader}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Customer Segments
            </Text>
            <TouchableOpacity onPress={() => {
              Alert.alert("Filter Segments", "Show:", [
                { text: "Active", onPress: () => console.log("Filter active") },
                { text: "Inactive", onPress: () => console.log("Filter inactive") },
                { text: "All", onPress: () => console.log("Filter all") },
                { text: "Cancel", style: "cancel" },
              ]);
            }}>
              <Ionicons name="filter" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={segments}
            renderItem={renderSegmentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.segmentsList}
          />
        </Card>

        {/* Selected Segment Analysis */}
        {selectedSegment && (
          <Card style={styles.analysisCard}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              {selectedSegment.name} Analysis
            </Text>
            <View style={styles.analysisContent}>
              <View style={styles.analysisMetric}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Customer Count
                </Text>
                <Text variant="h2" fontWeight="bold">
                  {selectedSegment.customerCount}
                </Text>
              </View>
              <View style={styles.analysisMetric}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Avg. Order Value
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.green}>
                  ${selectedSegment.avgOrderValue.toFixed(2)}
                </Text>
              </View>
              <View style={styles.analysisMetric}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Growth Rate
                </Text>
                <Text 
                  variant="h2" 
                  fontWeight="bold"
                  color={selectedSegment.growthRate >= 0 ? theme.colors.status.success : theme.colors.status.error}
                >
                  {selectedSegment.growthRate >= 0 ? '+' : ''}{selectedSegment.growthRate.toFixed(1)}%
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="primary"
            size="md"
            onPress={handleCreateSegment}
            style={styles.actionButton}
          >
            Create New Segment
          </Button>
          <Button
            variant="outline"
            size="md"
            onPress={async () => {
              try {
                const result = await DocumentPicker.getDocumentAsync({
                  type: "text/csv",
                  copyToCacheDirectory: true,
                });
                if (result.assets && result.assets.length > 0) {
                  Alert.alert("Import Started", `Importing from: ${result.assets[0].name}`);
                }
              } catch (error) {
                console.log("Import cancelled");
              }
            }}
            style={styles.actionButton}
          >
            Import Customer Data
          </Button>
        </View>
      </ScrollView>

      {renderSegmentDetails()}
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
  segmentsCard: {
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
  segmentsList: {
    gap: theme.spacing.md,
  },
  segmentCard: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  selectedSegmentCard: {
    borderColor: theme.colors.primary.green,
    backgroundColor: theme.colors.primary.green + "10",
  },
  segmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  segmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.sm,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  segmentMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  metricItem: {
    alignItems: "center",
  },
  segmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  analysisCard: {
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  analysisContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: theme.spacing.md,
  },
  analysisMetric: {
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  segmentDetailModal: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    width: "90%",
    maxHeight: "80%",
    padding: theme.spacing.lg,
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
  segmentDetailContent: {
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
  criterionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
});

export default CustomerSegmentationSystem;