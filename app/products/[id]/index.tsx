import { Button, Card } from "@/components/primary";
import { ROUTES } from "@/constants";
import { productsData } from "@/mocks/storeProductsData";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useConfetti } from "@/contexts/ConfettiContext";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { showConfetti } = useConfetti();
  
  const product = productsData.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }
  
  const handleBack = () => router.back();
  const handleEdit = () => router.push(ROUTES.PRODUCT.EDIT(id) as any);
  const handleUploadToStore = () => {
    Alert.alert(
      "Upload to Store",
      "This product will be published to your store. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Upload",
          onPress: () => {
            showConfetti();
            Alert.alert("Success", "Product uploaded to store successfully!");
          },
        },
      ]
    );
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // In a real app, this would call an API to delete the product
            console.log(`Deleting product ${id}`);
            // Show confetti for successful deletion
            showConfetti();
            // Navigate back to the previous screen after deletion
            router.back();
          },
        },
      ]
    );
  };
  
  // Get all images for the product (main image + any additional images)
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images || [])
  ];
  
  const nextImage = () => {
    if (allImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const prevImage = () => {
    if (allImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.headerBtn}>
          <Ionicons name="pencil" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + theme.spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            {allImages.length > 0 ? (
              <Image
                source={{ uri: allImages[currentImageIndex] }}
                style={styles.productImage}
                contentFit="cover"
              />
            ) : (
              <Ionicons
                name="cube-outline"
                size={64}
                color={theme.colors.text.light}
              />
            )}
            {allImages.length > 1 && (
              <>
                <TouchableOpacity style={styles.navButtonLeft} onPress={prevImage}>
                  <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButtonRight} onPress={nextImage}>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </>
            )}
          </View>
          <View style={styles.dots}>
            {allImages.map((_, index) => (
              <View 
                key={index} 
                style={[styles.dot, currentImageIndex === index && styles.dotActive]} 
              />
            ))}
          </View>
        </View>
        <Card style={styles.card}>
          <Text style={styles.label}>Product Name</Text>
          <Text style={styles.value}>{product.name}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.label}>Pricing</Text>
          <Text style={styles.value}>₹ {product.currentPrice}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.label}>Seller Details</Text>
          <Text style={styles.value}>
            {product.sellerDetails || "Super Market"}
          </Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>
            {product.description || "No description available."}
          </Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.label}>Nutritional facts</Text>
          <Text style={styles.value}>
            {product.nutritionalFacts || "No nutritional facts available."}
          </Text>
        </Card>
        <View style={styles.actions}>
          <Button
            variant="secondary"
            size="lg"
            shiny={true}
            active={true}
            onPress={handleUploadToStore}
            style={styles.actionBtn}
          >
            Upload on Store
          </Button>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Delete Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.secondary },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
  },
  errorText: { color: theme.colors.text.primary, fontSize: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    backgroundColor: theme.colors.background.primary,
  },
  headerBtn: { padding: 8 },
  headerTitle: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  content: { padding: 16, paddingBottom: 100 },
  imagePlaceholder: {
    height: 240,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border.light,
  },
  dotActive: { backgroundColor: theme.colors.primary.green },
  card: { marginBottom: 12 },
  label: { color: theme.colors.text.secondary, fontSize: 14, marginBottom: 4 },
  value: { color: theme.colors.text.primary, fontSize: 16, fontWeight: "500" },
  actions: { flexDirection: "row", gap: 16, marginTop: 16 },
  actionBtn: { flex: 1 },
  deleteBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: theme.colors.status.error,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: {
    color: theme.colors.status.error,
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    marginBottom: 16,
  },
  navButtonLeft: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  navButtonRight: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
});
