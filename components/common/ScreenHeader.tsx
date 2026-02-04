/**
 * Standardized Screen Header Component
 * Consistent header styling across all screens
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/theme/appTheme';
import { Text } from './Text';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  size?: 'large' | 'medium' | 'small';
  style?: ViewStyle;
  onBackPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  rightAction,
  size = 'medium',
  style,
  onBackPress,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const titleStyles = {
    large: styles.titleLarge,
    medium: styles.titleMedium,
    small: styles.titleSmall,
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {/* Left - Back Button */}
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityHint="Navigates to the previous screen"
              accessibilityRole="button"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="chevron-back"
                size={28}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Center - Title */}
        <View style={styles.centerSection}>
          <Text style={[styles.title, titleStyles[size]]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right - Action */}
        <View style={styles.rightSection}>
          {rightAction || <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingTop: theme.spacing.xl + 20, // Account for status bar
    minHeight: 100,
  },
  leftSection: {
    width: 44,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  rightSection: {
    width: 44,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  titleLarge: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
  },
  titleMedium: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  },
  titleSmall: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  placeholder: {
    width: 44,
  },
});

export default ScreenHeader;
