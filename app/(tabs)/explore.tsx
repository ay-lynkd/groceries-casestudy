import { Loading } from '@/components/common';
import {
  EarningsChartCard,
  TransactionHistoryCard,
  WalletHeader,
} from '@/components/features/wallet';
import { useOrders } from '@/contexts/OrderContext';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { theme } from '@/theme/appTheme';
import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { Alert, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Inner component that uses wallet context
function WalletScreenContent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoading } = useOrders();
  const {
    totalEarnings,
    availableBalance,
    pendingBalance,
    transactions,
    weeklyEarnings,
    todayEarnings,
    weekEarnings,
    monthEarnings,
    getTransactionsByPeriod,
    withdraw,
  } = useWallet();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Week');

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Data is automatically reactive through context
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleWithdraw = useCallback(async () => {
    Alert.alert(
      'Withdraw Funds',
      `Available balance: ₹${availableBalance.toFixed(2)}\n\nEnter amount to withdraw:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: async () => {
            const success = await withdraw(availableBalance);
            if (success) {
              Alert.alert('Success', 'Withdrawal request submitted successfully!');
            } else {
              Alert.alert('Error', 'Insufficient balance for withdrawal.');
            }
          },
        },
      ]
    );
  }, [availableBalance, withdraw]);

  const handleAnalyticsPress = useCallback(() => {
    router.push('/analytics/dashboard' as any);
  }, [router]);

  const handleSearchPress = useCallback(() => {
    // Show transaction search/filter
  }, []);

  const handleNotificationPress = useCallback(() => {
    router.push('/notifications/push-center' as any);
  }, [router]);

  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period);
  }, []);

  // Get earnings based on selected period
  const getPeriodEarnings = () => {
    switch (selectedPeriod) {
      case 'Day': return todayEarnings;
      case 'Week': return weekEarnings;
      case 'Month': return monthEarnings;
      default: return totalEarnings;
    }
  };

  // Filter transactions by period
  const filteredTransactions = getTransactionsByPeriod(
    selectedPeriod.toLowerCase() as 'day' | 'week' | 'month'
  );

  // Format date header
  const getDateHeader = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short',
      year: now.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };
    return `Today, ${now.toLocaleDateString('en-IN', options)}`;
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.wallet.accent]}
            tintColor={theme.colors.wallet.accent}
          />
        }
      >
        <WalletHeader
          userName="Miya"
          greeting={getGreeting()}
          mood={getMood(availableBalance)}
          totalEarnings={totalEarnings}
          availableBalance={availableBalance}
          pendingBalance={pendingBalance}
          avatar="https://i.pravatar.cc/150?img=5"
          onWithdrawPress={handleWithdraw}
          onAnalyticsPress={handleAnalyticsPress}
          onSearchPress={handleSearchPress}
          onNotificationPress={handleNotificationPress}
          notificationCount={3}
        />

        <View style={[styles.content, { paddingBottom: insets.bottom + theme.spacing.xl }]}>
          <TransactionHistoryCard
            transactions={filteredTransactions}
            dateHeader={getDateHeader()}
            onShowAll={() => router.push('/reports/sales' as any)}
          />

          <EarningsChartCard
            data={weeklyEarnings}
            total={getPeriodEarnings()}
            periods={['Day', 'Week', 'Month', 'Year']}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            onRefresh={handleRefresh}
          />

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <QuickStatCard
              title="Today's Earnings"
              amount={todayEarnings}
              trend={+12.5}
            />
            <QuickStatCard
              title="Pending"
              amount={pendingBalance}
              subtitle="From active orders"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Helper functions
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getMood(balance: number): string {
  if (balance > 5000) return 'Great sales today!';
  if (balance > 2000) return 'Steady earnings';
  if (balance > 0) return 'Building up';
  return 'Let\'s get selling!';
}

// Quick Stat Card Component
interface QuickStatCardProps {
  title: string;
  amount: number;
  trend?: number;
  subtitle?: string;
}

function QuickStatCard({ title, amount, trend, subtitle }: QuickStatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statAmount}>₹{amount.toLocaleString('en-IN')}</Text>
      {trend !== undefined && (
        <Text style={[styles.statTrend, trend >= 0 ? styles.positive : styles.negative]}>
          {trend >= 0 ? '+' : '-'} {Math.abs(trend)}%
        </Text>
      )}
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// Main export with provider
export default function WalletScreen() {
  return (
    <WalletProvider>
      <WalletScreenContent />
    </WalletProvider>
  );
}

import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.wallet.darkBg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    backgroundColor: theme.colors.background.secondary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    minHeight: 500,
  },
  quickStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statTitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  statTrend: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  positive: {
    color: theme.colors.status.success,
  },
  negative: {
    color: theme.colors.status.error,
  },
  statSubtitle: {
    fontSize: 11,
    color: theme.colors.text.light,
    marginTop: 4,
  },
});
