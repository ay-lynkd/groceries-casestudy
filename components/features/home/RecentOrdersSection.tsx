import { theme } from '@/theme/appTheme';
import type { RecentOrder } from '@/types/home';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RecentOrderItem } from './RecentOrderItem';

interface RecentOrdersSectionProps {
  orders: RecentOrder[];
  onShowAll?: () => void;
  onOrderPress?: (orderId: string) => void;
  searchQuery?: string;
}

export const RecentOrdersSection: React.FC<RecentOrdersSectionProps> = ({
  orders,
  onShowAll,
  onOrderPress,
  searchQuery,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: RecentOrder }) => (
      <RecentOrderItem
        customerName={item.customerName}
        orderId={item.orderId}
        itemCount={item.itemCount}
        amount={item.amount}
        status={item.status}
        profileImage={item.profileImage}
        onPress={() => onOrderPress?.(item.orderId)}
      />
    ),
    [onOrderPress]
  );

  const keyExtractor = useCallback((item: RecentOrder) => item.orderId, []);

  if (orders.length === 0) {
    const isSearchActive = searchQuery && searchQuery.trim().length > 0;
    return (
      <View
        style={styles.emptyContainer}
        accessibilityLabel={isSearchActive ? 'No search results found' : 'No recent orders'}
        accessibilityRole="text">
        <Ionicons
          name={isSearchActive ? 'search-outline' : 'cube-outline'}
          size={48}
          color={theme.colors.text.light}
          accessibilityLabel="Empty state icon"
        />
        <Text style={styles.emptyTitle}>
          {isSearchActive ? 'No results found' : 'No recent orders'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {isSearchActive
            ? `No orders match "${searchQuery}"`
            : 'New orders will appear here'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityLabel={`${orders.length} recent orders`}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        accessibilityRole="list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});

export default RecentOrdersSection;
