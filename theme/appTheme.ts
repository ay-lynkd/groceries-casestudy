/**
 * App theme - numeric values for React Native StyleSheet
 */
export const theme = {
  colors: {
    primary: {
      green: "#4CAF50",
      purple: "#9C27B0",
      darkPurple: "#7B1FA2",
      orange: "#FF9800",
    },
    status: {
      success: "#4CAF50",
      error: "#F44336",
      warning: "#FFC107",
      info: "#2196F3",
    },
    background: {
      primary: "#FFFFFF",
      secondary: "#F8F8F8",
      tertiary: "#F0F0F0",
      card: "#FFFFFF",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
      light: "#9E9E9E",
    },
    border: {
      light: "#E0E0E0",
      medium: "#BDBDBD",
    },
    badge: {
      delivered: "#E3F2FD",
      pending: "#FFF9C4",
      cancelled: "#FFEBEE",
    },
    wallet: {
      darkBg: "#0D0D1A",
      darkBgMid: "#0F1028",
      darkBgEnd: "#0A0A14",
      glassBg: "rgba(255,255,255,0.08)",
      glassBorder: "rgba(255,255,255,0.15)",
      accent: "#00D09C",
      cardBg: "#2D5A4A",
      smartpayBg: "#1E3A5F",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
    },
    fontWeight: {
      normal: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },
  },
  fonts: {
    regular: "System",
    medium: "System",
    bold: "System",
    figtree: "Figtree",
    poppins: "Poppins",
    plusJakarta: "PlusJakartaSans",
  },
} as const;

export type Theme = typeof theme;
