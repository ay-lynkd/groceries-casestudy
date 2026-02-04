import type { GraphData, RecentOrder, SummaryCardData } from "@/types/home";

export const summaryCardsData: SummaryCardData[] = [
  {
    id: 1,
    iconType: "shopping-cart",
    iconColor: "#9C27B0",
    iconBackgroundColor: "#F3E5F5",
    title: "Total Orders",
    value: "238",
    change: {
      percentage: 4.3,
      isPositive: false,
      label: "Down from yesterday",
    },
  },
  {
    id: 2,
    iconType: "wallet",
    iconColor: "#7B1FA2",
    iconBackgroundColor: "#EDE7F6",
    title: "Total Profit",
    value: "₹49,000",
    change: { percentage: 4.3, isPositive: true, label: "Up from yesterday" },
  },
  {
    id: 3,
    iconType: "person",
    iconColor: "#FF9800",
    iconBackgroundColor: "#FFF3E0",
    title: "Pending Orders",
    value: "5091",
    change: { percentage: 4.3, isPositive: true, label: "Up from yesterday" },
  },
  {
    id: 4,
    iconType: "delivery",
    iconColor: "#1976D2",
    iconBackgroundColor: "#E3F2FD",
    title: "Pending Delivers",
    value: "1022",
    change: {
      percentage: 4.3,
      isPositive: false,
      label: "Down from yesterday",
    },
  },
];

export const graphData: GraphData[] = [
  { day: "Mon", date: 10, value: 180 },
  { day: "Tues", date: 11, value: 200 },
  { day: "Weds", date: 12, value: 220 },
  { day: "Thurs", date: 13, value: 210 },
  { day: "Fri", date: 14, value: 238 },
  { day: "Sat", date: 15, value: 250 },
];

export const recentOrdersData: RecentOrder[] = [
  {
    id: 1,
    customerName: "Karthik Kumar",
    orderId: "783627834",
    itemCount: 20,
    amount: "₹500.00",
    status: "delivered",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    customerName: "Priyanaka",
    orderId: "783627834",
    itemCount: 10,
    amount: "₹500.00",
    status: "pending",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    customerName: "Rahul Kumar",
    orderId: "783627834",
    itemCount: 12,
    amount: "₹500.00",
    status: "cancelled",
    profileImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
];
