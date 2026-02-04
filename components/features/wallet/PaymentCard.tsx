import { theme } from "@/theme/appTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import type { ColorValue } from "react-native";
import { StyleSheet, Text, View } from "react-native";

interface PaymentCardProps {
  title: string;
  cardNumber: string;
  variant?: "green" | "blue";
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  title,
  cardNumber,
  variant = "green",
}) => {
  const gradientColors: [ColorValue, ColorValue] =
    variant === "green" ? ["#1BA672", "#158A5E"] : ["#1E3A5F", "#152A45"];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative circles */}
      <View style={[styles.decorativeCircle, styles.circleTopRight]} />
      <View style={[styles.decorativeCircle, styles.circleBottomLeft]} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.cardNumber}>**** {cardNumber}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: 70,
    borderRadius: theme.borderRadius.xl,
    marginRight: theme.spacing.md,
    overflow: "hidden",
    position: "relative",
  },
  decorativeCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  circleTopRight: {
    top: -15,
    right: -15,
  },
  circleBottomLeft: {
    bottom: -20,
    left: -20,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: "white",
  },
  cardNumber: {
    fontSize: theme.typography.fontSize.sm,
    color: "rgba(255,255,255,0.7)",
  },
});
