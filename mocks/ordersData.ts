import type { Order, OrderStatus, PaymentStatus, OrderItem, Customer, OrderTimelineEvent } from '@/types/order';

// Sample customers
const sampleCustomers: Customer[] = [
  {
    id: 'cust_1',
    name: 'Rakesh Kumar',
    phone: '+91 9876543210',
    email: 'rakesh.kumar@email.com',
    address: '123, Green Valley Apartments, Electronic City Phase 2, Bengaluru',
    landmark: 'Near Wipro Gate',
    image: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 'cust_2',
    name: 'Priya Sharma',
    phone: '+91 9876543211',
    email: 'priya.sharma@email.com',
    address: '456, Silver Oak Residency, Whitefield, Bengaluru',
    landmark: 'Opposite Phoenix Mall',
    image: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'cust_3',
    name: 'Amit Patel',
    phone: '+91 9876543212',
    address: '789, Golden Heights, Koramangala, Bengaluru',
    landmark: 'Near Forum Mall',
    image: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 'cust_4',
    name: 'Sneha Gupta',
    phone: '+91 9876543213',
    email: 'sneha.gupta@email.com',
    address: '321, Diamond Plaza, Indiranagar, Bengaluru',
    image: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: 'cust_5',
    name: 'Vikram Singh',
    phone: '+91 9876543214',
    address: '654, Platinum Towers, JP Nagar, Bengaluru',
    landmark: 'Near Metro Station',
    image: 'https://i.pravatar.cc/150?img=12',
  },
];

// Sample order items
const createOrderItems = (orderNum: number): OrderItem[] => {
  const items: OrderItem[] = [
    {
      id: `item_${orderNum}_1`,
      productId: '1',
      name: 'Verka Milk Packet',
      quantity: 2,
      unit: '500ml',
      price: 300,
      totalPrice: 600,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
      isPacked: false,
      isAvailable: true,
    },
    {
      id: `item_${orderNum}_2`,
      productId: '2',
      name: 'Fresh Tomatoes',
      quantity: 2,
      unit: 'KG',
      price: 150,
      totalPrice: 300,
      image: 'https://images.unsplash.com/photo-1546470427-227c7369a9b8?w=200&h=200&fit=crop',
      isPacked: false,
      isAvailable: true,
    },
    {
      id: `item_${orderNum}_3`,
      productId: '3',
      name: 'Aashirvaad Atta',
      quantity: 1,
      unit: '10KG',
      price: 300,
      totalPrice: 300,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop',
      isPacked: false,
      isAvailable: true,
    },
    {
      id: `item_${orderNum}_4`,
      productId: '4',
      name: 'Basmati Rice',
      quantity: 1,
      unit: '5KG',
      price: 180,
      totalPrice: 180,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
      isPacked: false,
      isAvailable: true,
    },
    {
      id: `item_${orderNum}_5`,
      productId: '5',
      name: 'Sunflower Oil',
      quantity: 1,
      unit: '1L',
      price: 120,
      totalPrice: 120,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
      isPacked: false,
      isAvailable: true,
    },
  ];
  
  // Return random subset for variety
  const numItems = 2 + Math.floor(Math.random() * 4); // 2-5 items
  return items.slice(0, numItems);
};

// Create timeline for an order
const createTimeline = (status: OrderStatus, createdAt: string): OrderTimelineEvent[] => {
  const events: OrderTimelineEvent[] = [
    {
      id: `event_${Date.now()}_created`,
      status: 'new',
      timestamp: createdAt,
      description: 'Order placed by customer',
      actor: 'system',
    },
  ];

  const statusFlow: OrderStatus[] = ['accepted', 'preparing', 'ready', 'assigned', 'out_for_delivery', 'delivered'];
  const currentIndex = statusFlow.indexOf(status);
  
  if (currentIndex >= 0) {
    for (let i = 0; i <= currentIndex; i++) {
      const eventStatus = statusFlow[i];
      const eventTime = new Date(new Date(createdAt).getTime() + (i + 1) * 10 * 60 * 1000).toISOString(); // +10 mins each
      
      let description = '';
      let actor: OrderTimelineEvent['actor'] = 'seller';
      
      switch (eventStatus) {
        case 'accepted':
          description = 'Order accepted by seller';
          break;
        case 'preparing':
          description = 'Started preparing items';
          break;
        case 'ready':
          description = 'All items packed and ready';
          break;
        case 'assigned':
          description = 'Delivery boy assigned';
          actor = 'system';
          break;
        case 'out_for_delivery':
          description = 'Out for delivery';
          actor = 'delivery';
          break;
        case 'delivered':
          description = 'Order delivered successfully';
          actor = 'delivery';
          break;
      }
      
      events.push({
        id: `event_${Date.now()}_${eventStatus}`,
        status: eventStatus,
        timestamp: eventTime,
        description,
        actor,
      });
    }
  }

  return events;
};

// Generate order ID
const generateOrderId = (index: number): string => {
  const prefix = 'ORD';
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const suffix = String(index).padStart(4, '0');
  return `${prefix}${date}${suffix}`;
};

// Create orders with different statuses
const createOrders = (): Order[] => {
  const now = new Date();
  
  const orders: Order[] = [
    // New orders (need acceptance)
    {
      id: 'order_1',
      orderId: generateOrderId(1),
      customer: sampleCustomers[0],
      items: createOrderItems(1),
      paymentAmount: 1500,
      paymentStatus: 'received',
      status: 'new',
      createdAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 mins ago
      updatedAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      timeline: createTimeline('new', new Date(now.getTime() - 5 * 60 * 1000).toISOString()),
    },
    {
      id: 'order_2',
      orderId: generateOrderId(2),
      customer: sampleCustomers[1],
      items: createOrderItems(2),
      paymentAmount: 800,
      paymentStatus: 'received',
      status: 'new',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 mins ago
      updatedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      timeline: createTimeline('new', new Date(now.getTime() - 15 * 60 * 1000).toISOString()),
    },
    {
      id: 'order_3',
      orderId: generateOrderId(3),
      customer: sampleCustomers[2],
      items: createOrderItems(3),
      paymentAmount: 2100,
      paymentStatus: 'pending',
      status: 'new',
      createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 mins ago
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      timeline: createTimeline('new', new Date(now.getTime() - 30 * 60 * 1000).toISOString()),
    },
    
    // Accepted orders (need to start preparing)
    {
      id: 'order_4',
      orderId: generateOrderId(4),
      customer: sampleCustomers[3],
      items: createOrderItems(4).map(item => ({ ...item, isPacked: true })), // Some items packed
      paymentAmount: 1200,
      paymentStatus: 'received',
      status: 'accepted',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      timeline: createTimeline('accepted', new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()),
    },
    
    // Preparing orders
    {
      id: 'order_5',
      orderId: generateOrderId(5),
      customer: sampleCustomers[4],
      items: createOrderItems(5).map((item, idx) => ({ ...item, isPacked: idx < 2 })), // Half packed
      paymentAmount: 950,
      paymentStatus: 'received',
      status: 'preparing',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString(),
      timeline: createTimeline('preparing', new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()),
    },
    
    // Ready for delivery assignment
    {
      id: 'order_6',
      orderId: generateOrderId(6),
      customer: sampleCustomers[0],
      items: createOrderItems(6).map(item => ({ ...item, isPacked: true })),
      paymentAmount: 1800,
      paymentStatus: 'received',
      status: 'ready',
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      timeline: createTimeline('ready', new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()),
    },
    
    // Assigned to delivery boy
    {
      id: 'order_7',
      orderId: generateOrderId(7),
      customer: sampleCustomers[1],
      items: createOrderItems(7).map(item => ({ ...item, isPacked: true })),
      paymentAmount: 650,
      paymentStatus: 'received',
      status: 'assigned',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      timeline: createTimeline('assigned', new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString()),
      deliveryAssignment: {
        deliveryBoyId: 'db_1',
        deliveryBoyName: 'Rahul Kumar',
        deliveryBoyPhone: '+91 8971267218',
        assignedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        estimatedDeliveryTime: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
      },
    },
    
    // Out for delivery
    {
      id: 'order_8',
      orderId: generateOrderId(8),
      customer: sampleCustomers[2],
      items: createOrderItems(8).map(item => ({ ...item, isPacked: true })),
      paymentAmount: 2400,
      paymentStatus: 'received',
      status: 'out_for_delivery',
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      timeline: createTimeline('out_for_delivery', new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()),
      deliveryAssignment: {
        deliveryBoyId: 'db_2',
        deliveryBoyName: 'Vijay Singh',
        deliveryBoyPhone: '+91 9876543215',
        assignedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        estimatedDeliveryTime: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
      },
    },
    
    // Delivered
    {
      id: 'order_9',
      orderId: generateOrderId(9),
      customer: sampleCustomers[3],
      items: createOrderItems(9).map(item => ({ ...item, isPacked: true })),
      paymentAmount: 1100,
      paymentStatus: 'received',
      status: 'delivered',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      updatedAt: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString(),
      timeline: createTimeline('delivered', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()),
      deliveryAssignment: {
        deliveryBoyId: 'db_1',
        deliveryBoyName: 'Rahul Kumar',
        deliveryBoyPhone: '+91 8971267218',
        assignedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        estimatedDeliveryTime: new Date(now.getTime() - 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      },
    },
    
    // Cancelled
    {
      id: 'order_10',
      orderId: generateOrderId(10),
      customer: sampleCustomers[4],
      items: createOrderItems(10),
      paymentAmount: 500,
      paymentStatus: 'refunded',
      status: 'cancelled',
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 47 * 60 * 60 * 1000).toISOString(),
      cancellationReason: 'Customer requested cancellation',
      timeline: [
        {
          id: 'event_created',
          status: 'new',
          timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
          description: 'Order placed by customer',
          actor: 'system',
        },
        {
          id: 'event_cancelled',
          status: 'cancelled',
          timestamp: new Date(now.getTime() - 47 * 60 * 60 * 1000).toISOString(),
          description: 'Order cancelled - Customer requested cancellation',
          actor: 'seller',
        },
      ],
    },
  ];

  return orders;
};

// Export the orders data
export const ordersData: Order[] = createOrders();

// Re-export types for backward compatibility
export type { Order, OrderStatus, PaymentStatus, OrderItem, Customer };

// Helper functions
export const getOrdersByStatus = (status: OrderStatus | OrderStatus[]): Order[] => {
  const statuses = Array.isArray(status) ? status : [status];
  return ordersData.filter(order => statuses.includes(order.status));
};

export const getOrderById = (orderId: string): Order | undefined => {
  return ordersData.find(order => order.orderId === orderId || order.id === orderId);
};

export const getPendingOrders = (): Order[] => {
  return ordersData.filter(order => ['new', 'accepted', 'preparing', 'ready'].includes(order.status));
};

export const getActiveDeliveries = (): Order[] => {
  return ordersData.filter(order => ['assigned', 'out_for_delivery'].includes(order.status));
};

export const getTodayOrders = (): Order[] => {
  const today = new Date().toISOString().split('T')[0];
  return ordersData.filter(order => order.createdAt.startsWith(today));
};

export const calculateTotalRevenue = (): number => {
  return ordersData
    .filter(order => order.status === 'delivered' && order.paymentStatus === 'received')
    .reduce((total, order) => total + order.paymentAmount, 0);
};

export const getOrderStats = () => {
  const total = ordersData.length;
  const newOrders = ordersData.filter(o => o.status === 'new').length;
  const preparing = ordersData.filter(o => ['accepted', 'preparing', 'ready'].includes(o.status)).length;
  const outForDelivery = ordersData.filter(o => ['assigned', 'out_for_delivery'].includes(o.status)).length;
  const delivered = ordersData.filter(o => o.status === 'delivered').length;
  const cancelled = ordersData.filter(o => o.status === 'cancelled' || o.status === 'declined').length;
  
  return {
    total,
    new: newOrders,
    preparing,
    outForDelivery,
    delivered,
    cancelled,
    completionRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
  };
};
