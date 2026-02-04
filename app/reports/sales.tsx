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
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types for sales report data
interface SalesReport {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  topProducts: string[];
  revenueByCategory: { category: string; revenue: number }[];
  salesByChannel: { channel: string; sales: number }[];
}

interface ReportFilter {
  dateRange: "today" | "yesterday" | "last7" | "last30" | "month" | "quarter" | "year";
  channel: string;
  category: string;
  product: string;
}

const SalesReportingSystem: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<SalesReport | null>(null);
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: "last30",
    channel: "all",
    category: "all",
    product: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockReports: SalesReport[] = [
        {
          id: "1",
          period: "Jan 1 - Jan 31, 2024",
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          totalSales: 42560,
          totalOrders: 142,
          avgOrderValue: 299,
          conversionRate: 4.2,
          topProducts: ["Basmati Rice 10kg", "Moong Dal 1kg", "Fortune Oil 1L"],
          revenueByCategory: [
            { category: "Grains", revenue: 18500 },
            { category: "Pulses", revenue: 12300 },
            { category: "Edible Oils", revenue: 10440 },
            { category: "Others", revenue: 1320 },
          ],
          salesByChannel: [
            { channel: "App", sales: 32500 },
            { channel: "Web", sales: 8760 },
            { channel: "Phone", sales: 1300 },
          ],
        },
        {
          id: "2",
          period: "Dec 1 - Dec 31, 2023",
          startDate: "2023-12-01",
          endDate: "2023-12-31",
          totalSales: 38240,
          totalOrders: 128,
          avgOrderValue: 298,
          conversionRate: 3.9,
          topProducts: ["Basmati Rice 10kg", "Moong Dal 1kg", "Sugar 5kg"],
          revenueByCategory: [
            { category: "Grains", revenue: 16200 },
            { category: "Pulses", revenue: 11500 },
            { category: "Edible Oils", revenue: 9200 },
            { category: "Others", revenue: 1340 },
          ],
          salesByChannel: [
            { channel: "App", sales: 29500 },
            { channel: "Web", sales: 7440 },
            { channel: "Phone", sales: 1300 },
          ],
        },
        {
          id: "3",
          period: "Nov 1 - Nov 30, 2023",
          startDate: "2023-11-01",
          endDate: "2023-11-30",
          totalSales: 35670,
          totalOrders: 118,
          avgOrderValue: 302,
          conversionRate: 3.7,
          topProducts: ["Basmati Rice 10kg", "Fortune Oil 1L", "Sugar 5kg"],
          revenueByCategory: [
            { category: "Grains", revenue: 14800 },
            { category: "Pulses", revenue: 10800 },
            { category: "Edible Oils", revenue: 8700 },
            { category: "Others", revenue: 1370 },
          ],
          salesByChannel: [
            { channel: "App", sales: 27200 },
            { channel: "Web", sales: 7170 },
            { channel: "Phone", sales: 1300 },
          ],
        },
      ];

      setReports(mockReports);
      setSelectedReport(mockReports[0]); // Set first report as default
      setLoading(false);
    }, 1000);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleApplyFilters = () => {
    // In a real app, this would fetch data based on filters
    setShowFilters(false);
    Alert.alert("Filters Applied", `Date range: ${filters.dateRange}`);
  };

  const handleExportReport = async () => {
    const html = `
      <h1>Sales Report</h1>
      <p>Period: ${selectedReport?.period || "All Time"}</p>
      <table border="1" cellpadding="5">
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Total Sales</td><td>₹${selectedReport?.totalSales.toLocaleString() || "0"}</td></tr>
        <tr><td>Total Orders</td><td>${selectedReport?.totalOrders || "0"}</td></tr>
        <tr><td>Avg Order Value</td><td>₹${selectedReport?.avgOrderValue || "0"}</td></tr>
        <tr><td>Conversion Rate</td><td>${selectedReport?.conversionRate || "0"}%</td></tr>
      </table>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { dialogTitle: "Sales Report" });
  };

  const renderReportCard = ({ item }: { item: SalesReport }) => (
    <TouchableOpacity
      onPress={() => setSelectedReport(item)}
      style={[
        styles.reportCard,
        selectedReport?.id === item.id && styles.selectedReportCard,
      ]}
    >
      <View style={styles.reportHeader}>
        <Text variant="body" fontWeight="semibold">
          {item.period}
        </Text>
        <Ionicons
          name={selectedReport?.id === item.id ? "checkmark-circle" : "radio-button-off"}
          size={20}
          color={selectedReport?.id === item.id ? colors.primary.green : colors.text.light}
        />
      </View>
      
      <View style={styles.reportMetrics}>
        <View style={styles.metricRow}>
          <Text variant="caption" color={colors.text.light}>
            Sales
          </Text>
          <Text variant="body" fontWeight="bold">
            ₹{item.totalSales.toLocaleString()}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text variant="caption" color={colors.text.light}>
            Orders
          </Text>
          <Text variant="body" fontWeight="bold">
            {item.totalOrders}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text variant="caption" color={colors.text.light}>
            Avg Order
          </Text>
          <Text variant="body" fontWeight="bold">
            ₹{item.avgOrderValue}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRevenueByCategory = () => {
    if (!selectedReport) return null;

    return (
      <Card style={styles.chartCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          Revenue by Category
        </Text>
        {selectedReport.revenueByCategory.map((cat, index) => {
          const percentage = (cat.revenue / selectedReport.totalSales) * 100;
          return (
            <View key={index} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text variant="body" fontWeight="semibold">
                  {cat.category}
                </Text>
                <Text variant="caption" color={colors.text.light}>
                  {percentage.toFixed(1)}%
                </Text>
              </View>
              <Text variant="body" fontWeight="bold">
                ₹{cat.revenue.toLocaleString()}
              </Text>
            </View>
          );
        })}
      </Card>
    );
  };

  const renderSalesByChannel = () => {
    if (!selectedReport) return null;

    return (
      <Card style={styles.chartCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          Sales by Channel
        </Text>
        {selectedReport.salesByChannel.map((channel, index) => {
          const percentage = (channel.sales / selectedReport.totalSales) * 100;
          return (
            <View key={index} style={styles.channelRow}>
              <View style={styles.channelInfo}>
                <Text variant="body" fontWeight="semibold">
                  {channel.channel}
                </Text>
                <Text variant="caption" color={colors.text.light}>
                  {percentage.toFixed(1)}%
                </Text>
              </View>
              <Text variant="body" fontWeight="bold">
                ₹{channel.sales.toLocaleString()}
              </Text>
            </View>
          );
        })}
      </Card>
    );
  };

  const renderTopProducts = () => {
    if (!selectedReport) return null;

    return (
      <Card style={styles.chartCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          Top Selling Products
        </Text>
        {selectedReport.topProducts.map((product, index) => (
          <View key={index} style={styles.productRow}>
            <Text variant="body" fontWeight="semibold">
              {index + 1}. {product}
            </Text>
          </View>
        ))}
      </Card>
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
          Sales Reports
        </Text>
        <TouchableOpacity
          onPress={handleExportReport}
          style={styles.exportButton}
        >
          <Ionicons name="download" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={20} color={colors.text.primary} />
            <Text variant="body" style={styles.filterButtonText}>
              {filters.dateRange === "today" && "Today"}
              {filters.dateRange === "yesterday" && "Yesterday"}
              {filters.dateRange === "last7" && "Last 7 Days"}
              {filters.dateRange === "last30" && "Last 30 Days"}
              {filters.dateRange === "month" && "This Month"}
              {filters.dateRange === "quarter" && "This Quarter"}
              {filters.dateRange === "year" && "This Year"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report Cards */}
        <Card style={styles.reportsCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Reports
          </Text>
          <FlatList
            data={reports}
            renderItem={renderReportCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.reportsList}
          />
        </Card>

        {/* Report Details */}
        {selectedReport && (
          <View style={styles.detailsContainer}>
            <Card style={styles.summaryCard}>
              <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                Report Summary
              </Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text variant="caption" color={colors.text.light}>
                    Total Sales
                  </Text>
                  <Text variant="h2" fontWeight="bold" color={colors.primary.green}>
                    ₹{selectedReport.totalSales.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text variant="caption" color={colors.text.light}>
                    Total Orders
                  </Text>
                  <Text variant="h2" fontWeight="bold" color={colors.primary.purple}>
                    {selectedReport.totalOrders}
                  </Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text variant="caption" color={colors.text.light}>
                    Avg Order Value
                  </Text>
                  <Text variant="h2" fontWeight="bold" color={colors.primary.orange}>
                    ₹{selectedReport.avgOrderValue}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text variant="caption" color={colors.text.light}>
                    Conversion Rate
                  </Text>
                  <Text variant="h2" fontWeight="bold" color={colors.primary.darkPurple}>
                    {selectedReport.conversionRate}%
                  </Text>
                </View>
              </View>
            </Card>

            {renderRevenueByCategory()}
            {renderSalesByChannel()}
            {renderTopProducts()}
          </View>
        )}
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filtersModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                Filters
              </Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterOptions}>
              <Text variant="body" fontWeight="semibold" style={styles.filterLabel}>
                Date Range
              </Text>
              <View style={styles.dateRangeOptions}>
                {(["today", "yesterday", "last7", "last30", "month", "quarter", "year"] as const).map(range => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.dateRangeButton,
                      filters.dateRange === range && styles.selectedDateRangeButton,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, dateRange: range }))}
                  >
                    <Text
                      variant="caption"
                      fontWeight="medium"
                      color={filters.dateRange === range ? colors.background.primary : colors.text.primary}
                    >
                      {range === "today" && "Today"}
                      {range === "yesterday" && "Yesterday"}
                      {range === "last7" && "Last 7 Days"}
                      {range === "last30" && "Last 30 Days"}
                      {range === "month" && "This Month"}
                      {range === "quarter" && "This Quarter"}
                      {range === "year" && "This Year"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterOptions}>
              <Text variant="body" fontWeight="semibold" style={styles.filterLabel}>
                Channel
              </Text>
              <View style={styles.optionGroup}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    filters.channel === "all" && styles.selectedOption,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, channel: "all" }))}
                >
                  <Text variant="caption">All Channels</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    filters.channel === "app" && styles.selectedOption,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, channel: "app" }))}
                >
                  <Text variant="caption">App</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    filters.channel === "web" && styles.selectedOption,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, channel: "web" }))}
                >
                  <Text variant="caption">Web</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.filterOptions}>
              <Text variant="body" fontWeight="semibold" style={styles.filterLabel}>
                Category
              </Text>
              <View style={styles.optionGroup}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    filters.category === "all" && styles.selectedOption,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, category: "all" }))}
                >
                  <Text variant="caption">All Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    filters.category === "grains" && styles.selectedOption,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, category: "grains" }))}
                >
                  <Text variant="caption">Grains</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    filters.category === "pulses" && styles.selectedOption,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, category: "pulses" }))}
                >
                  <Text variant="caption">Pulses</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button
                variant="outline"
                size="md"
                onPress={() => setShowFilters(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={handleApplyFilters}
                style={styles.modalButton}
              >
                Apply
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  exportButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  filterButtonText: {
    flex: 1,
  },
  reportsCard: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  reportsList: {
    gap: spacing.md,
  },
  reportCard: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
  },
  selectedReportCard: {
    borderColor: colors.primary.green,
    backgroundColor: colors.primary.green + "10",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  reportMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricRow: {
    alignItems: "center",
  },
  detailsContainer: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: 100, // Space for potential footer
  },
  summaryCard: {
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  summaryItem: {
    alignItems: "center",
  },
  chartCard: {
    padding: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  categoryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginRight: spacing.md,
  },
  channelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  channelInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginRight: spacing.md,
  },
  productRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filtersModal: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: "80%",
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
  filterOptions: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    marginBottom: spacing.md,
  },
  dateRangeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  dateRangeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  selectedDateRangeButton: {
    backgroundColor: colors.primary.green,
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  optionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  selectedOption: {
    backgroundColor: colors.primary.green,
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

export default SalesReportingSystem;