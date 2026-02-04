import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme/appTheme';

type BadgeVariant = 'delivered' | 'pending' | 'cancelled';

interface BadgeProps {
  children: React.ReactNode;
  variant: BadgeVariant;
}

const badgeStyles: Record<BadgeVariant, { backgroundColor: string }> = {
  delivered: { backgroundColor: theme.colors.badge.delivered },
  pending: { backgroundColor: theme.colors.badge.pending },
  cancelled: { backgroundColor: theme.colors.badge.cancelled },
};

export const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
  return (
    <View style={[styles.badge, badgeStyles[variant]]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium as unknown as '500',
    color: theme.colors.text.primary,
  },
});
