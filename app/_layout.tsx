import { 
  ConfettiProvider, 
  OrderProvider, 
  ProductProvider,
  NotificationProvider,
  CustomerProvider,
  ThemeProvider,
  useTheme,
} from '@/contexts';
import { ordersData } from '@/mocks/ordersData';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// StatusBar wrapper that uses theme context
function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

// Root layout content wrapped with access to theme
function RootLayoutContent() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="products/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="products/[id]/edit" options={{ presentation: 'card' }} />
        <Stack.Screen name="orders/[orderId]/tracking" options={{ presentation: 'card' }} />
        <Stack.Screen name="schedule-delivery/[orderId]" options={{ presentation: 'card' }} />
        <Stack.Screen name="add-delivery-boy" options={{ presentation: 'card' }} />
        <Stack.Screen name="confetti-demo" options={{ presentation: 'card' }} />
      </Stack>
      <ThemedStatusBar />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ConfettiProvider>
            <OrderProvider initialOrders={ordersData}>
              <ProductProvider>
                <CustomerProvider>
                  <NotificationProvider>
                    <RootLayoutContent />
                  </NotificationProvider>
                </CustomerProvider>
              </ProductProvider>
            </OrderProvider>
          </ConfettiProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
