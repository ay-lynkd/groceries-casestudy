/**
 * EmptyState Component
 * Reusable empty state with icon, title, description, and optional action
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/appTheme';
import { Text } from './Text';
import { Button } from '@/components/primitives/Button';

export type EmptyStateVariant = 'products' | 'orders' | 'search' | 'network-error' | 'wallet' | 'generic';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary' | 'outline';
}

// Predefined configurations for common variants
const VARIANT_CONFIG: Record<EmptyStateVariant, { icon: keyof typeof Ionicons.glyphMap; iconColor: string; bgColor: string }> = {
  products: {
    icon: 'cube-outline',
    iconColor: theme.colors.status.info,
    bgColor: theme.colors.status.info + '15',
  },
  orders: {
    icon: 'receipt-outline',
    iconColor: theme.colors.primary.purple,
    bgColor: theme.colors.primary.purple + '15',
  },
  search: {
    icon: 'search-outline',
    iconColor: theme.colors.text.light,
    bgColor: theme.colors.border.light,
  },
  'network-error': {
    icon: 'cloud-offline-outline',
    iconColor: theme.colors.status.error,
    bgColor: theme.colors.status.error + '15',
  },
  wallet: {
    icon: 'wallet-outline',
    iconColor: theme.colors.status.success,
    bgColor: theme.colors.status.success + '15',
  },
  generic: {
    icon: 'file-tray-outline',
    iconColor: theme.colors.text.light,
    bgColor: theme.colors.border.light,
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'generic',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
}) => {
  const config = VARIANT_CONFIG[variant];
  const iconName = icon || config.icon;
  const iconSize = 40;
  const containerSize = 80;

  return (
    <View style={styles.container}>
      {/* Icon with background circle */}
      <View
        style={[
          styles.iconContainer,
          {
            width: containerSize,
            height: containerSize,
            borderRadius: containerSize / 2,
            backgroundColor: config.bgColor,
          },
        ]}
      >
        <Ionicons name={iconName} size={iconSize} color={config.iconColor} />
      </View>

      {/* Title */}
      <Text
        variant="h3"
        fontWeight="bold"
        color={theme.colors.text.primary}
        align="center"
        style={styles.title}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          variant="body"
          color={theme.colors.text.secondary}
          align="center"
          style={styles.description}
        >
          {description}
        </Text>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button
          variant={actionVariant}
          onPress={onAction}
          style={styles.actionButton}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  description: {
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  actionButton: {
    minWidth: 160,
  },
});

export default EmptyState;
