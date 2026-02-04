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

// Types for pricing rules and products
interface PricingRule {
  id: string;
  name: string;
  description: string;
  condition: string; // e.g., "category = groceries", "demand > 80%"
  adjustmentType: "percentage" | "fixed";
  adjustmentValue: number; // positive for increase, negative for decrease
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  currentPrice: number;
  demandLevel: number; // 0-100%
  inventoryLevel: number; // 0-100%
  competitorPrice: number;
  lastUpdated: string;
}

const DynamicPricingTool: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: "prod-1",
          name: "Basmati Rice 10kg",
          category: "Grains",
          basePrice: 18.99,
          currentPrice: 19.99,
          demandLevel: 85,
          inventoryLevel: 30,
          competitorPrice: 19.50,
          lastUpdated: "2023-10-15T10:30:00Z",
        },
        {
          id: "prod-2",
          name: "Moong Dal 1kg",
          category: "Pulses",
          basePrice: 8.49,
          currentPrice: 8.29,
          demandLevel: 65,
          inventoryLevel: 70,
          competitorPrice: 8.75,
          lastUpdated: "2023-10-15T09:15:00Z",
        },
        {
          id: "prod-3",
          name: "Fortune Oil 1L",
          category: "Edible Oils",
          basePrice: 15.99,
          currentPrice: 15.99,
          demandLevel: 45,
          inventoryLevel: 85,
          competitorPrice: 16.25,
          lastUpdated: "2023-10-15T08:45:00Z",
        },
        {
          id: "prod-4",
          name: "Sugar 5kg",
          category: "Staples",
          basePrice: 12.99,
          currentPrice: 13.49,
          demandLevel: 75,
          inventoryLevel: 45,
          competitorPrice: 13.25,
          lastUpdated: "2023-10-15T11:20:00Z",
        },
        {
          id: "prod-5",
          name: "Salt 1kg",
          category: "Staples",
          basePrice: 3.99,
          currentPrice: 3.99,
          demandLevel: 30,
          inventoryLevel: 90,
          competitorPrice: 4.25,
          lastUpdated: "2023-10-15T07:30:00Z",
        },
      ];

      const mockRules: PricingRule[] = [
        {
          id: "rule-1",
          name: "High Demand Surcharge",
          description: "Increase prices by 5% when demand > 80%",
          condition: "demand > 80",
          adjustmentType: "percentage",
          adjustmentValue: 5,
          startDate: "2023-01-01",
          endDate: "2024-12-31",
          isActive: true,
        },
        {
          id: "rule-2",
          name: "Low Inventory Discount",
          description: "Decrease prices by 10% when inventory > 80%",
          condition: "inventory > 80",
          adjustmentType: "percentage",
          adjustmentValue: -10,
          startDate: "2023-01-01",
          endDate: "2024-12-31",
          isActive: true,
        },
        {
          id: "rule-3",
          name: "Competitor Matching",
          description: "Match competitor prices within 2%",
          condition: "competitor_price < current_price * 0.98",
          adjustmentType: "percentage",
          adjustmentValue: -2,
          startDate: "2023-01-01",
          endDate: "2024-12-31",
          isActive: true,
        },
      ];

      setProducts(mockProducts);
      setPricingRules(mockRules);
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

  const handleApplyPricing = (productId: string) => {
    Alert.alert(
      "Apply Dynamic Pricing",
      "Apply recommended pricing changes to this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Apply", onPress: () => console.log(`Applying pricing to ${productId}`) },
      ]
    );
  };

  const handleCreateRule = () => {
    Alert.alert(
      "Create Pricing Rule",
      "Create a new dynamic pricing rule would be implemented here",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => console.log("Creating pricing rule") },
      ]
    );
  };

  const handleViewPricingAnalysis = (productId: string) => {
    setSelectedProduct(products.find(p => p.id === productId) || null);
    setShowPricingModal(true);
  };

  const calculatePriceRecommendation = (product: Product): number => {
    let recommendedPrice = product.basePrice;
    
    // Apply demand-based pricing
    if (product.demandLevel > 80) {
      recommendedPrice *= 1.05; // 5% increase for high demand
    } else if (product.demandLevel < 30) {
      recommendedPrice *= 0.95; // 5% decrease for low demand
    }
    
    // Apply inventory-based pricing
    if (product.inventoryLevel > 80) {
      recommendedPrice *= 0.98; // 2% discount for high inventory
    } else if (product.inventoryLevel < 20) {
      recommendedPrice *= 1.03; // 3% increase for low inventory
    }
    
    // Apply competitive pricing
    if (product.competitorPrice < recommendedPrice * 0.98) {
      recommendedPrice = product.competitorPrice * 1.02; // Match competitor + 2%
    }
    
    return parseFloat(recommendedPrice.toFixed(2));
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const priceRecommendation = calculatePriceRecommendation(item);
    const priceDifference = priceRecommendation - item.currentPrice;
    const priceChangePercent = ((priceDifference) / item.currentPrice) * 100;
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedProduct(item)}
        style={[
          styles.productCard,
          selectedProduct?.id === item.id && styles.selectedProductCard,
        ]}
      >
        <View style={styles.productHeader}>
          <View>
            <Text variant="body" fontWeight="semibold">
              {item.name}
            </Text>
            <Text variant="caption" color={theme.colors.text.light}>
              {item.category}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text variant="body" fontWeight="bold" color={theme.colors.text.primary}>
              ${item.currentPrice.toFixed(2)}
            </Text>
            <Text variant="caption" color={theme.colors.text.light}>
              Base: ${item.basePrice.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Demand
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.demandLevel}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Inventory
            </Text>
            <Text variant="body" fontWeight="bold">
              {item.inventoryLevel}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text variant="caption" color={theme.colors.text.light}>
              Competitor
            </Text>
            <Text variant="body" fontWeight="bold">
              ${item.competitorPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.recommendationContainer}>
          <View>
            <Text variant="caption" color={theme.colors.text.light}>
              Recommended: ${priceRecommendation.toFixed(2)}
            </Text>
            <Text 
              variant="body" 
              fontWeight="bold"
              color={priceChangePercent > 0 ? theme.colors.status.error : theme.colors.status.success}
            >
              {priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </Text>
          </View>
          <Button
            variant="outline"
            size="sm"
            onPress={() => handleViewPricingAnalysis(item.id)}
          >
            Analyze
          </Button>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPricingModal = () => {
    if (!selectedProduct) return null;

    const priceRecommendation = calculatePriceRecommendation(selectedProduct);
    const priceDifference = priceRecommendation - selectedProduct.currentPrice;
    const priceChangePercent = ((priceDifference) / selectedProduct.currentPrice) * 100;

    return (
      <Modal
        visible={showPricingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPricingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pricingModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                Pricing Analysis
              </Text>
              <TouchableOpacity onPress={() => setShowPricingModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.pricingModalContent}>
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Product Info
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Name</Text>
                  <Text variant="body" fontWeight="bold">{selectedProduct.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Category</Text>
                  <Text variant="body" fontWeight="bold">{selectedProduct.category}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Base Price</Text>
                  <Text variant="body" fontWeight="bold">${selectedProduct.basePrice.toFixed(2)}</Text>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Market Conditions
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Demand Level</Text>
                  <Text variant="body" fontWeight="bold">{selectedProduct.demandLevel}%</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Inventory Level</Text>
                  <Text variant="body" fontWeight="bold">{selectedProduct.inventoryLevel}%</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Competitor Price</Text>
                  <Text variant="body" fontWeight="bold">${selectedProduct.competitorPrice.toFixed(2)}</Text>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Price Recommendation
                </Text>
                <View style={styles.detailRow}>
                  <Text variant="body">Current Price</Text>
                  <Text variant="body" fontWeight="bold">${selectedProduct.currentPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Recommended</Text>
                  <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                    ${priceRecommendation.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="body">Savings/Difference</Text>
                  <Text 
                    variant="body" 
                    fontWeight="bold"
                    color={priceChangePercent > 0 ? theme.colors.status.error : theme.colors.status.success}
                  >
                    {priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                  </Text>
                </View>
              </Card>
              
              <Card style={styles.detailCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Applied Rules
                </Text>
                {selectedProduct.demandLevel > 80 && (
                  <View style={styles.ruleItem}>
                    <Ionicons name="trending-up" size={16} color={theme.colors.status.error} />
                    <Text variant="body" style={{ marginLeft: theme.spacing.sm }}>
                      High demand (+5%)
                    </Text>
                  </View>
                )}
                {selectedProduct.inventoryLevel > 80 && (
                  <View style={styles.ruleItem}>
                    <Ionicons name="trending-down" size={16} color={theme.colors.status.success} />
                    <Text variant="body" style={{ marginLeft: theme.spacing.sm }}>
                      High inventory (-2%)
                    </Text>
                  </View>
                )}
                {selectedProduct.competitorPrice < selectedProduct.currentPrice * 0.98 && (
                  <View style={styles.ruleItem}>
                    <Ionicons name="pricetag" size={16} color={theme.colors.primary.orange} />
                    <Text variant="body" style={{ marginLeft: theme.spacing.sm }}>
                      Competitor match (-2%)
                    </Text>
                  </View>
                )}
                {(selectedProduct.demandLevel <= 80 && selectedProduct.inventoryLevel <= 80 && 
                  selectedProduct.competitorPrice >= selectedProduct.currentPrice * 0.98) && (
                  <Text variant="body" color={theme.colors.text.secondary} style={styles.noRulesText}>
                    No dynamic rules applied
                  </Text>
                )}
              </Card>
              
              <View style={styles.modalActions}>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setShowPricingModal(false)}
                  style={styles.modalButton}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onPress={() => {
                    Alert.alert("Apply Pricing", "Apply the recommended price to this product?");
                    setShowPricingModal(false);
                  }}
                  style={styles.modalButton}
                >
                  Apply Price
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
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Dynamic Pricing
        </Text>
        <TouchableOpacity onPress={handleCreateRule} style={styles.addButton}>
          <Ionicons name="add" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Pricing Summary */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Pricing Summary
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Active Rules
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.green}>
                  {pricingRules.filter(r => r.isActive).length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Products Priced
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.green}>
                  {products.length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="caption" color={theme.colors.text.light}>
                  Avg. Change
                </Text>
                <Text variant="h2" fontWeight="bold" color={theme.colors.primary.purple}>
                  +2.4%
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Pricing Rules */}
        <Card style={styles.rulesCard}>
          <View style={styles.cardHeader}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Pricing Rules
            </Text>
            <TouchableOpacity onPress={handleCreateRule}>
              <Ionicons name="settings" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.rulesList}>
            {pricingRules.slice(0, 3).map((rule) => (
              <View key={rule.id} style={styles.ruleItem}>
                <View style={styles.ruleIconContainer}>
                  <Ionicons 
                    name={rule.adjustmentValue > 0 ? "trending-up" : "trending-down"} 
                    size={16} 
                    color={rule.adjustmentValue > 0 ? theme.colors.status.error : theme.colors.status.success} 
                  />
                </View>
                <View style={styles.ruleInfo}>
                  <Text variant="body" fontWeight="semibold">{rule.name}</Text>
                  <Text variant="caption" color={theme.colors.text.light}>{rule.description}</Text>
                </View>
                <View style={styles.ruleValue}>
                  <Text 
                    variant="body" 
                    fontWeight="bold"
                    color={rule.adjustmentValue > 0 ? theme.colors.status.error : theme.colors.status.success}
                  >
                    {rule.adjustmentValue > 0 ? '+' : ''}{rule.adjustmentValue}
                    {rule.adjustmentType === 'percentage' ? '%' : '$'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Product List */}
        <Card style={styles.productsCard}>
          <View style={styles.cardHeader}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Products
            </Text>
            <TouchableOpacity onPress={() => {
              Alert.alert("Filter Products", "Show:", [
                { text: "With Rules", onPress: () => console.log("Filter with rules") },
                { text: "Without Rules", onPress: () => console.log("Filter without rules") },
                { text: "All", onPress: () => console.log("Filter all") },
                { text: "Cancel", style: "cancel" },
              ]);
            }}>
              <Ionicons name="filter" size={20} color={theme.colors.text.primary} />
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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="primary"
            size="md"
            onPress={handleCreateRule}
            style={styles.actionButton}
          >
            Create Pricing Rule
          </Button>
          <Button
            variant="outline"
            size="md"
            onPress={() => {
              Alert.alert(
                "Optimize All Prices",
                "This will apply pricing rules to all products. Continue?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Optimize", 
                    onPress: () => Alert.alert("Success", "Pricing optimization applied to all products!")
                  },
                ]
              );
            }}
            style={styles.actionButton}
          >
            Optimize All Prices
          </Button>
        </View>
      </ScrollView>

      {renderPricingModal()}
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
  rulesCard: {
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
  rulesList: {
    gap: theme.spacing.md,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
  },
  ruleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  ruleInfo: {
    flex: 1,
  },
  ruleValue: {
    minWidth: 50,
    alignItems: "flex-end",
  },
  productsCard: {
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  productsList: {
    gap: theme.spacing.md,
  },
  productCard: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  selectedProductCard: {
    borderColor: theme.colors.primary.green,
    backgroundColor: theme.colors.primary.green + "10",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  metricItem: {
    alignItems: "center",
  },
  recommendationContainer: {
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
  pricingModal: {
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
  pricingModalContent: {
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
  noRulesText: {
    padding: theme.spacing.md,
    textAlign: "center",
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

export default DynamicPricingTool;