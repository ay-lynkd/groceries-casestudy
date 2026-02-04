/**
 * Enhanced Card Component
 * Standardized shadow/elevation with proper defaults and press animations
 */

import { theme } from "@/theme/appTheme";
import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  /**
   * Scale value when card is pressed (default: 0.98)
   */
  pressScale?: number;
  /**
   * Disable press animation
   */
  disableAnimation?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  onPress, 
  style,
  elevation = 'md',
  padding = 'md',
  borderRadius = 'lg',
  backgroundColor = theme.colors.background.card,
  accessibilityLabel,
  accessibilityHint,
  testID,
  pressScale = 0.98,
  disableAnimation = false,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [elevationAnim] = useState(new Animated.Value(getElevationValue(elevation)));
  const [shadowOpacityAnim] = useState(new Animated.Value(getShadowOpacity(elevation)));
  
  const shouldAnimate = onPress && !disableAnimation;

  // Get numeric elevation value
  function getElevationValue(elev: 'none' | 'sm' | 'md' | 'lg'): number {
    const elevationMap = {
      none: 0,
      sm: 1,
      md: 3,
      lg: 6,
    };
    return elevationMap[elev];
  }

  // Get shadow opacity based on elevation
  function getShadowOpacity(elev: 'none' | 'sm' | 'md' | 'lg'): number {
    const opacityMap = {
      none: 0,
      sm: 0.05,
      md: 0.08,
      lg: 0.12,
    };
    return opacityMap[elev];
  }

  // Get increased elevation value for press state
  function getPressedElevation(elev: 'none' | 'sm' | 'md' | 'lg'): number {
    const baseElevation = getElevationValue(elev);
    return baseElevation + 3;
  }

  // Get increased shadow opacity for press state
  function getPressedShadowOpacity(elev: 'none' | 'sm' | 'md' | 'lg'): number {
    const baseOpacity = getShadowOpacity(elev);
    return Math.min(baseOpacity + 0.05, 0.2);
  }

  // Animation handlers
  const onPressIn = () => {
    if (shouldAnimate) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: pressScale,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(elevationAnim, {
          toValue: getPressedElevation(elevation),
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shadowOpacityAnim, {
          toValue: getPressedShadowOpacity(elevation),
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const onPressOut = () => {
    if (shouldAnimate) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(elevationAnim, {
          toValue: getElevationValue(elevation),
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shadowOpacityAnim, {
          toValue: getShadowOpacity(elevation),
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Elevation shadows matching design system
  const elevationStyles = {
    none: {},
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  };

  const paddingStyles = {
    none: 0,
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg,
  };

  const borderRadiusStyles = {
    none: 0,
    sm: theme.borderRadius.sm,
    md: theme.borderRadius.md,
    lg: theme.borderRadius.lg,
    xl: theme.borderRadius.xl,
  };
  
  const cardStyle = [
    styles.card,
    { 
      backgroundColor,
      borderRadius: borderRadiusStyles[borderRadius],
      padding: paddingStyles[padding],
    },
    elevationStyles[elevation],
  ];

  // Animated shadow styles
  const animatedShadowStyle = {
    shadowOpacity: shadowOpacityAnim,
    elevation: elevationAnim,
  };

  const Wrapper = onPress ? TouchableOpacity : View;
  
  if (onPress) {
    return (
      <Animated.View
        style={[
          { transform: [{ scale: scaleAnim }] },
          style,
        ]}>
        <Wrapper 
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.9}
          style={[cardStyle, animatedShadowStyle]}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole="button"
          testID={testID}
        >
          {children}
        </Wrapper>
      </Animated.View>
    );
  }
  
  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // Base card styles
  },
});

export default Card;
