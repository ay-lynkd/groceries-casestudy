/**
 * Offline Storage Utilities
 * Provides data persistence and offline support using AsyncStorage
 */

// AsyncStorage mock implementation
// In production, install: npm install @react-native-async-storage/async-storage

interface AsyncStorageStatic {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
  multiGet: (keys: string[]) => Promise<[string, string | null][]>;
}

const AsyncStorage: AsyncStorageStatic = {
  setItem: async (key: string, value: string) => { 
    console.log('Storage set:', key); 
  },
  getItem: async (key: string) => null,
  removeItem: async (key: string) => {},
  clear: async () => {},
  getAllKeys: async () => [],
  multiGet: async (keys: string[]) => keys.map(k => [k, null]) as [string, string | null][],
};

const STORAGE_KEYS = {
  ORDERS: '@orders',
  PRODUCTS: '@products',
  CUSTOMERS: '@customers',
  SETTINGS: '@settings',
  CART: '@cart',
  AUTH: '@auth',
  OFFLINE_QUEUE: '@offline_queue',
  LAST_SYNC: '@last_sync',
} as const;

// Generic storage functions
export const storage = {
  // Save data
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  },

  // Load data
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },

  // Remove data
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  },

  // Clear all data
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  // Get all keys
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  },

  // Multi-get
  async multiGet<T>(keys: string[]): Promise<[string, T | null][]> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      return pairs.map(([key, value]) => [
        key,
        value != null ? JSON.parse(value) : null,
      ]) as [string, T | null][];
    } catch (error) {
      console.error('Error in multiGet:', error);
      return keys.map(k => [k, null]) as [string, T | null][];
    }
  },
};

// Offline queue for pending actions
export interface OfflineAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: string;
  retryCount: number;
}

export const offlineQueue = {
  async add(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const queue = await storage.get<OfflineAction[]>(STORAGE_KEYS.OFFLINE_QUEUE) || [];
    const newAction: OfflineAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(newAction);
    await storage.set(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  },

  async getAll(): Promise<OfflineAction[]> {
    return await storage.get<OfflineAction[]>(STORAGE_KEYS.OFFLINE_QUEUE) || [];
  },

  async remove(actionId: string): Promise<void> {
    const queue = await this.getAll();
    const filtered = queue.filter(a => a.id !== actionId);
    await storage.set(STORAGE_KEYS.OFFLINE_QUEUE, filtered);
  },

  async incrementRetry(actionId: string): Promise<void> {
    const queue = await this.getAll();
    const updated = queue.map(a =>
      a.id === actionId ? { ...a, retryCount: a.retryCount + 1 } : a
    );
    await storage.set(STORAGE_KEYS.OFFLINE_QUEUE, updated);
  },

  async clear(): Promise<void> {
    await storage.remove(STORAGE_KEYS.OFFLINE_QUEUE);
  },

  async processQueue(processor: (action: OfflineAction) => Promise<boolean>): Promise<void> {
    const queue = await this.getAll();
    const maxRetries = 3;

    for (const action of queue) {
      if (action.retryCount >= maxRetries) {
        console.warn(`Action ${action.id} exceeded max retries, removing`);
        await this.remove(action.id);
        continue;
      }

      try {
        const success = await processor(action);
        if (success) {
          await this.remove(action.id);
        } else {
          await this.incrementRetry(action.id);
        }
      } catch (error) {
        console.error(`Error processing action ${action.id}:`, error);
        await this.incrementRetry(action.id);
      }
    }
  },
};

// Cache management
export const cache = {
  async set<T>(key: string, data: T, ttlMinutes: number = 60): Promise<void> {
    const item = {
      data,
      expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    };
    await storage.set(`@cache_${key}`, item);
  },

  async get<T>(key: string): Promise<T | null> {
    const item = await storage.get<{ data: T; expiresAt: number }>(`@cache_${key}`);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      await storage.remove(`@cache_${key}`);
      return null;
    }
    
    return item.data;
  },

  async invalidate(key: string): Promise<void> {
    await storage.remove(`@cache_${key}`);
  },

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await storage.getAllKeys();
    const matchingKeys = keys.filter(k => k.startsWith('@cache_') && k.includes(pattern));
    for (const key of matchingKeys) {
      await storage.remove(key);
    }
  },

  async clear(): Promise<void> {
    const keys = await storage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith('@cache_'));
    for (const key of cacheKeys) {
      await storage.remove(key);
    }
  },
};

// Settings persistence
export interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  language: string;
  autoAccept: boolean;
  lowStockThreshold: number;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  notifications: true,
  soundEnabled: true,
  language: 'en',
  autoAccept: false,
  lowStockThreshold: 10,
};

export const settingsStorage = {
  async load(): Promise<AppSettings> {
    const stored = await storage.get<AppSettings>(STORAGE_KEYS.SETTINGS);
    return stored || defaultSettings;
  },

  async save(settings: AppSettings): Promise<void> {
    await storage.set(STORAGE_KEYS.SETTINGS, settings);
  },

  async update(partial: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.load();
    const updated = { ...current, ...partial };
    await this.save(updated);
    return updated;
  },

  async reset(): Promise<void> {
    await this.save(defaultSettings);
  },
};

// Export storage keys for direct access
export { STORAGE_KEYS };

// Default export
export default {
  storage,
  offlineQueue,
  cache,
  settings: settingsStorage,
  keys: STORAGE_KEYS,
};
