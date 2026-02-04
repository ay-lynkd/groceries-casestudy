/**
 * Sales Performance Screen
 * Detailed sales analysis with charts
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/common';
import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '@/contexts/OrderContext';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency } from '@/utils/formatters';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

type Period = '7days' | '30days' | '90days' | 'year';

export default function SalesAnalyticsScreen() {
  const { colors } = theme;
  const { orders } = useOrders();
  const [period, setPeriod] = useState<Period>('30days');
  const [chartType, setChartType] = useState<'revenue' | 'orders'>('revenue');

  // Mock chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: chartType === 'revenue' 
        ? [4500, 5200, 4800, 6100, 5800, 7200, 6800]
        : [45, 52, 48, 61, 58, 72, 68],
    }],
  };

  const hourlyData = {
    labels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
    datasets: [{
      data: [12, 25, 45, 38, 42, 68, 85, 52],
    }],
  };

  const chartConfig = {
    backgroundColor: '#FFF',
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4CAF50',
    },
  };

  const salesStats = [
    { label: 'Gross Sales', value: 156800, change: 12.5 },
    { label: 'Net Sales', value: 142500, change: 10.2 },
    { label: 'Refunds', value: 3200, change: -5.3 },
    { label: 'Discounts', value: 11100, change: 8.7 },
  ];

  const topProducts = [
    { name: 'Basmati Rice 1kg', sales: 245, revenue: 36750 },
    { name: 'Organic Turmeric', sales: 189, revenue: 9450 },
    { name: 'Fresh Milk 1L', sales: 156, revenue: 6240 },
    { name: 'Brown Bread', sales: 134, revenue: 4020 },
    { name: 'Eggs (12 pcs)', sales: 128, revenue: 7680 },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'Sales Report' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          {(['7days', '30days', '90days', 'year'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodButton, period === p && styles.periodButtonActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : p === '90days' ? '90 Days' : 'Year'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Type Toggle */}
        <View style={styles.chartToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, chartType === 'revenue' && styles.toggleButtonActive]}
            onPress={() => setChartType('revenue')}
          >
            <Text style={[styles.toggleText, chartType === 'revenue' && styles.toggleTextActive]}>
              Revenue
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, chartType === 'orders' && styles.toggleButtonActive]}
            onPress={() => setChartType('orders')}
          >
            <Text style={[styles.toggleText, chartType === 'orders' && styles.toggleTextActive]}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {chartType === 'revenue' ? 'Revenue Trend' : 'Orders Trend'}
          </Text>
          <LineChart
            data={chartData}
            width={width - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            yAxisLabel={chartType === 'revenue' ? '₹' : ''}
            yAxisSuffix=""
          />
        </Card>

        {/* Sales Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Breakdown</Text>
          <View style={styles.statsGrid}>
            {salesStats.map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{formatCurrency(stat.value)}</Text>
                <View style={[styles.changeBadge, { backgroundColor: stat.change >= 0 ? '#E8F5E9' : '#FFEBEE' }]}>
                  <Ionicons 
                    name={stat.change >= 0 ? 'trending-up' : 'trending-down'} 
                    size={12} 
                    color={stat.change >= 0 ? '#4CAF50' : '#F44336'} 
                  />
                  <Text style={[styles.changeText, { color: stat.change >= 0 ? '#4CAF50' : '#F44336' }]}>
                    {stat.change >= 0 ? '+' : ''}{stat.change}%
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Hourly Distribution */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Hourly Order Distribution</Text>
          <BarChart
            data={hourlyData}
            width={width - 64}
            height={180}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
          />
        </Card>

        {/* Top Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Selling Products</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {topProducts.map((product, index) => (
            <Card key={index} style={styles.productCard}>
              <View style={styles.productRank}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSales}>{product.sales} sold</Text>
              </View>
              <Text style={styles.productRevenue}>{formatCurrency(product.revenue)}</Text>
            </Card>
          ))}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <Card style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <View style={styles.paymentItem}>
                <Ionicons name="card-outline" size={24} color="#2196F3" />
                <Text style={styles.paymentLabel}>Online</Text>
                <Text style={styles.paymentValue}>65%</Text>
              </View>
              <View style={styles.paymentDivider} />
              <View style={styles.paymentItem}>
                <Ionicons name="cash-outline" size={24} color="#4CAF50" />
                <Text style={styles.paymentLabel}>COD</Text>
                <Text style={styles.paymentValue}>30%</Text>
              </View>
              <View style={styles.paymentDivider} />
              <View style={styles.paymentItem}>
                <Ionicons name="wallet-outline" size={24} color="#FF9800" />
                <Text style={styles.paymentLabel}>Wallet</Text>
                <Text style={styles.paymentValue}>5%</Text>
              </View>
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
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  periodTextActive: {
    color: '#FFF',
  },
  chartToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FFF',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  toggleTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  chartCard: {
    margin: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 44) / 2,
    padding: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
  },
  productSales: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  productRevenue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentCard: {
    padding: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paymentItem: {
    alignItems: 'center',
    flex: 1,
  },
  paymentDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  paymentLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  paymentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
