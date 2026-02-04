/**
 * Product Performance Screen
 * Best and worst performing products analysis
 */

import { Text } from '@/components/common';
import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
// global common functions
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
// get particular styles 
import { styles } from '@/components/analytics/products/ProductStyle';
// get all types
import { FilterType } from '@/components/analytics/products/Types';
// get products constants
import { category, MOCK_PRODUCTS, FILTERS } from '@/components/analytics/products/Common/Constants';
// helper functions
import { getTrendIcon } from '@/components/analytics/products/Common/Commonfuntions';


export default function ProductAnalyticsScreen() {
  const { colors } = theme;
  const [activeFilter, setActiveFilter] = useState<FilterType>('top');
  const products = MOCK_PRODUCTS[activeFilter];



  return (
    <>
      <Stack.Screen options={{ title: 'Product Performance' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Ionicons name="cube-outline" size={24} color={colors.primary.green} />
            <Text style={styles.summaryValue}>156</Text>
            <Text style={styles.summaryLabel}>Total Products</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Ionicons name="warning-outline" size={24} color={colors.status.warning} />
            <Text style={styles.summaryValue}>12</Text>
            <Text style={styles.summaryLabel}>Low Stock</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Ionicons name="star-outline" size={24} color={colors.primary.purple} />
            <Text style={styles.summaryValue}>4.7</Text>
            <Text style={styles.summaryLabel}>Avg Rating</Text>
          </Card>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterTab, activeFilter === filter.id && styles.filterTabActive]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Ionicons 
                  name={filter.icon as any} 
                  size={18} 
                  color={activeFilter === filter.id ? colors.background.primary : colors.text.secondary} 
                />
                <Text style={[styles.filterText, activeFilter === filter.id && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Performance</Text>
          <Card style={styles.categoryCard}>
            {category.map((cat, index) => (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryRevenue}>{formatCurrency(cat.revenue)}</Text>
                </View>
                <View style={styles.categoryBarContainer}>
                  <View style={[styles.categoryBar, { width: `${cat.percent}%` }]} />
                </View>
                <Text style={styles.categoryPercent}>{cat.percent}%</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Products List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {FILTERS.find(f => f.id === activeFilter)?.label}
            </Text>
            <TouchableOpacity>
              <Text style={styles.sortText}>Sort by Revenue</Text>
            </TouchableOpacity>
          </View>

          {products.map((product, index) => {
            const trend = getTrendIcon(product.trend);
            const isLowStock = product.stock <= 10;
            
            return (
              <Card key={product.id} style={{...styles.productCard, ...(isLowStock ? styles.lowStockCard : {})}}>
                <View style={styles.productHeader}>
                  <View style={styles.productRank}>
                    <Text style={styles.rankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.productMain}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={styles.productStats}>
                      <View style={styles.statItem}>
                        <Ionicons name="star" size={14} color={colors.status.warning} />
                        <Text style={styles.statText}>{product.rating}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons name="return-up-back" size={14} color={colors.text.secondary} />
                        <Text style={styles.statText}>{product.returnRate}% returns</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.trendIndicator}>
                    <Ionicons name={trend.name as any} size={20} color={trend.color} />
                  </View>
                </View>

                <View style={styles.productMetrics}>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Revenue</Text>
                    <Text style={styles.metricValue}>{formatCurrency(product.revenue)}</Text>
                  </View>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Orders</Text>
                    <Text style={styles.metricValue}>{formatNumber(product.orders)}</Text>
                  </View>
                  <View style={[styles.metricBox, isLowStock && styles.lowStockMetric]}>
                    <Text style={styles.metricLabel}>Stock</Text>
                    <Text style={[styles.metricValue, isLowStock && styles.lowStockText]}>
                      {product.stock} units
                    </Text>
                  </View>
                </View>

                {isLowStock && (
                  <View style={styles.alertBanner}>
                    <Ionicons name="warning" size={16} color={colors.background.primary} />
                    <Text style={styles.alertText}>Low stock - Restock soon</Text>
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        {/* Inventory Alerts */}
        {activeFilter !== 'low-stock' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inventory Alerts</Text>
            <Card style={styles.alertCard}>
              <View style={styles.alertItem}>
                <View style={[styles.alertDot, { backgroundColor: colors.status.error }]} />
                <Text style={styles.alertLabel}>Out of Stock</Text>
                <Text style={styles.alertCount}>3 products</Text>
              </View>
              <View style={styles.alertItem}>
                <View style={[styles.alertDot, { backgroundColor: colors.status.warning }]} />
                <Text style={styles.alertLabel}>Low Stock (&lt;10)</Text>
                <Text style={styles.alertCount}>12 products</Text>
              </View>
              <View style={styles.alertItem}>
                <View style={[styles.alertDot, { backgroundColor: colors.status.info }]} />
                <Text style={styles.alertLabel}>Overstock (&gt;100)</Text>
                <Text style={styles.alertCount}>8 products</Text>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </>
  );
}

