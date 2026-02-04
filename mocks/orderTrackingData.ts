import type { OrderTrackingData } from '@/types/order';

export const orderTrackingData: Record<string, OrderTrackingData> = {
  GH627181: {
    orderId: 'ODC98989865H711',
    productName: 'Thirumala Milk Packet',
    originalPrice: 200000,
    discountedPrice: 79999,
    discountPercentage: 50,
    paymentStatus: 'Payment Received from customer',
    statuses: [
      { id: '1', title: 'Order Confirmed', date: 'Aug 15th, 2025', description: 'Your Order has been placed.', timestamp: 'Aug 15th, 2025, 08:09PM', isCompleted: true },
      { id: '2', title: 'Shipped', date: 'Aug 16th, 2025', description: 'Your Item has been Shipped', deliveryId: 'Delivery - 9999129920012', isCompleted: true },
      { id: '3', title: 'Out For Delivery', date: 'Aug 17th, 2025', description: 'Your Item is out for delivery', timestamp: 'Aug 17th, 2025, 08:09PM', isCompleted: true },
      { id: '4', title: 'Delivered', date: 'Aug 17th, 2025', description: 'Your Item has been delivered', timestamp: 'Aug 17th, 2025, 08:09PM', isCompleted: true },
    ],
  },
  GH627182: {
    orderId: 'ODC98989865H712',
    productName: 'Thirumala Milk Packet',
    originalPrice: 200000,
    discountedPrice: 79999,
    discountPercentage: 50,
    paymentStatus: 'Payment Received from customer',
    statuses: [
      { id: '1', title: 'Order Confirmed', date: 'Aug 15th, 2025', description: 'Your Order has been placed.', timestamp: 'Aug 15th, 2025, 08:09PM', isCompleted: true },
      { id: '2', title: 'Shipped', date: 'Aug 16th, 2025', description: 'Your Item has been Shipped', deliveryId: 'Delivery - 9999129920013', isCompleted: true },
      { id: '3', title: 'Out For Delivery', date: 'Aug 17th, 2025', description: 'Your Item is out for delivery', timestamp: 'Aug 17th, 2025, 08:09PM', isCompleted: false },
      { id: '4', title: 'Delivered', date: 'Aug 17th, 2025', description: 'Your Item has been delivered', timestamp: 'Aug 17th, 2025, 08:09PM', isCompleted: false },
    ],
  },
};
