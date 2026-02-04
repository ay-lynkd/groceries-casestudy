import { theme } from '@/theme/appTheme';
import { StyleSheet } from 'react-native';
const { colors, spacing, borderRadius, typography } = theme;
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.secondary,
    },
    summaryContainer: {
      flexDirection: 'row',
      padding: spacing.md,
      gap: spacing.md,
    },
    summaryCard: {
      flex: 1,
      padding: spacing.md,
      alignItems: 'center',
    },
    summaryValue: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      marginTop: 8,
      marginBottom: 4,
    },
    summaryLabel: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
    },
    filterContainer: {
      paddingVertical: spacing.sm,
    },
    filterTab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginLeft: spacing.md,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.secondary,
      gap: 6,
    },
    filterTabActive: {
      backgroundColor: colors.primary.green,
    },
    filterText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    filterTextActive: {
      color: colors.background.primary,
      fontWeight: typography.fontWeight.semibold,
    },
    section: {
      padding: spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
    },
    sortText: {
      color: colors.primary.green,
      fontWeight: typography.fontWeight.semibold,
    },
    categoryCard: {
      padding: spacing.md,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    categoryInfo: {
      width: 100,
    },
    categoryName: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
    },
    categoryRevenue: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
    },
    categoryBarContainer: {
      flex: 1,
      height: spacing.sm,
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.sm,
      marginHorizontal: 12,
    },
    categoryBar: {
      height: '100%',
      backgroundColor: colors.primary.green,
      borderRadius: borderRadius.sm,
    },
    categoryPercent: {
      width: 40,
      textAlign: 'right',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
    },
    productCard: {
      padding: spacing.md,
      marginBottom: 12,
    },
    lowStockCard: {
      borderLeftWidth: 4,
      borderLeftColor: colors.status.warning,
    },
    productHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    productRank: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    rankText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.secondary,
    },
    productMain: {
      flex: 1,
    },
    productName: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.xs,
    },
    productStats: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    statText: {
      fontSize: 12,
      color: colors.text.secondary,
    },
    trendIndicator: {
      padding: spacing.xs,
    },
    productMetrics: {
      flexDirection: 'row',
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
    },
    metricBox: {
      flex: 1,
      alignItems: 'center',
    },
    lowStockMetric: {
      backgroundColor: colors.badge.cancelled,
      borderRadius: borderRadius.sm,
    },
    metricLabel: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginBottom: 4,
    },
    metricValue: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
    },
    lowStockText: {
      color: colors.status.error,
    },
    alertBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.status.warning,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      marginTop: spacing.md,
    },
    alertText: {
      color: colors.background.primary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      marginLeft: 8,
    },
    alertCard: {
      padding: spacing.md,
    },
    alertItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    alertDot: {
      width: 12,
      height: 12,
      borderRadius: borderRadius.full,
      marginRight: spacing.md,
    },
    alertLabel: {
      flex: 1,
      fontSize: typography.fontSize.sm,
    },
    alertCount: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
    },
  });
  