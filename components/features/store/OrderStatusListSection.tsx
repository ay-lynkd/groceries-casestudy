import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OrderStatusListItem } from './OrderStatusListItem';
import type { OrderStatusItem } from '@/types/order';

interface OrderStatusListSectionProps {
  orders: OrderStatusItem[];
  onTrackStatus?: (orderId: string) => void;
}

export const OrderStatusListSection: React.FC<OrderStatusListSectionProps> = ({ orders, onTrackStatus }) => {
  return (
    <View style={styles.container}>
      {orders.map((order) => (
        <OrderStatusListItem
          key={order.id}
          productName={order.productName}
          orderId={order.orderId}
          quantity={order.quantity}
          deliveryRecipient={order.deliveryRecipient}
          onTrackStatus={() => onTrackStatus?.(order.orderId)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12, marginBottom: 16 },
});
