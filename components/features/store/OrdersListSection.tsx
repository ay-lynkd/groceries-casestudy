import { Text } from '@/components/common';
import type { Order, OrderStatus } from '@/types/order';
import { ORDER_STATUS_CONFIG } from '@/types/order';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { OrderCard } from './OrderCard';

interface OrdersListSectionProps {
  orders: Order[];
  statusFilter?: OrderStatus | OrderStatus[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  emptyText?: string;
}

export const OrdersListSection: React.FC<OrdersListSectionProps> = ({
  orders,
  statusFilter,
  onRefresh,
  isRefreshing = false,
  emptyText = 'No orders found',
}) => {
  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    const statuses = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
    return orders.filter(order => statuses.includes(order.status));
  }, [orders, statusFilter]);

  const renderOrderCard = useCallback(({ item }: { item: Order }) => {
    return <OrderCard order={item} />;
  }, []);

  const keyExtractor = useCallback((item: Order) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 400,
    offset: 400 * index,
    index,
  }), []);

  if (filteredOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="cube-outline" size={48} color={theme.colors.text.light} />
        </View>
        <Text style={styles.emptyTitle}>{emptyText}</Text>
        <Text style={styles.emptySubtitle}>
          {statusFilter 
            ? `No orders with status "${Array.isArray(statusFilter) ? statusFilter[0] : statusFilter}"`
            : 'New orders will appear here'
          }
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredOrders}
      renderItem={renderOrderCard}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContainer}
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
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
};

interface OrderStatusTabsProps {
  selectedStatus: OrderStatus | 'all';
  onStatusChange: (status: OrderStatus | 'all') => void;
  counts: Record<string, number>;
}

export const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({
  selectedStatus,
  onStatusChange,
  counts,
}) => {
  const tabs: { key: OrderStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'out_for_delivery', label: 'Out' },
  ];

  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            selectedStatus === tab.key && styles.tabActive,
          ]}
          onPress={() => onStatusChange(tab.key)}
        >
          <Text style={[
            styles.tabText,
            selectedStatus === tab.key && styles.tabTextActive,
          ]}>
            {tab.label}
          </Text>
          {counts[tab.key] > 0 && (
            <View style={[
              styles.badge,
              selectedStatus === tab.key && styles.badgeActive,
            ]}>
              <Text style={[
                styles.badgeText,
                selectedStatus === tab.key && styles.badgeTextActive,
              ]}>
                {counts[tab.key]}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    gap: theme.spacing.xs,
  },
  tabActive: {
    backgroundColor: theme.colors.primary.green,
  },
  tabText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    color: '#FFF',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.text.light,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FFF',
  },
  badgeTextActive: {
    color: '#FFF',
  },
});
