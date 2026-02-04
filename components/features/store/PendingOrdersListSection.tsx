import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PendingOrderCard } from './PendingOrderCard';
import type { Order } from '@/types/order';

interface PendingOrdersListSectionProps {
  orders: Order[];
  onSchedule?: (orderId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const PendingOrdersListSection: React.FC<PendingOrdersListSectionProps> = ({ orders, onSchedule, onRefresh, isRefreshing }) => {
  return (
    <View style={styles.container}>
      {orders.map((order) => (
        <PendingOrderCard key={order.id} order={order} onSchedule={onSchedule} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12, marginBottom: 16 },
});
