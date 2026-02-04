/**
 * Wallet Dashboard Screen
 * View wallet balance and transaction history
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ScrollView, Image } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallet } from '@/contexts/WalletContext';
import { walletData, type Transaction } from '@/mocks/walletData';
import { formatCurrency } from '@/utils/formatters';

const PERIOD_FILTERS = ['Day', 'Week', 'Month', 'Year'] as const;

export default function WalletScreen() {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { availableBalance } = useWallet();
  const [selectedPeriod, setSelectedPeriod] = useState<typeof PERIOD_FILTERS[number]>('Week');
  const [refreshing, setRefreshing] = useState(false);
  const [transactions] = useState<Transaction[]>(walletData.transactions);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const totalEarnings = transactions
    .filter(t => t.status === 'received')
    .reduce((sum, t) => sum + t.amount, 0);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card style={styles.transactionCard}>
      <View style={styles.transactionContent}>
        <Image source={{ uri: item.avatar }} style={styles.transactionAvatar} />
        <View style={styles.transactionInfo}>
          <Text variant="body" fontWeight="semibold">
            {item.name}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.date}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text variant="body" fontWeight="bold" color={item.status === 'received' ? theme.colors.status.success : theme.colors.text.primary}>
            {item.status === 'received' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'received': return theme.colors.status.success;
      case 'sent': return theme.colors.status.error;
      case 'pending': return theme.colors.status.warning;
      default: return theme.colors.text.light;
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Wallet',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/wallet/tax-report')}
              style={styles.headerButton}
            >
              <Ionicons name="document-text-outline" size={theme.typography.fontSize.xl} color={theme.colors.status.success} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView 
        style={[styles.container, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.status.success]}
            tintColor={theme.colors.status.success}
          />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceSection}>
          <Card style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <TouchableOpacity style={styles.eyeButton}>
                <Ionicons name="eye-outline" size={theme.typography.fontSize.lg} color={theme.colors.background.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(availableBalance)}
            </Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>This Week</Text>
                <Text style={styles.balanceItemValue}>+{formatCurrency(1250)}</Text>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>This Month</Text>
                <Text style={styles.balanceItemValue}>+{formatCurrency(5215)}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/wallet/payout-request');
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.status.success + '15' }]}>
              <Ionicons name="arrow-down-outline" size={theme.typography.fontSize.xl} color={theme.colors.status.success} />
            </View>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/analytics/sales');
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.status.info + '15' }]}>
              <Ionicons name="analytics-outline" size={theme.typography.fontSize.xl} color={theme.colors.status.info} />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/wallet/tax-report');
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary.orange + '15' }]}>
              <Ionicons name="receipt-outline" size={theme.typography.fontSize.xl} color={theme.colors.primary.orange} />
            </View>
            <Text style={styles.actionText}>Tax Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Bank accounts functionality
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary.purple + '15' }]}>
              <Ionicons name="card-outline" size={theme.typography.fontSize.xl} color={theme.colors.primary.purple} />
            </View>
            <Text style={styles.actionText}>Bank</Text>
          </TouchableOpacity>
        </View>

        {/* Period Filter */}
        <View style={styles.periodSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodContainer}>
            {PERIOD_FILTERS.map(period => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodTab,
                  selectedPeriod === period && { backgroundColor: theme.colors.status.success },
                ]}
                onPress={() => {
                  setSelectedPeriod(period);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period && { color: theme.colors.background.primary },
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Earnings Chart Placeholder */}
        <View style={styles.chartSection}>
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Earnings Overview</Text>
            <View style={styles.chartPlaceholder}>
              {walletData.weeklyEarnings.map((data, index) => (
                <View key={data.day} style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: Math.max(20, (data.value / 500) * 100),
                        backgroundColor: index === 4 ? theme.colors.status.success : theme.colors.border.light,
                      }
                    ]} 
                  />
                  <Text style={styles.barLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={transactions.slice(0, 5)}
            keyExtractor={item => item.id}
            renderItem={renderTransaction}
            scrollEnabled={false}
            contentContainerStyle={styles.transactionsList}
          />
        </View>

        {/* Payout CTA */}
        <View style={styles.payoutSection}>
          <Card style={styles.payoutCard}>
            <View style={styles.payoutContent}>
              <View style={styles.payoutIcon}>
                <Ionicons name="cash-outline" size={theme.typography.fontSize['2xl']} color={theme.colors.status.success} />
              </View>
              <View style={styles.payoutInfo}>
                <Text variant="body" fontWeight="semibold">Ready to withdraw?</Text>
                <Text variant="caption" color={theme.colors.text.light}>
                  Minimum payout: {formatCurrency(100)}
                </Text>
              </View>
              <Button
                variant="primary"
                size="sm"
                onPress={() => router.push('/wallet/payout-request')}
              >
                <Text style={{ color: theme.colors.background.primary }}>Withdraw</Text>
              </Button>
            </View>
          </Card>
        </View>

        {/* Bottom padding */}
        <View style={{ height: insets.bottom + theme.spacing.xl }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  balanceSection: {
    padding: theme.spacing.md,
  },
  balanceCard: {
    backgroundColor: theme.colors.status.success,
    padding: theme.spacing.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  balanceLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  eyeButton: {
    padding: theme.spacing.xs,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background.primary,
    marginBottom: theme.spacing.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceDivider: {
    width: 1,
    height: theme.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  balanceItemLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  balanceItemValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background.primary,
    marginTop: theme.spacing.xs / 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    alignItems: 'center',
  },
  actionIcon: {
    width: theme.spacing.xxl,
    height: theme.spacing.xxl,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  periodSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  periodContainer: {
    gap: theme.spacing.sm,
  },
  periodTab: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.border.light,
  },
  periodText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  chartSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  chartCard: {
    padding: theme.spacing.md,
  },
  chartTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  chartPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingVertical: theme.spacing.sm,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 24,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  barLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.light,
  },
  transactionsSection: {
    paddingHorizontal: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.status.success,
  },
  transactionsList: {
    gap: theme.spacing.sm,
  },
  transactionCard: {
    padding: theme.spacing.md,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAvatar: {
    width: theme.spacing.xl + theme.spacing.md,
    height: theme.spacing.xl + theme.spacing.md,
    borderRadius: (theme.spacing.xl + theme.spacing.md) / 2,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs - 1,
    fontWeight: theme.typography.fontWeight.bold,
  },
  payoutSection: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  payoutCard: {
    backgroundColor: theme.colors.status.success + '08',
    borderColor: theme.colors.status.success + '30',
    borderWidth: 1,
  },
  payoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payoutIcon: {
    width: theme.spacing.xl + theme.spacing.md,
    height: theme.spacing.xl + theme.spacing.md,
    borderRadius: (theme.spacing.xl + theme.spacing.md) / 2,
    backgroundColor: theme.colors.status.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
});
