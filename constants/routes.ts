export const ROUTES = {
  HOME: '/',
  STORE: '/store',
  SHOP: {
    BASE: '/store',
    EDIT: '/store/edit' as const,
  },
  PRODUCT: {
    BASE: '/product',
    CREATE: '/product/create/wizard' as const,
    BY_ID: (id: string) => `/product/${id}` as const,
    EDIT: (id: string) => `/product/${id}/edit` as const,
  },
  ORDER_TRACKING: {
    BASE: '/order-tracking',
    BY_ID: (orderId: string) => `/order-tracking/${orderId}` as const,
  },
  SCHEDULE_DELIVERY: {
    BASE: '/schedule-delivery',
    BY_ORDER_ID: (orderId: string) => `/schedule-delivery/${orderId}` as const,
  },
  ADD_DELIVERY_BOY: '/add-delivery-boy',
  ORDER: '/order',
} as const;
