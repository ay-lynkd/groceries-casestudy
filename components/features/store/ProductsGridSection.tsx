import { Text } from '@/components/common';
import { Input } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  View,
  RefreshControl,
} from 'react-native';
import { ProductCard } from './ProductCard';
import type { StoreProduct } from '@/types/store';

interface ProductsGridSectionProps {
  products: StoreProduct[];
  onProductClick?: (productId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

type SortOption = 'name' | 'price-low' | 'price-high' | 'stock';

export const ProductsGridSection: React.FC<ProductsGridSectionProps> = ({
  products,
  onProductClick,
  searchQuery: externalSearchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing = false,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showFilters, setShowFilters] = useState(false);

  // Use external or internal search
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = (query: string) => {
    setInternalSearchQuery(query);
    onSearchChange?.(query);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'stock':
        filtered.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchQuery, sortBy]);

  const inStockCount = products.filter(p => p.inStock).length;
  const lowStockCount = products.filter(p => p.inStock && p.amount && p.amount < 10).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;

  const renderProductCard = ({ item }: { item: StoreProduct }) => (
    <ProductCard
      name={item.name}
      quantity={item.quantity}
      currentPrice={item.currentPrice}
      originalPrice={item.originalPrice}
      discount={item.discount}
      image={item.image}
      inStock={item.inStock}
      stockAmount={item.amount}
      onPress={() => onProductClick?.(item.id)}
    />
  );

  const keyExtractor = (item: StoreProduct) => item.id;

  const getItemLayout = (data: any, index: number) => ({
    length: 220,
    offset: 220 * index,
    index,
  });

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchBar}>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          containerStyle={styles.searchInput}
        />
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={showFilters ? theme.colors.primary.green : theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <View style={styles.sortOptions}>
            {[
              { key: 'name', label: 'Name', icon: 'text-outline' },
              { key: 'price-low', label: 'Price: Low to High', icon: 'trending-down-outline' },
              { key: 'price-high', label: 'Price: High to Low', icon: 'trending-up-outline' },
              { key: 'stock', label: 'Stock', icon: 'cube-outline' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  sortBy === option.key && styles.sortOptionActive,
                ]}
                onPress={() => setSortBy(option.key as SortOption)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={16}
                  color={sortBy === option.key ? '#FFF' : theme.colors.text.secondary}
                />
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.key && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Stock Summary */}
      <View style={styles.stockSummary}>
        <StockBadge count={inStockCount} label="In Stock" color="#4CAF50" />
        {lowStockCount > 0 && (
          <StockBadge count={lowStockCount} label="Low Stock" color="#FF9800" />
        )}
        {outOfStockCount > 0 && (
          <StockBadge count={outOfStockCount} label="Out of Stock" color="#F44336" />
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </Text>
        {searchQuery && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary.green]}
                tintColor={theme.colors.primary.green}
              />
            ) : undefined
          }
          getItemLayout={getItemLayout}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={3}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={64} color={theme.colors.border.medium} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No products found' : 'No products'}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'Try adjusting your search'
              : 'Add products to your store'}
          </Text>
        </View>
      )}
    </View>
  );
};

// Stock Badge Component
interface StockBadgeProps {
  count: number;
  label: string;
  color: string;
}

function StockBadge({ count, label, color }: StockBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '15' }]}>
      <View style={[styles.badgeDot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>
        {count} {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  filterButtonActive: {
    borderColor: theme.colors.primary.green,
    backgroundColor: theme.colors.primary.green + '10',
  },
  filterPanel: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
  },
  sortOptionActive: {
    backgroundColor: theme.colors.primary.green,
  },
  sortOptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  sortOptionTextActive: {
    color: '#FFF',
    fontWeight: theme.typography.fontWeight.medium,
  },
  stockSummary: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  clearText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.green,
    fontWeight: theme.typography.fontWeight.medium,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default ProductsGridSection;
