/**
 * Delivery Management Screen
 * Track and manage active deliveries
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, TextInput, ScrollView, Linking } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ordersData, getActiveDeliveries } from '@/mocks/ordersData';
import { deliveryBoysData, type DeliveryBoy } from '@/mocks/deliveryBoysData';
import type { Order, OrderStatus } from '@/types/order';

const DELIVERY_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  assigned: { label: 'Assigned', color: theme.colors.status.info, icon: 'bicycle-outline' },
  out_for_delivery: { label: 'Out for Delivery', color: theme.colors.primary.purple, icon: 'navigate-outline' },
  delivered: { label: 'Delivered', color: theme.colors.status.success, icon: 'checkmark-done-outline' },
};

export default function DeliveryScreen() {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'assigned' | 'out_for_delivery'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [activeDeliveries] = useState<Order[]>(getActiveDeliveries());
  const [deliveryBoys] = useState<DeliveryBoy[]>(deliveryBoysData);

  const availableDeliveryBoys = deliveryBoys.filter(b => b.isAvailable).length;

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const filteredDeliveries = activeDeliveries.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.deliveryAssignment?.deliveryBoyName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCallCustomer = (phone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone}`);
  };

  const handleCallDeliveryBoy = (phone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone}`);
  };

  const handleTrackOrder = (orderId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/orders/${orderId}/tracking`);
  };

  const renderDelivery = ({ item }: { item: Order }) => {
    const statusConfig = DELIVERY_STATUS_CONFIG[item.status] || DELIVERY_STATUS_CONFIG.assigned;
    const totalItems = item.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <Card style={styles.deliveryCard}>
        {/* Order Header */}
        <View style={styles.deliveryHeader}>
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
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={theme.typography.fontSize.base} color={theme.colors.text.secondary} />
            <Text variant="body" color={theme.colors.text.secondary}>
              {item.customer.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={theme.typography.fontSize.base} color={theme.colors.text.secondary} />
            <Text variant="caption" color={theme.colors.text.secondary} numberOfLines={2}>
              {item.customer.address}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cube-outline" size={theme.typography.fontSize.base} color={theme.colors.text.secondary} />
            <Text variant="body" color={theme.colors.text.secondary}>
              {totalItems} items • ₹{item.paymentAmount}
            </Text>
          </View>
        </View>

        {/* Delivery Boy Info */}
        {item.deliveryAssignment && (
          <View style={styles.deliveryBoySection}>
            <View style={styles.deliveryBoyHeader}>
              <Ionicons name="bicycle" size={theme.typography.fontSize.base} color={theme.colors.status.success} />
              <Text variant="body" fontWeight="semibold">
                Delivery Partner
              </Text>
            </View>
            <View style={styles.deliveryBoyInfo}>
              <Text variant="body" fontWeight="medium">
                {item.deliveryAssignment.deliveryBoyName}
              </Text>
              <Text variant="caption" color={theme.colors.text.light}>
                {item.deliveryAssignment.deliveryBoyPhone}
              </Text>
              {item.deliveryAssignment.estimatedDeliveryTime && (
                <Text variant="caption" color={theme.colors.status.success}>
                  Est. Delivery: {new Date(item.deliveryAssignment.estimatedDeliveryTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="outline"
            size="sm"
            onPress={() => handleCallCustomer(item.customer.phone)}
            style={styles.actionButton}
          >
            <Ionicons name="call-outline" size={theme.typography.fontSize.base} />
            <Text style={{ marginLeft: theme.spacing.xs }}>Customer</Text>
          </Button>
          
          {item.deliveryAssignment && (
            <Button
              variant="outline"
              size="sm"
              onPress={() => item.deliveryAssignment?.deliveryBoyPhone && handleCallDeliveryBoy(item.deliveryAssignment.deliveryBoyPhone.replace(/\s/g, ''))}
              style={styles.actionButton}
            >
              <Ionicons name="bicycle-outline" size={theme.typography.fontSize.base} />
              <Text style={{ marginLeft: theme.spacing.xs }}>Partner</Text>
            </Button>
          )}
          
          <Button
            variant="primary"
            size="sm"
            onPress={() => handleTrackOrder(item.id)}
            style={styles.actionButton}
          >
            <Ionicons name="navigate-outline" size={theme.typography.fontSize.base} color={theme.colors.background.primary} />
            <Text style={{ marginLeft: theme.spacing.xs, color: theme.colors.background.primary }}>Track</Text>
          </Button>
        </View>
      </Card>
    );
  };

  const renderDeliveryBoy = ({ item }: { item: DeliveryBoy }) => (
    <Card style={styles.deliveryBoyCard}>
      <TouchableOpacity
        style={styles.deliveryBoyCardContent}
        onPress={() => router.push(`/delivery-boys/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <View style={[styles.avatarContainer, { backgroundColor: item.isAvailable ? theme.colors.status.success : theme.colors.text.light }]}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.deliveryBoyCardInfo}>
          <Text variant="body" fontWeight="semibold">{item.name}</Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.phoneNumber}
          </Text>
        </View>
        <View style={[styles.availabilityBadge, { backgroundColor: (item.isAvailable ? theme.colors.status.success : theme.colors.text.light) + '20' }]}>
          <Text style={[styles.availabilityText, { color: item.isAvailable ? theme.colors.status.success : theme.colors.text.light }]}>
            {item.isAvailable ? 'AVAILABLE' : 'OFFLINE'}
          </Text>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Delivery Management',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/delivery-boys')}
              style={styles.headerButton}
            >
              <Ionicons name="people-outline" size={theme.typography.fontSize.xl} color={theme.colors.status.success} />
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
              placeholder="Search deliveries..."
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
            <Text style={styles.statNumber}>{activeDeliveries.filter(d => d.status === 'assigned').length}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeDeliveries.filter(d => d.status === 'out_for_delivery').length}</Text>
            <Text style={styles.statLabel}>Out for Delivery</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{availableDeliveryBoys}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(['all', 'assigned', 'out_for_delivery'] as const).map(filter => (
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
                  {filter === 'all' ? 'All Active' : 
                   filter === 'out_for_delivery' ? 'Out for Delivery' :
                   filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Deliveries</Text>
          <TouchableOpacity onPress={() => router.push('/delivery-boys')}>
            <Text style={styles.viewAllText}>Manage Partners</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery List */}
        <FlatList
          data={filteredDeliveries}
          keyExtractor={item => item.id}
          renderItem={renderDelivery}
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
              <Ionicons name="bicycle-outline" size={theme.spacing.xxl} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>No active deliveries</Text>
              <Text style={styles.emptySubtitle}>All orders have been delivered</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.status.success,
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  deliveryCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
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
  infoSection: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  deliveryBoySection: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  deliveryBoyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  deliveryBoyInfo: {
    gap: theme.spacing.xs / 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  deliveryBoyCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  deliveryBoyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: theme.spacing.xl + theme.spacing.md,
    height: theme.spacing.xl + theme.spacing.md,
    borderRadius: (theme.spacing.xl + theme.spacing.md) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background.primary,
  },
  deliveryBoyCardInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  availabilityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  availabilityText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
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
