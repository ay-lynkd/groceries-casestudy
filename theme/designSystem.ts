/**
 * Design System
 * Centralized design tokens for consistent UI
 */

import { Colors } from '@/constants/theme';

// Color palette with semantic naming
export const palette = {
  // Primary colors
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Main primary
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Secondary/Accent colors
  secondary: {
    orange: '#FF9800',
    purple: '#9C27B0',
    blue: '#2196F3',
    teal: '#009688',
  },

  // Semantic colors
  semantic: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  },

  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    black: '#000000',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F8F8',
    tertiary: '#F0F0F0',
    card: '#FFFFFF',
    modal: 'rgba(0, 0, 0, 0.5)',
  },

  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9E9E9E',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },

  // Wallet specific
  wallet: {
    darkBg: '#0D0D1A',
    darkBgMid: '#0F1028',
    darkBgEnd: '#0A0A14',
    glassBg: 'rgba(255,255,255,0.08)',
    glassBorder: 'rgba(255,255,255,0.15)',
    accent: '#00D09C',
  },
};

// Typography system
export const typography = {
  // Font families
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    figtree: 'Figtree',
    poppins: 'Poppins',
    plusJakarta: 'PlusJakartaSans',
  },

  // Font sizes (in px, will be converted to dp)
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Line heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
  },
};

// Spacing system (4px base unit)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,

  // Named spacing for semantic use
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 16,
  },
};

// Animation timings
export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Breakpoints (for responsive design)
export const breakpoints = {
  sm: 320,
  md: 375,
  lg: 414,
  xl: 768,
};

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Component-specific tokens
export const components = {
  button: {
    heights: {
      sm: 36,
      md: 44,
      lg: 56,
    },
    padding: {
      sm: { horizontal: 12 },
      md: { horizontal: 16 },
      lg: { horizontal: 24 },
    },
    borderRadius: borderRadius.full,
  },

  input: {
    height: 56,
    padding: { horizontal: 16 },
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
  },

  card: {
    padding: 16,
    borderRadius: borderRadius.lg,
    ...shadows.base,
  },

  badge: {
    height: 20,
    padding: { horizontal: 8 },
    borderRadius: borderRadius.full,
    fontSize: typography.sizes.xs,
  },

  avatar: {
    sizes: {
      sm: 32,
      md: 48,
      lg: 64,
      xl: 96,
    },
    borderRadius: borderRadius.full,
  },
};

// Dark mode colors
export const darkTheme = {
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2C2C2C',
    card: '#1E1E1E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    tertiary: '#808080',
    disabled: '#666666',
    inverse: '#121212',
  },
  border: {
    light: '#2C2C2C',
    medium: '#404040',
    dark: '#666666',
  },
};

// Export complete design system
export const designSystem = {
  palette,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  breakpoints,
  zIndex,
  components,
  darkTheme,
};

export default designSystem;
