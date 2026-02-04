import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import type { Order } from '@/types/order';

interface PendingOrderCardProps {
  order: Order;
  onSchedule?: (orderId: string) => void;
}

export const PendingOrderCard: React.FC<PendingOrderCardProps> = ({ order, onSchedule }) => {
  const firstItem = order.items[0];
  const itemCount = order.items.length;
  
  return (
    <Card>
      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{order.customer.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{order.customer.name}</Text>
      </View>
      <Text style={styles.detail}>
        Ordered: {firstItem?.name} {itemCount > 1 ? `+ ${itemCount - 1} more` : ''}
      </Text>
      <Text style={styles.detail}>Order ID: {order.orderId}</Text>
      <Text style={styles.detail}>Items: {itemCount}</Text>
      <View style={styles.paymentBadge}>
        <Text style={styles.paymentText}>Payment Received ₹{order.paymentAmount.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.scheduleBtn} onPress={() => onSchedule?.(order.orderId)}>
        <Text style={styles.scheduleBtnText}>Schedule Delivery</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: theme.colors.text.secondary, fontSize: 18, fontWeight: '600' },
  name: { color: theme.colors.text.primary, fontSize: theme.typography.fontSize.base, fontWeight: '600', flex: 1 },
  detail: { color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm, marginBottom: 4 },
  paymentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.badge.delivered,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 12,
  },
  paymentText: { color: theme.colors.text.primary, fontSize: theme.typography.fontSize.sm, fontWeight: '500' },
  scheduleBtn: {
    borderWidth: 1,
    borderColor: theme.colors.primary.green,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  scheduleBtnText: { color: theme.colors.primary.green, fontSize: theme.typography.fontSize.base, fontWeight: '500' },
});
