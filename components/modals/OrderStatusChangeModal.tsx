/**
 * Order Status Change Modal
 * Confirmation modal for changing order status
 */

import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text as RNText } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { OrderStatus, ORDER_STATUS_CONFIG } from '@/types/order';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface OrderStatusChangeModalProps {
  visible: boolean;
  currentStatus: OrderStatus;
  newStatus: OrderStatus | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const STATUS_ICONS: { [key: string]: string } = {
  pending: 'time-outline',
  accepted: 'checkmark-circle-outline',
  preparing: 'cube-outline',
  ready: 'checkmark-done-circle-outline',
  out_for_delivery: 'bicycle-outline',
  delivered: 'home-outline',
  cancelled: 'close-circle-outline',
};

const STATUS_MESSAGES: Record<string, string> = {
  'pending-accepted': 'Accept this order and begin processing?',
  'pending-cancelled': 'Cancel this order? This action cannot be undone.',
  'accepted-preparing': 'Start preparing this order?',
  'accepted-cancelled': 'Cancel this order? This action cannot be undone.',
  'preparing-ready': 'Mark order as ready for pickup/delivery?',
  'preparing-cancelled': 'Cancel this order? This action cannot be undone.',
  'ready-out_for_delivery': 'Send order out for delivery?',
  'out_for_delivery-delivered': 'Confirm order has been delivered?',
};

export function OrderStatusChangeModal({
  visible,
  currentStatus,
  newStatus,
  onConfirm,
  onCancel,
  isLoading = false,
}: OrderStatusChangeModalProps) {
  const { colors } = theme;

  if (!newStatus) return null;

  const currentIcon = STATUS_ICONS[currentStatus];
  const newIcon = STATUS_ICONS[newStatus];
  const currentConfig = ORDER_STATUS_CONFIG[currentStatus];
  const newConfig = ORDER_STATUS_CONFIG[newStatus];
  const messageKey = `${currentStatus}-${newStatus}`;
  const message = STATUS_MESSAGES[messageKey] || `Change order status from ${currentConfig.label} to ${newConfig.label}?`;

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm();
  };

  const handleCancel = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <Card style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Status Change</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statusFlow}>
            <View style={styles.statusItem}>
              <View style={[styles.iconContainer, { backgroundColor: currentConfig.color + '20' }]}>
                <Ionicons name={currentIcon as any} size={24} color={currentConfig.color} />
              </View>
              <RNText style={styles.statusLabel}>Current</RNText>
              <RNText style={styles.statusValue}>{currentConfig.label}</RNText>
            </View>

            <View style={styles.arrowContainer}>
              <View style={[styles.arrow, { backgroundColor: colors.primary.green }]}>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.statusItem}>
              <View style={[styles.iconContainer, { backgroundColor: newConfig.color + '20' }]}>
                <Ionicons name={newIcon as any} size={24} color={newConfig.color} />
              </View>
              <RNText style={styles.statusLabel}>New</RNText>
              <RNText style={styles.statusValue}>{newConfig.label}</RNText>
            </View>
          </View>

          <View style={styles.messageContainer}>
            <RNText style={styles.message}>{message}</RNText>
          </View>

          {newStatus === 'cancelled' && (
            <View style={[styles.warningBox, { backgroundColor: colors.status.error + '15' }]}>
              <Ionicons name="warning-outline" size={20} color={colors.status.error} />
              <RNText style={styles.warningText}>
                Cancelling an order may affect your store rating and customer satisfaction.
              </RNText>
            </View>
          )}

          <View style={styles.actions}>
            <Button
              variant="outline"
              onPress={handleCancel}
              style={styles.actionButton}
              disabled={isLoading}
            >
              <RNText>Cancel</RNText>
            </Button>
            <Button
              variant="primary"
              onPress={handleConfirm}
              style={styles.actionButton}
              disabled={isLoading}
            >
              <RNText style={{ color: '#FFF' }}>Confirm Change</RNText>
            </Button>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  statusFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statusItem: {
    alignItems: 'center',
    minWidth: 100,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statusValue: {
    fontWeight: '600',
  },
  arrowContainer: {
    paddingHorizontal: 16,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default OrderStatusChangeModal;
