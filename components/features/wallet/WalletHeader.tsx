import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlassActionButton } from "./GlassActionButton";
import { CardData, PaymentCardsSection } from "./PaymentCardsSection";

interface WalletHeaderProps {
  userName: string;
  greeting?: string;
  mood?: string;
  totalEarnings?: number;
  availableBalance?: number;
  pendingBalance?: number;
  avatar?: string;
  cards?: CardData[];
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onWithdrawPress?: () => void;
  onAnalyticsPress?: () => void;
  notificationCount?: number;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  userName,
  greeting = "Morning",
  mood = "Feeling happy Today",
  totalEarnings,
  availableBalance,
  pendingBalance,
  avatar,
  cards = [],
  onSearchPress,
  onNotificationPress,
  onWithdrawPress,
  onAnalyticsPress,
  notificationCount = 1,
}) => {
  const displayBalance = availableBalance ?? totalEarnings ?? 0;
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[
        theme.colors.wallet.darkBg,
        theme.colors.wallet.darkBgMid,
        theme.colors.wallet.darkBgEnd,
      ]}
      locations={[0, 0.5, 1]}
      style={[styles.container, { paddingTop: insets.top + theme.spacing.md }]}
    >
      {/* Decorative circles */}
      <View style={[styles.decorativeCircle, styles.circleLeft]} />
      <View style={[styles.decorativeCircle, styles.circleRight]} />

      {/* Top Row: Profile and Icons */}
      <View style={styles.topRow}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: avatar || "https://i.pravatar.cc/100?img=5" }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              {greeting}, {userName}
            </Text>
            <Text style={styles.moodText}>{mood}</Text>
          </View>
        </View>
        <View style={styles.iconSection}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color="white" />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Total Earnings</Text>
        <Text style={styles.balanceAmount}>
          ₹{" "}
          {displayBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.walletLabel}>Your Wallet Balance</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <GlassActionButton
          icon="wallet-outline"
          label="Withdraw"
          onPress={onWithdrawPress}
        />
        <GlassActionButton
          icon="bar-chart-outline"
          label="Analytics"
          onPress={onAnalyticsPress}
        />
      </View>

      {/* Payment Cards */}
      {cards.length > 0 && <PaymentCardsSection cards={cards} />}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.lg,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    overflow: "hidden",
    position: "relative",
  },
  decorativeCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  circleLeft: {
    top: 40,
    left: -40,
  },
  circleRight: {
    top: 100,
    right: -60,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  greetingContainer: {
    marginLeft: theme.spacing.md,
  },
  greetingText: {
    color: "white",
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    fontFamily: theme.fonts.figtree,
  },
  moodText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.fonts.figtree,
    marginTop: 2,
  },
  iconSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: theme.colors.status.info,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
  },
  balanceSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.fonts.figtree,
    marginBottom: theme.spacing.sm,
  },
  balanceAmount: {
    color: "white",
    fontSize: 40,
    fontWeight: theme.typography.fontWeight.bold,
    fontFamily: theme.fonts.figtree,
    marginBottom: theme.spacing.xs,
  },
  walletLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.fonts.figtree,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
});
