/**
 * Order status with proper state machine transitions
 */
export type OrderStatus = 
  | 'new' 
  | 'accepted' 
  | 'preparing' 
  | 'ready' 
  | 'assigned' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled' 
  | 'declined';

/**
 * Payment status types
 */
export type PaymentStatus = 'pending' | 'received' | 'failed' | 'refunded' | 'partially_refunded';

/**
 * Order item details
 */
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  image?: string;
  isPacked: boolean;
  isAvailable: boolean;
}

/**
 * Customer details
 */
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  landmark?: string;
  image?: string;
}

/**
 * Delivery boy details
 */
export interface DeliveryAssignment {
  deliveryBoyId?: string;
  deliveryBoyName?: string;
  deliveryBoyPhone?: string;
  assignedAt?: string;
  estimatedDeliveryTime?: string;
}

/**
 * Complete Order interface
 */
export interface Order {
  id: string;
  orderId: string;
  customer: Customer;
  items: OrderItem[];
  paymentAmount: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deliveryAssignment?: DeliveryAssignment;
  notes?: string;
  cancellationReason?: string;
  timeline: OrderTimelineEvent[];
}

/**
 * Order timeline event
 */
export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  timestamp: string;
  description: string;
  actor: 'system' | 'seller' | 'customer' | 'delivery';
}

/**
 * Order action types
 */
export type OrderAction = 
  | 'accept'
  | 'decline' 
  | 'start_preparing'
  | 'mark_ready'
  | 'assign_delivery'
  | 'mark_out_for_delivery'
  | 'mark_delivered'
  | 'cancel'
  | 'track';

/**
 * Valid state transitions mapping
 */
export const VALID_STATE_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  'new': ['accepted', 'declined', 'cancelled'],
  'accepted': ['preparing', 'cancelled'],
  'preparing': ['ready', 'cancelled'],
  'ready': ['assigned', 'cancelled'],
  'assigned': ['out_for_delivery', 'cancelled'],
  'out_for_delivery': ['delivered'],
  'delivered': [], // Terminal state
  'cancelled': [], // Terminal state
  'declined': [], // Terminal state
};

/**
 * Order status configuration for UI
 */
export interface OrderStatusConfig {
  label: string;
  color: string;
  backgroundColor: string;
  icon: string;
  description: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
  'new': {
    label: 'New Order',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    icon: 'sparkles',
    description: 'New order received',
  },
  'accepted': {
    label: 'Accepted',
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
    icon: 'checkmark-circle',
    description: 'Order accepted by seller',
  },
  'preparing': {
    label: 'Preparing',
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
    icon: 'restaurant',
    description: 'Items being prepared',
  },
  'ready': {
    label: 'Ready',
    color: '#9C27B0',
    backgroundColor: '#F3E5F5',
    icon: 'bag-check',
    description: 'Ready for pickup',
  },
  'assigned': {
    label: 'Assigned',
    color: '#00BCD4',
    backgroundColor: '#E0F7FA',
    icon: 'person-add',
    description: 'Delivery boy assigned',
  },
  'out_for_delivery': {
    label: 'Out for Delivery',
    color: '#FF5722',
    backgroundColor: '#FBE9E7',
    icon: 'bicycle',
    description: 'On the way',
  },
  'delivered': {
    label: 'Delivered',
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
    icon: 'checkmark-done-circle',
    description: 'Successfully delivered',
  },
  'cancelled': {
    label: 'Cancelled',
    color: '#F44336',
    backgroundColor: '#FFEBEE',
    icon: 'close-circle',
    description: 'Order cancelled',
  },
  'declined': {
    label: 'Declined',
    color: '#F44336',
    backgroundColor: '#FFEBEE',
    icon: 'close-circle',
    description: 'Order declined',
  },
};

/**
 * Get available actions for an order status
 */
export const getAvailableActions = (status: OrderStatus): OrderAction[] => {
  switch (status) {
    case 'new':
      return ['accept', 'decline'];
    case 'accepted':
      return ['start_preparing', 'cancel'];
    case 'preparing':
      return ['mark_ready', 'cancel'];
    case 'ready':
      return ['assign_delivery', 'cancel'];
    case 'assigned':
      return ['mark_out_for_delivery', 'cancel'];
    case 'out_for_delivery':
      return ['mark_delivered'];
    case 'delivered':
      return ['track'];
    case 'cancelled':
    case 'declined':
      return [];
    default:
      return [];
  }
};

/**
 * Check if a state transition is valid
 */
export const isValidTransition = (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
  return VALID_STATE_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
};

/**
 * Get next logical statuses for current status
 */
export const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  return VALID_STATE_TRANSITIONS[currentStatus] ?? [];
};

// Legacy interfaces for backward compatibility
export interface OrderStatusItem {
  id: string;
  productName: string;
  orderId: string;
  quantity: string;
  deliveryRecipient: string;
  productImage?: string;
}

export interface OrderTrackingStatus {
  id: string;
  title: string;
  date: string;
  description: string;
  timestamp?: string;
  deliveryId?: string;
  isCompleted: boolean;
}

export interface OrderTrackingData {
  orderId: string;
  productName: string;
  productImage?: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  paymentStatus: string;
  statuses: OrderTrackingStatus[];
}
