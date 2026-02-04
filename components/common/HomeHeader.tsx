import { Input } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Constant height for all header elements (search pill + circular buttons)
const HEADER_ELEMENT_HEIGHT = 48;

interface HomeHeaderProps {
  onSearch?: (text: string) => void;
  searchValue?: string;
  placeholder?: string;
  showScanner?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onSearch,
  searchValue = '',
  placeholder = 'Search orders, customers...',
  showScanner = true,
  showNotifications = true,
  notificationCount = 0,
  onNotificationPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // Sync local search with parent
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchValue !== searchValue) {
        onSearch?.(localSearchValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchValue, searchValue, onSearch]);

  const handleScanPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Scanner',
      'QR Code scanner would open here. This feature requires camera permissions.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Scanner',
          onPress: () => setIsScannerVisible(true),
        },
      ]
    );
  }, []);

  const handleBarCodeScanned = useCallback(
    (data: string) => {
      if (isScanning) return;

      setIsScanning(true);

      // Process scanned data
      setIsScannerVisible(false);

      // Check if it's an order ID
      if (data.startsWith('ORD') || data.startsWith('order_')) {
        // Extract order ID and navigate
        const orderId = data.replace('order_', '');
        Alert.alert('Order Scanned', `Order ID: ${orderId}`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'View Order',
            onPress: () => router.push(`/orders/${orderId}/tracking`),
          },
        ]);
      } else {
        Alert.alert('Scanned', `Data: ${data}`);
      }

      setTimeout(() => setIsScanning(false), 2000);
    },
    [isScanning, router]
  );

  const handleNotificationPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      router.push('/notifications/push-center');
    }
  }, [onNotificationPress, router]);

  const handleMicPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    Alert.alert('Voice Search', 'Voice search is not available in this version. Please type your search query.');
  }, []);

  const handleSearchSubmit = useCallback(() => {
    Keyboard.dismiss();
    onSearch?.(localSearchValue);
  }, [localSearchValue, onSearch]);

  return (
    <>
      <View
        style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
        <View style={styles.topRow}>
          {/* Search Pill */}
          <View style={styles.searchContainer} accessibilityRole="search">
            <Input
              placeholder={placeholder}
              leftIcon="search-outline"
              rightIcon="mic-outline"
              value={localSearchValue}
              onChangeText={setLocalSearchValue}
              onRightIconPress={handleMicPress}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              style={styles.searchInput}
              containerStyle={styles.searchWrapper}
              accessibilityLabel="Search orders and customers"
              accessibilityHint="Type to search orders, customers, or products"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Scanner Button */}
          {showScanner && (
            <TouchableOpacity
              style={styles.circleButton}
              onPress={handleScanPress}
              accessibilityLabel="Scan QR Code"
              accessibilityHint="Scan customer or order QR codes"
              accessibilityRole="button"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons
                name="scan-outline"
                size={22}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          )}

          {/* Notification Button with Badge */}
          {showNotifications && (
            <View style={styles.circleButtonWrapper}>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={handleNotificationPress}
                accessibilityLabel={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
                accessibilityHint="View your notifications"
                accessibilityRole="button"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
              {notificationCount > 0 && (
                <View
                  style={styles.badge}
                  accessibilityLabel={`${notificationCount} unread notifications`}
                  accessibilityLiveRegion="polite">
                  <Text style={styles.badgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Scanner Modal */}
      <Modal
        visible={isScannerVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setIsScannerVisible(false)}
        accessibilityViewIsModal
        accessibilityLabel="QR Code Scanner">
        <SafeAreaView style={styles.scannerContainer}>
          <View style={[styles.scannerHeader, { paddingTop: insets.top }]}>
            <TouchableOpacity
              onPress={() => setIsScannerVisible(false)}
              style={styles.closeButton}
              accessibilityLabel="Close scanner"
              accessibilityRole="button"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scan QR Code</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.scannerWrapper}>
            {/* Camera placeholder */}
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: '#000',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Ionicons name="camera-outline" size={64} color="#FFF" />
              <Text style={{ color: '#FFF', marginTop: 16 }}>Camera preview</Text>
              <TouchableOpacity
                style={styles.simulateScanButton}
                onPress={() => handleBarCodeScanned('order_12345')}
                accessibilityLabel="Simulate scan"
                accessibilityRole="button">
                <Text style={styles.simulateScanText}>Simulate Scan</Text>
              </TouchableOpacity>
            </View>

            {/* Scanner overlay */}
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerFrame}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.scannerHint}>Align QR code within the frame</Text>
            </View>
          </View>

          {isScanning && (
            <View style={styles.processingOverlay} accessibilityLabel="Processing scan">
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  // Parent row: flexbox with center alignment
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  // Search pill container
  searchContainer: {
    flex: 1,
  },
  // Remove default margin from Input wrapper
  searchWrapper: {
    marginBottom: 0,
  },
  // Style for Input's internal container (passed as 'style' prop)
  searchInput: {
    marginBottom: 0,
    height: HEADER_ELEMENT_HEIGHT,
    paddingVertical: 0,
  },
  // Circular button wrapper for badge positioning
  circleButtonWrapper: {
    position: 'relative',
  },
  // Circular button: fixed size, centered content
  circleButton: {
    width: HEADER_ELEMENT_HEIGHT,
    height: HEADER_ELEMENT_HEIGHT,
    borderRadius: HEADER_ELEMENT_HEIGHT / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  // Badge: absolutely positioned relative to button wrapper
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.status.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.background.secondary,
  },
  badgeText: {
    fontFamily: theme.fonts.figtree,
    fontWeight: '700',
    fontSize: 9,
    color: '#FFF',
  },
  // Scanner styles
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: '#000',
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  scannerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: '#FFF',
  },
  placeholder: {
    width: 44,
  },
  scannerWrapper: {
    flex: 1,
    position: 'relative',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderRadius: 20,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: theme.colors.primary.green,
    borderWidth: 4,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 20,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 20,
  },
  scannerHint: {
    marginTop: theme.spacing.xl,
    fontSize: theme.typography.fontSize.base,
    color: '#FFF',
    textAlign: 'center',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.lg,
    color: '#FFF',
  },
  simulateScanButton: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary.green,
    borderRadius: 8,
  },
  simulateScanText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeHeader;
