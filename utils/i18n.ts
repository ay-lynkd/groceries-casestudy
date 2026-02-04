/**
 * Internationalization (i18n) Support
 * Multi-language translation system
 */

import { I18n } from 'i18n-js';
import { storage } from './offlineStorage';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  hi: { name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  ta: { name: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  te: { name: 'తెలుగు', flag: '🇮🇳', dir: 'ltr' },
  kn: { name: 'ಕನ್ನಡ', flag: '🇮🇳', dir: 'ltr' },
  ml: { name: 'മലയാളം', flag: '🇮🇳', dir: 'ltr' },
  bn: { name: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  mr: { name: 'मराठी', flag: '🇮🇳', dir: 'ltr' },
  gu: { name: 'ગુજરાતી', flag: '🇮🇳', dir: 'ltr' },
  pa: { name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', dir: 'ltr' },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Translations
const translations = {
  en: {
    // Common
    appName: 'Groceries Seller',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    done: 'Done',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    apply: 'Apply',
    reset: 'Reset',
    
    // Navigation
    home: 'Home',
    store: 'Store',
    orders: 'Orders',
    wallet: 'Wallet',
    profile: 'Profile',
    
    // Orders
    newOrder: 'New Order',
    acceptOrder: 'Accept Order',
    declineOrder: 'Decline Order',
    orderAccepted: 'Order Accepted',
    orderDeclined: 'Order Declined',
    preparing: 'Preparing',
    ready: 'Ready',
    outForDelivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    orderId: 'Order ID',
    customer: 'Customer',
    items: 'Items',
    total: 'Total',
    payment: 'Payment',
    paymentReceived: 'Payment Received',
    paymentPending: 'Payment Pending',
    
    // Products
    products: 'Products',
    addProduct: 'Add Product',
    productName: 'Product Name',
    price: 'Price',
    stock: 'Stock',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    category: 'Category',
    description: 'Description',
    
    // Wallet
    earnings: 'Earnings',
    totalEarnings: 'Total Earnings',
    availableBalance: 'Available Balance',
    pendingBalance: 'Pending Balance',
    withdraw: 'Withdraw',
    transactions: 'Transactions',
    
    // Notifications
    notifications: 'Notifications',
    notificationsSettings: 'Notifications',
    markAsRead: 'Mark as Read',
    markAllAsRead: 'Mark All as Read',
    noNotifications: 'No notifications yet',
    
    // Profile
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    logout: 'Logout',
    
    // Time
    justNow: 'Just now',
    minutesAgo: '{{count}}m ago',
    hoursAgo: '{{count}}h ago',
    yesterday: 'Yesterday',
    daysAgo: '{{count}} days ago',
    
    // Errors
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    invalidCredentials: 'Invalid email or password',
    sessionExpired: 'Session expired. Please login again.',
  },
  
  hi: {
    appName: 'किराना विक्रेता',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    done: 'हो गया',
    close: 'बंद करें',
    confirm: 'पुष्टि करें',
    back: 'वापस',
    next: 'अगला',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    sort: 'क्रमबद्ध करें',
    apply: 'लागू करें',
    reset: 'रीसेट',
    
    home: 'होम',
    store: 'स्टोर',
    orders: 'ऑर्डर',
    wallet: 'वॉलेट',
    profile: 'प्रोफ़ाइल',
    
    newOrder: 'नया ऑर्डर',
    acceptOrder: 'ऑर्डर स्वीकार करें',
    declineOrder: 'ऑर्डर अस्वीकार करें',
    orderAccepted: 'ऑर्डर स्वीकार किया गया',
    orderDeclined: 'ऑर्डर अस्वीकार किया गया',
    preparing: 'तैयारी हो रही है',
    ready: 'तैयार',
    outForDelivery: 'डिलीवरी के लिए निकला',
    delivered: 'डिलीवर किया गया',
    cancelled: 'रद्द किया गया',
    orderId: 'ऑर्डर आईडी',
    customer: 'ग्राहक',
    items: 'आइटम',
    total: 'कुल',
    payment: 'भुगतान',
    paymentReceived: 'भुगतान प्राप्त',
    paymentPending: 'भुगतान लंबित',
    
    products: 'उत्पाद',
    addProduct: 'उत्पाद जोड़ें',
    productName: 'उत्पाद का नाम',
    price: 'कीमत',
    stock: 'स्टॉक',
    inStock: 'स्टॉक में',
    outOfStock: 'स्टॉक खत्म',
    lowStock: 'कम स्टॉक',
    category: 'श्रेणी',
    description: 'विवरण',
    
    earnings: 'कमाई',
    totalEarnings: 'कुल कमाई',
    availableBalance: 'उपलब्ध शेष',
    pendingBalance: 'लंबित शेष',
    withdraw: 'निकालें',
    transactions: 'लेनदेन',
    
    notifications: 'सूचनाएं',
    markAsRead: 'पढ़ा हुआ मार्क करें',
    markAllAsRead: 'सभी को पढ़ा हुआ मार्क करें',
    noNotifications: 'अभी तक कोई सूचना नहीं',
    
    settings: 'सेटिंग्स',
    language: 'भाषा',
    darkMode: 'डार्क मोड',
    logout: 'लॉगआउट',
    
    justNow: 'अभी अभी',
    minutesAgo: '{{count}} मिनट पहले',
    hoursAgo: '{{count}} घंटे पहले',
    yesterday: 'कल',
    daysAgo: '{{count}} दिन पहले',
    
    networkError: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
    serverError: 'सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।',
    invalidCredentials: 'अमान्य ईमेल या पासवर्ड',
    sessionExpired: 'सत्र समाप्त हो गया। कृपया फिर से लॉगिन करें।',
  },
  
  // Add more languages as needed
  ta: {},
  te: {},
  kn: {},
  ml: {},
  bn: {},
  mr: {},
  gu: {},
  pa: {},
};

// Initialize i18n
const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Language management
class I18nManager {
  private currentLanguage: LanguageCode = 'en';
  private listeners: ((lang: LanguageCode) => void)[] = [];

  constructor() {
    this.loadSavedLanguage();
  }

  private async loadSavedLanguage() {
    const saved = await storage.get<LanguageCode>('@app_language');
    if (saved && SUPPORTED_LANGUAGES[saved]) {
      this.currentLanguage = saved;
      i18n.locale = saved;
    }
  }

  getCurrentLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  async setLanguage(lang: LanguageCode): Promise<void> {
    if (!SUPPORTED_LANGUAGES[lang]) {
      console.error('Unsupported language:', lang);
      return;
    }
    
    this.currentLanguage = lang;
    i18n.locale = lang;
    await storage.set('@app_language', lang);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(lang));
  }

  subscribe(listener: (lang: LanguageCode) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Format currency
  formatCurrency(amount: number, currency = 'INR'): string {
    return new Intl.NumberFormat(this.currentLanguage === 'en' ? 'en-IN' : `${this.currentLanguage}-IN`, {
      style: 'currency',
      currency,
    }).format(amount);
  }

  // Format date
  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const locale = this.currentLanguage === 'en' ? 'en-IN' : `${this.currentLanguage}-IN`;
    return d.toLocaleDateString(locale, options);
  }

  // Format relative time
  formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return i18n.t('justNow');
    if (diffMins < 60) return i18n.t('minutesAgo', { count: diffMins });
    if (diffHours < 24) return i18n.t('hoursAgo', { count: diffHours });
    if (diffDays === 1) return i18n.t('yesterday');
    return i18n.t('daysAgo', { count: diffDays });
  }

  // Get translation
  t(key: string, options?: Record<string, any>): string {
    return i18n.t(key, options);
  }
}

export const i18nManager = new I18nManager();

// React hook for translations
export function useTranslation() {
  return {
    t: i18nManager.t.bind(i18nManager),
    i18n: i18nManager,
    language: i18nManager.getCurrentLanguage(),
    setLanguage: i18nManager.setLanguage.bind(i18nManager),
    formatCurrency: i18nManager.formatCurrency.bind(i18nManager),
    formatDate: i18nManager.formatDate.bind(i18nManager),
    formatRelativeTime: i18nManager.formatRelativeTime.bind(i18nManager),
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}

// Utility function for quick translation
export const t = (key: string, options?: Record<string, any>): string => {
  return i18nManager.t(key, options);
};

export default i18nManager;
