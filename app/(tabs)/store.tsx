import {
  CategoryFilter,
  OrdersListSection,
  OrderStatusTabs,
  PendingOrdersListSection,
  ProductsGridSection,
  ShopDetailsCard,
  SubCategoryTabs,
} from '@/components/features/store';
import {
  CATEGORIES,
  CATEGORY_VALUES,
  STOCK_STATUS,
  SUB_CATEGORIES,
} from '@/constants';
import { useOrders } from '@/contexts/OrderContext';
import { productsData, shopDetails } from '@/mocks/storeProductsData';
import { theme } from '@/theme/appTheme';
import type { OrderStatus } from '@/types/order';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function StoreScreen() {
  const router = useRouter();
  const { orders, isLoading, refreshOrders, getPendingOrders, getActiveOrders, getCompletedOrders } = useOrders();
  
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>(
    CATEGORY_VALUES.GROCERIES
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<(typeof SUB_CATEGORIES)[number]>(
    STOCK_STATUS.IN_STOCK
  );
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered products
  const filteredProducts = useMemo(() => {
    let filtered = productsData;
    
    // Stock filter
    if (selectedSubCategory === STOCK_STATUS.IN_STOCK) {
      filtered = filtered.filter((p) => p.inStock);
    } else {
      filtered = filtered.filter((p) => !p.inStock);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );
    }
    
    return filtered;
  }, [selectedSubCategory, searchQuery]);

  // Order counts for tabs
  const orderCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Filtered orders based on status tab
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return orders;
    return orders.filter(order => order.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  // Pending orders for delivery scheduling
  const pendingOrders = useMemo(() => getPendingOrders(), [getPendingOrders]);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}` as any);
  };

  const handleAddProduct = () => {
    router.push('/products/create' as any);
  };

  const handleSchedule = (orderId: string) => {
    router.push(`/schedule-delivery/${orderId}` as any);
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case CATEGORY_VALUES.GROCERIES:
        return (
          <>
            <SubCategoryTabs
              tabs={[...SUB_CATEGORIES]}
              selectedTab={selectedSubCategory}
              onTabChange={(t) => setSelectedSubCategory(t as (typeof SUB_CATEGORIES)[number])}
              showAddButton
              onAddClick={handleAddProduct}
            />
            <ProductsGridSection 
              products={filteredProducts} 
              onProductClick={handleProductPress}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </>
        );
      
      case CATEGORY_VALUES.ORDERS:
        return (
          <View style={styles.ordersContainer}>
            <OrderStatusTabs
              selectedStatus={orderStatusFilter}
              onStatusChange={setOrderStatusFilter}
              counts={orderCounts}
            />
            <OrdersListSection
              orders={filteredOrders}
              onRefresh={refreshOrders}
              isRefreshing={isLoading}
              emptyText={orderStatusFilter === 'all' ? 'No orders yet' : `No ${orderStatusFilter} orders`}
            />
          </View>
        );
      
      case CATEGORY_VALUES.PENDING_ORDERS:
        return (
          <PendingOrdersListSection 
            orders={pendingOrders} 
            onSchedule={handleSchedule}
            onRefresh={refreshOrders}
            isRefreshing={isLoading}
          />
        );
      
      case CATEGORY_VALUES.ORDER_STATUS:
        return (
          <View style={styles.statusContainer}>
            {/* Order status summary cards */}
            <View style={styles.statusSummary}>
              <StatusSummaryCard
                title="New"
                count={orderCounts['new'] || 0}
                color={theme.colors.status.info}
              />
              <StatusSummaryCard
                title="Preparing"
                count={(orderCounts['accepted'] || 0) + (orderCounts['preparing'] || 0) + (orderCounts['ready'] || 0)}
                color={theme.colors.primary.orange}
              />
              <StatusSummaryCard
                title="Out"
                count={(orderCounts['assigned'] || 0) + (orderCounts['out_for_delivery'] || 0)}
                color={theme.colors.status.error}
              />
              <StatusSummaryCard
                title="Delivered"
                count={orderCounts['delivered'] || 0}
                color={theme.colors.status.success}
              />
            </View>
            
            <OrdersListSection
              orders={getActiveOrders()}
              emptyText="No active deliveries"
            />
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <ShopDetailsCard shop={shopDetails} />
        <CategoryFilter
          categories={[...CATEGORIES]}
          selectedCategory={selectedCategory}
          onCategoryChange={(c) => setSelectedCategory(c as (typeof CATEGORIES)[number])}
        />
        {renderContent()}
      </ScrollView>
    </View>
  );
}

// Status summary card component
interface StatusSummaryCardProps {
  title: string;
  count: number;
  color: string;
}

function StatusSummaryCard({ title, count, color }: StatusSummaryCardProps) {
  return (
    <View style={[styles.summaryCard, { borderLeftColor: color, borderLeftWidth: theme.spacing.xs }]}>
      <Text style={styles.summaryCount}>{count}</Text>
      <Text style={styles.summaryTitle}>{title}</Text>
    </View>
  );
}

import { Text } from '@/components/common';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background.secondary 
  },
  scroll: { 
    flex: 1 
  },
  content: { 
    padding: theme.spacing.md, 
    paddingBottom: theme.spacing.lg 
  },
  ordersContainer: {
    flex: 1,
  },
  statusContainer: {
    gap: theme.spacing.md,
  },
  statusSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm + 4,
    marginBottom: theme.spacing.sm,
  },
  summaryCard: {
    flex: 1,
    minWidth: 70,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    elevation: 2,
    shadowColor: theme.colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryCount: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  summaryTitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});
