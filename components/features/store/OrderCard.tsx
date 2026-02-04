import { Button, Card } from '@/components/primary';
import { useOrders } from '@/contexts/OrderContext';
import type { Order, OrderStatus } from '@/types/order';
import { ORDER_STATUS_CONFIG, getAvailableActions } from '@/types/order';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OrderCardProps {
  order: Order;
  showItems?: boolean;
}

export const OrderCard = React.memo(({ order, showItems = true }: OrderCardProps) => {
  const router = useRouter();
  const { 
    acceptOrder, 
    declineOrder, 
    startPreparing, 
    markReady, 
    markDelivered,
    updateItemPackedStatus,
    isLoading 
  } = useOrders();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const availableActions = useMemo(() => getAvailableActions(order.status), [order.status]);

  const packedCount = useMemo(() => 
    order.items.filter(item => item.isPacked).length,
    [order.items]
  );
  
  const allItemsPacked = packedCount === order.items.length;
  const packedProgress = order.items.length > 0 ? (packedCount / order.items.length) * 100 : 0;

  const handleAccept = useCallback(async () => {
    setIsProcessing(true);
    const success = await acceptOrder(order.orderId);
    setIsProcessing(false);
    if (!success) {
      Alert.alert('Error', 'Failed to accept order. Please try again.');
    }
  }, [acceptOrder, order.orderId]);

  const handleDecline = useCallback(() => {
    Alert.prompt(
      'Decline Order',
      'Please provide a reason for declining this order:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Decline', 
          style: 'destructive',
          onPress: async (reason: string | undefined) => {
            if (reason) {
              setIsProcessing(true);
              await declineOrder(order.orderId, reason);
              setIsProcessing(false);
            }
          }
        },
      ],
      'plain-text'
    );
  }, [declineOrder, order.orderId]);

  const handleStartPreparing = useCallback(async () => {
    setIsProcessing(true);
    const success = await startPreparing(order.orderId);
    setIsProcessing(false);
    if (!success) {
      Alert.alert('Error', 'Failed to start preparing. Please try again.');
    }
  }, [startPreparing, order.orderId]);

  const handleMarkReady = useCallback(async () => {
    if (!allItemsPacked) {
      Alert.alert(
        'Items Not Packed',
        `Only ${packedCount} of ${order.items.length} items are packed. Are you sure?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Mark Ready', 
            style: 'default',
            onPress: async () => {
              setIsProcessing(true);
              await markReady(order.orderId);
              setIsProcessing(false);
            }
          },
        ]
      );
      return;
    }
    
    setIsProcessing(true);
    const success = await markReady(order.orderId);
    setIsProcessing(false);
    if (!success) {
      Alert.alert('Error', 'Failed to mark ready. Please try again.');
    }
  }, [markReady, order.orderId, allItemsPacked, packedCount, order.items.length]);

  const handleMarkDelivered = useCallback(async () => {
    Alert.alert(
      'Confirm Delivery',
      'Are you sure you want to mark this order as delivered?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Delivered', 
          style: 'default',
          onPress: async () => {
            setIsProcessing(true);
            await markDelivered(order.orderId);
            setIsProcessing(false);
          }
        },
      ]
    );
  }, [markDelivered, order.orderId]);

  const handleScheduleDelivery = useCallback(() => {
    router.push(`/schedule-delivery/${order.orderId}` as any);
  }, [router, order.orderId]);

  const handleTrackOrder = useCallback(() => {
    router.push(`/orders/${order.orderId}/tracking` as any);
  }, [router, order.orderId]);

  const handleTogglePacked = useCallback((itemId: string, currentStatus: boolean) => {
    updateItemPackedStatus(order.orderId, itemId, !currentStatus);
  }, [updateItemPackedStatus, order.orderId]);

  const getPrimaryAction = () => {
    const actions: Record<OrderStatus, { label: string; handler: () => void; variant: 'primary' | 'secondary' } | null> = {
      'new': { label: 'Accept Order', handler: handleAccept, variant: 'primary' },
      'accepted': { label: 'Start Preparing', handler: handleStartPreparing, variant: 'primary' },
      'preparing': { label: 'Mark Ready', handler: handleMarkReady, variant: 'primary' },
      'ready': { label: 'Assign Delivery', handler: handleScheduleDelivery, variant: 'primary' },
      'assigned': { label: 'Out for Delivery', handler: handleMarkDelivered, variant: 'secondary' },
      'out_for_delivery': { label: 'Mark Delivered', handler: handleMarkDelivered, variant: 'primary' },
      'delivered': { label: 'Track Order', handler: handleTrackOrder, variant: 'secondary' },
      'cancelled': null,
      'declined': null,
    };
    return actions[order.status];
  };

  const getSecondaryAction = () => {
    if (order.status === 'new') {
      return { label: 'Decline', handler: handleDecline };
    }
    if (['accepted', 'preparing', 'ready'].includes(order.status)) {
      return { label: 'Cancel Order', handler: () => {} }; // TODO: Implement cancel
    }
    return null;
  };

  const primaryAction = getPrimaryAction();
  const secondaryAction = getSecondaryAction();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <Card style={styles.cardContainer}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.customerSection}>
          <Image 
            source={{ uri: order.customer.image || 'https://i.pravatar.cc/150' }} 
            style={styles.customerImage}
          />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{order.customer.name}</Text>
            <Text style={styles.orderMeta}>#{order.orderId} • {formatDate(order.createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Payment Info */}
      <View style={styles.paymentRow}>
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amount}>₹{order.paymentAmount.toFixed(2)}</Text>
        </View>
        <View style={[styles.paymentBadge, { 
          backgroundColor: order.paymentStatus === 'received' ? '#E8F5E9' : '#FFF3E0'
        }]}>
          <Text style={[styles.paymentText, { 
            color: order.paymentStatus === 'received' ? '#4CAF50' : '#FF9800'
          }]}>
            {order.paymentStatus === 'received' ? 'Paid' : 'Pending'}
          </Text>
        </View>
      </View>

      {/* Items Section */}
      {showItems && (
        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>Order Items ({order.items.length})</Text>
            {(order.status === 'accepted' || order.status === 'preparing') && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${packedProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{packedCount}/{order.items.length} packed</Text>
              </View>
            )}
          </View>

          <ScrollView 
            style={styles.itemsList} 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {order.items.map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                {(order.status === 'accepted' || order.status === 'preparing') ? (
                  <TouchableOpacity 
                    style={[styles.checkbox, item.isPacked && styles.checkboxChecked]}
                    onPress={() => handleTogglePacked(item.id, item.isPacked)}
                  >
                    {item.isPacked && <Ionicons name="checkmark" size={14} color="#FFF" />}
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.checkbox, item.isPacked && styles.checkboxChecked]}>
                    {item.isPacked && <Ionicons name="checkmark" size={14} color="#FFF" />}
                  </View>
                )}
                <View style={styles.itemImagePlaceholder}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                  ) : (
                    <Ionicons name="cube-outline" size={16} color={theme.colors.text.light} />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.totalPrice}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Delivery Info */}
      {order.deliveryAssignment && (
        <View style={styles.deliverySection}>
          <Ionicons name="bicycle-outline" size={16} color={theme.colors.text.secondary} />
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryLabel}>Assigned to</Text>
            <Text style={styles.deliveryName}>{order.deliveryAssignment.deliveryBoyName}</Text>
          </View>
          {order.deliveryAssignment.estimatedDeliveryTime && (
            <Text style={styles.etaText}>
              ETA: {new Date(order.deliveryAssignment.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {secondaryAction && (
          <Button
            variant="outline"
            size="md"
            onPress={secondaryAction.handler}
            disabled={isProcessing || isLoading}
            style={styles.secondaryBtn}
          >
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button
            variant={primaryAction.variant}
            size="md"
            active={primaryAction.variant === 'primary'}
            onPress={primaryAction.handler}
            disabled={isProcessing || isLoading}
            style={!secondaryAction ? StyleSheet.flatten([styles.primaryBtn, styles.fullWidthBtn]) : styles.primaryBtn}
          >
            {isProcessing ? 'Processing...' : primaryAction.label}
          </Button>
        )}
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  customerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: theme.spacing.md,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  orderMeta: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border.light,
    marginBottom: theme.spacing.md,
  },
  amountSection: {},
  amountLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  amount: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  paymentBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  paymentText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  itemsSection: {
    marginBottom: theme.spacing.md,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  itemsTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary.green,
    borderRadius: 2,
  },
  progressText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  itemsList: {
    maxHeight: 200,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary.green,
    borderColor: theme.colors.primary.green,
  },
  itemImagePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  itemQuantity: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  deliverySection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  deliveryLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  deliveryName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  etaText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.green,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  primaryBtn: {
    flex: 1,
  },
  secondaryBtn: {
    flex: 1,
  },
  fullWidthBtn: {
    flex: 1,
  },
});

export default OrderCard;
