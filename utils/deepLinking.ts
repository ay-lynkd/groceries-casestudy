/**
 * Deep Linking Configuration
 * Handles universal links and app scheme navigation
 */

import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

// App scheme configuration
export const linkingConfig = {
  prefixes: [
    'groceriesapp://',           // Custom scheme
    'https://groceries.example.com', // Universal link domain
    'https://*.groceries.example.com',
  ],
  
  // Route configuration
  config: {
    screens: {
      '(tabs)': {
        screens: {
          index: '',
          store: 'store',
          explore: 'wallet',
          profile: 'profile',
        },
      },
      'product': {
        path: 'product/:id',
        parse: {
          id: (id: string) => id,
        },
      },
      'order-tracking': {
        path: 'order/:orderId',
        parse: {
          orderId: (orderId: string) => orderId,
        },
      },
      'schedule-delivery': {
        path: 'delivery/:orderId',
        parse: {
          orderId: (orderId: string) => orderId,
        },
      },
      'notifications': {
        path: 'notifications',
      },
      'analytics': {
        path: 'analytics',
      },
    },
  },
  
  // Custom getInitialURL for handling universal links
  getInitialURL: async () => {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();
    if (url) {
      console.log('App opened with URL:', url);
      return url;
    }
    return null;
  },
  
  // Subscribe to incoming links
  subscribe: (listener: (url: string) => void) => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Received deep link:', url);
      listener(url);
    });
    
    return () => {
      subscription.remove();
    };
  },
};

// Deep link handlers
export const deepLinkHandlers = {
  // Handle order deep links
  handleOrderLink: (orderId: string, router: any) => {
    if (orderId) {
      router.push(`/order-tracking/${orderId}`);
      return true;
    }
    return false;
  },
  
  // Handle product deep links
  handleProductLink: (productId: string, router: any) => {
    if (productId) {
      router.push(`/product/${productId}`);
      return true;
    }
    return false;
  },
  
  // Handle promotion/promo code links
  handlePromoLink: (code: string, router: any) => {
    if (code) {
      Alert.alert(
        'Promo Code',
        `Apply promo code ${code}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Apply', 
            onPress: () => {
              // Store promo code for later use
              console.log('Applying promo:', code);
              router.push('/store');
            }
          },
        ]
      );
      return true;
    }
    return false;
  },
  
  // Handle invite/referral links
  handleInviteLink: (referralCode: string) => {
    if (referralCode) {
      console.log('Referral code:', referralCode);
      // Store referral code
      return true;
    }
    return false;
  },
  
  // Handle notification links
  handleNotificationLink: (notificationId: string, router: any) => {
    router.push('/notifications/push-center');
    return true;
  },
};

// Generate shareable links
export const linkGenerator = {
  // Generate product share link
  productLink: (productId: string): string => {
    return `https://groceries.example.com/product/${productId}`;
  },
  
  // Generate order tracking link
  orderLink: (orderId: string): string => {
    return `https://groceries.example.com/order/${orderId}`;
  },
  
  // Generate invite/referral link
  inviteLink: (referralCode: string): string => {
    return `https://groceries.example.com/invite?code=${referralCode}`;
  },
  
  // Generate promo code link
  promoLink: (promoCode: string): string => {
    return `https://groceries.example.com/promo?code=${promoCode}`;
  },
  
  // Generate store link
  storeLink: (): string => {
    return 'https://groceries.example.com/store';
  },
};

// URL parsing utilities
export const urlParser = {
  // Parse deep link URL
  parseUrl: (url: string): { type: string; params: Record<string, string> } => {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return {
      type: pathParts[0] || 'home',
      params: {
        ...params,
        id: pathParts[1],
      },
    };
  },
  
  // Check if URL is valid deep link
  isValidDeepLink: (url: string): boolean => {
    return (
      url.startsWith('groceriesapp://') ||
      url.includes('groceries.example.com')
    );
  },
};

// Share functionality
export const shareUtils = {
  // Share text with fallback
  share: async (options: { title?: string; message: string; url?: string }): Promise<void> => {
    try {
      // Use native share if available
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: options.title,
          text: options.message,
          url: options.url,
        });
      } else {
        // Fallback - copy to clipboard
        console.log('Share:', options);
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  },
  
  // Share product
  shareProduct: async (productName: string, productId: string): Promise<void> => {
    const url = linkGenerator.productLink(productId);
    await shareUtils.share({
      title: productName,
      message: `Check out ${productName} on Groceries App!`,
      url,
    });
  },
  
  // Share order tracking
  shareOrder: async (orderId: string): Promise<void> => {
    const url = linkGenerator.orderLink(orderId);
    await shareUtils.share({
      title: 'Track Order',
      message: `Track your order #${orderId}`,
      url,
    });
  },
  
  // Share invite
  shareInvite: async (referralCode: string): Promise<void> => {
    const url = linkGenerator.inviteLink(referralCode);
    await shareUtils.share({
      title: 'Join me on Groceries App',
      message: `Use my referral code ${referralCode} and get ₹100 off!`,
      url,
    });
  },
};

export default {
  linkingConfig,
  handlers: deepLinkHandlers,
  generator: linkGenerator,
  parser: urlParser,
  share: shareUtils,
};
