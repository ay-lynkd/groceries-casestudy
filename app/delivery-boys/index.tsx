/**
 * Delivery Boys Management Screen
 * Manage delivery personnel
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, RefreshControl } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'busy';
  totalDeliveries: number;
  rating: number;
  currentOrder?: string;
  vehicleType: string;
  vehicleNumber: string;
}

const MOCK_DELIVERY_BOYS: DeliveryBoy[] = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    email: 'ramesh@delivery.com',
    status: 'active',
    totalDeliveries: 156,
    rating: 4.8,
    vehicleType: 'Bike',
    vehicleNumber: 'KA 01 AB 1234',
  },
  {
    id: '2',
    name: 'Suresh Patel',
    phone: '+91 98765 43211',
    email: 'suresh@delivery.com',
    status: 'busy',
    totalDeliveries: 89,
    rating: 4.5,
    currentOrder: 'ORD-2024-001',
    vehicleType: 'Bike',
    vehicleNumber: 'KA 01 CD 5678',
  },
  {
    id: '3',
    name: 'Mahesh Singh',
    phone: '+91 98765 43212',
    email: 'mahesh@delivery.com',
    status: 'inactive',
    totalDeliveries: 234,
    rating: 4.9,
    vehicleType: 'Scooter',
    vehicleNumber: 'KA 01 EF 9012',
  },
];

export default function DeliveryBoysScreen() {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'busy' | 'inactive'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const filteredBoys = MOCK_DELIVERY_BOYS.filter(boy => {
    const matchesSearch = 
      boy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boy.phone.includes(searchQuery);
    const matchesFilter = selectedFilter === 'all' || boy.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: DeliveryBoy['status']) => {
    switch (status) {
      case 'active': return theme.colors.status.success;
      case 'busy': return theme.colors.status.warning;
      case 'inactive': return theme.colors.text.light;
    }
  };

  const renderDeliveryBoy = ({ item }: { item: DeliveryBoy }) => (
    <Card style={styles.boyCard}>
      <View style={styles.boyHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.boyInfo}>
          <Text style={styles.boyName}>{item.name}</Text>
          <Text style={styles.boyPhone}>{item.phone}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="star" size={theme.typography.fontSize.base} color="#FFC107" />
          <Text style={styles.statValue}>{item.rating}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="bicycle" size={theme.typography.fontSize.base} color={theme.colors.text.secondary} />
          <Text style={styles.statValue}>{item.totalDeliveries} deliveries</Text>
        </View>
      </View>

      <View style={styles.vehicleInfo}>
        <Ionicons name="car-outline" size={theme.typography.fontSize.base} color={theme.colors.text.secondary} />
        <Text style={styles.vehicleText}>{item.vehicleType} • {item.vehicleNumber}</Text>
      </View>

      {item.currentOrder && (
        <View style={styles.currentOrder}>
          <Ionicons name="cube-outline" size={theme.typography.fontSize.base} color={theme.colors.status.success} />
          <Text style={styles.currentOrderText}>On Order: {item.currentOrder}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button 
          variant="outline" 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Linking.openURL(`tel:${item.phone}`);
          }}
        >
          <Ionicons name="call-outline" size={theme.typography.fontSize.base} />
        </Button>
        <Button 
          variant="outline" 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/delivery-boys/${item.id}` as any);
          }}
        >
          <Ionicons name="create-outline" size={theme.typography.fontSize.base} />
        </Button>
        <Button 
          variant={item.status === 'active' ? 'primary' : 'outline'} 
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
              'Assign Order',
              `Assign a new order to ${item.name}?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Assign', 
                  onPress: () => {
                    // Navigate to orders to assign one
                    router.push('/(tabs)');
                    Alert.alert('Success', `Order assignment mode activated for ${item.name}`);
                  }
                },
              ]
            );
          }}
        >
          <Text style={{ color: item.status === 'active' ? theme.colors.background.primary : undefined, fontSize: theme.typography.fontSize.xs }}>
            Assign
          </Text>
        </Button>
      </View>
    </Card>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Delivery Partners',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/add-delivery-boy');
              }} 
              style={styles.headerButton}
            >
              <Ionicons name="add" size={theme.typography.fontSize['2xl'] + 4} color={theme.colors.status.success} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(['all', 'active', 'busy', 'inactive'] as const).map(filter => (
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
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {MOCK_DELIVERY_BOYS.filter(b => b.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {MOCK_DELIVERY_BOYS.filter(b => b.status === 'busy').length}
            </Text>
            <Text style={styles.statLabel}>On Delivery</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {MOCK_DELIVERY_BOYS.reduce((sum, b) => sum + b.totalDeliveries, 0)}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredBoys}
          keyExtractor={item => item.id}
          renderItem={renderDeliveryBoy}
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
              <Ionicons name="people-outline" size={theme.spacing.xxl} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>No delivery partners</Text>
              <Text style={styles.emptySubtitle}>Add your first delivery partner</Text>
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
    padding: theme.spacing.md,
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.border.light,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm + 4,
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
    paddingBottom: theme.spacing.lg - 4,
  },
  boyCard: {
    marginBottom: theme.spacing.sm + 4,
    padding: theme.spacing.md,
  },
  boyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm + 4,
  },
  avatarContainer: {
    width: theme.spacing.xxl,
    height: theme.spacing.xxl,
    borderRadius: theme.spacing.xl,
    backgroundColor: theme.colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background.primary,
  },
  boyInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm + 4,
  },
  boyName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  boyPhone: {
    fontSize: theme.typography.fontSize.sm - 1,
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.lg - 12,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs - 1,
    fontWeight: theme.typography.fontWeight.bold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.fontSize.sm - 1,
    color: theme.colors.text.secondary,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  vehicleText: {
    fontSize: theme.typography.fontSize.sm - 1,
    color: theme.colors.text.secondary,
  },
  currentOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.status.success + '15',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm + 4,
  },
  currentOrderText: {
    fontSize: theme.typography.fontSize.sm - 1,
    color: theme.colors.status.success,
    fontWeight: theme.typography.fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl + theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.base,
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
