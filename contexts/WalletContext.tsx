/**
 * Wallet Context - Manages earnings and transactions based on orders
 */

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useOrders } from './OrderContext';
import type { Order } from '@/types/order';

export interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  type: 'sale' | 'refund' | 'withdrawal';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  avatar?: string;
}

export interface EarningData {
  day: string;
  value: number;
}

interface WalletState {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  transactions: Transaction[];
  weeklyEarnings: EarningData[];
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
}

interface WalletContextType extends WalletState {
  getTransactionsByPeriod: (period: 'day' | 'week' | 'month' | 'year') => Transaction[];
  getEarningsByPeriod: (period: 'day' | 'week' | 'month' | 'year') => number;
  withdraw: (amount: number) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Generate transactions from orders
const generateTransactionsFromOrders = (orders: Order[]): Transaction[] => {
  const transactions: Transaction[] = [];
  
  orders.forEach(order => {
    // Add sale transaction for delivered orders
    if (order.status === 'delivered' && order.paymentStatus === 'received') {
      transactions.push({
        id: `txn_sale_${order.id}`,
        orderId: order.orderId,
        customerName: order.customer.name,
        amount: order.paymentAmount,
        type: 'sale',
        status: 'completed',
        date: order.timeline.find(t => t.status === 'delivered')?.timestamp || order.updatedAt,
        avatar: order.customer.image,
      });
    }
    
    // Add pending transaction for orders in progress
    if (['assigned', 'out_for_delivery'].includes(order.status) && order.paymentStatus === 'received') {
      transactions.push({
        id: `txn_pending_${order.id}`,
        orderId: order.orderId,
        customerName: order.customer.name,
        amount: order.paymentAmount,
        type: 'sale',
        status: 'pending',
        date: order.updatedAt,
        avatar: order.customer.image,
      });
    }
    
    // Add refund transactions
    if (order.paymentStatus === 'refunded' || order.paymentStatus === 'partially_refunded') {
      transactions.push({
        id: `txn_refund_${order.id}`,
        orderId: order.orderId,
        customerName: order.customer.name,
        amount: -order.paymentAmount,
        type: 'refund',
        status: 'completed',
        date: order.updatedAt,
        avatar: order.customer.image,
      });
    }
  });
  
  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate weekly earnings data
const generateWeeklyEarnings = (orders: Order[]): EarningData[] => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  const earnings: EarningData[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const dayEarnings = orders
      .filter(order => {
        const deliveredDate = order.timeline.find(t => t.status === 'delivered')?.timestamp;
        if (!deliveredDate) return false;
        const orderDate = new Date(deliveredDate);
        return orderDate >= dayStart && orderDate <= dayEnd && order.paymentStatus === 'received';
      })
      .reduce((sum, order) => sum + order.paymentAmount, 0);
    
    earnings.push({
      day: days[date.getDay()],
      value: Math.round(dayEarnings),
    });
  }
  
  return earnings;
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { orders } = useOrders();
  
  const transactions = useMemo(() => generateTransactionsFromOrders(orders), [orders]);
  
  const weeklyEarnings = useMemo(() => generateWeeklyEarnings(orders), [orders]);
  
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const totalEarnings = completedTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const todayEarnings = completedTransactions
      .filter(t => t.type === 'sale' && new Date(t.date) >= today)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const weekEarnings = completedTransactions
      .filter(t => t.type === 'sale' && new Date(t.date) >= weekAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthEarnings = completedTransactions
      .filter(t => t.type === 'sale' && new Date(t.date) >= monthAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingBalance = transactions
      .filter(t => t.status === 'pending' && t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalEarnings,
      availableBalance: totalEarnings,
      pendingBalance,
      todayEarnings,
      weekEarnings,
      monthEarnings,
    };
  }, [transactions]);
  
  const getTransactionsByPeriod = useCallback((period: 'day' | 'week' | 'month' | 'year') => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (period) {
      case 'day':
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  }, [transactions]);
  
  const getEarningsByPeriod = useCallback((period: 'day' | 'week' | 'month' | 'year') => {
    const txs = getTransactionsByPeriod(period);
    return txs
      .filter(t => t.type === 'sale' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [getTransactionsByPeriod]);
  
  const withdraw = useCallback(async (amount: number): Promise<boolean> => {
    // Simulate withdrawal
    await new Promise(resolve => setTimeout(resolve, 1000));
    return amount <= stats.availableBalance;
  }, [stats.availableBalance]);
  
  const value = useMemo(() => ({
    ...stats,
    transactions,
    weeklyEarnings,
    getTransactionsByPeriod,
    getEarningsByPeriod,
    withdraw,
  }), [stats, transactions, weeklyEarnings, getTransactionsByPeriod, getEarningsByPeriod, withdraw]);
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export default WalletContext;
