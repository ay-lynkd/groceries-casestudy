/**
 * Orders Management Screen
 * View and manage all orders
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, TextInput, ScrollView } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ordersData, getOrderStats } from '@/mocks/ordersData';
import type { Order, OrderStatus } from '@/types/order';

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  new: { label: 'New', color: theme.colors.status.info, icon: 'time-outline' },
  accepted: { label: 'Accepted', color: theme.colors.status.warning, icon: 'checkmark-circle-outline' },
  preparing: { label: 'Preparing', color: theme.colors.primary.orange, icon: 'restaurant-outline' },
  ready: { label: 'Ready', color: theme.colors.primary.purple, icon: 'cube-outline' },
  assigned: { label: 'Assigned', color: theme.colors.status.info, icon: 'bicycle-outline' },
  out_for_delivery: { label: 'Out for Delivery', color: theme.colors.primary.purple, icon: 'navigate-outline' },
  delivered: { label: 'Delivered', color: theme.colors.status.success, icon: 'checkmark-done-outline' },
  cancelled: { label: 'Cancelled', color: theme.colors.status.error, icon: 'close-circle-outline' },
  declined: { label: 'Declined', color: theme.colors.status.error, icon: 'close-circle-outline' },
};

type FilterStatus = 'all' | OrderStatus;

export default function OrdersScreen() {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [orders] = useState<Order[]>(ordersData);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = getOrderStats();

  const handleAcceptOrder = (orderId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', `Order ${orderId} accepted successfully`);
  };

  const handleCancelOrder = (orderId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel order ${orderId}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }},
      ]
    );
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const statusConfig = ORDER_STATUS_CONFIG[item.status];
    const totalItems = item.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <Card style={styles.orderCard}>
        <TouchableOpacity
          style={styles.orderContent}
          onPress={() => router.push(`/order/${item.id}` as any)}
          activeOpacity={0.7}
        >
          {/* Order Header */}
          <View style={styles.orderHeader}>
            <View>
              <Text variant="body" fontWeight="semibold">
                {item.orderId}
              </Text>
              <Text variant="caption" color={theme.colors.text.light}>
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '15' }]}>
              <Ionicons name={statusConfig.icon as any} size={theme.typography.fontSize.sm} color={statusConfig.color} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* Customer Info */}
          <View style={styles.customerRow}>
            <Ionicons name="person-outline" size={theme.typography.fontSize.base} color={theme.colors.text.secondary} />
            <Text variant="body" color={theme.colors.text.secondary}>
              {item.customer.name}
            </Text>
          </View>

          {/* Order Items Summary */}
          <View style={styles.itemsRow}>
            <Ionicons name="cube-outline" size={theme.typography.fontSize.base} color={theme.colors.text.secondary} />
            <Text variant="body" color={theme.colors.text.secondary}>
              {totalItems} items
            </Text>
          </View>

          {/* Order Total */}
          <View style={styles.orderFooter}>
            <View>
              <Text variant="caption" color={theme.colors.text.light}>Total Amount</Text>
              <Text variant="h3" fontWeight="bold" color={theme.colors.status.success}>
                ₹{item.paymentAmount}
              </Text>
            </View>
            
            {/* Action Buttons for New Orders */}
            {item.status === 'new' && (
              <View style={styles.actionButtons}>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => handleCancelOrder(item.orderId)}
                  style={styles.actionButton}
                >
                  Decline
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onPress={() => handleAcceptOrder(item.orderId)}
                  style={styles.actionButton}
                >
                  Accept
                </Button>
              </View>
            )}

            {item.status !== 'new' && (
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
                <Ionicons name="chevron-forward" size={theme.typography.fontSize.base} color={theme.colors.status.success} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Orders',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/analytics/dashboard')}
              style={styles.headerButton}
            >
              <Ionicons name="analytics-outline" size={theme.typography.fontSize.xl} color={theme.colors.status.success} />
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
              placeholder="Search orders..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchText}
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.new}</Text>
            <Text style={styles.statLabel}>New</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.preparing}</Text>
            <Text style={styles.statLabel}>Preparing</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.outForDelivery}</Text>
            <Text style={styles.statLabel}>Delivery</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.delivered}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(['all', 'new', 'accepted', 'preparing', 'ready', 'assigned', 'out_for_delivery', 'delivered', 'cancelled'] as FilterStatus[]).map(filter => (
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
                   filter === 'out_for_delivery' ? 'Out for Delivery' :
                   filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Order List */}
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={renderOrder}
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
              <Ionicons name="receipt-outline" size={theme.spacing.xxl} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>No orders found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
            </View>
          }
        />
      </View>
    </>
  );
}

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
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.status.success,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  filterContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.border.light,
    marginRight: theme.spacing.sm,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  orderCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  orderContent: {
    gap: theme.spacing.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    marginTop: theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    minWidth: theme.spacing.xl * 2,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  viewButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.status.success,
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
});
