export interface Transaction {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  amount: number;
  currency: string;
  status: "received" | "sent" | "pending";
  avatar: string;
}

export interface EarningData {
  day: string;
  value: number;
}

export interface CardData {
  id: string;
  title: string;
  cardNumber: string;
  variant: "green" | "blue";
}

export const walletData = {
  userName: "Miya",
  greeting: "Morning",
  mood: "Feeling happy Today",
  totalEarnings: 5215.0,
  walletBalance: 5215.0,
  cards: [
    {
      id: "1",
      title: "Co.payment Cards",
      cardNumber: "1121",
      variant: "green",
    },
    {
      id: "2",
      title: "Smartpay",
      cardNumber: "4532",
      variant: "blue",
    },
    {
      id: "3",
      title: "Business Card",
      cardNumber: "7891",
      variant: "green",
    },
  ] as CardData[],
  transactions: [
    {
      id: "1",
      name: "Consultation – John",
      subtitle: "30 Aug, 2025",
      date: "Today, Mar 20",
      amount: 1.33,
      currency: "USD",
      status: "received",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: "2",
      name: "Consultation – Karthik",
      subtitle: "30 Aug, 2025",
      date: "Today, Mar 20",
      amount: 1.33,
      currency: "USD",
      status: "received",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
      id: "3",
      name: "Lucas Bennett",
      subtitle: "30 Aug, 2025",
      date: "Today, Mar 20",
      amount: 1.33,
      currency: "USD",
      status: "received",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
    {
      id: "4",
      name: "Oliver Hayes",
      subtitle: "30 Aug, 2025",
      date: "Today, Mar 20",
      amount: 1.33,
      currency: "USD",
      status: "received",
      avatar: "https://i.pravatar.cc/100?img=4",
    },
  ] as Transaction[],
  weeklyEarnings: [
    { day: "S", value: 150 },
    { day: "M", value: 220 },
    { day: "T", value: 180 },
    { day: "W", value: 280 },
    { day: "T", value: 455 },
    { day: "F", value: 320 },
    { day: "S", value: 200 },
  ] as EarningData[],
  periodFilters: ["Day", "Week", "Month", "Year"],
};
