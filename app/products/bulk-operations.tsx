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
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive" | "draft";
  image: string;
}

interface BulkOperation {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
}

const BulkProductOperations: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Basmati Rice 10kg",
        sku: "RICE-BASMATI-10KG",
        price: 400,
        stock: 50,
        category: "Groceries",
        status: "active",
        image: "https://placehold.co/100x100/4CAF50/white?text=Rice",
      },
      {
        id: "2",
        name: "Moong Dal 1kg",
        sku: "DAL-MOONG-1KG",
        price: 80,
        stock: 30,
        category: "Groceries",
        status: "active",
        image: "https://placehold.co/100x100/FF9800/white?text=Dal",
      },
      {
        id: "3",
        name: "Fortune Oil 1L",
        sku: "OIL-FORTUNE-1L",
        price: 120,
        stock: 0,
        category: "Groceries",
        status: "inactive",
        image: "https://placehold.co/100x100/2196F3/white?text=Oil",
      },
      {
        id: "4",
        name: "Sugar 5kg",
        sku: "SUGAR-WHITE-5KG",
        price: 200,
        stock: 25,
        category: "Groceries",
        status: "active",
        image: "https://placehold.co/100x100/9C27B0/white?text=Sugar",
      },
      {
        id: "5",
        name: "Salt 1kg",
        sku: "SALT-POND-1KG",
        price: 15,
        stock: 100,
        category: "Groceries",
        status: "draft",
        image: "https://placehold.co/100x100/607D8B/white?text=Salt",
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) {
      Alert.alert("No Selection", "Please select at least one product to perform bulk operations.");
      return;
    }

    switch (action) {
      case "status":
        setShowStatusModal(true);
        break;
      case "price":
        setShowPriceModal(true);
        break;
      case "stock":
        setShowStockModal(true);
        break;
      case "delete":
        handleBulkDelete();
        break;
      case "activate":
        handleBulkActivate();
        break;
      case "deactivate":
        handleBulkDeactivate();
        break;
      default:
        break;
    }
  };

  const handleBulkDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedProducts = products.filter(
              product => !selectedProducts.includes(product.id)
            );
            setProducts(updatedProducts);
            setSelectedProducts([]);
            Alert.alert("Success", "Selected products have been deleted.");
          },
        },
      ]
    );
  };

  const handleBulkActivate = () => {
    const updatedProducts = products.map(product => 
      selectedProducts.includes(product.id) 
        ? { ...product, status: "active" as const } 
        : product
    );
    setProducts(updatedProducts);
    setSelectedProducts([]);
    Alert.alert("Success", "Selected products have been activated.");
  };

  const handleBulkDeactivate = () => {
    const updatedProducts = products.map(product => 
      selectedProducts.includes(product.id) 
        ? { ...product, status: "inactive" as const } 
        : product
    );
    setProducts(updatedProducts);
    setSelectedProducts([]);
    Alert.alert("Success", "Selected products have been deactivated.");
  };

  const handleApplyStatusChange = (newStatus: "active" | "inactive" | "draft") => {
    const updatedProducts = products.map(product => 
      selectedProducts.includes(product.id) 
        ? { ...product, status: newStatus } 
        : product
    );
    setProducts(updatedProducts);
    setSelectedProducts([]);
    setShowStatusModal(false);
    Alert.alert("Success", "Product status has been updated.");
  };

  const handleApplyPriceChange = (operation: "increase" | "decrease" | "set", value: number) => {
    const updatedProducts = products.map(product => {
      if (selectedProducts.includes(product.id)) {
        let newPrice = product.price;
        if (operation === "increase") {
          newPrice = product.price + value;
        } else if (operation === "decrease") {
          newPrice = Math.max(0, product.price - value);
        } else if (operation === "set") {
          newPrice = value;
        }
        return { ...product, price: newPrice };
      }
      return product;
    });
    setProducts(updatedProducts);
    setSelectedProducts([]);
    setShowPriceModal(false);
    Alert.alert("Success", "Product prices have been updated.");
  };

  const handleApplyStockChange = (operation: "add" | "subtract" | "set", value: number) => {
    const updatedProducts = products.map(product => {
      if (selectedProducts.includes(product.id)) {
        let newStock = product.stock;
        if (operation === "add") {
          newStock = product.stock + value;
        } else if (operation === "subtract") {
          newStock = Math.max(0, product.stock - value);
        } else if (operation === "set") {
          newStock = value;
        }
        return { ...product, stock: newStock };
      }
      return product;
    });
    setProducts(updatedProducts);
    setSelectedProducts([]);
    setShowStockModal(false);
    Alert.alert("Success", "Product stock levels have been updated.");
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <Card style={styles.productCard}>
      <TouchableOpacity
        onPress={() => toggleProductSelection(item.id)}
        style={styles.productRow}
        accessibilityLabel={`Product ${item.name}`}
        accessibilityState={{ selected: selectedProducts.includes(item.id) }}
      >
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => toggleProductSelection(item.id)}
            style={[
              styles.checkbox,
              selectedProducts.includes(item.id) && styles.checkboxSelected,
            ]}
            accessibilityLabel={`Select ${item.name}`}
          >
            {selectedProducts.includes(item.id) && (
              <Ionicons name="checkmark" size={16} color={theme.colors.background.primary} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.productImageContainer}>
          <Ionicons name="image" size={24} color={theme.colors.text.light} />
        </View>

        <View style={styles.productInfo}>
          <Text variant="body" fontWeight="semibold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.sku}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.category}
          </Text>
        </View>

        <View style={styles.productStats}>
          <Text variant="body" fontWeight="bold">
            ₹{item.price.toFixed(2)}
          </Text>
          <Text
            variant="caption"
            color={
              item.stock > 10
                ? theme.colors.status.success
                : item.stock > 0
                ? theme.colors.status.warning
                : theme.colors.status.error
            }
          >
            {item.stock} in stock
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "active"
                    ? theme.colors.status.success + "20"
                    : item.status === "inactive"
                    ? theme.colors.status.error + "20"
                    : theme.colors.status.warning + "20",
              },
            ]}
          >
            <Text
              variant="caption"
              color={
                item.status === "active"
                  ? theme.colors.status.success
                  : item.status === "inactive"
                  ? theme.colors.status.error
                  : theme.colors.status.warning
              }
            >
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const bulkActions: BulkOperation[] = [
    {
      id: "status",
      title: "Change Status",
      description: "Update product status",
      icon: "toggle",
      action: () => handleBulkAction("status"),
    },
    {
      id: "price",
      title: "Update Prices",
      description: "Adjust product prices",
      icon: "cash",
      action: () => handleBulkAction("price"),
    },
    {
      id: "stock",
      title: "Update Stock",
      description: "Adjust inventory levels",
      icon: "cube",
      action: () => handleBulkAction("stock"),
    },
    {
      id: "activate",
      title: "Activate",
      description: "Enable selected products",
      icon: "play",
      action: () => handleBulkAction("activate"),
    },
    {
      id: "deactivate",
      title: "Deactivate",
      description: "Disable selected products",
      icon: "pause",
      action: () => handleBulkAction("deactivate"),
    },
    {
      id: "delete",
      title: "Delete",
      description: "Remove products permanently",
      icon: "trash",
      action: () => handleBulkAction("delete"),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Bulk Operations
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={selectAllProducts}
            style={styles.selectAllButton}
            accessibilityLabel="Select all products"
          >
            <Ionicons
              name={selectedProducts.length === products.length ? "checkbox" : "square-outline"}
              size={24}
              color={theme.colors.primary.green}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Selection Info */}
      {selectedProducts.length > 0 && (
        <View style={styles.selectionInfo}>
          <Text variant="body" fontWeight="semibold">
            {selectedProducts.length} selected
          </Text>
          <TouchableOpacity
            onPress={() => setShowBulkActions(true)}
            style={styles.bulkActionsButton}
          >
            <Ionicons name="settings" size={20} color={theme.colors.text.primary} />
            <Text variant="body" style={styles.bulkActionsText}>
              Actions
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Products List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={48} color={theme.colors.primary.green} />
            <Text variant="h3" style={styles.loadingText}>
              Loading products...
            </Text>
          </View>
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cube" size={48} color={theme.colors.text.light} />
            <Text variant="h3" fontWeight="bold" style={styles.emptyTitle}>
              No Products Found
            </Text>
            <Text variant="body" color={theme.colors.text.secondary} style={styles.emptyText}>
              You don&apos;t have any products to manage.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bulk Actions Modal */}
      <Modal
        visible={showBulkActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBulkActions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionsModal}>
            <View style={styles.modalHeader}>
              <Text variant="h3" fontWeight="bold">
                Bulk Actions
              </Text>
              <TouchableOpacity onPress={() => setShowBulkActions(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={bulkActions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => {
                    item.action();
                    setShowBulkActions(false);
                  }}
                >
                  <View style={styles.actionIconContainer}>
                    <Ionicons name={item.icon} size={24} color={theme.colors.primary.green} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text variant="body" fontWeight="semibold">
                      {item.title}
                    </Text>
                    <Text variant="caption" color={theme.colors.text.light}>
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionModal}>
            <Text variant="h3" fontWeight="bold" style={styles.modalTitle}>
              Change Status
            </Text>
            <Text variant="body" color={theme.colors.text.secondary} style={styles.modalSubtitle}>
              Select new status for {selectedProducts.length} products
            </Text>

            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleApplyStatusChange("active")}
              >
                <View style={[styles.optionCircle, { backgroundColor: theme.colors.status.success + "20" }]}>
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.status.success} />
                </View>
                <Text variant="body">Active</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleApplyStatusChange("inactive")}
              >
                <View style={[styles.optionCircle, { backgroundColor: theme.colors.status.error + "20" }]}>
                  <Ionicons name="close-circle" size={24} color={theme.colors.status.error} />
                </View>
                <Text variant="body">Inactive</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleApplyStatusChange("draft")}
              >
                <View style={[styles.optionCircle, { backgroundColor: theme.colors.status.warning + "20" }]}>
                  <Ionicons name="document" size={24} color={theme.colors.status.warning} />
                </View>
                <Text variant="body">Draft</Text>
              </TouchableOpacity>
            </View>

            <Button
              variant="outline"
              size="md"
              onPress={() => setShowStatusModal(false)}
              style={styles.modalCancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      {/* Price Change Modal */}
      <Modal
        visible={showPriceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPriceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionModal}>
            <Text variant="h3" fontWeight="bold" style={styles.modalTitle}>
              Update Prices
            </Text>
            <Text variant="body" color={theme.colors.text.secondary} style={styles.modalSubtitle}>
              Select how to update prices for {selectedProducts.length} products
            </Text>

            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleApplyPriceChange("increase", 10)}
              >
                <View style={[styles.optionCircle, { backgroundColor: theme.colors.primary.green + "20" }]}>
                  <Ionicons name="add" size={24} color={theme.colors.primary.green} />
                </View>
                <Text variant="body">Increase by ₹10</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleApplyPriceChange("decrease", 10)}
              >
                <View style={[styles.optionCircle, { backgroundColor: theme.colors.status.error + "20" }]}>
                  <Ionicons name="remove" size={24} color={theme.colors.status.error} />
                </View>
                <Text variant="body">Decrease by ₹10</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  Alert.prompt(
                    "Set Specific Price",
                    "Enter the new price for selected products:",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Apply", 
                        onPress: (value?: string) => {
                          const newPrice = parseFloat(value || "0");
                          if (newPrice > 0) {
                            handleApplyPriceChange("set", newPrice);
                          }
                        }
                      },
                    ],
                    "plain-text",
                    ""
                  );
                }}
              >
                <View style={[styles.optionCircle, { backgroundColor: theme.colors.primary.purple + "20" }]}>
                  <Ionicons name="pricetag" size={24} color={theme.colors.primary.purple} />
                </View>
                <Text variant="body">Set Specific Price</Text>
              </TouchableOpacity>
            </View>

            <Button
              variant="outline"
              size="md"
              onPress={() => setShowPriceModal(false)}
              style={styles.modalCancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      {/* Stock Change Modal */}
      <Modal
        visible={showStockModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStockModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionModal}>
            <Text variant="h3" fontWeight="bold" style={styles.modalTitle}>
              Update Stock
            </Text>
            <Text variant="body" color={theme.colors.text.secondary} style={styles.modalSubtitle}>
              Select how to update stock for {selectedProducts.length} products
            </Text>

            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleApplyStockChange("add", 10)}
              >
                <View style={[styles.optionCircle, { backgroundColor: theme.colors.primary.green + "20" }]}>
                  <Ionicons name="add" size={24} color={theme.colors.primary.green} />
                </View>
                <Text variant="body">Add 10 units</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleApplyStockChange("subtract", 5)}
              >
                <View style={[styles.optionCircle, { backgroundColor: theme.colors.status.error + "20" }]}>
                  <Ionicons name="remove" size={24} color={theme.colors.status.error} />
                </View>
                <Text variant="body">Subtract 5 units</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  Alert.prompt(
                    "Set Specific Quantity",
                    "Enter the new stock quantity for selected products:",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Apply", 
                        onPress: (value?: string) => {
                          const newQty = parseInt(value || "0", 10);
                          if (newQty >= 0) {
                            handleApplyStockChange("set", newQty);
                          }
                        }
                      },
                    ],
                    "plain-text",
                    ""
                  );
                }}
              >
                <View style={[styles.optionCircle, { backgroundColor: theme.colors.primary.purple + "20" }]}>
                  <Ionicons name="cube" size={24} color={theme.colors.primary.purple} />
                </View>
                <Text variant="body">Set Specific Quantity</Text>
              </TouchableOpacity>
            </View>

            <Button
              variant="outline"
              size="md"
              onPress={() => setShowStockModal(false)}
              style={styles.modalCancelButton}
            >
              Cancel
            </Button>
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
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  selectAllButton: {
    padding: theme.spacing.sm,
  },
  selectionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
  },
  bulkActionsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  bulkActionsText: {
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.xl + 18,
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
  productCard: {
    marginBottom: theme.spacing.sm,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  checkboxContainer: {
    marginRight: theme.spacing.md,
  },
  checkbox: {
    width: theme.spacing.md + 8,
    height: theme.spacing.md + 8,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary.green,
    borderColor: theme.colors.primary.green,
  },
  productImageContainer: {
    width: theme.spacing.xxl + 2,
    height: theme.spacing.xxl + 2,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  productInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  productStats: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.xxl + 4,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.text.light,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionsModal: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  actionIconContainer: {
    width: theme.spacing.xl + 8,
    height: theme.spacing.xl + 8,
    borderRadius: theme.borderRadius.lg - 4,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  optionModal: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  modalSubtitle: {
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: theme.spacing.xl,
  },
  optionItem: {
    alignItems: "center",
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  optionCircle: {
    width: theme.spacing.xxl + 12,
    height: theme.spacing.xxl + 12,
    borderRadius: theme.borderRadius.xl + 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  modalCancelButton: {
    marginTop: theme.spacing.sm,
  },
});

export default BulkProductOperations;