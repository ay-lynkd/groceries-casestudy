import { theme } from '@/theme/appTheme';
import type { Transaction } from '@/contexts/WalletContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
}) => {
  const { customerName, orderId, amount, type, status, date, avatar } = transaction;

  const getIconConfig = () => {
    switch (type) {
      case 'sale':
        return { 
          icon: 'arrow-down-outline', 
          color: theme.colors.status.success,
          bgColor: `${theme.colors.status.success}15`
        };
      case 'refund':
        return { 
          icon: 'arrow-up-outline', 
          color: theme.colors.status.error,
          bgColor: `${theme.colors.status.error}15`
        };
      case 'withdrawal':
        return { 
          icon: 'cash-outline', 
          color: theme.colors.status.warning,
          bgColor: `${theme.colors.status.warning}15`
        };
      default:
        return { 
          icon: 'swap-horizontal-outline', 
          color: theme.colors.text.secondary,
          bgColor: theme.colors.background.secondary
        };
    }
  };

  const iconConfig = getIconConfig();
  const isPositive = amount >= 0;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <View style={styles.card}>
      {/* Icon or Avatar */}
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: iconConfig.bgColor }]}>
          <Ionicons name={iconConfig.icon as any} size={20} color={iconConfig.color} />
        </View>
      )}

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {type === 'sale' ? `Order #${orderId}` : type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
        <Text style={styles.subtitle}>
          {customerName} • {formatDate(date)}
        </Text>
      </View>

      {/* Amount */}
      <View style={styles.amountContainer}>
        <Text style={[
          styles.amount, 
          { color: isPositive ? theme.colors.status.success : theme.colors.status.error }
        ]}>
          {isPositive ? '+' : '-'}₹{Math.abs(amount).toFixed(2)}
        </Text>
        <View style={[styles.statusBadge, { 
          backgroundColor: status === 'completed' ? `${theme.colors.status.success}15` : 
                          status === 'pending' ? `${theme.colors.status.warning}15` : 
                          `${theme.colors.status.error}15`
        }]}>
          <Text style={[styles.statusText, {
            color: status === 'completed' ? theme.colors.status.success :
                   status === 'pending' ? theme.colors.status.warning :
                   theme.colors.status.error
          }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background.secondary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: {
    fontFamily: theme.fonts.plusJakarta,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: theme.fonts.plusJakarta,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.light,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: theme.fonts.plusJakarta,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontFamily: theme.fonts.plusJakarta,
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default TransactionItem;
