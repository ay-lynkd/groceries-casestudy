/**
 * Feature Flags System
 * A/B testing and feature toggle management
 */

import { storage } from './offlineStorage';

// Feature flag definitions
export type FeatureFlag = 
  | 'voice_search'
  | 'bulk_operations'
  | 'advanced_analytics'
  | 'customer_segments'
  | 'promo_codes'
  | 'dark_mode'
  | 'biometric_auth'
  | 'realtime_notifications'
  | 'offline_mode'
  | 'multi_language';

interface FeatureConfig {
  enabled: boolean;
  rolloutPercentage: number; // 0-100
  allowedUsers?: string[]; // Specific user IDs
  excludedUsers?: string[]; // User IDs to exclude
}

// Default feature flags
const defaultFeatures: Record<FeatureFlag, FeatureConfig> = {
  voice_search: { enabled: true, rolloutPercentage: 100 },
  bulk_operations: { enabled: true, rolloutPercentage: 100 },
  advanced_analytics: { enabled: true, rolloutPercentage: 100 },
  customer_segments: { enabled: true, rolloutPercentage: 100 },
  promo_codes: { enabled: true, rolloutPercentage: 100 },
  dark_mode: { enabled: true, rolloutPercentage: 100 },
  biometric_auth: { enabled: true, rolloutPercentage: 100 },
  realtime_notifications: { enabled: true, rolloutPercentage: 100 },
  offline_mode: { enabled: true, rolloutPercentage: 100 },
  multi_language: { enabled: true, rolloutPercentage: 100 },
};

class FeatureFlags {
  private features: Record<FeatureFlag, FeatureConfig> = defaultFeatures;
  private userId: string | null = null;

  constructor() {
    this.loadFeatures();
  }

  // Load features from storage
  private async loadFeatures() {
    const stored = await storage.get<Record<FeatureFlag, FeatureConfig>>('@feature_flags');
    if (stored) {
      this.features = { ...defaultFeatures, ...stored };
    }
  }

  // Set current user for rollout checks
  setUser(userId: string) {
    this.userId = userId;
  }

  // Check if feature is enabled for current user
  isEnabled(flag: FeatureFlag): boolean {
    const config = this.features[flag];
    
    if (!config.enabled) return false;
    
    // Check specific allowed users
    if (config.allowedUsers && this.userId) {
      return config.allowedUsers.includes(this.userId);
    }
    
    // Check excluded users
    if (config.excludedUsers && this.userId) {
      if (config.excludedUsers.includes(this.userId)) return false;
    }
    
    // Check rollout percentage
    if (this.userId) {
      const userHash = this.hashString(this.userId + flag);
      const userPercentage = userHash % 100;
      return userPercentage < config.rolloutPercentage;
    }
    
    return true;
  }

  // Enable/disable feature
  async toggle(flag: FeatureFlag, enabled: boolean) {
    this.features[flag].enabled = enabled;
    await this.saveFeatures();
  }

  // Update rollout percentage
  async setRollout(flag: FeatureFlag, percentage: number) {
    this.features[flag].rolloutPercentage = Math.max(0, Math.min(100, percentage));
    await this.saveFeatures();
  }

  // Add user to allowed list
  async allowUser(flag: FeatureFlag, userId: string) {
    if (!this.features[flag].allowedUsers) {
      this.features[flag].allowedUsers = [];
    }
    if (!this.features[flag].allowedUsers!.includes(userId)) {
      this.features[flag].allowedUsers!.push(userId);
      await this.saveFeatures();
    }
  }

  // Exclude user from feature
  async excludeUser(flag: FeatureFlag, userId: string) {
    if (!this.features[flag].excludedUsers) {
      this.features[flag].excludedUsers = [];
    }
    if (!this.features[flag].excludedUsers!.includes(userId)) {
      this.features[flag].excludedUsers!.push(userId);
      await this.saveFeatures();
    }
  }

  // Get all feature statuses
  getAllFeatures(): Record<FeatureFlag, boolean> {
    return Object.keys(this.features).reduce((acc, key) => {
      acc[key as FeatureFlag] = this.isEnabled(key as FeatureFlag);
      return acc;
    }, {} as Record<FeatureFlag, boolean>);
  }

  // Reset to defaults
  async reset() {
    this.features = defaultFeatures;
    await this.saveFeatures();
  }

  private async saveFeatures() {
    await storage.set('@feature_flags', this.features);
  }

  // Simple hash function for consistent user bucketing
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

// Singleton instance
export const featureFlags = new FeatureFlags();

// React hook for feature flags
export function useFeatureFlag(flag: FeatureFlag): boolean {
  return featureFlags.isEnabled(flag);
}

// Hook for all features
export function useAllFeatures(): Record<FeatureFlag, boolean> {
  return featureFlags.getAllFeatures();
}

// A/B Testing
export class ABTesting {
  private assignments: Map<string, string> = new Map();

  // Assign user to experiment variant
  getVariant(experimentId: string, variants: string[]): string {
    const key = `${experimentId}_${this.getUserId()}`;
    
    // Check if already assigned
    if (this.assignments.has(key)) {
      return this.assignments.get(key)!;
    }
    
    // Assign based on hash
    const hash = this.hashString(key);
    const variant = variants[hash % variants.length];
    this.assignments.set(key, variant);
    
    return variant;
  }

  // Track experiment event
  trackEvent(experimentId: string, event: string, metadata?: Record<string, any>) {
    console.log('A/B Test Event:', { experimentId, event, metadata });
    // Send to analytics
  }

  private getUserId(): string {
    // Return stored user ID or generate anonymous ID
    return 'user_' + Date.now();
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

export const abTesting = new ABTesting();

export default featureFlags;
