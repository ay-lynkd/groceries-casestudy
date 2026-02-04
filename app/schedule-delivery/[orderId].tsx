import { Button, Card, Input } from '@/components/primary';
import { Loading } from '@/components/common';
import { DeliveryBoyListItem } from '@/components/features/delivery';
import { useConfetti } from '@/contexts/ConfettiContext';
import { useOrders } from '@/contexts/OrderContext';
import { deliveryBoysData } from '@/mocks/deliveryBoysData';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState, useCallback } from 'react';
import { 
  Alert, 
  Modal, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScheduleDeliveryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { getOrderById, assignDelivery, isLoading: ordersLoading } = useOrders();
  const { showConfetti } = useConfetti();

  const order = useMemo(() => getOrderById(orderId), [getOrderById, orderId]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeliveryBoyId, setSelectedDeliveryBoyId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const filteredDeliveryBoys = useMemo(() => {
    if (!searchQuery.trim()) return deliveryBoysData.filter((b) => b.isAvailable);
    const q = searchQuery.toLowerCase();
    return deliveryBoysData.filter(
      (b) =>
        b.isAvailable &&
        (b.name.toLowerCase().includes(q) || b.phoneNumber.includes(q))
    );
  }, [searchQuery]);

  const handleSelectDeliveryBoy = useCallback((id: string) => {
    setSelectedDeliveryBoyId(id === selectedDeliveryBoyId ? null : id);
  }, [selectedDeliveryBoyId]);

  const handleAddDeliveryBoy = useCallback(() => {
    router.push('/add-delivery-boy' as any);
  }, [router]);

  const handleSubmit = useCallback(() => {
    if (!selectedDeliveryBoyId) {
      Alert.alert('Select Delivery Partner', 'Please select a delivery partner to continue.');
      return;
    }
    setShowConfirmation(true);
  }, [selectedDeliveryBoyId]);

  const confirmAssignment = useCallback(async () => {
    if (!selectedDeliveryBoyId || !order) return;

    setIsAssigning(true);
    
    const deliveryBoy = deliveryBoysData.find(b => b.id === selectedDeliveryBoyId);
    if (!deliveryBoy) {
      setIsAssigning(false);
      Alert.alert('Error', 'Delivery partner not found.');
      return;
    }

    const success = await assignDelivery(
      order.orderId,
      deliveryBoy.id,
      deliveryBoy.name,
      deliveryBoy.phoneNumber
    );

    setIsAssigning(false);
    setShowConfirmation(false);

    if (success) {
      showConfetti();
      Alert.alert(
        'Delivery Assigned',
        `${deliveryBoy.name} has been assigned to deliver this order.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('Error', 'Failed to assign delivery partner. Please try again.');
    }
  }, [selectedDeliveryBoyId, order, assignDelivery, showConfetti, router]);

  const cancelAssignment = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  if (ordersLoading) {
    return (
      <View style={styles.container}>
        <Loading fullScreen />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assign Delivery</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.status.error} />
          <Text style={styles.errorTitle}>Order Not Found</Text>
          <Text style={styles.errorText}>The order you're looking for doesn't exist.</Text>
          <Button variant="primary" onPress={() => router.back()} style={styles.errorButton}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  const packedCount = order.items.filter(item => item.isPacked).length;
  const allPacked = packedCount === order.items.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Delivery</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary Card */}
        <Card style={styles.orderCard}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          
          <View style={styles.customerRow}>
            <View style={styles.avatar}>
              {order.customer.image ? (
                <Image source={{ uri: order.customer.image }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{order.customer.name.charAt(0)}</Text>
              )}
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{order.customer.name}</Text>
              <Text style={styles.customerPhone}>{order.customer.phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>#{order.orderId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Items</Text>
              <Text style={styles.detailValue}>{order.items.length} items</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Packing Status</Text>
              <Text style={[
                styles.detailValue, 
                allPacked ? styles.successText : styles.warningText
              ]}>
                {packedCount}/{order.items.length} packed
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.amountValue}>₹{order.paymentAmount.toFixed(2)}</Text>
            </View>
          </View>

          {!allPacked && (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color={theme.colors.status.warning} />
              <Text style={styles.warningBoxText}>
                Some items are not packed yet. Make sure all items are packed before assigning delivery.
              </Text>
            </View>
          )}
        </Card>

        {/* Delivery Partner Selection */}
        <Text style={styles.sectionTitle}>Select Delivery Partner</Text>
        
        <Input
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          containerStyle={styles.searchInput}
        />

        <Card style={styles.deliveryBoysCard}>
          {filteredDeliveryBoys.length > 0 ? (
            filteredDeliveryBoys.map((boy) => (
              <DeliveryBoyListItem
                key={boy.id}
                deliveryBoy={boy}
                isSelected={selectedDeliveryBoyId === boy.id}
                onSelect={() => handleSelectDeliveryBoy(boy.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>No delivery partners found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Try a different search term' : 'No available delivery partners'}
              </Text>
            </View>
          )}
          
          <Button 
            variant="outline" 
            size="md" 
            onPress={handleAddDeliveryBoy} 
            style={styles.addButton}
          >
            <Ionicons name="add" size={20} color={theme.colors.primary.green} />
            <Text style={styles.addButtonText}> Add New Delivery Partner</Text>
          </Button>
        </Card>
      </ScrollView>

      {/* Footer Action */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          disabled={!selectedDeliveryBoyId || isAssigning}
          style={styles.submitButton}
        >
          {isAssigning ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            'Assign Delivery Partner'
          )}
        </Button>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
        onRequestClose={cancelAssignment}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="bicycle" size={48} color={theme.colors.primary.green} />
            </View>
            
            <Text style={styles.modalTitle}>Confirm Assignment</Text>
            
            {selectedDeliveryBoyId && (
              <View style={styles.selectedPartnerInfo}>
                {(() => {
                  const boy = deliveryBoysData.find(b => b.id === selectedDeliveryBoyId);
                  return boy ? (
                    <>
                      <Text style={styles.partnerName}>{boy.name}</Text>
                      <Text style={styles.partnerPhone}>{boy.phoneNumber}</Text>
                    </>
                  ) : null;
                })()}
              </View>
            )}
            
            <Text style={styles.modalText}>
              Are you sure you want to assign this delivery partner to the order?
            </Text>

            <View style={styles.modalActions}>
              <Button
                variant="outline"
                size="md"
                onPress={cancelAssignment}
                disabled={isAssigning}
                style={styles.modalCancelButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={confirmAssignment}
                disabled={isAssigning}
                style={styles.modalConfirmButton}
              >
                {isAssigning ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  'Confirm'
                )}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import { Image } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background.secondary 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginLeft: -theme.spacing.sm,
  },
  headerTitle: { 
    fontSize: theme.typography.fontSize.xl, 
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 44,
  },
  content: { 
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  errorButton: {
    minWidth: 150,
  },
  orderCard: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.secondary,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  customerPhone: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.md,
  },
  orderDetails: {
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  successText: {
    color: theme.colors.status.success,
  },
  warningText: {
    color: theme.colors.status.warning,
  },
  amountValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.green,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.status.warning + '15',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  warningBoxText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    marginBottom: theme.spacing.md,
  },
  deliveryBoysCard: {
    marginBottom: theme.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  addButton: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: theme.colors.primary.green,
    fontWeight: theme.typography.fontWeight.medium,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  submitButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary.green + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  selectedPartnerInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    width: '100%',
  },
  partnerName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  partnerPhone: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  modalText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
  },
  modalConfirmButton: {
    flex: 2,
  },
});
