import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Tab configuration
const TABS = [
  { 
    name: 'index', 
    title: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  { 
    name: 'store', 
    title: 'Store',
    icon: 'storefront-outline',
    activeIcon: 'storefront',
  },
  { 
    name: 'explore', 
    title: 'Wallet',
    icon: 'wallet-outline',
    activeIcon: 'wallet',
  },
  { 
    name: 'profile', 
    title: 'Profile',
    icon: 'person-outline',
    activeIcon: 'person',
  },
] as const;

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleTabPress = useCallback((route: any, isFocused: boolean, index: number) => {
    if (isFocused) {
      // Already on this tab - could scroll to top or refresh
      return;
    }

    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  }, [navigation]);

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom:
            insets.bottom > 0
              ? insets.bottom
              : Platform.OS === 'android'
                ? 12
                : 8,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;
        const tabConfig = TABS.find(t => t.name === route.name) || TABS[0];

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={`${label} tab`}
            accessibilityHint={`Navigate to ${label}`}
            onPress={() => handleTabPress(route, isFocused, index)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
              <Ionicons 
                name={isFocused ? tabConfig.activeIcon : tabConfig.icon} 
                size={24} 
                color={isFocused ? theme.colors.primary.green : theme.colors.text.secondary}
              />
            </View>
            <Text style={[
              styles.tabLabel, 
              { color: isFocused ? theme.colors.primary.green : theme.colors.text.secondary }
            ]}>
              {label}
            </Text>
            {isFocused && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Wallet',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.sm,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
  iconContainer: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 2,
  },
  iconContainerActive: {
    backgroundColor: `${theme.colors.primary.green}15`,
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.fonts.figtree,
    marginBottom: theme.spacing.xs,
  },
  indicator: {
    width: 20,
    height: 3,
    backgroundColor: theme.colors.primary.green,
    borderRadius: 1.5,
    marginTop: 2,
  },
});
