/**
 * Product Context - Manages product CRUD operations and inventory
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { productsData } from '@/mocks/storeProductsData';
import type { StoreProduct } from '@/types/store';

// Actions
type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: StoreProduct[] }
  | { type: 'ADD_PRODUCT'; payload: StoreProduct }
  | { type: 'UPDATE_PRODUCT'; payload: StoreProduct }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'UPDATE_STOCK'; payload: { productId: string; quantity: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// State
interface ProductState {
  products: StoreProduct[];
  isLoading: boolean;
  error: string | null;
}

// Context type
interface ProductContextType extends ProductState {
  // Getters
  getProductById: (id: string) => StoreProduct | undefined;
  getProductsByStock: (inStock: boolean) => StoreProduct[];
  getLowStockProducts: (threshold?: number) => StoreProduct[];
  
  // Actions
  addProduct: (product: Omit<StoreProduct, 'id'>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<StoreProduct>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateStock: (productId: string, quantity: number) => Promise<boolean>;
  deductStock: (productId: string, quantity: number) => Promise<boolean>;
  
  // Loading & Error
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

// Initial state
const initialState: ProductState = {
  products: productsData,
  isLoading: false,
  error: null,
};

// Reducer
function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    case 'UPDATE_STOCK':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.productId
            ? { 
                ...p, 
                amount: (p.amount || 0) + action.payload.quantity,
                inStock: (p.amount || 0) + action.payload.quantity > 0 
              }
            : p
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

// Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider
export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const getProductById = useCallback((id: string) => {
    return state.products.find(p => p.id === id);
  }, [state.products]);

  const getProductsByStock = useCallback((inStock: boolean) => {
    return state.products.filter(p => p.inStock === inStock);
  }, [state.products]);

  const getLowStockProducts = useCallback((threshold = 10) => {
    return state.products.filter(
      p => p.inStock && p.amount !== undefined && p.amount > 0 && p.amount < threshold
    );
  }, [state.products]);

  const addProduct = useCallback(async (product: Omit<StoreProduct, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newProduct: StoreProduct = {
        ...product,
        id: `prod_${Date.now()}`,
      };
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add product' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<StoreProduct>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const product = getProductById(id);
      if (!product) throw new Error('Product not found');
      
      const updatedProduct = { ...product, ...updates };
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update product' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, [getProductById]);

  const deleteProduct = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete product' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, []);

  const updateStock = useCallback(async (productId: string, quantity: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch({ type: 'UPDATE_STOCK', payload: { productId, quantity } });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update stock' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, []);

  const deductStock = useCallback(async (productId: string, quantity: number) => {
    const product = getProductById(productId);
    if (!product || (product.amount || 0) < quantity) {
      dispatch({ type: 'SET_ERROR', payload: 'Insufficient stock' });
      return false;
    }
    return updateStock(productId, -quantity);
  }, [getProductById, updateStock]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value = useMemo(() => ({
    ...state,
    getProductById,
    getProductsByStock,
    getLowStockProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    deductStock,
    setLoading,
    clearError,
  }), [
    state,
    getProductById,
    getProductsByStock,
    getLowStockProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    deductStock,
    setLoading,
    clearError,
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

export default ProductContext;
