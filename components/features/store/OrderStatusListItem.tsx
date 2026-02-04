import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '@/components/primary';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/appTheme';

interface OrderStatusListItemProps {
  productName: string;
  orderId: string;
  quantity: string;
  deliveryRecipient: string;
  onTrackStatus?: () => void;
}

export const OrderStatusListItem: React.FC<OrderStatusListItemProps> = ({
  productName,
  orderId,
  quantity,
  deliveryRecipient,
  onTrackStatus,
}) => {
  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="cube-outline" size={32} color={theme.colors.text.light} />
        </View>
        <View style={styles.details}>
          <Text style={styles.productName}>{productName}</Text>
          <Text style={styles.meta}>Order ID : {orderId} | {quantity}</Text>
          <Text style={styles.meta}>Delivering to : {deliveryRecipient}</Text>
        </View>
        <TouchableOpacity style={styles.trackBtn} onPress={onTrackStatus}>
          <Text style={styles.trackBtnText}>Track Status</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: { flex: 1 },
  productName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: { color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm, marginBottom: 2 },
  trackBtn: {
    borderWidth: 1,
    borderColor: theme.colors.primary.green,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  trackBtnText: { color: theme.colors.primary.green, fontSize: theme.typography.fontSize.sm, fontWeight: '500' },
});
