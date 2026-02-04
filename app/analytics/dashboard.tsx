/**
 * Analytics Dashboard
 * Comprehensive business insights overview
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { Text } from '@/components/common';
import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '@/contexts/OrderContext';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type Period = 'today' | 'week' | 'month' | 'year';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
  onPress?: () => void;
}

function MetricCard({ title, value, change, icon, color, onPress }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <TouchableOpacity style={[styles.metricCard, { borderLeftColor: color, borderLeftWidth: 4 }]} onPress={onPress}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <View style={[styles.changeBadge, { backgroundColor: isPositive ? '#E8F5E9' : '#FFEBEE' }]}>
          <Ionicons name={isPositive ? 'trending-up' : 'trending-down'} size={12} color={isPositive ? '#4CAF50' : '#F44336'} />
          <Text style={[styles.changeText, { color: isPositive ? '#4CAF50' : '#F44336' }]}>
            {isPositive ? '+' : ''}{change}%
          </Text>
        </View>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function AnalyticsDashboardScreen() {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();
  const { totalEarnings, todayEarnings, weekEarnings, monthEarnings } = useWallet();
  const [period, setPeriod] = useState<Period>('week');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Calculate metrics based on period
  const getMetrics = () => {
    const now = new Date();
    let filteredOrders = orders;
    
    switch (period) {
      case 'today':
        const today = now.toDateString();
        filteredOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredOrders = orders.filter(o => new Date(o.createdAt) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredOrders = orders.filter(o => new Date(o.createdAt) >= monthAgo);
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredOrders = orders.filter(o => new Date(o.createdAt) >= yearAgo);
        break;
    }

    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.paymentAmount, 0);
    const totalOrders = filteredOrders.length;
    const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered').length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return { totalRevenue, totalOrders, deliveredOrders, avgOrderValue };
  };

  const metrics = getMetrics();

  // Mock data for charts
  const hourlyData = [12, 18, 25, 30, 28, 35, 42, 38, 45, 52, 48, 55];
  const weeklyData = [4500, 5200, 4800, 6100, 5800, 7200, 6800];

  return (
    <>
      <Stack.Screen options={{ title: 'Analytics Dashboard' }} />
      <ScrollView 
        style={[styles.container, { paddingTop: insets.top }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + theme.spacing.lg }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.status.success]}
            tintColor={theme.colors.status.success}
          />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          {(['today', 'week', 'month', 'year'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodButton, period === p && styles.periodButtonActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            change={12.5}
            icon="cash-outline"
            color="#4CAF50"
          />
          <MetricCard
            title="Total Orders"
            value={formatNumber(metrics.totalOrders)}
            change={8.2}
            icon="cart-outline"
            color="#2196F3"
          />
          <MetricCard
            title="Avg Order Value"
            value={formatCurrency(metrics.avgOrderValue)}
            change={-2.1}
            icon="trending-up-outline"
            color="#FF9800"
          />
          <MetricCard
            title="Delivered"
            value={formatNumber(metrics.deliveredOrders)}
            change={15.3}
            icon="checkmark-circle-outline"
            color="#9C27B0"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Reports</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/analytics/sales')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="bar-chart-outline" size={24} color="#2196F3" />
              </View>
              <Text style={styles.actionTitle}>Sales Report</Text>
              <Text style={styles.actionSubtitle}>Detailed sales analysis</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/analytics/products')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="cube-outline" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.actionTitle}>Products</Text>
              <Text style={styles.actionSubtitle}>Top & bottom performers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/analytics/customers')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="people-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.actionTitle}>Customers</Text>
              <Text style={styles.actionSubtitle}>Behavior insights</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/wallet/tax-report')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="document-text-outline" size={24} color="#FF9800" />
              </View>
              <Text style={styles.actionTitle}>Tax Report</Text>
              <Text style={styles.actionSubtitle}>GST & filing</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Performance Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Performance Summary</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Conversion Rate</Text>
              <Text style={styles.summaryValue}>68.5%</Text>
              <Text style={styles.summaryChange}>+5.2% vs last period</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Return Rate</Text>
              <Text style={styles.summaryValue}>2.3%</Text>
              <Text style={[styles.summaryChange, { color: '#4CAF50' }]}>-0.8% vs last period</Text>
            </View>
          </View>
          
          <View style={[styles.summaryRow, { marginTop: 16 }]}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Customer Satisfaction</Text>
              <Text style={styles.summaryValue}>4.8/5</Text>
              <Text style={styles.summaryChange}>Based on 124 reviews</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Response Time</Text>
              <Text style={styles.summaryValue}>12 min</Text>
              <Text style={styles.summaryChange}>Avg. order acceptance</Text>
            </View>
          </View>
        </Card>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <Card style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="bulb-outline" size={24} color="#FF9800" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Peak Hours</Text>
              <Text style={styles.insightText}>
                Your store receives most orders between 6 PM - 9 PM. Consider increasing stock during these hours.
              </Text>
            </View>
          </Card>
          
          <Card style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="trending-up-outline" size={24} color="#4CAF50" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Top Category</Text>
              <Text style={styles.insightText}>
                Groceries account for 45% of your sales. Consider expanding this category.
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  periodContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#4CAF50',
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  periodTextActive: {
    color: '#FFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  summaryCard: {
    margin: 16,
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  summaryChange: {
    fontSize: 11,
    color: '#4CAF50',
  },
  insightCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
