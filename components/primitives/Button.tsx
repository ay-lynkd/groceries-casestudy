/**
 * Enhanced Button Component
 * Fixed size variants, added loading state, icon support, and press animations
 */

import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  AccessibilityState,
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  active?: boolean;
  style?: ViewStyle;
  shiny?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'tab';
  accessibilityState?: AccessibilityState;
  testID?: string;
  /**
   * Scale value when button is pressed (default: 0.95)
   */
  pressScale?: number;
  /**
   * Disable press animation
   */
  disableAnimation?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  onPress,
  active = false,
  style,
  shiny = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState,
  testID,
  pressScale = 0.95,
  disableAnimation = false,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const isShiny = shiny && active;
  const hasShadow = shiny;
  const isDisabled = disabled || loading;
  const shouldAnimate = !isDisabled && !disableAnimation;

  // Scale animation on press
  const onPressIn = () => {
    if (shouldAnimate) {
      Animated.spring(scaleAnim, {
        toValue: pressScale,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const onPressOut = () => {
    if (shouldAnimate) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  // Size configurations matching design system
  const sizeStyles = {
    sm: {
      height: 36,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.typography.fontSize.sm,
    },
    md: {
      height: 44,
      paddingHorizontal: theme.spacing.lg,
      fontSize: theme.typography.fontSize.base,
    },
    lg: {
      height: 56,
      paddingHorizontal: theme.spacing.xl,
      fontSize: theme.typography.fontSize.lg,
    },
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: theme.colors.primary.green,
      borderColor: theme.colors.primary.green,
      borderWidth: 1,
    },
    secondary: {
      backgroundColor: active ? theme.colors.primary.green : theme.colors.background.primary,
      borderColor: active ? theme.colors.primary.green : theme.colors.border.light,
      borderWidth: 1,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border.light,
      borderWidth: 1,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    danger: {
      backgroundColor: theme.colors.status.error,
      borderColor: theme.colors.status.error,
      borderWidth: 1,
    },
  };

  const textColor =
    variant === 'primary' || variant === 'danger' || (variant === 'secondary' && active)
      ? theme.colors.background.primary
      : theme.colors.text.primary;

  const currentSize = sizeStyles[size];

  const buttonContent = (
    <>
      {isShiny && (
        <View style={styles.shinyOverlay}>
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255,255,255,0.18)',
              'transparent',
              'rgba(255,255,255,0.18)',
              'transparent',
              'rgba(255,255,255,0.18)',
              'transparent',
              'rgba(255,255,255,0.18)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
      
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={textColor}
          accessibilityLabel="Loading"
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <Ionicons 
              name={leftIcon} 
              size={currentSize.fontSize} 
              color={textColor}
              style={styles.leftIcon}
            />
          )}
          <Text
            numberOfLines={1}
            style={[
              styles.text,
              {
                fontSize: currentSize.fontSize,
                color: textColor,
              },
            ]}>
            {children}
          </Text>
          {rightIcon && (
            <Ionicons 
              name={rightIcon} 
              size={currentSize.fontSize} 
              color={textColor}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </>
  );

  const buttonProps = {
    onPress: !isDisabled ? onPress : undefined,
    disabled: isDisabled,
    activeOpacity: isDisabled ? 1 : 0.8,
    accessibilityLabel: accessibilityLabel || (typeof children === 'string' ? children : 'Button'),
    accessibilityHint: accessibilityHint || (loading ? 'Loading, please wait' : undefined),
    accessibilityRole,
    accessibilityState: { 
      ...accessibilityState, 
      disabled: isDisabled,
      busy: loading 
    },
    testID,
  };

  const baseButtonStyle = [
    styles.base,
    {
      height: currentSize.height,
      paddingHorizontal: currentSize.paddingHorizontal,
      borderRadius: theme.borderRadius.full,
    },
    variantStyles[variant],
    isDisabled && styles.disabled,
    fullWidth && styles.fullWidth,
  ];

  const renderButton = () => {
    if (hasShadow) {
      return (
        <View style={[styles.shadowWrapper, fullWidth && styles.fullWidth]}>
          <View style={[styles.shadow, !active && styles.shadowInactive]} />
          <TouchableOpacity
            {...buttonProps}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={baseButtonStyle}>
            {buttonContent}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        {...buttonProps}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={baseButtonStyle}>
        {buttonContent}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth && styles.fullWidth,
        style,
      ]}>
      {renderButton()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.fonts.figtree,
    fontWeight: theme.typography.fontWeight.medium,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  rightIcon: {
    marginLeft: theme.spacing.sm,
  },
  shadowWrapper: {
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    bottom: -theme.spacing.xs,
    left: theme.spacing.xs,
    right: theme.spacing.xs,
    height: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: theme.borderRadius.full,
  },
  shadowInactive: {
    backgroundColor: '#2a2a2a',
  },
  shinyOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: theme.borderRadius.full,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
