/**
 * Notification Context - Real-time notifications with WebSocket simulation
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useOrders } from './OrderContext';
import * as Haptics from 'expo-haptics';

export type NotificationType = 'order' | 'delivery' | 'payment' | 'system' | 'promo' | 'inventory';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  priority: 'high' | 'normal' | 'low';
  actionLabel?: string;
  actionData?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  pushEnabled: boolean;
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'SET_PUSH_ENABLED'; payload: boolean }
  | { type: 'UPDATE_UNREAD_COUNT' };

interface NotificationContextType extends NotificationState {
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  togglePushNotifications: (enabled: boolean) => void;
  
  // Queries
  getNotificationsByType: (type: NotificationType) => Notification[];
  getUnreadByType: (type: NotificationType) => number;
  
  // Real-time
  simulateIncomingOrder: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  pushEnabled: true,
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.read).length,
      };
    }
    case 'MARK_AS_READ': {
      const updated = state.notifications.map(n =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      return {
        ...state,
        notifications: updated,
        unreadCount: updated.filter(n => !n.read).length,
      };
    }
    case 'MARK_ALL_AS_READ': {
      const updated = state.notifications.map(n => ({ ...n, read: true }));
      return {
        ...state,
        notifications: updated,
        unreadCount: 0,
      };
    }
    case 'DELETE_NOTIFICATION': {
      const filtered = state.notifications.filter(n => n.id !== action.payload);
      return {
        ...state,
        notifications: filtered,
        unreadCount: filtered.filter(n => !n.read).length,
      };
    }
    case 'CLEAR_ALL':
      return { ...state, notifications: [], unreadCount: 0 };
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };
    case 'SET_PUSH_ENABLED':
      return { ...state, pushEnabled: action.payload };
    case 'UPDATE_UNREAD_COUNT':
      return { ...state, unreadCount: state.notifications.filter(n => !n.read).length };
    default:
      return state;
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Simulated WebSocket for demo purposes
class SimulatedWebSocket {
  private callbacks: { [key: string]: ((data: any) => void)[] } = {};
  private connected = false;

  connect() {
    this.connected = true;
    setTimeout(() => this.emit('open'), 500);
    
    // Simulate incoming notifications
    this.scheduleNotification();
  }

  disconnect() {
    this.connected = false;
    this.emit('close');
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(callback);
  }

  emit(event: string, data?: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data));
    }
  }

  private scheduleNotification() {
    if (!this.connected) return;
    
    // Random notification every 30-60 seconds
    const delay = 30000 + Math.random() * 30000;
    setTimeout(() => {
      if (this.connected) {
        const types: NotificationType[] = ['order', 'delivery', 'payment', 'system'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.emit('notification', { type, timestamp: new Date().toISOString() });
        this.scheduleNotification();
      }
    }, delay);
  }
}

const ws = new SimulatedWebSocket();

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { orders } = useOrders();
  const connectionRef = useRef<NodeJS.Timeout | null>(null);

  // Connect to WebSocket on mount
  useEffect(() => {
    ws.connect();
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });

    ws.on('notification', (data) => {
      handleIncomingNotification(data);
    });

    ws.on('close', () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  // Generate notifications from order changes
  useEffect(() => {
    const newOrders = orders.filter(o => o.status === 'new');
    if (newOrders.length > 0) {
      const latestOrder = newOrders[0];
      const existingNotification = state.notifications.find(
        n => n.data?.orderId === latestOrder.orderId
      );
      
      if (!existingNotification) {
        addNotification({
          title: 'New Order Received!',
          body: `Order #${latestOrder.orderId} worth ₹${latestOrder.paymentAmount}`,
          type: 'order',
          priority: 'high',
          data: { orderId: latestOrder.orderId, screen: 'OrderDetails' },
          actionLabel: 'View Order',
        });
      }
    }
  }, [orders]);

  const handleIncomingNotification = useCallback((data: { type: NotificationType; timestamp: string }) => {
    if (!state.pushEnabled) return;

    const notifications: Record<NotificationType, Omit<Notification, 'id' | 'read' | 'createdAt'>> = {
      order: {
        title: 'New Order!',
        body: 'You have a new order waiting for confirmation.',
        type: 'order',
        priority: 'high',
        actionLabel: 'View',
      },
      delivery: {
        title: 'Delivery Update',
        body: 'Your delivery partner is on the way.',
        type: 'delivery',
        priority: 'normal',
      },
      payment: {
        title: 'Payment Received',
        body: '₹500 has been credited to your wallet.',
        type: 'payment',
        priority: 'normal',
      },
      system: {
        title: 'System Update',
        body: 'New features are now available!',
        type: 'system',
        priority: 'low',
      },
      promo: {
        title: 'Special Offer',
        body: 'Boost your sales with today\'s promotion!',
        type: 'promo',
        priority: 'normal',
      },
      inventory: {
        title: 'Low Stock Alert',
        body: 'Some products are running low on stock.',
        type: 'inventory',
        priority: 'high',
      },
    };

    const notification = notifications[data.type];
    if (notification) {
      addNotification(notification);
    }
  }, [state.pushEnabled]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    
    // Haptic feedback for high priority notifications
    if (notification.priority === 'high') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  }, []);

  const deleteNotification = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const togglePushNotifications = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_PUSH_ENABLED', payload: enabled });
  }, []);

  const getNotificationsByType = useCallback((type: NotificationType) => {
    return state.notifications.filter(n => n.type === type);
  }, [state.notifications]);

  const getUnreadByType = useCallback((type: NotificationType) => {
    return state.notifications.filter(n => n.type === type && !n.read).length;
  }, [state.notifications]);

  const simulateIncomingOrder = useCallback(() => {
    addNotification({
      title: '🛒 New Order Received!',
      body: 'Order #ORD12345 worth ₹1,250 is waiting for your confirmation.',
      type: 'order',
      priority: 'high',
      data: { orderId: 'ORD12345', amount: 1250 },
      actionLabel: 'Accept Order',
    });
  }, [addNotification]);

  const value = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    togglePushNotifications,
    getNotificationsByType,
    getUnreadByType,
    simulateIncomingOrder,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
