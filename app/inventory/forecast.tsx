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

// Types for inventory forecast data
interface ForecastProduct {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  salesVelocity: number; // units per day
  daysToStockout: number;
  reorderLevel: number;
  suggestedOrder: number;
  category: string;
  supplier: string;
  leadTime: number; // days
  forecastedDemand: number; // next 30 days
  seasonalityFactor: number;
  trend: "increasing" | "decreasing" | "stable";
}

interface ForecastPeriod {
  period: string;
  demand: number;
  confidence: number;
}

const InventoryForecastingTool: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<ForecastProduct[]>([]);
  const [forecastData, setForecastData] = useState<ForecastPeriod[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ForecastProduct | null>(null);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts: ForecastProduct[] = [
        {
          id: "1",
          name: "Basmati Rice 10kg",
          sku: "RICE-BASMATI-10KG",
          currentStock: 45,
          minStock: 10,
          maxStock: 100,
          salesVelocity: 2.5,
          daysToStockout: 18,
          reorderLevel: 25,
          suggestedOrder: 35,
          category: "Grains",
          supplier: "ABC Distributors",
          leadTime: 5,
          forecastedDemand: 75,
          seasonalityFactor: 1.2,
          trend: "increasing",
        },
        {
          id: "2",
          name: "Moong Dal 1kg",
          sku: "DAL-MOONG-1KG",
          currentStock: 32,
          minStock: 8,
          maxStock: 80,
          salesVelocity: 1.8,
          daysToStockout: 18,
          reorderLevel: 20,
          suggestedOrder: 28,
          category: "Pulses",
          supplier: "XYZ Suppliers",
          leadTime: 3,
          forecastedDemand: 55,
          seasonalityFactor: 1.0,
          trend: "stable",
        },
        {
          id: "3",
          name: "Fortune Oil 1L",
          sku: "OIL-FORTUNE-1L",
          currentStock: 15,
          minStock: 5,
          maxStock: 60,
          salesVelocity: 1.2,
          daysToStockout: 13,
          reorderLevel: 15,
          suggestedOrder: 25,
          category: "Edible Oils",
          supplier: "PQR Distributors",
          leadTime: 7,
          forecastedDemand: 35,
          seasonalityFactor: 0.9,
          trend: "decreasing",
        },
        {
          id: "4",
          name: "Sugar 5kg",
          sku: "SUGAR-WHITE-5KG",
          currentStock: 67,
          minStock: 15,
          maxStock: 120,
          salesVelocity: 2.0,
          daysToStockout: 34,
          reorderLevel: 30,
          suggestedOrder: 0,
          category: "Staples",
          supplier: "LMN Suppliers",
          leadTime: 4,
          forecastedDemand: 60,
          seasonalityFactor: 1.1,
          trend: "stable",
        },
        {
          id: "5",
          name: "Salt 1kg",
          sku: "SALT-POND-1KG",
          currentStock: 89,
          minStock: 20,
          maxStock: 150,
          salesVelocity: 1.5,
          daysToStockout: 59,
          reorderLevel: 35,
          suggestedOrder: 0,
          category: "Staples",
          supplier: "DEF Distributors",
          leadTime: 2,
          forecastedDemand: 45,
          seasonalityFactor: 1.0,
          trend: "stable",
        },
      ];

      const mockForecast: ForecastPeriod[] = [
        { period: "Day 1-7", demand: 18, confidence: 85 },
        { period: "Day 8-14", demand: 22, confidence: 80 },
        { period: "Day 15-21", demand: 19, confidence: 75 },
        { period: "Day 22-28", demand: 24, confidence: 70 },
        { period: "Day 29-35", demand: 21, confidence: 65 },
      ];

      setProducts(mockProducts);
      setForecastData(mockForecast);
      setSelectedProduct(mockProducts[0]); // Set first product as default
      setLoading(false);
    }, 1000);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleReorder = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    Alert.alert(
      "Reorder Product",
      `Order ${product.suggestedOrder} units of ${product.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reorder", 
          onPress: () => {
            Alert.alert("Order Placed", `Reorder placed for ${product.suggestedOrder} units of ${product.name}. Supplier: ${product.supplier}`);
          }
        },
      ]
    );
  };

  const handleViewForecast = (productId: string) => {
    setShowProductDetails(true);
  };

  const renderProductItem = ({ item }: { item: ForecastProduct }) => {
    const stockStatus = 
      item.currentStock <= item.minStock ? "critical" :
      item.currentStock <= item.reorderLevel ? "low" : "adequate";
    
    const statusColor = 
      stockStatus === "critical" ? colors.status.error :
      stockStatus === "low" ? colors.status.warning : colors.status.success;

    return (
      <TouchableOpacity
        onPress={() => setSelectedProduct(item)}
        style={[
          styles.productCard,
          selectedProduct?.id === item.id && styles.selectedProductCard,
        ]}
      >
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Text variant="body" fontWeight="semibold">
              {item.name}
            </Text>
            <Text variant="caption" color={colors.text.light}>
              {item.sku} • {item.category}
            </Text>
          </View>
          <View style={styles.stockStatus}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            <Text variant="caption" color={statusColor}>
              {stockStatus === "critical" ? "Critical" : 
               stockStatus === "low" ? "Low Stock" : "Adequate"}
            </Text>
          </View>
        </View>

        <View style={styles.productMetrics}>
          <View style={styles.metricItem}>
            <Text variant="caption" color={colors.text.light}>
              Stock
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.currentStock}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text variant="caption" color={colors.text.light}>
              Velocity
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.salesVelocity}/day
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text variant="caption" color={colors.text.light}>
              Days Left
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.daysToStockout}
            </Text>
          </View>
        </View>

        <View style={styles.forecastRow}>
          <View style={styles.forecastInfo}>
            <Text variant="caption" color={colors.text.light}>
              Forecast (30d)
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.forecastedDemand} units
            </Text>
          </View>
          {item.suggestedOrder > 0 && (
            <Button
              variant="outline"
              size="sm"
              onPress={() => handleReorder(item.id)}
              style={styles.reorderButton}
            >
              Reorder {item.suggestedOrder}
            </Button>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderForecastChart = () => {
    if (!selectedProduct) return null;

    return (
      <Card style={styles.chartCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          Demand Forecast
        </Text>
        <View style={styles.chartContainer}>
          {forecastData.map((period, index) => {
            // Calculate bar height based on max demand
            const maxDemand = Math.max(...forecastData.map(f => f.demand));
            const barHeight = (period.demand / maxDemand) * 100;
            
            return (
              <View key={index} style={styles.forecastBarContainer}>
                <Text variant="caption" style={styles.barLabel}>
                  {period.period.split(" ")[0]}
                </Text>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.forecastBar,
                      { height: barHeight, backgroundColor: colors.primary.green }
                    ]}
                  />
                </View>
                <Text variant="caption" fontWeight="bold">
                  {period.demand}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.confidenceRow}>
          <Text variant="caption" color={colors.text.light}>
            Confidence Level
          </Text>
          <Text variant="caption" fontWeight="bold" color={colors.primary.green}>
            80%
          </Text>
        </View>
      </Card>
    );
  };

  const renderInventoryRecommendations = () => {
    if (!selectedProduct) return null;

    // Filter products that need attention
    const productsNeedingAttention = products.filter(p => 
      p.currentStock <= p.reorderLevel || p.suggestedOrder > 0
    );

    return (
      <Card style={styles.recommendationsCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          Inventory Recommendations
        </Text>
        {productsNeedingAttention.length > 0 ? (
          productsNeedingAttention.map((product) => (
            <View key={product.id} style={styles.recommendationItem}>
              <View style={styles.recommendationContent}>
                <Text variant="body" fontWeight="semibold">
                  {product.name}
                </Text>
                <Text variant="caption" color={colors.text.light}>
                  {product.currentStock} units left
                </Text>
              </View>
              {product.suggestedOrder > 0 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onPress={() => handleReorder(product.id)}
                >
                  Order {product.suggestedOrder}
                </Button>
              ) : (
                <Text variant="caption" color={colors.status.warning}>
                  Monitor closely
                </Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.noRecommendations}>
            <Ionicons name="checkmark-circle" size={24} color={colors.status.success} />
            <Text variant="body" color={colors.text.secondary} style={styles.noRecText}>
              No immediate action required
            </Text>
          </View>
        )}
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
          Inventory Forecast
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const html = `
              <h1>Inventory Forecast Report</h1>
              <table border="1" cellpadding="5">
                <tr><th>Product</th><th>Current Stock</th><th>Reorder Level</th><th>Suggested Order</th></tr>
                ${products.map(p => `<tr><td>${p.name}</td><td>${p.currentStock}</td><td>${p.reorderLevel}</td><td>${p.suggestedOrder}</td></tr>`).join('')}
              </table>
            `;
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri, { dialogTitle: "Inventory Forecast Report" });
          }}
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
        {/* Timeframe Selector */}
        <View style={styles.timeframeContainer}>
          <TouchableOpacity
            style={[
              styles.timeframeButton,
              timeframe === "7d" && styles.activeTimeframeButton,
            ]}
            onPress={() => setTimeframe("7d")}
          >
            <Text
              variant="caption"
              fontWeight="medium"
              color={timeframe === "7d" ? colors.background.primary : colors.text.primary}
            >
              7 Days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeframeButton,
              timeframe === "30d" && styles.activeTimeframeButton,
            ]}
            onPress={() => setTimeframe("30d")}
          >
            <Text
              variant="caption"
              fontWeight="medium"
              color={timeframe === "30d" ? colors.background.primary : colors.text.primary}
            >
              30 Days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeframeButton,
              timeframe === "90d" && styles.activeTimeframeButton,
            ]}
            onPress={() => setTimeframe("90d")}
          >
            <Text
              variant="caption"
              fontWeight="medium"
              color={timeframe === "90d" ? colors.background.primary : colors.text.primary}
            >
              90 Days
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forecast Summary */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Forecast Summary
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={colors.text.light}>
                  Total Items
                </Text>
                <Text variant="h2" fontWeight="bold" color={colors.primary.green}>
                  {products.length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={colors.text.light}>
                  Need Reorder
                </Text>
                <Text variant="h2" fontWeight="bold" color={colors.status.error}>
                  {products.filter(p => p.suggestedOrder > 0).length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={colors.text.light}>
                  Avg. Confidence
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.purple}>
                  80%
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Product List */}
        <Card style={styles.productsCard}>
          <View style={styles.cardHeader}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Products
            </Text>
            <TouchableOpacity onPress={() => {
              Alert.alert("Filter Options", "Choose filter:", [
                { text: "Critical Stock", onPress: () => setProducts(prev => prev.filter(p => p.currentStock <= p.minStock)) },
                { text: "Low Stock", onPress: () => setProducts(prev => prev.filter(p => p.currentStock <= p.reorderLevel)) },
                { text: "All", onPress: () => {
                  // Reset to original mock data
                  setProducts([
                    { id: "1", name: "Basmati Rice 10kg", sku: "RICE-BAS-10", currentStock: 3, minStock: 5, maxStock: 100, salesVelocity: 2.5, daysToStockout: 1, reorderLevel: 10, suggestedOrder: 50, category: "Grains", supplier: "Rice Suppliers Inc.", leadTime: 3, forecastedDemand: 75, seasonalityFactor: 1.2, trend: "stable" },
                    { id: "2", name: "Moong Dal 1kg", sku: "DAL-MOO-01", currentStock: 15, minStock: 5, maxStock: 50, salesVelocity: 1.8, daysToStockout: 8, reorderLevel: 10, suggestedOrder: 0, category: "Pulses", supplier: "Pulse Traders", leadTime: 2, forecastedDemand: 54, seasonalityFactor: 1.0, trend: "increasing" },
                    { id: "3", name: "Fortune Oil 1L", sku: "OIL-FOR-01", currentStock: 0, minStock: 10, maxStock: 80, salesVelocity: 3.2, daysToStockout: 0, reorderLevel: 20, suggestedOrder: 40, category: "Oils", supplier: "Oil Corp", leadTime: 4, forecastedDemand: 96, seasonalityFactor: 1.1, trend: "stable" },
                  ]);
                }},
                { text: "Cancel", style: "cancel" },
              ]);
            }}>
              <Ionicons name="filter" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </Card>

        {/* Forecast Chart and Recommendations */}
        {selectedProduct && (
          <View style={styles.detailsContainer}>
            {renderForecastChart()}
            {renderInventoryRecommendations()}
          </View>
        )}
      </ScrollView>

      {/* Product Detail Modal */}
      <Modal
        visible={showProductDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProductDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.productDetailModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                Product Details
              </Text>
              <TouchableOpacity onPress={() => setShowProductDetails(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            {selectedProduct && (
              <View style={styles.productDetailContent}>
                <Card style={styles.detailCard}>
                  <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                    {selectedProduct.name}
                  </Text>
                  
                  <View style={styles.detailRow}>
                    <Text variant="body">SKU</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.sku}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Category</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.category}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Supplier</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.supplier}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Lead Time</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.leadTime} days</Text>
                  </View>
                </Card>
                
                <Card style={styles.detailCard}>
                  <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                    Inventory Levels
                  </Text>
                  <View style={styles.detailRow}>
                    <Text variant="body">Current Stock</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.currentStock}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Min Stock</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.minStock}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Max Stock</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.maxStock}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Reorder Level</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.reorderLevel}</Text>
                  </View>
                </Card>
                
                <Card style={styles.detailCard}>
                  <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                    Forecast Metrics
                  </Text>
                  <View style={styles.detailRow}>
                    <Text variant="body">Sales Velocity</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.salesVelocity}/day</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Days to Stockout</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.daysToStockout}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Forecasted Demand</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.forecastedDemand} units</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="body">Suggested Order</Text>
                    <Text variant="body" fontWeight="bold">{selectedProduct.suggestedOrder}</Text>
                  </View>
                </Card>
                
                <View style={styles.modalActions}>
                  <Button
                    variant="outline"
                    size="md"
                    onPress={() => setShowProductDetails(false)}
                    style={styles.modalButton}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onPress={() => {
                      handleReorder(selectedProduct.id);
                      setShowProductDetails(false);
                    }}
                    style={styles.modalButton}
                    disabled={selectedProduct.suggestedOrder === 0}
                  >
                    Reorder Now
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
  timeframeContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  timeframeButton: {
    flex: 1,
    padding: spacing.md,
    alignItems: "center",
  },
  activeTimeframeButton: {
    backgroundColor: colors.primary.green,
  },
  summaryContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  summaryItem: {
    alignItems: "center",
  },
  productsCard: {
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
  productsList: {
    gap: spacing.md,
  },
  productCard: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
  },
  selectedProductCard: {
    borderColor: colors.primary.green,
    backgroundColor: colors.primary.green + "10",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  stockStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.sm,
  },
  productMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  metricItem: {
    alignItems: "center",
  },
  forecastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forecastInfo: {
    flex: 1,
  },
  reorderButton: {
    alignSelf: "flex-start",
  },
  chartCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 120,
    marginBottom: spacing.md,
  },
  forecastBarContainer: {
    alignItems: "center",
    flex: 1,
  },
  barBackground: {
    width: 20,
    height: 100,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  forecastBar: {
    width: "100%",
    borderRadius: borderRadius.sm,
  },
  barLabel: {
    marginBottom: spacing.xs,
  },
  confidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationsCard: {
    padding: spacing.md,
  },
  recommendationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  recommendationContent: {
    flex: 1,
  },
  noRecommendations: {
    alignItems: "center",
    padding: spacing.lg,
  },
  noRecText: {
    marginTop: spacing.sm,
  },
  detailsContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: 100, // Space for potential footer
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  productDetailModal: {
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
  productDetailContent: {
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

export default InventoryForecastingTool;