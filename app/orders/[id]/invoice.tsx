/**
 * Order Invoice Screen
 * Generate and print/share order invoice
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '@/contexts/OrderContext';
import { formatCurrency } from '@/utils/formatters';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

export default function InvoiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrders();
  const { colors } = theme;

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const deliveryFee = 0; // Default to 0 if not available
  const discount = 0; // Default to 0 if not available
  const total = subtotal + tax + deliveryFee - discount;

  const generateHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 20px; margin-bottom: 30px; }
            .store-name { font-size: 28px; font-weight: bold; color: #4CAF50; margin-bottom: 10px; }
            .invoice-title { font-size: 24px; color: #333; margin-bottom: 5px; }
            .invoice-meta { color: #666; font-size: 14px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 10px; text-transform: uppercase; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th { background-color: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #ddd; }
            .items-table td { padding: 12px; border-bottom: 1px solid #eee; }
            .items-table td:last-child { text-align: right; }
            .totals { margin-top: 20px; border-top: 2px solid #ddd; padding-top: 15px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .total-row.final { font-size: 20px; font-weight: bold; color: #4CAF50; margin-top: 10px; padding-top: 10px; border-top: 2px solid #4CAF50; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
            .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            .status-delivered { background-color: #E8F5E9; color: #4CAF50; }
            .status-pending { background-color: #FFF3E0; color: #FF9800; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-name">Kirana Store</div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-meta">
              Order #${order.id} | ${new Date(order.createdAt).toLocaleDateString()} | 
              <span class="status-badge status-${order.status}">${order.status.replace('_', ' ')}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Customer Details</div>
            <div class="row">
              <span><strong>${order.customer.name}</strong></span>
            </div>
            <div class="row">
              <span>${order.customer.phone}</span>
            </div>
            <div class="row">
              <span>${order.customer.address}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Order Items</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="total-row">
              <span>Tax (5%):</span>
              <span>${formatCurrency(tax)}</span>
            </div>
            ${deliveryFee > 0 ? `
              <div class="total-row">
                <span>Delivery Fee:</span>
                <span>${formatCurrency(deliveryFee)}</span>
              </div>
            ` : ''}
            ${discount > 0 ? `
              <div class="total-row">
                <span>Discount:</span>
                <span>-${formatCurrency(discount)}</span>
              </div>
            ` : ''}
            <div class="total-row final">
              <span>Total Amount:</span>
              <span>${formatCurrency(total)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with Kirana Store!</p>
            <p>For any queries, contact: support@kiranastore.com | +91 98765 43210</p>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    try {
      const html = generateHTML();
      await Print.printAsync({ html });
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  const handleShare = async () => {
    try {
      const html = generateHTML();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        dialogTitle: `Invoice - Order #${order.id}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Invoice',
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color={colors.primary.green} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.storeName}>Kirana Store</Text>
              <Text style={styles.invoiceLabel}>INVOICE</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: order.status === 'delivered' ? theme.colors.status.success + '15' : theme.colors.status.warning + '15' }]}>
              <Text style={{ color: order.status === 'delivered' ? theme.colors.status.success : theme.colors.status.warning, fontWeight: theme.typography.fontWeight.bold, fontSize: 12 }}>
                {order.status.toUpperCase().replace('_', ' ')}
              </Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Order #{order.id}</Text>
            <Text style={styles.metaText}>|</Text>
            <Text style={styles.metaText}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Card>

        {/* Customer Details */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Text style={styles.customerName}>{order.customer.name}</Text>
          <Text style={styles.customerPhone}>{order.customer.phone}</Text>
          <Text style={styles.customerAddress}>{order.customer.address}</Text>
        </Card>

        {/* Order Items */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.quantity} x {formatCurrency(item.price)}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
        </Card>

        {/* Totals */}
        <Card style={styles.sectionCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (5%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
          </View>
          {deliveryFee > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Fee</Text>
              <Text style={styles.totalValue}>{formatCurrency(deliveryFee)}</Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={[styles.totalValue, { color: colors.status.success }]}>
                -{formatCurrency(discount)}
              </Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>Total Amount</Text>
            <Text style={styles.finalTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button variant="primary" onPress={handlePrint}>
            <Ionicons name="print-outline" size={20} color={theme.colors.background.primary} />
            <Text style={{ color: colors.background.primary, marginLeft: 8 }}>Print Invoice</Text>
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for shopping with Kirana Store!</Text>
          <Text style={styles.footerSubtext}>support@kiranastore.com | +91 98765 43210</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  headerCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md - 4,
  },
  storeName: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.status.success,
  },
  invoiceLabel: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md - 4,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.borderRadius.lg,
  },
  metaRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  metaText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  sectionCard: {
    marginBottom: 16,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md - 4,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
  },
  customerName: {
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  customerPhone: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md - 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: theme.typography.fontSize.base - 1,
    marginBottom: 4,
  },
  itemQty: {
    fontSize: theme.typography.fontSize.xs + 1,
    color: theme.colors.text.secondary,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  finalTotal: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.status.success,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md - 4,
  },
  finalTotalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
  },
  finalTotalValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.green,
  },
  actions: {
    marginVertical: theme.spacing.lg,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.light,
  },
});
