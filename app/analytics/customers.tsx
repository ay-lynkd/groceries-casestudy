/**
 * Customer Insights Screen
 * Customer behavior analysis and segmentation
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/common';
import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';

const { colors, spacing, borderRadius, typography } = theme;
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency, formatNumber } from '@/utils/formatters';

type Segment = 'all' | 'new' | 'regular' | 'vip' | 'inactive';

interface CustomerInsight {
  id: string;
  name: string;
  segment: string;
  orders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrder: string;
  frequency: number;
  retention: number;
}

const SEGMENTS: { id: Segment; label: string; color: string; icon: string }[] = [
  { id: 'all', label: 'All Customers', color: colors.primary.green, icon: 'people-outline' },
  { id: 'new', label: 'New', color: colors.status.info, icon: 'person-add-outline' },
  { id: 'regular', label: 'Regular', color: colors.status.warning, icon: 'refresh-outline' },
  { id: 'vip', label: 'VIP', color: colors.primary.purple, icon: 'diamond-outline' },
  { id: 'inactive', label: 'Inactive', color: colors.text.light, icon: 'time-outline' },
];

const MOCK_CUSTOMERS: CustomerInsight[] = [
  { id: '1', name: 'Rahul Sharma', segment: 'vip', orders: 24, totalSpent: 45600, avgOrderValue: 1900, lastOrder: '2 days ago', frequency: 4.2, retention: 95 },
  { id: '2', name: 'Priya Patel', segment: 'regular', orders: 18, totalSpent: 32400, avgOrderValue: 1800, lastOrder: '5 days ago', frequency: 3.5, retention: 88 },
  { id: '3', name: 'Amit Kumar', segment: 'vip', orders: 32, totalSpent: 67800, avgOrderValue: 2118, lastOrder: '1 day ago', frequency: 5.1, retention: 98 },
  { id: '4', name: 'Sneha Gupta', segment: 'regular', orders: 15, totalSpent: 28500, avgOrderValue: 1900, lastOrder: '1 week ago', frequency: 2.8, retention: 82 },
  { id: '5', name: 'Vikram Singh', segment: 'new', orders: 3, totalSpent: 4200, avgOrderValue: 1400, lastOrder: '3 days ago', frequency: 1.0, retention: 45 },
  { id: '6', name: 'Neha Verma', segment: 'inactive', orders: 8, totalSpent: 15600, avgOrderValue: 1950, lastOrder: '2 months ago', frequency: 0.5, retention: 25 },
];

export default function CustomerAnalyticsScreen() {
  
  const [activeSegment, setActiveSegment] = useState<Segment>('all');

  const filteredCustomers = activeSegment === 'all' 
    ? MOCK_CUSTOMERS 
    : MOCK_CUSTOMERS.filter(c => c.segment === activeSegment);

  const metrics = {
    total: MOCK_CUSTOMERS.length,
    new: MOCK_CUSTOMERS.filter(c => c.segment === 'new').length,
    regular: MOCK_CUSTOMERS.filter(c => c.segment === 'regular').length,
    vip: MOCK_CUSTOMERS.filter(c => c.segment === 'vip').length,
    inactive: MOCK_CUSTOMERS.filter(c => c.segment === 'inactive').length,
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Customer Insights' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Customer Overview */}
        <View style={styles.overviewContainer}>
          <Card style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{metrics.total}</Text>
            <Text style={styles.overviewLabel}>Total Customers</Text>
          </Card>
          <Card style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{formatCurrency(2456)}</Text>
            <Text style={styles.overviewLabel}>Avg LTV</Text>
          </Card>
        </View>

        {/* Segment Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Segments</Text>
          <Card style={styles.segmentCard}>
            <View style={styles.segmentRow}>
              <View style={styles.segmentItem}>
                <View style={[styles.segmentIcon, { backgroundColor: '#2196F320' }]}>
                  <Ionicons name="person-add-outline" size={20} color={colors.status.info} />
                </View>
                <Text style={styles.segmentCount}>{metrics.new}</Text>
                <Text style={styles.segmentName}>New</Text>
              </View>
              <View style={styles.segmentItem}>
                <View style={[styles.segmentIcon, { backgroundColor: '#FF980020' }]}>
                  <Ionicons name="refresh-outline" size={20} color={colors.status.warning} />
                </View>
                <Text style={styles.segmentCount}>{metrics.regular}</Text>
                <Text style={styles.segmentName}>Regular</Text>
              </View>
              <View style={styles.segmentItem}>
                <View style={[styles.segmentIcon, { backgroundColor: '#9C27B020' }]}>
                  <Ionicons name="diamond-outline" size={20} color={colors.primary.purple} />
                </View>
                <Text style={styles.segmentCount}>{metrics.vip}</Text>
                <Text style={styles.segmentName}>VIP</Text>
              </View>
              <View style={styles.segmentItem}>
                <View style={[styles.segmentIcon, { backgroundColor: '#9E9E9E20' }]}>
                  <Ionicons name="time-outline" size={20} color={colors.text.light} />
                </View>
                <Text style={styles.segmentCount}>{metrics.inactive}</Text>
                <Text style={styles.segmentName}>Inactive</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <Card style={styles.metricCard}>
              <Ionicons name="cart-outline" size={24} color={colors.primary.green} />
              <Text style={styles.metricValue}>3.2</Text>
              <Text style={styles.metricLabel}>Avg Orders/Customer</Text>
            </Card>
            <Card style={styles.metricCard}>
              <Ionicons name="cash-outline" size={24} color={colors.status.info} />
              <Text style={styles.metricValue}>{formatCurrency(1850)}</Text>
              <Text style={styles.metricLabel}>Avg Order Value</Text>
            </Card>
            <Card style={styles.metricCard}>
              <Ionicons name="repeat-outline" size={24} color={colors.status.warning} />
              <Text style={styles.metricValue}>68%</Text>
              <Text style={styles.metricLabel}>Repeat Rate</Text>
            </Card>
            <Card style={styles.metricCard}>
              <Ionicons name="heart-outline" size={24} color={colors.status.error} />
              <Text style={styles.metricValue}>4.7</Text>
              <Text style={styles.metricLabel}>Satisfaction</Text>
            </Card>
          </View>
        </View>

        {/* Behavior Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Behavior Insights</Text>
          <Card style={styles.insightCard}>
            <View style={styles.insightRow}>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Peak Order Time</Text>
                <Text style={styles.insightValue}>6 PM - 9 PM</Text>
              </View>
              <View style={styles.insightDivider} />
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Avg Response</Text>
                <Text style={styles.insightValue}>12 mins</Text>
              </View>
            </View>
            <View style={[styles.insightRow, { marginTop: 16 }]}>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Preferred Payment</Text>
                <Text style={styles.insightValue}>UPI (65%)</Text>
              </View>
              <View style={styles.insightDivider} />
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Churn Rate</Text>
                <Text style={styles.insightValue}>8.5%</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Customer List Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer List</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {SEGMENTS.map(seg => (
              <TouchableOpacity
                key={seg.id}
                style={[styles.filterChip, activeSegment === seg.id && { backgroundColor: seg.color }]}
                onPress={() => setActiveSegment(seg.id)}
              >
                <Ionicons 
                  name={seg.icon as any} 
                  size={16} 
                  color={activeSegment === seg.id ? colors.background.primary : seg.color} 
                />
                <Text style={[styles.filterChipText, activeSegment === seg.id && { color: colors.background.primary }]}>
                  {seg.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Customer Cards */}
          {filteredCustomers.map(customer => (
            <Card key={customer.id} style={styles.customerCard}>
              <View style={styles.customerHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <View style={styles.customerMeta}>
                    <View style={[styles.segmentBadge, { backgroundColor: SEGMENTS.find(s => s.id === customer.segment)?.color + '20' }]}>
                      <Text style={[styles.segmentBadgeText, { color: SEGMENTS.find(s => s.id === customer.segment)?.color }]}>
                        {customer.segment.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.lastOrder}>Last: {customer.lastOrder}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.messageButton}>
                  <Ionicons name="chatbubble-outline" size={20} color={colors.primary.green} />
                </TouchableOpacity>
              </View>

              <View style={styles.customerStats}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{customer.orders}</Text>
                  <Text style={styles.statLabel}>Orders</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{formatCurrency(customer.totalSpent)}</Text>
                  <Text style={styles.statLabel}>Total Spent</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{formatCurrency(customer.avgOrderValue)}</Text>
                  <Text style={styles.statLabel}>Avg Order</Text>
                </View>
              </View>

              <View style={styles.retentionBar}>
                <View style={styles.retentionHeader}>
                  <Text style={styles.retentionLabel}>Retention Score</Text>
                  <Text style={styles.retentionValue}>{customer.retention}%</Text>
                </View>
                <View style={styles.retentionTrack}>
                  <View style={[styles.retentionFill, { width: `${customer.retention}%` }]} />
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  overviewContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  overviewCard: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.green,
  },
  overviewLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
  segmentCard: {
    padding: spacing.lg,
  },
  segmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  segmentItem: {
    alignItems: 'center',
  },
  segmentIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  segmentCount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  segmentName: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '47%',
    padding: spacing.md,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  insightCard: {
    padding: spacing.lg,
  },
  insightRow: {
    flexDirection: 'row',
  },
  insightItem: {
    flex: 1,
    alignItems: 'center',
  },
  insightDivider: {
    width: 1,
    backgroundColor: colors.border.light,
  },
  insightLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  insightValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  customerCard: {
    padding: spacing.md,
    marginBottom: 12,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.background.primary,
  },
  customerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  customerName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  customerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  segmentBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  segmentBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  lastOrder: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  messageButton: {
    padding: spacing.sm,
  },
  customerStats: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  retentionBar: {
    marginTop: spacing.xs,
  },
  retentionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  retentionLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  retentionValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.green,
  },
  retentionTrack: {
    height: 6,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
  },
  retentionFill: {
    height: '100%',
    backgroundColor: colors.primary.green,
    borderRadius: borderRadius.sm,
  },
});
