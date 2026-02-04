export const CATEGORIES = ['Groceries', 'Orders', 'Pending Orders', 'Order Status'] as const;
export type Category = (typeof CATEGORIES)[number];
export const CATEGORY_VALUES = {
  GROCERIES: 'Groceries',
  ORDERS: 'Orders',
  PENDING_ORDERS: 'Pending Orders',
  ORDER_STATUS: 'Order Status',
} as const;
