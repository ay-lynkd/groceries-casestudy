/**
 * Auth Context - Authentication with Biometric support
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import { storage } from '@/utils/offlineStorage';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  biometricEnabled: boolean;
  biometricAvailable: boolean;
  sessionExpiresAt: number | null;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BIOMETRIC_ENABLED'; payload: boolean }
  | { type: 'SET_BIOMETRIC_AVAILABLE'; payload: boolean }
  | { type: 'UPDATE_SESSION'; payload: number }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  
  // Biometric
  checkBiometricAvailability: () => Promise<boolean>;
  authenticateWithBiometric: () => Promise<boolean>;
  enableBiometric: (enabled: boolean) => Promise<void>;
  
  // Session
  refreshSession: () => Promise<void>;
  isSessionValid: () => boolean;
  
  // Profile
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  biometricEnabled: false,
  biometricAvailable: false,
  sessionExpiresAt: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionExpiresAt: Date.now() + SESSION_DURATION,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        biometricAvailable: state.biometricAvailable,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_BIOMETRIC_ENABLED':
      return { ...state, biometricEnabled: action.payload };
    case 'SET_BIOMETRIC_AVAILABLE':
      return { ...state, biometricAvailable: action.payload };
    case 'UPDATE_SESSION':
      return { ...state, sessionExpiresAt: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await storage.get<User>('@auth_user');
      const biometricEnabled = await storage.get<boolean>('@biometric_enabled');
      
      if (storedUser && biometricEnabled) {
        // Don't auto-login, just check if biometric is available
        dispatch({ type: 'SET_BIOMETRIC_ENABLED', payload: true });
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    }
  };

  const checkBiometricAvailability = useCallback(async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const available = compatible && enrolled;
      
      dispatch({ type: 'SET_BIOMETRIC_AVAILABLE', payload: available });
      return available;
    } catch (error) {
      console.error('Biometric check error:', error);
      dispatch({ type: 'SET_BIOMETRIC_AVAILABLE', payload: false });
      return false;
    }
  }, []);

  const authenticateWithBiometric = useCallback(async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Load stored user after successful biometric auth
        const storedUser = await storage.get<User>('@auth_user');
        if (storedUser) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: storedUser });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  }, []);

  const enableBiometric = useCallback(async (enabled: boolean) => {
    if (enabled) {
      // First authenticate to confirm
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm your identity to enable biometric login',
      });
      
      if (result.success) {
        await storage.set('@biometric_enabled', true);
        dispatch({ type: 'SET_BIOMETRIC_ENABLED', payload: true });
      }
    } else {
      await storage.set('@biometric_enabled', false);
      dispatch({ type: 'SET_BIOMETRIC_ENABLED', payload: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'admin@example.com' && password === 'password') {
        const user: User = {
          id: 'user_1',
          name: 'Admin User',
          email: 'admin@example.com',
          phone: '+91 9876543210',
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?img=11',
        };
        
        await storage.set('@auth_user', user);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      }
      
      dispatch({ type: 'SET_ERROR', payload: 'Invalid email or password' });
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please try again.' });
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await storage.remove('@auth_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        ...userData,
        id: `user_${Date.now()}`,
      };
      
      await storage.set('@auth_user', newUser);
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed. Please try again.' });
      return false;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (state.user) {
      dispatch({ type: 'UPDATE_SESSION', payload: Date.now() + SESSION_DURATION });
    }
  }, [state.user]);

  const isSessionValid = useCallback((): boolean => {
    if (!state.sessionExpiresAt) return false;
    return Date.now() < state.sessionExpiresAt;
  }, [state.sessionExpiresAt]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!state.user) return false;
      
      const updatedUser = { ...state.user, ...updates };
      await storage.set('@auth_user', updatedUser);
      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
      return false;
    }
  }, [state.user]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to change password' });
      return false;
    }
  }, []);

  const value = {
    ...state,
    login,
    logout,
    register,
    checkBiometricAvailability,
    authenticateWithBiometric,
    enableBiometric,
    refreshSession,
    isSessionValid,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
