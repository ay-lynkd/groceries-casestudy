/**
 * Theme Context - Dark Mode & Theme Management
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '@/utils/offlineStorage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
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
  primary: '#4CAF50',
  background: '#F8F8F8',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
};

// Dark theme colors
const darkColors: ThemeColors = {
  primary: '#66BB6A',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: '#2C2C2C',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  // Load saved theme preference
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    const saved = await storage.get<ThemeMode>('@theme_mode');
    if (saved) {
      setModeState(saved);
    }
  };

  // Determine if dark mode is active
  const isDark = React.useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark';
    }
    return mode === 'dark';
  }, [mode, systemColorScheme]);

  // Get current colors
  const colors = isDark ? darkColors : lightColors;

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    await storage.set('@theme_mode', newMode);
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  }, [isDark, setMode]);

  const value = {
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

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { lightColors, darkColors };
export default ThemeContext;
