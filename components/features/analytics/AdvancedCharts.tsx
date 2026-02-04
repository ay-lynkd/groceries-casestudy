/**
 * Advanced Analytics Charts Component
 * Sales trends, category performance, hourly patterns
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { theme } from '@/theme/appTheme';
import { Card } from '@/components/primary';

const screenWidth = Dimensions.get('window').width - 32;

interface SalesData {
  labels: string[];
  datasets: { data: number[]; color?: (opacity: number) => string }[];
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
}

interface AdvancedChartsProps {
  salesData: SalesData;
  categoryData: CategoryData[];
  hourlyData: number[];
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({
  salesData,
  categoryData,
  hourlyData,
}) => {
  const chartConfig = {
    backgroundColor: theme.colors.background.card,
    backgroundGradientFrom: theme.colors.background.card,
    backgroundGradientTo: theme.colors.background.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: () => theme.colors.text.secondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary.green,
    },
  };

  const hourlyLabels = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Sales Trend Line Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Sales Trend</Text>
        <LineChart
          data={salesData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </Card>

      {/* Category Performance Pie Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Sales by Category</Text>
        <PieChart
          data={categoryData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </Card>

      {/* Hourly Sales Bar Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Hourly Sales Pattern</Text>
        <BarChart
          data={{
            labels: hourlyLabels,
            datasets: [{ data: hourlyData }],
          }}
          width={screenWidth}
          height={200}
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

      {/* Stats Summary */}
      <View style={styles.statsGrid}>
        <StatCard title="Peak Hour" value="6 PM" subtitle="₹12,450" />
        <StatCard title="Avg Order" value="₹485" subtitle="+12% vs last week" />
        <StatCard title="Top Category" value="Groceries" subtitle="45% of sales" />
        <StatCard title="Conversion" value="78%" subtitle="+5% vs last week" />
      </View>
    </ScrollView>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </View>
);

// Demo data generator
export const generateDemoAnalytics = () => {
  const salesData: SalesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [12000, 15000, 18000, 14000, 22000, 28000, 25000],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      },
      {
        data: [10000, 12000, 15000, 13000, 18000, 24000, 22000],
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
      },
    ],
  };

  const categoryData: CategoryData[] = [
    { name: 'Groceries', value: 45, color: '#4CAF50', legendFontColor: '#7F7F7F' },
    { name: 'Vegetables', value: 25, color: '#2196F3', legendFontColor: '#7F7F7F' },
    { name: 'Dairy', value: 20, color: '#FF9800', legendFontColor: '#7F7F7F' },
    { name: 'Others', value: 10, color: '#9E9E9E', legendFontColor: '#7F7F7F' },
  ];

  const hourlyData = [1500, 3500, 8200, 6500, 12450, 9800];

  return { salesData, categoryData, hourlyData };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartCard: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 11,
    color: theme.colors.primary.green,
  },
});

export default AdvancedCharts;
