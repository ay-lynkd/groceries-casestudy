export type IconType = "shopping-cart" | "wallet" | "person" | "delivery";

export type CardVariant = "default" | "highlighted";

export interface SummaryCardData {
  id: number;
  iconType: IconType;
  iconColor: string;
  iconBackgroundColor: string;
  title: string;
  value: string;
  change: { percentage: number; isPositive: boolean; label: string };
  variant?: CardVariant;
}

export interface RecentOrder {
  id: number;
  customerName: string;
  orderId: string;
  itemCount: number;
  amount: string;
  status: "delivered" | "pending" | "cancelled";
  profileImage?: string;
}

export interface GraphData {
  day: string;
  date: number;
  value: number;
}
