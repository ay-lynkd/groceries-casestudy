import { ScreenHeader } from '@/components/common';
import { OrderTrackingPage } from '@/components/features/order/OrderTrackingPage';
import { orderTrackingData } from '@/mocks/orderTrackingData';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [trackingData, setTrackingData] = useState(orderId ? orderTrackingData[orderId] : undefined);
  
  // Poll for status updates every 30 seconds
  useEffect(() => {
    if (!orderId) return;
    
    const pollStatus = async () => {
      try {
        // In a real app, this would be an API call to get updated tracking data
        const updatedData = orderTrackingData[orderId];
        if (updatedData) {
          setTrackingData(updatedData);
        }
      } catch (error) {
        console.error('Error fetching updated tracking data:', error);
      }
    };
    
    // Poll immediately
    pollStatus();
    
    // Set up interval to poll every 30 seconds
    const intervalId = setInterval(pollStatus, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [orderId]);

  if (!trackingData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Order Tracking" showBack={true} />
      <OrderTrackingPage trackingData={trackingData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.secondary },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  errorText: { color: theme.colors.text.secondary, fontSize: 16 },
});
