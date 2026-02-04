/**
 * Assign Delivery Boy Modal
 * For assigning delivery partners to orders
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  status: 'available' | 'busy' | 'offline';
  currentLocation?: string;
  avatar?: string;
}

interface AssignDeliveryBoyModalProps {
  visible: boolean;
  onClose: () => void;
  onAssign: (deliveryBoyId: string) => void;
  orderId: string;
}

// Mock data - replace with API call
const mockDeliveryBoys: DeliveryBoy[] = [
  {
    id: '1',
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalDeliveries: 156,
    status: 'available',
    currentLocation: '2.5 km away',
  },
  {
    id: '2',
    name: 'Suresh Patel',
    phone: '+91 98765 43211',
    rating: 4.9,
    totalDeliveries: 203,
    status: 'available',
    currentLocation: '3.2 km away',
  },
  {
    id: '3',
    name: 'Amit Singh',
    phone: '+91 98765 43212',
    rating: 4.6,
    totalDeliveries: 89,
    status: 'busy',
    currentLocation: 'On delivery',
  },
  {
    id: '4',
    name: 'Vikram Rao',
    phone: '+91 98765 43213',
    rating: 4.7,
    totalDeliveries: 134,
    status: 'available',
    currentLocation: '1.8 km away',
  },
  {
    id: '5',
    name: 'Priya Sharma',
    phone: '+91 98765 43214',
    rating: 4.9,
    totalDeliveries: 178,
    status: 'offline',
    currentLocation: 'Offline',
  },
];

export default function AssignDeliveryBoyModal({
  visible,
  onClose,
  onAssign,
  orderId,
}: AssignDeliveryBoyModalProps) {
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [filteredBoys, setFilteredBoys] = useState<DeliveryBoy[]>([]);
  const [selectedBoy, setSelectedBoy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available'>('available');

  useEffect(() => {
    if (visible) {
      loadDeliveryBoys();
    }
  }, [visible]);

  useEffect(() => {
    let filtered = deliveryBoys;

    // Apply status filter
    if (filter === 'available') {
      filtered = filtered.filter((boy) => boy.status === 'available');
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (boy) =>
          boy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          boy.phone.includes(searchQuery)
      );
    }

    setFilteredBoys(filtered);
  }, [deliveryBoys, filter, searchQuery]);

  const loadDeliveryBoys = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDeliveryBoys(mockDeliveryBoys);
      setFilteredBoys(mockDeliveryBoys.filter((b) => b.status === 'available'));
      setLoading(false);
    }, 800);
  };

  const handleSelect = (boyId: string) => {
    setSelectedBoy(boyId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAssign = async () => {
    if (!selectedBoy) return;

    setAssigning(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate API call
    setTimeout(() => {
      setAssigning(false);
      onAssign(selectedBoy);
      onClose();
      setSelectedBoy(null);
    }, 1000);
  };

  const handleClose = () => {
    setSelectedBoy(null);
    setSearchQuery('');
    onClose();
  };

  const renderDeliveryBoy = ({ item }: { item: DeliveryBoy }) => {
    const isSelected = selectedBoy === item.id;
    const isAvailable = item.status === 'available';

    return (
      <TouchableOpacity
        onPress={() => isAvailable && handleSelect(item.id)}
        disabled={!isAvailable}
        style={[styles.boyCard, isSelected && styles.boyCardSelected, !isAvailable && styles.boyCardDisabled]}
        activeOpacity={isAvailable ? 0.7 : 1}
      >
        <View style={styles.boyLeft}>
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person-circle"
              size={theme.spacing.xl + 8}
              color={isAvailable ? theme.colors.status.success : theme.colors.text.light}
            />
            {isSelected && (
              <View style={styles.checkmark}>
                <Ionicons
                  name="checkmark-circle"
                  size={theme.typography.fontSize.lg + 4}
                  color={theme.colors.status.success}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.boyInfo}>
          <View style={styles.boyHeader}>
            <Text
              variant="body"
              fontWeight="semibold"
              color={isAvailable ? theme.colors.text.primary : theme.colors.text.light}
            >
              {item.name}
            </Text>
            <StatusBadge status={item.status} />
          </View>

          <Text variant="caption" color={theme.colors.text.secondary}>
            {item.phone}
          </Text>

          <View style={styles.boyStats}>
            <View style={styles.statItem}>
              <Ionicons
                name="star"
                size={theme.typography.fontSize.xs}
                color={theme.colors.primary.orange}
              />
              <Text variant="caption" fontWeight="semibold">
                {item.rating}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons
                name="bicycle"
                size={theme.typography.fontSize.xs}
                color={theme.colors.text.light}
              />
              <Text variant="caption" color={theme.colors.text.secondary}>
                {item.totalDeliveries} deliveries
              </Text>
            </View>

            {item.currentLocation && (
              <View style={styles.statItem}>
                <Ionicons
                  name="location-outline"
                  size={theme.typography.fontSize.xs}
                  color={theme.colors.status.info}
                />
                <Text
                  variant="caption"
                  color={
                    item.status === 'available'
                      ? theme.colors.status.success
                      : theme.colors.text.light
                  }
                >
                  {item.currentLocation}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const availableCount = deliveryBoys.filter((b) => b.status === 'available').length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text variant="h3" fontWeight="bold">
                Assign Delivery Partner
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                Order #{orderId} • {availableCount} available
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={theme.typography.fontSize.xl}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={theme.typography.fontSize.lg}
              color={theme.colors.text.light}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or phone..."
              placeholderTextColor={theme.colors.text.light}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons
                  name="close-circle"
                  size={theme.typography.fontSize.lg}
                  color={theme.colors.text.light}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'available' && styles.filterTabActive]}
              onPress={() => setFilter('available')}
            >
              <Text
                variant="caption"
                fontWeight={filter === 'available' ? 'semibold' : 'regular'}
                color={filter === 'available' ? theme.colors.status.success : theme.colors.text.secondary}
              >
                Available ({availableCount})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
              onPress={() => setFilter('all')}
            >
              <Text
                variant="caption"
                fontWeight={filter === 'all' ? 'semibold' : 'regular'}
                color={filter === 'all' ? theme.colors.text.primary : theme.colors.text.secondary}
              >
                All ({deliveryBoys.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.status.success} />
              <Text variant="body" color={theme.colors.text.secondary} style={styles.loadingText}>
                Loading delivery partners...
              </Text>
            </View>
          ) : filteredBoys.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="bicycle-outline"
                size={theme.spacing.xxl + 16}
                color={theme.colors.text.light}
              />
              <Text variant="h3" fontWeight="bold" style={styles.emptyTitle}>
                No Partners Found
              </Text>
              <Text variant="body" color={theme.colors.text.secondary} style={{ textAlign: 'center' }}>
                {filter === 'available'
                  ? 'No delivery partners are currently available. Try again later or view all partners.'
                  : 'No delivery partners match your search.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredBoys}
              renderItem={renderDeliveryBoy}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}

          {/* Footer */}
          {!loading && filteredBoys.length > 0 && (
            <View style={styles.footer}>
              <Button
                variant="primary"
                size="lg"
                onPress={handleAssign}
                disabled={!selectedBoy || assigning}
                style={styles.assignButton}
              >
                {assigning ? (
                  <ActivityIndicator color={theme.colors.background.primary} />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark"
                      size={theme.typography.fontSize.lg}
                      color={selectedBoy ? theme.colors.background.primary : theme.colors.text.light}
                      style={{ marginRight: theme.spacing.xs }}
                    />
                    <Text
                      style={{
                        color: selectedBoy
                          ? theme.colors.background.primary
                          : theme.colors.text.light,
                      }}
                    >
                      {selectedBoy ? 'Assign Selected Partner' : 'Select a Partner'}
                    </Text>
                  </>
                )}
              </Button>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

function StatusBadge({ status }: { status: DeliveryBoy['status'] }) {
  const config = {
    available: {
      bg: theme.colors.status.success + '15',
      color: theme.colors.status.success,
      text: 'Available',
    },
    busy: {
      bg: theme.colors.primary.orange + '15',
      color: theme.colors.primary.orange,
      text: 'Busy',
    },
    offline: {
      bg: theme.colors.background.tertiary,
      color: theme.colors.text.light,
      text: 'Offline',
    },
  };

  const { bg, color, text } = config[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <Text variant="caption" fontWeight="semibold" color={color}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '85%',
    paddingBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md - 4,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.tertiary,
  },
  filterTabActive: {
    backgroundColor: theme.colors.status.success + '15',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  boyCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },
  boyCardSelected: {
    borderColor: theme.colors.status.success,
    backgroundColor: theme.colors.status.success + '08',
  },
  boyCardDisabled: {
    opacity: 0.6,
  },
  boyLeft: {
    marginRight: theme.spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  checkmark: {
    position: 'absolute',
    bottom: -theme.spacing.xs,
    right: -theme.spacing.xs,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.full,
  },
  boyInfo: {
    flex: 1,
  },
  boyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs - 2,
    borderRadius: theme.borderRadius.full,
  },
  boyStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs - 2,
  },
  loadingContainer: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
  emptyContainer: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  assignButton: {
    width: '100%',
  },
});
