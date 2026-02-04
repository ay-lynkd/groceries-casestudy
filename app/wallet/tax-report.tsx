/**
 * Tax Report Screen
 * Generate and view tax reports
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Share, RefreshControl } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/formatters';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Period = 'monthly' | 'quarterly' | 'yearly' | 'custom';
type Year = '2024' | '2023' | '2022';

interface TaxSummary {
  totalRevenue: number;
  totalTax: number;
  taxableAmount: number;
  exemptions: number;
  ordersCount: number;
  cgst: number;
  sgst: number;
  igst: number;
}

const MOCK_TAX_DATA: Record<string, TaxSummary> = {
  '2024-Q1': {
    totalRevenue: 125000,
    totalTax: 11250,
    taxableAmount: 125000,
    exemptions: 0,
    ordersCount: 245,
    cgst: 5625,
    sgst: 5625,
    igst: 0,
  },
  '2024-Q2': {
    totalRevenue: 156000,
    totalTax: 14040,
    taxableAmount: 156000,
    exemptions: 0,
    ordersCount: 312,
    cgst: 7020,
    sgst: 7020,
    igst: 0,
  },
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const QUARTERS = [
  { id: 'Q1', label: 'Q1 (Apr-Jun)', months: ['April', 'May', 'June'] },
  { id: 'Q2', label: 'Q2 (Jul-Sep)', months: ['July', 'August', 'September'] },
  { id: 'Q3', label: 'Q3 (Oct-Dec)', months: ['October', 'November', 'December'] },
  { id: 'Q4', label: 'Q4 (Jan-Mar)', months: ['January', 'February', 'March'] },
];

export default function TaxReportScreen() {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('quarterly');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  const [year, setYear] = useState<Year>('2024');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [showGSTDetails, setShowGSTDetails] = useState(false);

  const taxData = MOCK_TAX_DATA[`${year}-${selectedQuarter}`] || {
    totalRevenue: 0,
    totalTax: 0,
    taxableAmount: 0,
    exemptions: 0,
    ordersCount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
  };

  const effectiveTaxRate = taxData.totalRevenue > 0 
    ? ((taxData.totalTax / taxData.totalRevenue) * 100).toFixed(2)
    : '0.00';

  return (
    <>
      <Stack.Screen options={{ title: 'Tax Report' }} />
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
        {/* Period Selection */}
        <View style={styles.periodSection}>
          <Text style={styles.sectionTitle}>Report Period</Text>
          <View style={styles.periodTabs}>
            {(['monthly', 'quarterly', 'yearly'] as Period[]).map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.periodTab, period === p && styles.periodTabActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Year & Quarter Selection */}
        <Card style={styles.selectionCard}>
          <View style={styles.pickerRow}>
            <Text style={styles.pickerLabel}>Year</Text>
            <View style={styles.pickerOptions}>
              {(['2024', '2023', '2022'] as Year[]).map(y => (
                <TouchableOpacity
                  key={y}
                  style={[styles.pickerChip, year === y && styles.pickerChipActive]}
                  onPress={() => setYear(y)}
                >
                  <Text style={year === y ? styles.pickerChipTextActive : undefined}>{y}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {period === 'quarterly' && (
            <View style={[styles.pickerRow, { marginTop: 16 }]}>
              <Text style={styles.pickerLabel}>Quarter</Text>
              <View style={styles.quarterGrid}>
                {QUARTERS.map(q => (
                  <TouchableOpacity
                    key={q.id}
                    style={[
                      styles.quarterChip,
                      selectedQuarter === q.id && styles.quarterChipActive,
                    ]}
                    onPress={() => setSelectedQuarter(q.id)}
                  >
                    <Text style={selectedQuarter === q.id ? styles.quarterChipTextActive : undefined}>
                      {q.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Card>

        {/* Tax Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Tax Summary</Text>
          
          <Card style={styles.totalTaxCard}>
            <Text style={styles.totalTaxLabel}>Total Tax Collected</Text>
            <Text style={styles.totalTaxAmount}>{formatCurrency(taxData.totalTax)}</Text>
            <View style={styles.taxRateBadge}>
              <Text style={styles.taxRateText}>Effective Rate: {effectiveTaxRate}%</Text>
            </View>
          </Card>

          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Ionicons name="cash-outline" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{formatCurrency(taxData.totalRevenue)}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </Card>
            <Card style={styles.statCard}>
              <Ionicons name="receipt-outline" size={24} color="#2196F3" />
              <Text style={styles.statValue}>{taxData.ordersCount}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </Card>
          </View>

          {/* GST Breakdown */}
          <TouchableOpacity 
            style={styles.gstHeader}
            onPress={() => setShowGSTDetails(!showGSTDetails)}
          >
            <Text style={styles.gstTitle}>GST Breakdown</Text>
            <Ionicons 
              name={showGSTDetails ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>

          {showGSTDetails && (
            <Card style={styles.gstCard}>
              <View style={styles.gstRow}>
                <View style={styles.gstItem}>
                  <Text style={styles.gstLabel}>CGST (2.5%)</Text>
                  <Text style={styles.gstValue}>{formatCurrency(taxData.cgst)}</Text>
                </View>
                <View style={styles.gstDivider} />
                <View style={styles.gstItem}>
                  <Text style={styles.gstLabel}>SGST (2.5%)</Text>
                  <Text style={styles.gstValue}>{formatCurrency(taxData.sgst)}</Text>
                </View>
              </View>
              <View style={[styles.gstRow, { marginTop: 12 }]}>
                <View style={styles.gstItem}>
                  <Text style={styles.gstLabel}>IGST (5%)</Text>
                  <Text style={styles.gstValue}>{formatCurrency(taxData.igst)}</Text>
                </View>
              </View>
            </Card>
          )}
        </View>

        {/* Monthly Breakdown */}
        <View style={styles.monthlySection}>
          <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
          {QUARTERS.find(q => q.id === selectedQuarter)?.months.map((month, index) => (
            <Card key={month} style={styles.monthCard}>
              <View style={styles.monthHeader}>
                <Text style={styles.monthName}>{month}</Text>
                <Text style={styles.monthAmount}>{formatCurrency(taxData.totalRevenue / 3)}</Text>
              </View>
              <View style={styles.monthDetails}>
                <Text style={styles.monthTax}>Tax: {formatCurrency(taxData.totalTax / 3)}</Text>
                <Text style={styles.monthOrders}>Orders: {Math.round(taxData.ordersCount / 3)}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button 
            variant="outline" 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                'Download Report',
                `Tax report for ${selectedQuarter} ${year} will be downloaded as PDF.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Download', 
                    onPress: () => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      Alert.alert('Success', 'Report downloaded successfully!');
                    }
                  },
                ]
              );
            }}
          >
            <Ionicons name="download-outline" size={18} />
            <Text style={{ marginLeft: 8 }}>Download Report</Text>
          </Button>
          <Button 
            variant="primary" 
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              try {
                const reportData = `
Tax Report - ${selectedQuarter} ${year}
Total Revenue: ${formatCurrency(taxData.totalRevenue)}
Total Tax: ${formatCurrency(taxData.totalTax)}
Orders: ${taxData.ordersCount}
Generated on: ${new Date().toLocaleDateString()}
                `.trim();
                
                await Share.share({
                  title: `Tax Report ${selectedQuarter} ${year}`,
                  message: reportData,
                });
              } catch (error) {
                Alert.alert('Error', 'Could not share report');
              }
            }}
          >
            <Ionicons name="share-outline" size={18} color="#FFF" />
            <Text style={{ marginLeft: 8, color: '#FFF' }}>Share with CA</Text>
          </Button>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          This is a summary report for reference. Please consult your CA for filing returns.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  periodSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 4,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodTabActive: {
    backgroundColor: '#FFF',
  },
  periodTabText: {
    fontSize: 14,
    color: '#666',
  },
  periodTabTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  selectionCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerLabel: {
    width: 60,
    fontSize: 14,
    fontWeight: '600',
  },
  pickerOptions: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  pickerChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  pickerChipActive: {
    backgroundColor: '#4CAF50',
  },
  pickerChipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  quarterGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quarterChip: {
    width: '22%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  quarterChipActive: {
    backgroundColor: '#4CAF50',
  },
  quarterChipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  summarySection: {
    padding: 16,
  },
  totalTaxCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  totalTaxLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  totalTaxAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 8,
  },
  taxRateBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  taxRateText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  gstHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  gstTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  gstCard: {
    padding: 16,
  },
  gstRow: {
    flexDirection: 'row',
  },
  gstItem: {
    flex: 1,
    alignItems: 'center',
  },
  gstDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  gstLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  gstValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  monthlySection: {
    padding: 16,
    paddingTop: 0,
  },
  monthCard: {
    padding: 16,
    marginBottom: 8,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthName: {
    fontSize: 16,
    fontWeight: '600',
  },
  monthAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  monthDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  monthTax: {
    fontSize: 13,
    color: '#666',
  },
  monthOrders: {
    fontSize: 13,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    padding: 16,
    paddingTop: 0,
  },
});
