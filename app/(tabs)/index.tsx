import { HomeHeader, Text } from '@/components/common';
import {
  GraphSection,
  PeriodFilter,
  RecentOrdersSection,
  SummaryCard,
} from '@/components/features/home';
import { PERIODS } from '@/constants';
import { useOrders } from '@/contexts/OrderContext';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Keyboard,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Graph data generator
const generateGraphData = (period: string) => {
  const baseValues = {
    today: [120, 150, 180, 220, 238, 190, 160],
    yesterday: [100, 130, 160, 180, 200, 170, 140],
    week: [800, 950, 1100, 1250, 1400, 1200, 1000],
    month: [3500, 4200, 4800, 5100, 5500, 5200, 4800],
  };

  const values = baseValues[period as keyof typeof baseValues] || baseValues.today;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return values.map((value, index) => ({
    day: days[index],
    date: 10 + index,
    value,
  }));
};

// Summary card data generator
const generateSummaryData = (orders: any[], period: string) => {
  const multiplier = period === 'today' ? 1 : period === 'week' ? 7 : 30;

  const totalOrders = orders.length * multiplier;
  const delivered = orders.filter((o) => o.status === 'delivered').length * multiplier;
  const pending = orders.filter((o) => ['new', 'accepted', 'preparing'].includes(o.status)).length;
  const revenue = orders.reduce((sum, o) => sum + (o.paymentAmount || 0), 0) * multiplier;

  const changePercent = Math.round((Math.random() - 0.3) * 10 * 10) / 10;
  const isPositive = changePercent >= 0;

  return [
    {
      id: 1,
      iconType: 'shopping-cart' as const,
      iconColor: theme.colors.primary.purple,
      iconBackgroundColor: theme.colors.badge.delivered,
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: {
        percentage: Math.abs(changePercent),
        isPositive,
        label: isPositive ? 'Up from last period' : 'Down from last period',
      },
    },
    {
      id: 2,
      iconType: 'wallet' as const,
      iconColor: theme.colors.primary.darkPurple,
      iconBackgroundColor: theme.colors.badge.delivered,
      title: 'Revenue',
      value: `₹${(revenue / 1000).toFixed(1)}K`,
      change: {
        percentage: Math.abs(changePercent + 1.2),
        isPositive: true,
        label: 'Up from last period',
      },
      variant: 'highlighted' as const,
    },
    {
      id: 3,
      iconType: 'person' as const,
      iconColor: theme.colors.primary.orange,
      iconBackgroundColor: theme.colors.badge.pending,
      title: 'Pending',
      value: pending.toString(),
      change: {
        percentage: 2.1,
        isPositive: false,
        label: 'Needs attention',
      },
    },
    {
      id: 4,
      iconType: 'delivery' as const,
      iconColor: theme.colors.status.info,
      iconBackgroundColor: theme.colors.badge.delivered,
      title: 'Delivered',
      value: delivered.toString(),
      change: {
        percentage: 5.4,
        isPositive: true,
        label: 'On track',
      },
    },
  ];
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, isLoading, refreshOrders, getPendingOrders } = useOrders();

  const [selectedPeriod, setSelectedPeriod] = useState<(typeof PERIODS)[number]>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Calculate notification count from pending orders
  const notificationCount = useMemo(() => getPendingOrders().length, [getPendingOrders]);

  // Generate dynamic data based on orders and period
  const summaryCards = useMemo(
    () => generateSummaryData(orders, selectedPeriod),
    [orders, selectedPeriod]
  );

  const graphData = useMemo(() => generateGraphData(selectedPeriod), [selectedPeriod]);

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const query = searchQuery.toLowerCase();
    return orders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query))
    );
  }, [orders, searchQuery]);

  // Recent orders (last 5)
  const recentOrders = useMemo(() => {
    const sourceOrders = searchQuery.trim() ? filteredOrders : orders;
    return [...sourceOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((order) => ({
        id: parseInt(order.id.replace('order_', '')) || 1,
        customerName: order.customer.name,
        orderId: order.orderId,
        itemCount: order.items.length,
        amount: `₹${order.paymentAmount.toFixed(2)}`,
        status:
          order.status === 'delivered'
            ? 'delivered'
            : order.status === 'cancelled'
              ? 'cancelled'
              : ('pending' as 'delivered' | 'cancelled' | 'pending'),
        profileImage: order.customer.image,
      }));
  }, [orders, filteredOrders, searchQuery]);

  // Pending orders count for badge
  const pendingCount = useMemo(() => getPendingOrders().length, [getPendingOrders]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  }, [refreshOrders]);

  const handleOrderPress = useCallback(
    (orderId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/orders/${orderId}/tracking`);
    },
    [router]
  );

  const handleViewAllOrders = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/store');
  }, [router]);

  const handleNotificationPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/notifications/push-center');
  }, [router]);

  const handleSummaryCardPress = useCallback(
    (cardId: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Navigate to relevant section based on card
      switch (cardId) {
        case 1: // Total Orders
        case 3: // Pending
          router.push('/store');
          break;
        case 2: // Revenue
          router.push('/explore');
          break;
        case 4: // Delivered
          router.push({ pathname: '/store', params: { filter: 'delivered' } });
          break;
      }
    },
    [router]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HomeHeader
        onSearch={handleSearch}
        searchValue={searchQuery}
        notificationCount={notificationCount}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary.green]}
            tintColor={theme.colors.primary.green}
            accessibilityLabel="Pull to refresh orders"
          />
        }>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickActionButton
            icon="add-circle"
            label="New Product"
            onPress={() => router.push('/products/create')}
            color={theme.colors.primary.green}
            accessibilityLabel="Create new product"
            accessibilityHint="Opens product creation wizard"
          />
          <QuickActionButton
            icon="cube"
            label="Inventory"
            onPress={() => router.push('/store')}
            color={theme.colors.status.info}
            accessibilityLabel="View inventory"
            accessibilityHint="Opens store inventory page"
          />
          <QuickActionButton
            icon="bicycle"
            label="Deliveries"
            count={pendingCount}
            onPress={() => router.push('/store')}
            color={theme.colors.primary.orange}
            accessibilityLabel="View deliveries"
            accessibilityHint={`Opens deliveries page. ${pendingCount} pending deliveries`}
          />
          <QuickActionButton
            icon="analytics"
            label="Reports"
            onPress={() => router.push('/analytics/dashboard')}
            color={theme.colors.primary.purple}
            accessibilityLabel="View reports"
            accessibilityHint="Opens analytics dashboard"
          />
        </View>

        {/* Period Filter */}
        <PeriodFilter
          periods={[...PERIODS]}
          selectedPeriod={selectedPeriod}
          onPeriodChange={(p) => setSelectedPeriod(p as (typeof PERIODS)[number])}
        />

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          {summaryCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.summaryCardWrapper}
              onPress={() => handleSummaryCardPress(card.id)}
              activeOpacity={0.8}
              accessibilityLabel={`${card.title}: ${card.value}`}
              accessibilityHint={`${card.change.label}. Double tap to view details`}
              accessibilityRole="button">
              <SummaryCard {...card} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders Graph */}
        <GraphSection
          title="Orders Overview"
          data={graphData}
          tooltipLabel="Orders"
          accessibilityLabel="Orders overview chart showing daily order counts"
        />

        {/* Recent Orders Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery.trim() ? 'Search Results' : 'Recent Orders'}
          </Text>
          <TouchableOpacity
            onPress={handleViewAllOrders}
            accessibilityLabel="View all orders"
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders List */}
        <RecentOrdersSection
          orders={recentOrders}
          onOrderPress={handleOrderPress}
          searchQuery={searchQuery}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

// Quick Action Button Component
interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
  count?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

function QuickActionButton({
  icon,
  label,
  onPress,
  color,
  count,
  accessibilityLabel,
  accessibilityHint,
}: QuickActionButtonProps) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button">
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={theme.typography.fontSize['2xl']} color={color} />
        {count !== undefined && count > 0 && (
          <View style={styles.quickActionBadge} accessibilityLabel={`${count} pending`}>
            <Text style={styles.quickActionBadgeText}>{count > 9 ? '9+' : count}</Text>
          </View>
        )}
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: theme.spacing.xxl + 8,
    height: theme.spacing.xxl + 8,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
    position: 'relative',
  },
  quickActionBadge: {
    position: 'absolute',
    top: -theme.spacing.xs,
    right: -theme.spacing.xs,
    minWidth: theme.spacing.lg - 4,
    height: theme.spacing.lg - 4,
    borderRadius: theme.spacing.lg - 14,
    backgroundColor: theme.colors.status.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background.secondary,
  },
  quickActionBadgeText: {
    fontSize: theme.typography.fontSize.xs - 2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background.primary,
  },
  quickActionLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  summaryCardWrapper: {
    width: '50%',
    padding: theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  viewAllLink: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.green,
    fontWeight: theme.typography.fontWeight.medium,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
});
