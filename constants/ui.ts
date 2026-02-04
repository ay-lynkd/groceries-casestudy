export const UI_CONSTANTS = {
  DISPLAY_TIME: '9:41',
  NOTIFICATION_COUNT: 10,
  DEFAULT_LOCATION: 'Electronic City Phase 1, Doddathogur Cross ..',
  NAV_ITEMS: [
    { label: 'Home', icon: 'home' as const },
    { label: 'Store', icon: 'store' as const },
    { label: 'Wallet', icon: 'wallet' as const },
    { label: 'Profile', icon: 'profile' as const },
  ] as const,
  BOTTOM_NAV_HEIGHT: 80,
  ACTIVE_INDICATOR: { WIDTH: 30, HEIGHT: 3 },
} as const;
