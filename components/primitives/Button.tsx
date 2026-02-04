import { theme } from '@/theme/appTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  AccessibilityState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  active?: boolean;
  style?: ViewStyle;
  shiny?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'tab';
  accessibilityState?: AccessibilityState;
  testID?: string;
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
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState,
  testID,
}) => {
  const isShiny = shiny && active;
  const hasShadow = shiny;

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
  };

  const textColor =
    variant === 'primary' || (variant === 'secondary' && active)
      ? '#FFFFFF'
      : theme.colors.text.primary;

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
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          {
            fontSize:
              size === 'sm' ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
            color: textColor,
          },
        ]}>
        {children}
      </Text>
    </>
  );

  if (hasShadow) {
    return (
      <View style={[styles.shadowWrapper, style]}>
        <View style={[styles.shadow, !active && styles.shadowInactive]} />
        <TouchableOpacity
          onPress={!disabled ? onPress : undefined}
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.8}
          style={[
            styles.base,
            styles.shinyBase,
            variantStyles[variant],
            disabled && styles.disabled,
            style,
          ]}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole={accessibilityRole}
          accessibilityState={{ ...accessibilityState, disabled }}
          testID={testID}>
          {buttonContent}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        styles.base,
        styles.nonShinyBase,
        variantStyles[variant],
        disabled && styles.disabled,
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled }}
      testID={testID}>
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shinyBase: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    overflow: 'hidden',
  },
  nonShinyBase: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  shadowWrapper: {
    position: 'relative',
    minHeight: 48,
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
  text: {
    fontFamily: theme.fonts.figtree,
    fontWeight: theme.typography.fontWeight.medium,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
