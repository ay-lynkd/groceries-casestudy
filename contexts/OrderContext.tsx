/**
 * Order Context - Global state management for orders
 * Handles order state transitions, validation, and notifications
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type { 
  Order, 
  OrderStatus, 
  OrderAction, 
  OrderTimelineEvent,
  PaymentStatus 
} from '@/types/order';
import { isValidTransition, getAvailableActions, ORDER_STATUS_CONFIG } from '@/types/order';

// Action types for reducer
type OrderContextAction =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; newStatus: OrderStatus; notes?: string } }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_ITEM_PACKED_STATUS'; payload: { orderId: string; itemId: string; isPacked: boolean } }
  | { type: 'ASSIGN_DELIVERY'; payload: { orderId: string; deliveryBoyId: string; deliveryBoyName: string; deliveryBoyPhone: string } }
  | { type: 'ADD_TIMELINE_EVENT'; payload: { orderId: string; event: OrderTimelineEvent } };

// State interface
interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Context interface
interface OrderContextType {
  // State
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  
  // Getters
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus | OrderStatus[]) => Order[];
  getPendingOrders: () => Order[];
  getActiveOrders: () => Order[];
  getCompletedOrders: () => Order[];
  getAvailableActionsForOrder: (orderId: string) => OrderAction[];
  canTransitionTo: (orderId: string, newStatus: OrderStatus) => boolean;
  
  // Actions
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => Promise<boolean>;
  acceptOrder: (orderId: string) => Promise<boolean>;
  declineOrder: (orderId: string, reason?: string) => Promise<boolean>;
  startPreparing: (orderId: string) => Promise<boolean>;
  markReady: (orderId: string) => Promise<boolean>;
  assignDelivery: (orderId: string, deliveryBoyId: string, deliveryBoyName: string, deliveryBoyPhone: string) => Promise<boolean>;
  markOutForDelivery: (orderId: string) => Promise<boolean>;
  markDelivered: (orderId: string) => Promise<boolean>;
  cancelOrder: (orderId: string, reason: string) => Promise<boolean>;
  updateItemPackedStatus: (orderId: string, itemId: string, isPacked: boolean) => void;
  
  // Loading & Error
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  refreshOrders: () => Promise<void>;
}

// Initial state
const initialState: OrderState = {
  orders: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Reducer
function orderReducer(state: OrderState, action: OrderContextAction): OrderState {
  switch (action.type) {
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
        lastUpdated: new Date().toISOString(),
      };
    
    case 'UPDATE_ORDER_STATUS': {
      const { orderId, newStatus, notes } = action.payload;
      return {
        ...state,
        orders: state.orders.map(order => {
          if (order.id !== orderId) return order;
          
          const newEvent: OrderTimelineEvent = {
            id: `event_${Date.now()}`,
            status: newStatus,
            timestamp: new Date().toISOString(),
            description: ORDER_STATUS_CONFIG[newStatus].description,
            actor: 'seller',
          };
          
          return {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            timeline: [...order.timeline, newEvent],
            ...(notes && { notes }),
            ...(newStatus === 'cancelled' && notes && { cancellationReason: notes }),
          };
        }),
        lastUpdated: new Date().toISOString(),
      };
    }
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        lastUpdated: new Date().toISOString(),
      };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        ),
        lastUpdated: new Date().toISOString(),
      };
    
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload),
        lastUpdated: new Date().toISOString(),
      };
    
    case 'UPDATE_ITEM_PACKED_STATUS':
      const { orderId: oid, itemId, isPacked } = action.payload;
      return {
        ...state,
        orders: state.orders.map(order => {
          if (order.id !== oid) return order;
          return {
            ...order,
            items: order.items.map(item => 
              item.id === itemId ? { ...item, isPacked } : item
            ),
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    
    case 'ASSIGN_DELIVERY':
      const { orderId: assignOid, deliveryBoyId, deliveryBoyName, deliveryBoyPhone } = action.payload;
      return {
        ...state,
        orders: state.orders.map(order => {
          if (order.id !== assignOid) return order;
          
          const assignEvent: OrderTimelineEvent = {
            id: `event_${Date.now()}`,
            status: 'assigned',
            timestamp: new Date().toISOString(),
            description: `Delivery assigned to ${deliveryBoyName}`,
            actor: 'seller',
          };
          
          return {
            ...order,
            status: 'assigned',
            deliveryAssignment: {
              deliveryBoyId,
              deliveryBoyName,
              deliveryBoyPhone,
              assignedAt: new Date().toISOString(),
            },
            timeline: [...order.timeline, assignEvent],
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    
    case 'ADD_TIMELINE_EVENT':
      const { orderId: timelineOid, event } = action.payload;
      return {
        ...state,
        orders: state.orders.map(order => {
          if (order.id !== timelineOid) return order;
          return {
            ...order,
            timeline: [...order.timeline, event],
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

// Create context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export function OrderProvider({ children, initialOrders = [] }: { children: React.ReactNode; initialOrders?: Order[] }) {
  const [state, dispatch] = useReducer(orderReducer, {
    ...initialState,
    orders: initialOrders,
  });

  // Getters
  const getOrderById = useCallback((orderId: string) => {
    return state.orders.find(order => order.orderId === orderId || order.id === orderId);
  }, [state.orders]);

  const getOrdersByStatus = useCallback((status: OrderStatus | OrderStatus[]) => {
    const statuses = Array.isArray(status) ? status : [status];
    return state.orders.filter(order => statuses.includes(order.status));
  }, [state.orders]);

  const getPendingOrders = useCallback(() => {
    return state.orders.filter(order => 
      ['new', 'accepted', 'preparing', 'ready'].includes(order.status)
    );
  }, [state.orders]);

  const getActiveOrders = useCallback(() => {
    return state.orders.filter(order => 
      ['assigned', 'out_for_delivery'].includes(order.status)
    );
  }, [state.orders]);

  const getCompletedOrders = useCallback(() => {
    return state.orders.filter(order => 
      ['delivered', 'cancelled', 'declined'].includes(order.status)
    );
  }, [state.orders]);

  const getAvailableActionsForOrder = useCallback((orderId: string) => {
    const order = getOrderById(orderId);
    if (!order) return [];
    return getAvailableActions(order.status);
  }, [getOrderById]);

  const canTransitionTo = useCallback((orderId: string, newStatus: OrderStatus) => {
    const order = getOrderById(orderId);
    if (!order) return false;
    return isValidTransition(order.status, newStatus);
  }, [getOrderById]);

  // Actions
  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus, notes?: string): Promise<boolean> => {
    const order = getOrderById(orderId);
    if (!order) {
      dispatch({ type: 'SET_ERROR', payload: 'Order not found' });
      return false;
    }

    if (!isValidTransition(order.status, newStatus)) {
      dispatch({ type: 'SET_ERROR', payload: `Cannot transition from ${order.status} to ${newStatus}` });
      return false;
    }

    // Simulate API call
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // In real app, make API call here
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ 
        type: 'UPDATE_ORDER_STATUS', 
        payload: { orderId: order.id, newStatus, notes } 
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update order status' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, [getOrderById]);

  const acceptOrder = useCallback((orderId: string) => {
    return updateOrderStatus(orderId, 'accepted');
  }, [updateOrderStatus]);

  const declineOrder = useCallback((orderId: string, reason?: string) => {
    return updateOrderStatus(orderId, 'declined', reason);
  }, [updateOrderStatus]);

  const startPreparing = useCallback((orderId: string) => {
    return updateOrderStatus(orderId, 'preparing');
  }, [updateOrderStatus]);

  const markReady = useCallback((orderId: string) => {
    return updateOrderStatus(orderId, 'ready');
  }, [updateOrderStatus]);

  const assignDelivery = useCallback(async (orderId: string, deliveryBoyId: string, deliveryBoyName: string, deliveryBoyPhone: string): Promise<boolean> => {
    const order = getOrderById(orderId);
    if (!order) {
      dispatch({ type: 'SET_ERROR', payload: 'Order not found' });
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ 
        type: 'ASSIGN_DELIVERY', 
        payload: { orderId: order.id, deliveryBoyId, deliveryBoyName, deliveryBoyPhone } 
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to assign delivery' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, [getOrderById]);

  const markOutForDelivery = useCallback((orderId: string) => {
    return updateOrderStatus(orderId, 'out_for_delivery');
  }, [updateOrderStatus]);

  const markDelivered = useCallback((orderId: string) => {
    return updateOrderStatus(orderId, 'delivered');
  }, [updateOrderStatus]);

  const cancelOrder = useCallback((orderId: string, reason: string) => {
    return updateOrderStatus(orderId, 'cancelled', reason);
  }, [updateOrderStatus]);

  const updateItemPackedStatus = useCallback((orderId: string, itemId: string, isPacked: boolean) => {
    const order = getOrderById(orderId);
    if (!order) return;
    
    dispatch({ 
      type: 'UPDATE_ITEM_PACKED_STATUS', 
      payload: { orderId: order.id, itemId, isPacked } 
    });
  }, [getOrderById]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const refreshOrders = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // In real app, fetch from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh orders' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const value = useMemo(() => ({
    ...state,
    getOrderById,
    getOrdersByStatus,
    getPendingOrders,
    getActiveOrders,
    getCompletedOrders,
    getAvailableActionsForOrder,
    canTransitionTo,
    updateOrderStatus,
    acceptOrder,
    declineOrder,
    startPreparing,
    markReady,
    assignDelivery,
    markOutForDelivery,
    markDelivered,
    cancelOrder,
    updateItemPackedStatus,
    setLoading,
    clearError,
    refreshOrders,
  }), [
    state,
    getOrderById,
    getOrdersByStatus,
    getPendingOrders,
    getActiveOrders,
    getCompletedOrders,
    getAvailableActionsForOrder,
    canTransitionTo,
    updateOrderStatus,
    acceptOrder,
    declineOrder,
    startPreparing,
    markReady,
    assignDelivery,
    markOutForDelivery,
    markDelivered,
    cancelOrder,
    updateItemPackedStatus,
    setLoading,
    clearError,
    refreshOrders,
  ]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

// Custom hook
export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

export default OrderContext;
