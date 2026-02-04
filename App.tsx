import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  ConfettiProvider,
  CustomerProvider,
  NotificationProvider,
  OrderProvider,
  ProductProvider,
} from '@/contexts';

import { ordersData } from '@/mocks/ordersData';

// Screens (map these properly)
// import TabsNavigator from '../navigation/TabsNavigator';
// import ConfettiDemo from '@/screens/confetti/ConfettiDemo';
// import AddDeliveryBoy from '@/screens/delivery/AddDeliveryBoy';
// import OrderTracking from '@/screens/order/OrderTracking';
// import ScheduleDelivery from '@/screens/order/ScheduleDelivery';
// import EditProduct from '@/screens/product/EditProduct';
// import ProductDetails from '@/screens/product/ProductDetails';
import { Confetti } from './components';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ConfettiProvider>
          <OrderProvider initialOrders={ordersData}>
            <ProductProvider>
              <CustomerProvider>
                <NotificationProvider>
                  <NavigationContainer>
                    <StatusBar barStyle="dark-content" />
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                      {/* <Stack.Screen name="Tabs" component={TabsNavigator} />
                      <Stack.Screen name="ProductDetails" component={ProductDetails} />
                      <Stack.Screen name="EditProduct" component={EditProduct} />
                      <Stack.Screen name="OrderTracking" component={OrderTracking} />
                      <Stack.Screen name="ScheduleDelivery" component={ScheduleDelivery} />
                      <Stack.Screen name="AddDeliveryBoy" component={AddDeliveryBoy} /> */}
                      <Stack.Screen name="ConfettiDemo" component={Confetti} />
                    </Stack.Navigator>
                  </NavigationContainer>
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
