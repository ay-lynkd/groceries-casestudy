import { Text } from '@/components/common';
import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import type { CardVariant, IconType } from '@/types/home';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SummaryCardProps {
  iconType: IconType;
  iconColor: string;
  iconBackgroundColor: string;
  title: string;
  value: string;
  change: { percentage: number; isPositive: boolean; label: string };
  variant?: CardVariant;
}

const iconMap: Record<IconType, keyof typeof Ionicons.glyphMap> = {
  'shopping-cart': 'cart-outline',
  wallet: 'wallet',
  person: 'person',
  delivery: 'cube-outline',
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  iconType,
  iconColor,
  iconBackgroundColor,
  title,
  value,
  change,
  variant = 'default',
}) => {
  const isHighlighted = variant === 'highlighted';
  const trendColor = change.isPositive
    ? theme.colors.status.success
    : theme.colors.status.error;

  return (
    <Card style={isHighlighted ? styles.highlightedCard : undefined}>
      <View
        style={styles.content}
        accessibilityLabel={`${title}: ${value}, ${change.percentage}% ${change.isPositive ? 'increase' : 'decrease'}, ${change.label}`}
        accessibilityRole="text">
        <View style={styles.header}>
          <View
            style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}
            accessibilityLabel={`${title} icon`}
            accessibilityRole="image">
            <Ionicons name={iconMap[iconType]} size={22} color={iconColor} />
          </View>
          <Text
            variant="caption"
            fontWeight="bold"
            color={theme.colors.text.primary}
            accessibilityLabel={`Card title: ${title}`}>
            {title}
          </Text>
        </View>
        <Text
          variant="h2"
          fontWeight="bold"
          color={theme.colors.text.primary}
          accessibilityLabel={`Value: ${value}`}>
          {value}
        </Text>
        <View style={styles.changeRow} accessibilityLabel="Change indicator">
          <Ionicons
            name={change.isPositive ? 'trending-up' : 'trending-down'}
            size={16}
            color={trendColor}
            accessibilityLabel={change.isPositive ? 'Trending up' : 'Trending down'}
          />
          <Text variant="small" fontWeight="medium" color={trendColor}>
            {change.percentage}% {change.label}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  content: { gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  highlightedCard: {
    backgroundColor: theme.colors.background.secondary,
  },
});

export default SummaryCard;
