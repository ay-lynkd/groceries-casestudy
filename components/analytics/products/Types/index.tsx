export type FilterType = 'top' | 'worst' | 'low-stock' | 'trending';

export interface ProductPerformance {
  id: string;
  name: string;
  image: string;
  revenue: number;
  orders: number;
  stock: number;
  rating: number;
  returnRate: number;
  trend: 'up' | 'down' | 'stable';
}