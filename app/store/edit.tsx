import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import shop data - in a real app, this would come from state management or API
import { shopDetails } from "@/mocks/storeProductsData";

// Define the shop data type
interface ShopData {
  name: string;
  location: string;
  hours: string;
  galleryImages: string[];
}

export default function EditShopDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [shopData, setShopData] = useState<ShopData>({
    name: shopDetails.name,
    location: shopDetails.location,
    hours: shopDetails.hours,
    galleryImages: [...shopDetails.galleryImages],
  });

  const handleSave = async () => {
    // In a real app, this would save to an API
    console.log("Saving shop details:", shopData);
    Alert.alert("Success", "Shop details updated successfully!");
    router.back();
  };

  const updateShopData = (field: keyof ShopData, value: any) => {
    setShopData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Edit Shop
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.form}>
          <Card style={styles.inputCard}>
            <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
              Store Name *
            </Text>
            <TextInput
              value={shopData.name}
              onChangeText={(text) => updateShopData("name", text)}
              placeholder="Enter store name"
              style={styles.textInput}
            />
          </Card>

          <Card style={styles.inputCard}>
            <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
              Location *
            </Text>
            <TextInput
              value={shopData.location}
              onChangeText={(text) => updateShopData("location", text)}
              placeholder="Enter store location"
              style={styles.textInput}
            />
          </Card>

          <Card style={styles.inputCard}>
            <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
              Operating Hours *
            </Text>
            <TextInput
              value={shopData.hours}
              onChangeText={(text) => updateShopData("hours", text)}
              placeholder="Enter operating hours (e.g. 09:00 am - 10:00 pm)"
              style={styles.textInput}
            />
          </Card>

          <Card style={styles.inputCard}>
            <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
              Gallery Images
            </Text>
            <View style={styles.galleryPreview}>
              {shopData.galleryImages.map((img, index) => (
                <View key={index} style={styles.galleryItem}>
                  <Ionicons name="image" size={24} color={theme.colors.text.light} />
                </View>
              ))}
              <TouchableOpacity style={styles.addImageButton}>
                <Ionicons name="add" size={24} color={theme.colors.primary.green} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleSave}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      </View>
    </View>
  );
}

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
  headerSpacer: {
    width: theme.spacing.xl + 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  form: {
    gap: theme.spacing.md,
  },
  inputCard: {
    padding: theme.spacing.md,
  },
  inputLabel: {
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  galleryPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  galleryItem: {
    width: theme.spacing.xxl + 32,
    height: theme.spacing.xxl + 12,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  addImageButton: {
    width: 80,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.border.light,
  },
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  saveButton: {
    width: "100%",
  },
});