/**
 * Skeleton Loading Component
 * Provides visual loading states for cards, lists, and content
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { theme } from '@/theme/appTheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = theme.borderRadius.sm,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

// Pre-built skeleton layouts
export const SkeletonCard: React.FC = () => (
  <View style={styles.card}>
    <Skeleton width="100%" height={120} borderRadius={theme.borderRadius.md} />
    <View style={styles.cardContent}>
      <Skeleton width="70%" height={20} style={styles.marginBottom} />
      <Skeleton width="40%" height={16} />
    </View>
  </View>
);

export const SkeletonProductItem: React.FC = () => (
  <View style={styles.productItem}>
    <Skeleton width={80} height={80} borderRadius={theme.borderRadius.md} />
    <View style={styles.productContent}>
      <Skeleton width="60%" height={18} style={styles.marginBottomSm} />
      <Skeleton width="40%" height={14} style={styles.marginBottomSm} />
      <Skeleton width="30%" height={16} />
    </View>
  </View>
);

export const SkeletonOrderItem: React.FC = () => (
  <View style={styles.orderItem}>
    <View style={styles.orderHeader}>
      <Skeleton width="40%" height={16} />
      <Skeleton width={60} height={24} borderRadius={theme.borderRadius.full} />
    </View>
    <Skeleton width="80%" height={14} style={styles.marginTop} />
    <Skeleton width="60%" height={14} style={styles.marginTopSm} />
  </View>
);

export const SkeletonStats: React.FC = () => (
  <View style={styles.statsContainer}>
    {[1, 2, 3, 4].map((i) => (
      <View key={i} style={styles.statItem}>
        <Skeleton width="100%" height={80} borderRadius={theme.borderRadius.lg} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.tertiary,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  productContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },
  orderItem: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  statItem: {
    width: '50%',
    padding: theme.spacing.xs,
  },
  marginBottom: {
    marginBottom: theme.spacing.sm,
  },
  marginBottomSm: {
    marginBottom: theme.spacing.xs,
  },
  marginTop: {
    marginTop: theme.spacing.md,
  },
  marginTopSm: {
    marginTop: theme.spacing.sm,
  },
});

export default Skeleton;
