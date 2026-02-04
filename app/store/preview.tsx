import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import * as Sharing from "expo-sharing";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface StoreProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isFeatured: boolean;
  isOnSale: boolean;
}

interface StorePreviewData {
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  bannerImage: string;
  logo: string;
  categories: string[];
  products: StoreProduct[];
  workingHours: {
    day: string;
    hours: string;
    isOpen: boolean;
  }[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

const StorePreviewScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [storeData, setStoreData] = useState<StorePreviewData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "about" | "reviews">("products");

  // Mock data for demonstration
  useEffect(() => {
    const mockStoreData: StorePreviewData = {
      name: "Fresh Groceries Store",
      description: "Your one-stop shop for fresh groceries and daily essentials. We offer the best quality products at affordable prices with fast delivery.",
      rating: 4.5,
      reviewCount: 128,
      bannerImage: "https://placehold.co/400x200/4CAF50/white?text=Fresh+Groceries+Store",
      logo: "https://placehold.co/100x100/4CAF50/white?text=FG",
      categories: ["Fruits & Vegetables", "Dairy", "Grains", "Snacks", "Beverages"],
      products: [
        {
          id: "1",
          name: "Basmati Rice 10kg",
          price: 400,
          originalPrice: 450,
          rating: 4.8,
          reviewCount: 42,
          image: "https://placehold.co/200x200/4CAF50/white?text=Rice",
          isFeatured: true,
          isOnSale: true,
        },
        {
          id: "2",
          name: "Moong Dal 1kg",
          price: 80,
          rating: 4.6,
          reviewCount: 31,
          image: "https://placehold.co/200x200/FF9800/white?text=Dal",
          isFeatured: false,
          isOnSale: false,
        },
        {
          id: "3",
          name: "Fortune Oil 1L",
          price: 120,
          originalPrice: 130,
          rating: 4.7,
          reviewCount: 28,
          image: "https://placehold.co/200x200/2196F3/white?text=Oil",
          isFeatured: true,
          isOnSale: true,
        },
        {
          id: "4",
          name: "Sugar 5kg",
          price: 200,
          rating: 4.4,
          reviewCount: 19,
          image: "https://placehold.co/200x200/9C27B0/white?text=Sugar",
          isFeatured: false,
          isOnSale: false,
        },
      ],
      workingHours: [
        { day: "Mon-Fri", hours: "9:00 AM - 9:00 PM", isOpen: true },
        { day: "Sat", hours: "10:00 AM - 10:00 PM", isOpen: true },
        { day: "Sun", hours: "10:00 AM - 8:00 PM", isOpen: true },
      ],
      contact: {
        phone: "+91 98765 43210",
        email: "info@freshgroceries.com",
        address: "123, Electronic City Phase 1, Bengaluru, Karnataka - 560100",
      },
      socialLinks: [
        { platform: "Facebook", url: "https://facebook.com/freshgroceries" },
        { platform: "Instagram", url: "https://instagram.com/freshgroceries" },
        { platform: "Twitter", url: "https://twitter.com/freshgroceries" },
      ],
    };

    // Simulate API call
    setTimeout(() => {
      setStoreData(mockStoreData);
    }, 800);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const renderProductItem = ({ item }: { item: StoreProduct }) => (
    <Card style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Ionicons name="image" size={24} color={theme.colors.text.light} />
        {item.isOnSale && (
          <View style={styles.saleBadge}>
            <Text variant="caption" fontWeight="bold" color={theme.colors.background.primary}>
              SALE
            </Text>
          </View>
        )}
        {item.isFeatured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color={theme.colors.background.primary} />
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text variant="body" fontWeight="semibold" numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color={theme.colors.primary.orange} />
          <Text variant="caption" fontWeight="semibold" style={styles.ratingText}>
            {item.rating}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            ({item.reviewCount})
          </Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text variant="body" fontWeight="bold">
            ₹{item.price}
          </Text>
          {item.originalPrice && (
            <Text variant="caption" color={theme.colors.text.light} style={styles.originalPrice}>
              ₹{item.originalPrice}
            </Text>
          )}
        </View>
      </View>
      
      <Button variant="outline" size="sm" style={styles.addToCartButton}>
        <Ionicons name="add" size={16} color={theme.colors.primary.green} />
        Add
      </Button>
    </Card>
  );

  const renderAboutSection = () => (
    <View style={styles.aboutContainer}>
      <Card style={styles.sectionCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          About Us
        </Text>
        <Text variant="body" color={theme.colors.text.secondary}>
          {storeData?.description}
        </Text>
      </Card>

      <Card style={styles.sectionCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          Categories
        </Text>
        <View style={styles.categoriesContainer}>
          {storeData?.categories.map((category, index) => (
            <View key={index} style={styles.categoryChip}>
              <Text variant="caption" fontWeight="medium">
                {category}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          Working Hours
        </Text>
        {storeData?.workingHours.map((hours, index) => (
          <View key={index} style={styles.hoursRow}>
            <Text variant="body" fontWeight="semibold" style={styles.hoursDay}>
              {hours.day}
            </Text>
            <View style={styles.hoursDetails}>
              <Text variant="body" color={hours.isOpen ? theme.colors.status.success : theme.colors.status.error}>
                {hours.hours}
              </Text>
              <View style={[
                styles.statusDot,
                { backgroundColor: hours.isOpen ? theme.colors.status.success : theme.colors.status.error }
              ]} />
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.sectionCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          Contact
        </Text>
        <View style={styles.contactRow}>
          <Ionicons name="call" size={16} color={theme.colors.text.primary} />
          <Text variant="body" style={styles.contactText}>
            {storeData?.contact.phone}
          </Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail" size={16} color={theme.colors.text.primary} />
          <Text variant="body" style={styles.contactText}>
            {storeData?.contact.email}
          </Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="location" size={16} color={theme.colors.text.primary} />
          <Text variant="body" style={styles.contactText}>
            {storeData?.contact.address}
          </Text>
        </View>
      </Card>
    </View>
  );

  const renderReviewsSection = () => (
    <View style={styles.reviewsContainer}>
      <Card style={styles.sectionCard}>
        <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
          Customer Reviews
        </Text>
        <View style={styles.ratingSummary}>
          <Text variant="h2" fontWeight="bold">
            {storeData?.rating}
          </Text>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < Math.floor(storeData?.rating || 0) ? "star" : "star-outline"}
                size={16}
                color={theme.colors.primary.orange}
              />
            ))}
          </View>
          <Text variant="body" color={theme.colors.text.light}>
            Based on {storeData?.reviewCount} reviews
          </Text>
        </View>
      </Card>

      <Card style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerAvatar}>
            <Text variant="body" fontWeight="bold" color={theme.colors.background.primary}>
              RK
            </Text>
          </View>
          <View style={styles.reviewInfo}>
            <Text variant="body" fontWeight="semibold">Rakesh Kumar</Text>
            <View style={styles.reviewStars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < 5 ? "star" : "star-outline"}
                  size={14}
                  color={theme.colors.primary.orange}
                />
              ))}
            </View>
          </View>
        </View>
        <Text variant="body" style={styles.reviewText}>
          Great service and fresh products. Delivery was on time and the quality was excellent. Will definitely order again!
        </Text>
        <Text variant="caption" color={theme.colors.text.light} style={styles.reviewDate}>
          2 days ago
        </Text>
      </Card>

      <Card style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerAvatar}>
            <Text variant="body" fontWeight="bold" color={theme.colors.background.primary}>
              PS
            </Text>
          </View>
          <View style={styles.reviewInfo}>
            <Text variant="body" fontWeight="semibold">Priya Sharma</Text>
            <View style={styles.reviewStars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < 4 ? "star" : "star-outline"}
                  size={14}
                  color={theme.colors.primary.orange}
                />
              ))}
            </View>
          </View>
        </View>
        <Text variant="body" style={styles.reviewText}>
          Very satisfied with the shopping experience. The products were fresh and the prices were reasonable.
        </Text>
        <Text variant="caption" color={theme.colors.text.light} style={styles.reviewDate}>
          1 week ago
        </Text>
      </Card>
    </View>
  );

  if (!storeData) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={48} color={theme.colors.primary.green} />
          <Text variant="h3" style={styles.loadingText}>
            Loading store preview...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Store Preview
        </Text>
        <TouchableOpacity
          onPress={async () => {
            try {
              await Sharing.shareAsync("https://kiranastore.app/store/preview", {
                dialogTitle: "Share Store",
              });
            } catch (error) {
              console.log("Share cancelled");
            }
          }}
          style={styles.shareButton}
        >
          <Ionicons name="share" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Store Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerImage}>
            <Ionicons name="image" size={48} color={theme.colors.text.light} />
          </View>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="storefront" size={24} color={theme.colors.text.light} />
            </View>
          </View>
        </View>

        {/* Store Info */}
        <View style={styles.storeInfoContainer}>
          <Text variant="h2" fontWeight="bold" style={styles.storeName}>
            {storeData.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={theme.colors.primary.orange} />
            <Text variant="body" fontWeight="semibold" style={styles.ratingText}>
              {storeData.rating}
            </Text>
            <Text variant="body" color={theme.colors.text.light}>
              ({storeData.reviewCount} reviews)
            </Text>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "products" && styles.activeTab]}
            onPress={() => setActiveTab("products")}
          >
            <Text
              variant="body"
              fontWeight="semibold"
              color={activeTab === "products" ? theme.colors.background.primary : theme.colors.text.light}
            >
              Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text
              variant="body"
              fontWeight="semibold"
              color={activeTab === "about" ? theme.colors.background.primary : theme.colors.text.light}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "reviews" && styles.activeTab]}
            onPress={() => setActiveTab("reviews")}
          >
            <Text
              variant="body"
              fontWeight="semibold"
              color={activeTab === "reviews" ? theme.colors.background.primary : theme.colors.text.light}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "products" && (
          <View style={styles.productsContainer}>
            <View style={styles.sectionHeader}>
              <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                Featured Products
              </Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/store")}>
                <Text variant="body" color={theme.colors.primary.green}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={storeData.products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          </View>
        )}

        {activeTab === "about" && renderAboutSection()}
        {activeTab === "reviews" && renderReviewsSection()}

        {/* Action Buttons */}
        <View style={[styles.actionContainer, { paddingBottom: insets.bottom }]}>
          <Button
            variant="outline"
            size="md"
            style={styles.actionButton}
            onPress={() => router.push("/support/help")}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color={theme.colors.primary.green} />
            Message
          </Button>
          <Button
            variant="primary"
            size="md"
            style={styles.actionButton}
            onPress={() => Alert.alert("Store Live", "Your store is now live at:\nhttps://kiranastore.app/store/preview")}
          >
            <Ionicons name="open" size={20} color={theme.colors.background.primary} />
            Visit Store
          </Button>
        </View>
      </ScrollView>
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
  shareButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    position: "relative",
    height: theme.spacing.xxl + 102,
    backgroundColor: theme.colors.background.secondary,
    marginBottom: -theme.spacing.xxl + 2,
  },
  bannerImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
  },
  logoContainer: {
    position: "absolute",
    bottom: -theme.spacing.xxl + 2,
    left: theme.spacing.md,
    zIndex: 1,
  },
  logoPlaceholder: {
    width: theme.spacing.xxl + 52,
    height: theme.spacing.xxl + 52,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },
  storeInfoContainer: {
    marginTop: theme.spacing.xxl + 2,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  storeName: {
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  ratingText: {
    marginRight: theme.spacing.xs,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
  },
  activeTab: {
    backgroundColor: theme.colors.primary.green,
    borderColor: theme.colors.primary.green,
  },
  productsContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  productsList: {
    gap: theme.spacing.md,
  },
  productCard: {
    width: Dimensions.get("window").width * 0.7,
    padding: theme.spacing.md,
  },
  productImageContainer: {
    height: theme.spacing.xxl + 72,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    position: "relative",
  },
  saleBadge: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.status.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  featuredBadge: {
    position: "absolute",
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.primary.orange,
    width: theme.spacing.xl - 4,
    height: theme.spacing.xl - 4,
    borderRadius: theme.borderRadius.lg - 6,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    alignSelf: "flex-start",
  },
  aboutContainer: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  reviewsContainer: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  sectionCard: {
    padding: theme.spacing.md,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  categoryChip: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  hoursDay: {
    flex: 1,
  },
  hoursDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  statusDot: {
    width: theme.spacing.sm - 4,
    height: theme.spacing.sm - 4,
    borderRadius: theme.borderRadius.xs,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  contactText: {
    flex: 1,
  },
  ratingSummary: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  starsContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  reviewCard: {
    padding: theme.spacing.md,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.green,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewInfo: {
    flex: 1,
  },
  reviewStars: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  reviewText: {
    marginBottom: theme.spacing.sm,
  },
  reviewDate: {
    alignSelf: "flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.xxl + 2,
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
  actionContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  actionButton: {
    flex: 1,
  },
});

export default StorePreviewScreen;