import { Text } from '@/components/common';
import {
  ProfileAvatarSection,
  ProfileHeader,
  SettingsMenuItem,
  SettingsSection,
  SettingsToggleItem,
} from '@/components/features/profile';
import { profileData } from '@/mocks/profileData';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { 
  Alert, 
  RefreshControl, 
  ScrollView, 
  StyleSheet, 
  View,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [darkTheme, setDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleMenuPress = useCallback((id: string) => {
    switch (id) {
      case 'store-settings':
        router.push('/store/edit' as any);
        break;
      case 'working-hours':
        router.push('/settings/working-hours' as any);
        break;
      case 'delivery-settings':
        Alert.alert('Delivery Settings', 'Configure delivery radius, fees, and zones');
        break;
      case 'payment-methods':
        Alert.alert('Payment Methods', 'Manage your payout methods and bank accounts');
        break;
      case 'tax-settings':
        Alert.alert('Tax Settings', 'Configure GST and tax invoice settings');
        break;
      case 'team-management':
        Alert.alert('Team Management', 'Add staff members with role-based access');
        break;
      case 'notifications':
        router.push('/notifications/push-center' as any);
        break;
      case 'help-support':
        Linking.openURL('https://support.example.com');
        break;
      case 'terms':
        Linking.openURL('https://terms.example.com');
        break;
      case 'privacy':
        Linking.openURL('https://privacy.example.com');
        break;
      case 'about':
        Alert.alert(
          'About',
          'Grocery Seller App v1.0.0\n\nMade with care for Indian sellers'
        );
        break;
      default:
        // Unhandled menu item
        break;
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Handle logout
            console.log('User logged out');
          }
        },
      ]
    );
  }, []);

  const handleEditPhoto = useCallback(() => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Take Photo', 
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status === 'granted') {
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
              });
              if (!result.canceled) {
                Alert.alert('Success', 'Profile photo updated!');
              }
            }
          }
        },
        { 
          text: 'Choose from Library', 
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status === 'granted') {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
              });
              if (!result.canceled) {
                Alert.alert('Success', 'Profile photo updated!');
              }
            }
          }
        },
      ]
    );
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ProfileHeader 
        title="Profile" 
        showBackButton={false}
        rightComponent={
          <View style={styles.onlineToggle}>
            <View style={[styles.statusDot, isOnline ? styles.online : styles.offline]} />
            <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        }
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary.green]}
            tintColor={theme.colors.primary.green}
          />
        }
      >
        {/* Profile Section */}
        <ProfileAvatarSection
          imageUrl={profileData.user.avatar}
          name={profileData.user.name}
          role={profileData.user.role}
          onEditPhoto={handleEditPhoto}
        />

        {/* Store Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>4.8</Text>
              <Text style={styles.statusLabel}>Rating</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>1.2k</Text>
              <Text style={styles.statusLabel}>Orders</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>98%</Text>
              <Text style={styles.statusLabel}>Response</Text>
            </View>
          </View>
        </View>

        {/* Business Settings */}
        <SettingsSection title="Business Settings">
          <SettingsMenuItem
            icon="storefront-outline"
            label="Store Settings"
            subtitle="Name, address, contact info"
            onPress={() => handleMenuPress('store-settings')}
            showDivider
          />
          <SettingsMenuItem
            icon="time-outline"
            label="Working Hours"
            subtitle="Set your business hours"
            onPress={() => handleMenuPress('working-hours')}
            showDivider
          />
          <SettingsMenuItem
            icon="bicycle-outline"
            label="Delivery Settings"
            subtitle="Radius, fees, zones"
            onPress={() => handleMenuPress('delivery-settings')}
            showDivider
          />
          <SettingsMenuItem
            icon="card-outline"
            label="Payment Methods"
            subtitle="Bank accounts, UPI"
            onPress={() => handleMenuPress('payment-methods')}
            showDivider
          />
          <SettingsMenuItem
            icon="receipt-outline"
            label="Tax Settings"
            subtitle="GST, invoice settings"
            onPress={() => handleMenuPress('tax-settings')}
          />
        </SettingsSection>

        {/* Quick Toggles */}
        <SettingsSection title="Quick Settings">
          <SettingsToggleItem
            icon="notifications-outline"
            label="Push Notifications"
            value={notifications}
            onToggle={setNotifications}
            showDivider
          />
          <SettingsToggleItem
            icon="moon-outline"
            label="Dark Theme"
            value={darkTheme}
            onToggle={setDarkTheme}
            showDivider
          />
          <SettingsToggleItem
            icon="checkmark-circle-outline"
            label="Auto-Accept Orders"
            subtitle="Automatically accept new orders"
            value={autoAccept}
            onToggle={setAutoAccept}
          />
        </SettingsSection>

        {/* Team & Access */}
        <SettingsSection title="Team & Access">
          <SettingsMenuItem
            icon="people-outline"
            label="Team Management"
            subtitle="Add staff, manage permissions"
            onPress={() => handleMenuPress('team-management')}
            showDivider
          />
          <SettingsMenuItem
            icon="lock-closed-outline"
            label="Security"
            subtitle="Password, 2FA"
            onPress={() => handleMenuPress('security')}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support & Information">
          {profileData.supportSettings.map((item, index) => (
            <SettingsMenuItem
              key={item.id}
              icon={item.icon as keyof typeof Ionicons.glyphMap}
              label={item.label}
              onPress={() => handleMenuPress(item.id)}
              showDivider={index < profileData.supportSettings.length - 1}
            />
          ))}
        </SettingsSection>

        {/* Account Management */}
        <SettingsSection title="Account Management">
          <SettingsMenuItem
            icon="language-outline"
            label="Language"
            subtitle="English"
            onPress={() => handleMenuPress('language')}
            showDivider
          />
          <SettingsMenuItem
            icon="information-circle-outline"
            label="About"
            subtitle="Version 1.0.0"
            onPress={() => handleMenuPress('about')}
            showDivider
          />
          <SettingsMenuItem
            icon="log-out-outline"
            label="Logout"
            labelStyle={{ color: theme.colors.status.error }}
            onPress={handleLogout}
            showDivider={false}
          />
        </SettingsSection>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs + 2,
  },
  statusDot: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
  },
  online: {
    backgroundColor: theme.colors.status.success,
  },
  offline: {
    backgroundColor: theme.colors.text.light,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  statusCard: {
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusNumber: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statusLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  statusDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border.light,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
});
