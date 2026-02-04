import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  name: string;
  quantity: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  image?: string;
  inStock?: boolean;
  stockAmount?: number;
  onPress?: () => void;
}

export const ProductCard = React.memo(({
  name,
  quantity,
  currentPrice,
  originalPrice,
  discount,
  image,
  inStock = true,
  stockAmount,
  onPress,
}: ProductCardProps) => {
  const hasDiscount = discount > 0;
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  
  // Determine stock status
  const isLowStock = inStock && stockAmount !== undefined && stockAmount > 0 && stockAmount < 10;
  const isOutOfStock = !inStock;

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress}
      disabled={!onPress}
      style={styles.container}
    >
      <Card style={styles.card}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.productImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons
                name="cube-outline"
                size={40}
                color={theme.colors.text.light}
              />
            </View>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && !isOutOfStock && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
          )}
          
          {/* Stock Status Badge */}
          {isOutOfStock && (
            <View style={[styles.stockBadge, styles.outOfStockBadge]}>
              <Text style={styles.stockBadgeText}>Out of Stock</Text>
            </View>
          )}
          {isLowStock && (
            <View style={[styles.stockBadge, styles.lowStockBadge]}>
              <Text style={styles.stockBadgeText}>Low Stock</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.quantity}>{quantity}</Text>
          
          {/* Price Row */}
          <View style={styles.priceRow}>
            <Text style={[styles.currentPrice, isOutOfStock && styles.strikethrough]}>
              ₹{currentPrice}
            </Text>
            {hasDiscount && !isOutOfStock && (
              <Text style={styles.originalPrice}>₹{originalPrice}</Text>
            )}
          </View>
          
          {/* Stock Amount */}
          {stockAmount !== undefined && stockAmount > 0 && !isOutOfStock && (
            <Text style={[styles.stockText, isLowStock && styles.lowStockText]}>
              {stockAmount} units left
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '48%',
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    backgroundColor: theme.colors.background.secondary,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.colors.primary.orange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  outOfStockBadge: {
    backgroundColor: theme.colors.status.error,
  },
  lowStockBadge: {
    backgroundColor: theme.colors.status.warning,
  },
  stockBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  infoContainer: {
    padding: theme.spacing.md,
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  quantity: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    marginBottom: theme.spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  currentPrice: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  originalPrice: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSize.sm,
    textDecorationLine: 'line-through',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.light,
  },
  stockText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  lowStockText: {
    color: theme.colors.status.warning,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default ProductCard;
