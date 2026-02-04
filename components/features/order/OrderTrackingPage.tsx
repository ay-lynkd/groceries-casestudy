import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import type { OrderTrackingData } from '@/types/order';

interface OrderTrackingPageProps {
  trackingData: OrderTrackingData;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    price
  );
};

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ trackingData }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.productCard}>
        <View style={styles.productRow}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="cube-outline" size={40} color={theme.colors.text.light} />
          </View>
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{trackingData.productName}</Text>
            <Text style={styles.orderId}>Order ID - {trackingData.orderId}</Text>
          </View>
        </View>
        <View style={styles.paymentSection}>
          <Text style={styles.paymentLabel}>{trackingData.paymentStatus}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.discountedPrice}>{formatPrice(trackingData.discountedPrice)}</Text>
            <Text style={styles.originalPrice}>{formatPrice(trackingData.originalPrice)}</Text>
            <Text style={styles.discountBadge}>{trackingData.discountPercentage}%</Text>
          </View>
        </View>
      </Card>

      <Card>
        {trackingData.statuses.map((status, index) => {
          const isLast = index === trackingData.statuses.length - 1;
          const isCompleted = status.isCompleted;
          return (
            <View key={status.id} style={styles.timelineRow}>
              {!isLast && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: isCompleted ? theme.colors.primary.green : theme.colors.border.light },
                  ]}
                />
              )}
              <View style={styles.timelineIconWrapper}>
                <View
                  style={[
                    styles.timelineIcon,
                    {
                      backgroundColor: isCompleted ? theme.colors.primary.green : theme.colors.background.secondary,
                      borderColor: isCompleted ? theme.colors.primary.green : theme.colors.border.light,
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={20} color="#FFF" />
                  ) : (
                    <View style={styles.dot} />
                  )}
                </View>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.statusTitle}>{status.title}</Text>
                <Text style={styles.statusDate}>{status.date}</Text>
                {status.deliveryId && (
                  <Text style={styles.statusMeta}>{status.deliveryId}</Text>
                )}
                <Text style={styles.statusDesc}>{status.description}</Text>
                {status.timestamp && (
                  <Text style={styles.statusTime}>{status.timestamp}</Text>
                )}
              </View>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.secondary },
  content: { padding: 16, paddingBottom: 32 },
  productCard: { marginBottom: 16 },
  productRow: { flexDirection: 'row', marginBottom: 16 },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productDetails: { flex: 1 },
  productName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderId: { color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm },
  paymentSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: 16,
  },
  paymentLabel: { color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  discountedPrice: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
  },
  originalPrice: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSize.sm,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    color: theme.colors.primary.green,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  timelineRow: { flexDirection: 'row', paddingBottom: 24, position: 'relative' },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 40,
    bottom: 0,
    width: 2,
  },
  timelineIconWrapper: { marginRight: 16, zIndex: 1 },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border.medium,
  },
  timelineContent: { flex: 1 },
  statusTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDate: { color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm, marginBottom: 4 },
  statusMeta: { color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm, marginBottom: 4 },
  statusDesc: { color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm, marginBottom: 4 },
  statusTime: { color: theme.colors.text.light, fontSize: theme.typography.fontSize.xs },
});
