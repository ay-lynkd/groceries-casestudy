/**
 * Notification System Utilities
 */

export type NotificationType = 'order' | 'delivery' | 'payment' | 'system' | 'promo';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// Notification storage (in-memory for now, should use AsyncStorage)
let notifications: Notification[] = [];
let listeners: ((notifications: Notification[]) => void)[] = [];

export const notificationService = {
  // Add a notification
  add: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications = [newNotification, ...notifications];
    notifyListeners();
    return newNotification;
  },

  // Mark as read
  markAsRead: (id: string) => {
    notifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    notifyListeners();
  },

  // Mark all as read
  markAllAsRead: () => {
    notifications = notifications.map(n => ({ ...n, read: true }));
    notifyListeners();
  },

  // Delete notification
  delete: (id: string) => {
    notifications = notifications.filter(n => n.id !== id);
    notifyListeners();
  },

  // Get all notifications
  getAll: () => notifications,

  // Get unread count
  getUnreadCount: () => notifications.filter(n => !n.read).length,

  // Subscribe to changes
  subscribe: (callback: (notifications: Notification[]) => void) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  },

  // Clear all
  clear: () => {
    notifications = [];
    notifyListeners();
  },
};

function notifyListeners() {
  listeners.forEach(callback => callback([...notifications]))
}

// Predefined notification templates
export const notificationTemplates = {
  newOrder: (orderId: string, amount: number): Omit<Notification, 'id' | 'read' | 'createdAt'> => ({
    title: 'New Order Received!',
    body: `Order #${orderId} worth ₹${amount} is waiting for your confirmation.`,
    type: 'order',
    data: { orderId, screen: 'OrderDetails' },
  }),

  orderAccepted: (orderId: string): Omit<Notification, 'id' | 'read' | 'createdAt'> => ({
    title: 'Order Accepted',
    body: `You have accepted order #${orderId}. Start preparing now!`,
    type: 'order',
    data: { orderId, screen: 'OrderDetails' },
  }),

  lowStock: (productName: string, stock: number): Omit<Notification, 'id' | 'read' | 'createdAt'> => ({
    title: 'Low Stock Alert',
    body: `${productName} is running low. Only ${stock} units left.`,
    type: 'system',
    data: { productName, screen: 'Inventory' },
  }),

  paymentReceived: (amount: number): Omit<Notification, 'id' | 'read' | 'createdAt'> => ({
    title: 'Payment Received',
    body: `₹${amount} has been credited to your wallet.`,
    type: 'payment',
    data: { amount, screen: 'Wallet' },
  }),

  deliveryAssigned: (orderId: string, deliveryBoyName: string): Omit<Notification, 'id' | 'read' | 'createdAt'> => ({
    title: 'Delivery Partner Assigned',
    body: `${deliveryBoyName} will deliver order #${orderId}.`,
    type: 'delivery',
    data: { orderId, screen: 'OrderTracking' },
  }),

  orderDelivered: (orderId: string): Omit<Notification, 'id' | 'read' | 'createdAt'> => ({
    title: 'Order Delivered',
    body: `Order #${orderId} has been successfully delivered to the customer.`,
    type: 'delivery',
    data: { orderId, screen: 'OrderDetails' },
  }),
};

export default notificationService;
