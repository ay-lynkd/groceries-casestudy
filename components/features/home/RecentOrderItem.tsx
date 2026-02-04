import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { ORDER_STATUS_CONFIG, OrderStatus } from '@/types/order';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecentOrderItemProps {
  customerName: string;
  orderId: string;
  itemCount: number;
  amount: string;
  status: 'delivered' | 'pending' | 'cancelled';
  profileImage?: string;
  onPress?: () => void;
}

const getStatusStyles = (status: 'delivered' | 'pending' | 'cancelled') => {
  // Map legacy status to new status config
  const statusMap: Record<string, OrderStatus> = {
    delivered: 'delivered',
    pending: 'new',
    cancelled: 'cancelled',
  };

  const config = ORDER_STATUS_CONFIG[statusMap[status]];

  return {
    backgroundColor: config?.backgroundColor || '#E8F4FD',
    color: config?.color || '#1976D2',
    icon: config?.icon || 'time',
    label: config?.label || status,
  };
};

export const RecentOrderItem: React.FC<RecentOrderItemProps> = ({
  customerName,
  orderId,
  itemCount,
  amount,
  status,
  profileImage,
  onPress,
}) => {
  const statusStyles = getStatusStyles(status);

  const handlePress = useCallback(() => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  }, [onPress]);

  // Get initials for avatar placeholder
  const initials = customerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={!onPress}
      accessibilityLabel={`Order from ${customerName}, ${statusStyles.label}, ${amount}`}
      accessibilityHint={onPress ? 'Double tap to view order details' : undefined}
      accessibilityRole={onPress ? 'button' : 'text'}
      style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.row}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
              accessibilityLabel={`${customerName} profile picture`}
            />
          ) : (
            <View
              style={[styles.avatar, styles.avatarPlaceholder]}
              accessibilityLabel={`${customerName} initials: ${initials}`}
              accessibilityRole="image">
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={1}>
              {customerName}
            </Text>
            <Text style={styles.orderId}>Order #{orderId}</Text>
            <View style={styles.itemRow}>
              <Text style={styles.itemCount}>{itemCount} items</Text>
            </View>
          </View>
          <View style={styles.right}>
            <View
              style={[styles.statusBadge, { backgroundColor: statusStyles.backgroundColor }]}>
              <Text style={[styles.statusText, { color: statusStyles.color }]}>
                {statusStyles.label}
              </Text>
            </View>
            <Text style={styles.amount}>{amount}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
  },
  details: {
    flex: 1,
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  orderId: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  right: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 34,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amount: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RecentOrderItem;
