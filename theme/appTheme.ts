/**
 * App theme - numeric values for React Native StyleSheet
 * Supports both light and dark themes
 */

import { ThemeColors, useTheme, lightColors, darkColors } from '@/contexts/ThemeContext';

// Base theme structure with shared values
const baseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
    },
    fontWeight: {
      normal: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },
  },
  fonts: {
    regular: "System",
    medium: "System",
    bold: "System",
    figtree: "Figtree",
    poppins: "Poppins",
    plusJakarta: "PlusJakartaSans",
  },
};

// Light theme with colors
export const lightTheme = {
  ...baseTheme,
  colors: lightColors,
} as const;

// Dark theme with colors
export const darkTheme = {
  ...baseTheme,
  colors: darkColors,
} as const;

// Original theme export for backward compatibility (defaults to light)
export const theme = lightTheme;

// Type for the light theme
export type Theme = typeof lightTheme;

// Type for the dark theme
export type DarkTheme = typeof darkTheme;

// Hook to get the current theme based on context
export function useAppTheme() {
  const { colors, isDark } = useTheme();
  
  return {
    ...baseTheme,
    colors,
    isDark,
  };
}

// Helper function to get theme colors outside of components
export function getThemeColors(isDarkMode: boolean): ThemeColors {
  return isDarkMode ? darkColors : lightColors;
}

export default theme;
