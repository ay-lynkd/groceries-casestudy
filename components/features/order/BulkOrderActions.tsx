/**
 * Bulk Order Actions Component
 * Allows selecting and performing actions on multiple orders
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/appTheme';
import { Button } from '@/components/primary';
import type { Order, OrderStatus } from '@/types/order';
import { useOrders } from '@/contexts/OrderContext';

interface BulkOrderActionsProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectionChange: (selected: string[]) => void;
  onActionComplete: () => void;
}

export const BulkOrderActions: React.FC<BulkOrderActionsProps> = ({
  orders,
  selectedOrders,
  onSelectionChange,
  onActionComplete,
}) => {
  const { acceptOrder, declineOrder, updateOrderStatus } = useOrders();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const isAllSelected = selectedOrders.length === orders.length && orders.length > 0;

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(orders.map(o => o.orderId));
    }
  }, [isAllSelected, orders, onSelectionChange]);

  const handleBulkAccept = useCallback(async () => {
    if (selectedOrders.length === 0) return;
    
    Alert.alert(
      'Accept Orders',
      `Accept ${selectedOrders.length} selected orders?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            setIsProcessing(true);
            for (const orderId of selectedOrders) {
              await acceptOrder(orderId);
            }
            setIsProcessing(false);
            onSelectionChange([]);
            onActionComplete();
          },
        },
      ]
    );
  }, [selectedOrders, acceptOrder, onSelectionChange, onActionComplete]);

  const handleBulkStatusUpdate = useCallback(async (newStatus: OrderStatus) => {
    if (selectedOrders.length === 0) return;
    
    const statusLabels: Record<string, string> = {
      'preparing': 'Start Preparing',
      'ready': 'Mark Ready',
      'assigned': 'Assign Delivery',
    };
    
    Alert.alert(
      statusLabels[newStatus] || 'Update Status',
      `Update ${selectedOrders.length} orders to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            setIsProcessing(true);
            for (const orderId of selectedOrders) {
              await updateOrderStatus(orderId, newStatus);
            }
            setIsProcessing(false);
            onSelectionChange([]);
            onActionComplete();
          },
        },
      ]
    );
  }, [selectedOrders, updateOrderStatus, onSelectionChange, onActionComplete]);

  const handleBulkPrint = useCallback(() => {
    Alert.alert(
      'Print Orders',
      `Generate invoice for ${selectedOrders.length} orders?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Print',
          onPress: () => {
            console.log('Printing orders:', selectedOrders);
            onSelectionChange([]);
            onActionComplete();
          },
        },
      ]
    );
  }, [selectedOrders, onSelectionChange, onActionComplete]);

  if (selectedOrders.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.selectAllButton} onPress={toggleSelectAll}>
          <Ionicons 
            name={isAllSelected ? 'checkbox' : 'square-outline'} 
            size={24} 
            color={theme.colors.primary.green} 
          />
          <Text style={styles.selectAllText}>
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <View style={styles.bulkContainer}>
        <View style={styles.selectionInfo}>
          <TouchableOpacity onPress={() => onSelectionChange([])}>
            <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.selectionCount}>
            {selectedOrders.length} selected
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowActionMenu(true)}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.primary.green} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryAction]}
            onPress={handleBulkAccept}
            disabled={isProcessing}
          >
            <Text style={styles.primaryActionText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Menu Modal */}
      <Modal
        visible={showActionMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.actionMenu}>
            <Text style={styles.menuTitle}>Bulk Actions</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { handleBulkStatusUpdate('preparing'); setShowActionMenu(false); }}
            >
              <Ionicons name="restaurant-outline" size={20} color={theme.colors.text.primary} />
              <Text style={styles.menuItemText}>Start Preparing</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { handleBulkStatusUpdate('ready'); setShowActionMenu(false); }}
            >
              <Ionicons name="checkmark-done-outline" size={20} color={theme.colors.text.primary} />
              <Text style={styles.menuItemText}>Mark Ready</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { handleBulkPrint(); setShowActionMenu(false); }}
            >
              <Ionicons name="print-outline" size={20} color={theme.colors.text.primary} />
              <Text style={styles.menuItemText}>Print Invoices</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity 
              style={[styles.menuItem, styles.destructiveItem]}
              onPress={() => { onSelectionChange([]); setShowActionMenu(false); }}
            >
              <Ionicons name="close-circle-outline" size={20} color={theme.colors.status.error} />
              <Text style={[styles.menuItemText, styles.destructiveText]}>Cancel Selection</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  selectAllText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  bulkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  selectionCount: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryAction: {
    backgroundColor: theme.colors.primary.green,
    paddingHorizontal: theme.spacing.lg,
    width: 'auto',
  },
  primaryActionText: {
    color: '#FFF',
    fontWeight: theme.typography.fontWeight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  actionMenu: {
    backgroundColor: theme.colors.background.card,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  menuTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.sm,
  },
  destructiveItem: {
    marginTop: theme.spacing.sm,
  },
  destructiveText: {
    color: theme.colors.status.error,
  },
});

export default BulkOrderActions;
