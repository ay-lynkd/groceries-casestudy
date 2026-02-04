/**
 * Customer Context - Customer management and analytics
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { useOrders } from './OrderContext';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  landmark?: string;
  image?: string;
  createdAt: string;
  tags?: string[];
  notes?: string;
}

export interface CustomerAnalytics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string | null;
  favoriteProducts: string[];
  orderFrequency: 'frequent' | 'regular' | 'occasional' | 'new';
}

interface CustomerWithAnalytics extends Customer {
  analytics: CustomerAnalytics;
}

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
}

type CustomerAction =
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'ADD_TAG'; payload: { customerId: string; tag: string } }
  | { type: 'REMOVE_TAG'; payload: { customerId: string; tag: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface CustomerContextType extends CustomerState {
  // Getters
  getCustomerById: (id: string) => CustomerWithAnalytics | undefined;
  getCustomersWithAnalytics: () => CustomerWithAnalytics[];
  getTopCustomers: (limit?: number) => CustomerWithAnalytics[];
  getCustomerSegments: () => Record<string, CustomerWithAnalytics[]>;
  searchCustomers: (query: string) => CustomerWithAnalytics[];
  
  // Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<boolean>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;
  addTag: (customerId: string, tag: string) => void;
  removeTag: (customerId: string, tag: string) => void;
}

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  error: null,
};

function customerReducer(state: CustomerState, action: CustomerAction): CustomerState {
  switch (action.type) {
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(c => c.id !== action.payload),
      };
    case 'ADD_TAG':
      return {
        ...state,
        customers: state.customers.map(c =>
          c.id === action.payload.customerId
            ? { ...c, tags: [...(c.tags || []), action.payload.tag] }
            : c
        ),
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        customers: state.customers.map(c =>
          c.id === action.payload.customerId
            ? { ...c, tags: c.tags?.filter(t => t !== action.payload.tag) || [] }
            : c
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

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// Generate unique customers from orders
const extractCustomersFromOrders = (orders: any[]): Customer[] => {
  const customerMap = new Map<string, Customer>();
  
  orders.forEach(order => {
    if (order.customer && !customerMap.has(order.customer.id)) {
      customerMap.set(order.customer.id, {
        ...order.customer,
        createdAt: order.createdAt,
        tags: [],
      });
    }
  });
  
  return Array.from(customerMap.values());
};

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(customerReducer, initialState);
  const { orders } = useOrders();

  // Extract customers from orders on mount
  React.useEffect(() => {
    const customers = extractCustomersFromOrders(orders);
    dispatch({ type: 'SET_CUSTOMERS', payload: customers });
  }, [orders]);

  const calculateCustomerAnalytics = useCallback((customer: Customer): CustomerAnalytics => {
    const customerOrders = orders.filter(o => o.customer.id === customer.id);
    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.paymentAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    const lastOrder = customerOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    // Calculate order frequency
    let orderFrequency: CustomerAnalytics['orderFrequency'] = 'new';
    if (totalOrders >= 10) orderFrequency = 'frequent';
    else if (totalOrders >= 5) orderFrequency = 'regular';
    else if (totalOrders >= 2) orderFrequency = 'occasional';
    
    // Get favorite products (most ordered items)
    const productCount: Record<string, number> = {};
    customerOrders.forEach(order => {
      order.items.forEach((item: any) => {
        productCount[item.name] = (productCount[item.name] || 0) + 1;
      });
    });
    
    const favoriteProducts = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
    
    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      lastOrderDate: lastOrder?.createdAt || null,
      favoriteProducts,
      orderFrequency,
    };
  }, [orders]);

  const getCustomerById = useCallback((id: string) => {
    const customer = state.customers.find(c => c.id === id);
    if (!customer) return undefined;
    return {
      ...customer,
      analytics: calculateCustomerAnalytics(customer),
    };
  }, [state.customers, calculateCustomerAnalytics]);

  const getCustomersWithAnalytics = useCallback(() => {
    return state.customers.map(customer => ({
      ...customer,
      analytics: calculateCustomerAnalytics(customer),
    }));
  }, [state.customers, calculateCustomerAnalytics]);

  const getTopCustomers = useCallback((limit = 10) => {
    return getCustomersWithAnalytics()
      .sort((a, b) => b.analytics.totalSpent - a.analytics.totalSpent)
      .slice(0, limit);
  }, [getCustomersWithAnalytics]);

  const getCustomerSegments = useCallback(() => {
    const customers = getCustomersWithAnalytics();
    return {
      frequent: customers.filter(c => c.analytics.orderFrequency === 'frequent'),
      regular: customers.filter(c => c.analytics.orderFrequency === 'regular'),
      occasional: customers.filter(c => c.analytics.orderFrequency === 'occasional'),
      new: customers.filter(c => c.analytics.orderFrequency === 'new'),
    };
  }, [getCustomersWithAnalytics]);

  const searchCustomers = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return getCustomersWithAnalytics().filter(
      c =>
        c.name.toLowerCase().includes(lowercaseQuery) ||
        c.phone.includes(lowercaseQuery) ||
        c.email?.toLowerCase().includes(lowercaseQuery) ||
        c.tags?.some(t => t.toLowerCase().includes(lowercaseQuery))
    );
  }, [getCustomersWithAnalytics]);

  const addCustomer = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newCustomer: Customer = {
        ...customer,
        id: `cust_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add customer' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, []);

  const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const customer = state.customers.find(c => c.id === id);
      if (!customer) throw new Error('Customer not found');
      
      const updatedCustomer = { ...customer, ...updates };
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update customer' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, [state.customers]);

  const deleteCustomer = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'DELETE_CUSTOMER', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete customer' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, []);

  const addTag = useCallback((customerId: string, tag: string) => {
    dispatch({ type: 'ADD_TAG', payload: { customerId, tag } });
  }, []);

  const removeTag = useCallback((customerId: string, tag: string) => {
    dispatch({ type: 'REMOVE_TAG', payload: { customerId, tag } });
  }, []);

  const value = {
    ...state,
    getCustomerById,
    getCustomersWithAnalytics,
    getTopCustomers,
    getCustomerSegments,
    searchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addTag,
    removeTag,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}

export default CustomerContext;
