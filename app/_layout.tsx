import { 
  ConfettiProvider, 
  OrderProvider, 
  ProductProvider,
  NotificationProvider,
  CustomerProvider 
} from '@/contexts';
import { ordersData } from '@/mocks/ordersData';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ConfettiProvider>
          <OrderProvider initialOrders={ordersData}>
            <ProductProvider>
              <CustomerProvider>
                <NotificationProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="products/[id]" options={{ presentation: 'card' }} />
                    <Stack.Screen name="products/[id]/edit" options={{ presentation: 'card' }} />
                    <Stack.Screen name="orders/[orderId]/tracking" options={{ presentation: 'card' }} />
                    <Stack.Screen name="schedule-delivery/[orderId]" options={{ presentation: 'card' }} />
                    <Stack.Screen name="add-delivery-boy" options={{ presentation: 'card' }} />
                    <Stack.Screen name="confetti-demo" options={{ presentation: 'card' }} />
                  </Stack>
                  <StatusBar style="dark" />
                </NotificationProvider>
              </CustomerProvider>
            </ProductProvider>
          </OrderProvider>
        </ConfettiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
