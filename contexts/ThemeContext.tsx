/**
 * Theme Context - Dark Mode & Theme Management
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme, Appearance, type ColorSchemeName } from 'react-native';
import { storage } from '@/utils/offlineStorage';

export type ThemeMode = 'light' | 'dark' | 'system';

// Theme colors using design system
export interface ThemeColors {
  // Primary colors
  primary: {
    green: string;
    purple: string;
    darkPurple: string;
    orange: string;
  };
  // Status colors
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
  };
  // Text colors
  text: {
    primary: string;
    secondary: string;
    light: string;
    inverse: string;
  };
  // Border colors
  border: {
    light: string;
    medium: string;
    dark: string;
  };
  // Badge colors
  badge: {
    delivered: string;
    pending: string;
    cancelled: string;
  };
  // Wallet colors
  wallet: {
    darkBg: string;
    darkBgMid: string;
    darkBgEnd: string;
    glassBg: string;
    glassBorder: string;
    accent: string;
    cardBg: string;
    smartpayBg: string;
  };
}

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => void;
}

// Light theme colors
const lightColors: ThemeColors = {
  primary: {
    green: '#4CAF50',
    purple: '#9C27B0',
    darkPurple: '#7B1FA2',
    orange: '#FF9800',
  },
  status: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F8F8',
    tertiary: '#F0F0F0',
    card: '#FFFFFF',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    light: '#9E9E9E',
    inverse: '#FFFFFF',
  },
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
  badge: {
    delivered: '#E3F2FD',
    pending: '#FFF9C4',
    cancelled: '#FFEBEE',
  },
  wallet: {
    darkBg: '#0D0D1A',
    darkBgMid: '#0F1028',
    darkBgEnd: '#0A0A14',
    glassBg: 'rgba(255,255,255,0.08)',
    glassBorder: 'rgba(255,255,255,0.15)',
    accent: '#00D09C',
    cardBg: '#2D5A4A',
    smartpayBg: '#1E3A5F',
  },
};

// Dark theme colors - using designSystem.ts darkTheme
const darkColors: ThemeColors = {
  primary: {
    green: '#66BB6A',
    purple: '#BA68C8',
    darkPurple: '#9C27B0',
    orange: '#FFB74D',
  },
  status: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  },
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2C2C2C',
    card: '#1E1E1E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    light: '#808080',
    inverse: '#121212',
  },
  border: {
    light: '#2C2C2C',
    medium: '#404040',
    dark: '#666666',
  },
  badge: {
    delivered: '#1E3A5F',
    pending: '#3D3D1E',
    cancelled: '#3D1E1E',
  },
  wallet: {
    darkBg: '#0D0D1A',
    darkBgMid: '#0F1028',
    darkBgEnd: '#0A0A14',
    glassBg: 'rgba(255,255,255,0.08)',
    glassBorder: 'rgba(255,255,255,0.15)',
    accent: '#00D09C',
    cardBg: '#2D5A4A',
    smartpayBg: '#1E3A5F',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  // Load saved theme preference on mount
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      // When system theme changes and mode is 'system', re-render with new scheme
      if (mode === 'system') {
        // Force re-render by triggering a state update
        setModeState('system');
      }
    });

    return () => subscription.remove();
  }, [mode]);

  const loadSavedTheme = async () => {
    try {
      const saved = await storage.get<ThemeMode>(THEME_STORAGE_KEY);
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        setModeState(saved);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  // Determine if dark mode is active based on mode and system preference
  const isDark = React.useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark';
    }
    return mode === 'dark';
  }, [mode, systemColorScheme]);

  // Get current colors based on isDark
  const colors = isDark ? darkColors : lightColors;

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await storage.set(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  }, [isDark, setMode]);

  const value: ThemeContextType = {
    mode,
    isDark,
    colors,
    setMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { lightColors, darkColors };
export default ThemeContext;
