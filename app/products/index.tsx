/**
 * Products Management Screen
 * List and manage all products
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { productsData } from '@/mocks/storeProductsData';

interface Product {
  id: string;
  name: string;
  quantity: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  inStock: boolean;
  image: string;
}

export default function ProductsScreen() {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'inStock' | 'outOfStock' | 'onSale'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>(productsData as any);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      selectedFilter === 'all' ? true :
      selectedFilter === 'inStock' ? product.inStock :
      selectedFilter === 'outOfStock' ? !product.inStock :
      selectedFilter === 'onSale' ? product.discount > 0 :
      true;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteProduct = (productId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setProducts(products.filter(p => p.id !== productId));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={styles.productCard}>
      <TouchableOpacity
        style={styles.productContent}
        onPress={() => router.push(`/product/${item.id}`)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text variant="body" fontWeight="semibold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.quantity}
          </Text>
          <View style={styles.priceRow}>
            <Text variant="body" fontWeight="bold" color={theme.colors.status.success}>
              ₹{item.currentPrice}
            </Text>
            {item.discount > 0 && (
              <View style={styles.discountBadge}>
                <Text variant="caption" style={styles.discountText}>
                  {item.discount}% OFF
                </Text>
              </View>
            )}
          </View>
          <View style={[
            styles.stockBadge,
            { backgroundColor: item.inStock ? theme.colors.status.success + '15' : theme.colors.status.error + '15' }
          ]}>
            <Text variant="caption" style={[
              styles.stockText,
              { color: item.inStock ? theme.colors.status.success : theme.colors.status.error }
            ]}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>
        <View style={styles.productActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/product/${item.id}/edit`);
            }}
          >
            <Ionicons name="create-outline" size={theme.typography.fontSize.lg} color={theme.colors.status.info} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Ionicons name="trash-outline" size={theme.typography.fontSize.lg} color={theme.colors.status.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Products',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/product/create/wizard');
              }} 
              style={styles.headerButton}
            >
              <Ionicons name="add" size={theme.typography.fontSize['2xl'] + 4} color={theme.colors.status.success} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Ionicons name="search-outline" size={theme.typography.fontSize.lg} color={theme.colors.text.light} />
            <TextInput
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchText}
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(['all', 'inStock', 'outOfStock', 'onSale'] as const).map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && { backgroundColor: theme.colors.status.success },
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && { color: theme.colors.background.primary },
              ]}>
                {filter === 'all' ? 'All' : 
                 filter === 'inStock' ? 'In Stock' : 
                 filter === 'outOfStock' ? 'Out of Stock' : 
                 'On Sale'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.filter(p => p.inStock).length}</Text>
            <Text style={styles.statLabel}>In Stock</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.filter(p => p.discount > 0).length}</Text>
            <Text style={styles.statLabel}>On Sale</Text>
          </View>
        </View>

        {/* Product List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.status.success]}
              tintColor={theme.colors.status.success}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={theme.spacing.xxl} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
            </View>
          }
        />

        {/* Bulk Actions */}
        <View style={styles.footer}>
          <Button
            variant="outline"
            onPress={() => router.push('/products/bulk-operations')}
            style={styles.footerButton}
          >
            <Ionicons name="layers-outline" size={theme.typography.fontSize.base} />
            <Text style={{ marginLeft: theme.spacing.sm }}>Bulk Operations</Text>
          </Button>
          <Button
            variant="primary"
            onPress={() => router.push('/product/create/wizard')}
            style={styles.footerButton}
          >
            <Ionicons name="add" size={theme.typography.fontSize.base} color={theme.colors.background.primary} />
            <Text style={{ marginLeft: theme.spacing.sm, color: theme.colors.background.primary }}>Add Product</Text>
          </Button>
        </View>
      </View>
    </>
  );
}

// Import TextInput
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
  },
  searchText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.border.light,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.status.success,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  productCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  productContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: theme.spacing.xxl + theme.spacing.lg,
    height: theme.spacing.xxl + theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
  },
  productInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  discountBadge: {
    backgroundColor: theme.colors.status.error + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    color: theme.colors.status.error,
    fontWeight: theme.typography.fontWeight.bold,
  },
  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
  },
  stockText: {
    fontWeight: theme.typography.fontWeight.medium,
  },
  productActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  footerButton: {
    flex: 1,
  },
});
