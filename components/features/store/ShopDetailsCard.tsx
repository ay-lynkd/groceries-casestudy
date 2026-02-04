import { Button, Card } from "@/components/primary";
import { ROUTES } from "@/constants";
import { theme } from "@/theme/appTheme";
import type { ShopDetails } from "@/types/store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ShopDetailsCardProps {
  shop: ShopDetails;
}

export const ShopDetailsCard: React.FC<ShopDetailsCardProps> = ({ shop }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Shop Details</Text>
      <Card shadow>
        <View style={styles.imagePlaceholder}>
          {shop.galleryImages?.[0] ? (
            <Image
              source={{ uri: shop.galleryImages[0] }}
              style={styles.shopImage}
              contentFit="cover"
            />
          ) : (
            <Ionicons
              name="storefront-outline"
              size={48}
              color={theme.colors.text.light}
            />
          )}
        </View>
        <View style={styles.shopNameWithEdit}>
          <Text style={styles.shopName}>{shop.name}</Text>
          <Button
            variant="secondary"
            size="sm"
            onPress={() => router.push(ROUTES.SHOP.EDIT as any)}
            accessibilityLabel={`Edit ${shop.name} details`}
            style={styles.editButton}
          >
            Edit
          </Button>
        </View>
        <View style={styles.row}>
          <Ionicons
            name="location"
            size={16}
            color={theme.colors.text.secondary}
          />
          <Text style={styles.detail}>{shop.location}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="time" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.detail}>{shop.hours}</Text>
        </View>
        {shop.galleryImages?.length > 0 && (
          <View style={styles.gallery}>
            {shop.galleryImages.map((imageUrl, i) => (
              <View key={i} style={styles.galleryItem}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.galleryImage}
                  contentFit="cover"
                />
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    fontFamily: theme.fonts.figtree,
    marginBottom: theme.spacing.md,
  },
  imagePlaceholder: {
    height: 120,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  shopImage: {
    width: "100%",
    height: "100%",
  },
  shopName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    fontFamily: theme.fonts.figtree,
    flex: 1,
  },
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, marginBottom: theme.spacing.xs },
  detail: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.fonts.figtree,
    flex: 1,
  },
  gallery: { flexDirection: "row", gap: theme.spacing.sm, marginVertical: theme.spacing.md },
  galleryItem: {
    width: 80,
    height: 64,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },

  shopNameWithEdit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  editButton: {
    alignSelf: "flex-start",
    padding: 0,
    minWidth: 40,
  },
  editButtonContainer: {
    alignSelf: "flex-start",
    marginTop: 0,
  },
});
