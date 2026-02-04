import { FilterType, ProductPerformance } from "../Types";

export const MOCK_PRODUCTS: Record<FilterType, ProductPerformance[]> = {
    top: [
      { id: '1', name: 'Organic Basmati Rice 1kg', image: '', revenue: 45600, orders: 304, stock: 45, rating: 4.8, returnRate: 0.5, trend: 'up' },
      { id: '2', name: 'Fresh Cow Milk 1L', image: '', revenue: 38400, orders: 640, stock: 120, rating: 4.7, returnRate: 1.2, trend: 'up' },
      { id: '3', name: 'Brown Eggs (Pack of 12)', image: '', revenue: 32100, orders: 428, stock: 85, rating: 4.9, returnRate: 0.8, trend: 'stable' },
      { id: '4', name: 'Whole Wheat Bread', image: '', revenue: 28900, orders: 578, stock: 32, rating: 4.6, returnRate: 2.1, trend: 'up' },
      { id: '5', name: 'Organic Turmeric Powder', image: '', revenue: 25600, orders: 320, stock: 67, rating: 4.8, returnRate: 0.3, trend: 'up' },
    ],
    worst: [
      { id: '6', name: 'Imported Cheese Slice', image: '', revenue: 1200, orders: 12, stock: 89, rating: 3.2, returnRate: 15.5, trend: 'down' },
      { id: '7', name: 'Diet Soda Pack', image: '', revenue: 2100, orders: 28, stock: 156, rating: 3.5, returnRate: 12.3, trend: 'down' },
      { id: '8', name: 'Artisanal Jam', image: '', revenue: 3400, orders: 34, stock: 78, rating: 3.8, returnRate: 8.7, trend: 'down' },
    ],
    'low-stock': [
      { id: '9', name: 'Fresh Cream 200ml', image: '', revenue: 18900, orders: 378, stock: 5, rating: 4.7, returnRate: 1.5, trend: 'stable' },
      { id: '10', name: 'Paneer 200g', image: '', revenue: 22400, orders: 448, stock: 3, rating: 4.8, returnRate: 0.9, trend: 'up' },
      { id: '11', name: 'Butter 100g', image: '', revenue: 15600, orders: 312, stock: 8, rating: 4.6, returnRate: 1.2, trend: 'up' },
    ],
    trending: [
      { id: '12', name: 'Organic Honey 500g', image: '', revenue: 38900, orders: 194, stock: 56, rating: 4.9, returnRate: 0.4, trend: 'up' },
      { id: '13', name: 'Cold Pressed Oil', image: '', revenue: 34200, orders: 171, stock: 43, rating: 4.8, returnRate: 0.6, trend: 'up' },
      { id: '14', name: 'Quinoa 500g', image: '', revenue: 29800, orders: 149, stock: 38, rating: 4.7, returnRate: 1.1, trend: 'up' },
    ],
  };
  
 export const FILTERS: { id: FilterType; label: string; icon: string }[] = [
    { id: 'top', label: 'Top Sellers', icon: 'trophy-outline' },
    { id: 'trending', label: 'Trending', icon: 'trending-up-outline' },
    { id: 'low-stock', label: 'Low Stock', icon: 'warning-outline' },
    { id: 'worst', label: 'Need Attention', icon: 'alert-circle-outline' },
  ];

  export const category= [
    { name: 'Groceries', percent: 45, revenue: 156000 },
    { name: 'Dairy', percent: 30, revenue: 104000 },
    { name: 'Beverages', percent: 15, revenue: 52000 },
    { name: 'Snacks', percent: 10, revenue: 35000 },
  ]