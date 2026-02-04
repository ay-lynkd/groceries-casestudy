/**
 * ThemeToggle Component
 * A reusable component for toggling between light and dark themes
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { Text } from './Text';

interface ThemeToggleProps {
  variant?: 'button' | 'icon' | 'switch';
  showLabel?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onToggle?: () => void;
}

export function ThemeToggle({
  variant = 'button',
  showLabel = true,
  style,
  textStyle,
  onToggle,
}: ThemeToggleProps) {
  const { isDark, toggleTheme, mode, setMode, colors } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    onToggle?.();
  };

  const getIcon = () => {
    if (isDark) {
      return '🌙';
    }
    return '☀️';
  };

  const getLabel = () => {
    if (mode === 'system') {
      return 'Auto';
    }
    return isDark ? 'Dark' : 'Light';
  };

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={handleToggle}
        style={[styles.iconButton, style]}
        activeOpacity={0.8}
        accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        accessibilityRole="button"
      >
        <Text style={[styles.icon, textStyle]}>{getIcon()}</Text>
      </TouchableOpacity>
    );
  }

  // Switch variant with mode cycling (light -> dark -> system -> light)
  if (variant === 'switch') {
    const cycleMode = () => {
      const modes: ThemeMode[] = ['light', 'dark', 'system'];
      const currentIndex = modes.indexOf(mode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      setMode(nextMode);
      onToggle?.();
    };

    return (
      <TouchableOpacity
        onPress={cycleMode}
        style={[
          styles.switchButton,
          { backgroundColor: colors.background.card, borderColor: colors.border.light },
          style,
        ]}
        activeOpacity={0.8}
        accessibilityLabel={`Theme mode: ${mode}. Tap to cycle`}
        accessibilityRole="button"
      >
        <Text style={[styles.switchIcon, textStyle]}>{getIcon()}</Text>
        {showLabel && (
          <Text style={[styles.switchLabel, { color: colors.text.primary }, textStyle]}>
            {getLabel()}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  // Default button variant
  return (
    <TouchableOpacity
      onPress={handleToggle}
      style={[
        styles.button,
        {
          backgroundColor: isDark ? colors.background.card : colors.primary.green,
          borderColor: colors.border.light,
        },
        style,
      ]}
      activeOpacity={0.8}
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      accessibilityRole="button"
    >
      <Text style={styles.icon}>{getIcon()}</Text>
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color: isDark ? colors.text.primary : '#FFFFFF' },
            textStyle,
          ]}
        >
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  icon: {
    fontSize: 18,
  },
  switchIcon: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ThemeToggle;
