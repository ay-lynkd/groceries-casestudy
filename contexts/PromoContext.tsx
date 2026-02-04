/**
 * Promo Context - Manages promotional codes and discounts
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

export type DiscountType = 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_shipping';

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  applicableProducts?: string[]; // Product IDs, empty = all
  applicableCategories?: string[];
  isActive: boolean;
  createdAt: string;
}

interface PromoState {
  promos: PromoCode[];
  isLoading: boolean;
  error: string | null;
}

type PromoAction =
  | { type: 'SET_PROMOS'; payload: PromoCode[] }
  | { type: 'ADD_PROMO'; payload: PromoCode }
  | { type: 'UPDATE_PROMO'; payload: PromoCode }
  | { type: 'DELETE_PROMO'; payload: string }
  | { type: 'INCREMENT_USAGE'; payload: string }
  | { type: 'TOGGLE_ACTIVE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface PromoContextType extends PromoState {
  // Getters
  getActivePromos: () => PromoCode[];
  getValidPromos: (orderAmount: number) => PromoCode[];
  validatePromo: (code: string, orderAmount: number) => { valid: boolean; discount: number; message?: string };
  getPromoByCode: (code: string) => PromoCode | undefined;
  
  // Actions
  createPromo: (promo: Omit<PromoCode, 'id' | 'usageCount' | 'createdAt'>) => Promise<boolean>;
  updatePromo: (id: string, updates: Partial<PromoCode>) => Promise<boolean>;
  deletePromo: (id: string) => Promise<boolean>;
  applyPromo: (code: string, orderAmount: number) => Promise<{ success: boolean; discount: number; finalAmount: number }>;
  togglePromoStatus: (id: string) => void;
  
  // Analytics
  getPromoAnalytics: () => { totalPromos: number; activePromos: number; totalUsage: number };
}

const initialState: PromoState = {
  promos: [
    {
      id: 'promo_1',
      code: 'WELCOME20',
      description: '20% off on your first order',
      discountType: 'percentage',
      discountValue: 20,
      maxDiscountAmount: 200,
      usageLimit: 100,
      usageCount: 45,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'promo_2',
      code: 'FLAT50',
      description: '₹50 off on orders above ₹500',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 500,
      usageLimit: 200,
      usageCount: 120,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'promo_3',
      code: 'FREESHIP',
      description: 'Free delivery on orders above ₹999',
      discountType: 'free_shipping',
      discountValue: 0,
      minOrderAmount: 999,
      usageLimit: 500,
      usageCount: 89,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  isLoading: false,
  error: null,
};

function promoReducer(state: PromoState, action: PromoAction): PromoState {
  switch (action.type) {
    case 'SET_PROMOS':
      return { ...state, promos: action.payload };
    case 'ADD_PROMO':
      return { ...state, promos: [...state.promos, action.payload] };
    case 'UPDATE_PROMO':
      return {
        ...state,
        promos: state.promos.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'DELETE_PROMO':
      return {
        ...state,
        promos: state.promos.filter(p => p.id !== action.payload),
      };
    case 'INCREMENT_USAGE':
      return {
        ...state,
        promos: state.promos.map(p =>
          p.id === action.payload ? { ...p, usageCount: p.usageCount + 1 } : p
        ),
      };
    case 'TOGGLE_ACTIVE':
      return {
        ...state,
        promos: state.promos.map(p =>
          p.id === action.payload ? { ...p, isActive: !p.isActive } : p
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export function PromoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(promoReducer, initialState);

  const getActivePromos = useCallback(() => {
    const now = new Date().toISOString();
    return state.promos.filter(p => 
      p.isActive && 
      p.startDate <= now && 
      p.endDate >= now &&
      (!p.usageLimit || p.usageCount < p.usageLimit)
    );
  }, [state.promos]);

  const getValidPromos = useCallback((orderAmount: number) => {
    return getActivePromos().filter(p => 
      !p.minOrderAmount || orderAmount >= p.minOrderAmount
    );
  }, [getActivePromos]);

  const getPromoByCode = useCallback((code: string) => {
    return state.promos.find(p => p.code.toUpperCase() === code.toUpperCase());
  }, [state.promos]);

  const validatePromo = useCallback((code: string, orderAmount: number): { valid: boolean; discount: number; message?: string } => {
    const promo = getPromoByCode(code);
    
    if (!promo) {
      return { valid: false, discount: 0, message: 'Invalid promo code' };
    }

    if (!promo.isActive) {
      return { valid: false, discount: 0, message: 'This promo code is inactive' };
    }

    const now = new Date().toISOString();
    if (promo.startDate > now) {
      return { valid: false, discount: 0, message: 'This promo code is not yet active' };
    }
    if (promo.endDate < now) {
      return { valid: false, discount: 0, message: 'This promo code has expired' };
    }

    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return { valid: false, discount: 0, message: 'This promo code has reached its usage limit' };
    }

    if (promo.minOrderAmount && orderAmount < promo.minOrderAmount) {
      return { valid: false, discount: 0, message: `Minimum order amount of ₹${promo.minOrderAmount} required` };
    }

    // Calculate discount
    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (orderAmount * promo.discountValue) / 100;
      if (promo.maxDiscountAmount) {
        discount = Math.min(discount, promo.maxDiscountAmount);
      }
    } else if (promo.discountType === 'fixed') {
      discount = promo.discountValue;
    } else if (promo.discountType === 'free_shipping') {
      discount = 40; // Assuming average shipping cost
    }

    return { valid: true, discount };
  }, [getPromoByCode]);

  const createPromo = useCallback(async (promo: Omit<PromoCode, 'id' | 'usageCount' | 'createdAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newPromo: PromoCode = {
        ...promo,
        id: `promo_${Date.now()}`,
        usageCount: 0,
        createdAt: new Date().toISOString(),
      };
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'ADD_PROMO', payload: newPromo });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create promo' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, []);

  const updatePromo = useCallback(async (id: string, updates: Partial<PromoCode>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const promo = state.promos.find(p => p.id === id);
      if (!promo) throw new Error('Promo not found');
      
      const updatedPromo = { ...promo, ...updates };
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'UPDATE_PROMO', payload: updatedPromo });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update promo' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, [state.promos]);

  const deletePromo = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'DELETE_PROMO', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete promo' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, []);

  const applyPromo = useCallback(async (code: string, orderAmount: number) => {
    const validation = validatePromo(code, orderAmount);
    
    if (!validation.valid) {
      return { success: false, discount: 0, finalAmount: orderAmount };
    }

    const promo = getPromoByCode(code);
    if (promo) {
      dispatch({ type: 'INCREMENT_USAGE', payload: promo.id });
    }

    return {
      success: true,
      discount: validation.discount,
      finalAmount: orderAmount - validation.discount,
    };
  }, [validatePromo, getPromoByCode]);

  const togglePromoStatus = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_ACTIVE', payload: id });
  }, []);

  const getPromoAnalytics = useCallback(() => {
    return {
      totalPromos: state.promos.length,
      activePromos: state.promos.filter(p => p.isActive).length,
      totalUsage: state.promos.reduce((sum, p) => sum + p.usageCount, 0),
    };
  }, [state.promos]);

  const value = {
    ...state,
    getActivePromos,
    getValidPromos,
    validatePromo,
    getPromoByCode,
    createPromo,
    updatePromo,
    deletePromo,
    applyPromo,
    togglePromoStatus,
    getPromoAnalytics,
  };

  return (
    <PromoContext.Provider value={value}>
      {children}
    </PromoContext.Provider>
  );
}

export function usePromos() {
  const context = useContext(PromoContext);
  if (context === undefined) {
    throw new Error('usePromos must be used within a PromoProvider');
  }
  return context;
}

export default PromoContext;
