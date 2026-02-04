import { theme } from "@/theme/appTheme";
import React from "react";
import { Text as RNText, StyleSheet, TextProps } from "react-native";

interface AppTextProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "small";
  fontWeight?: "regular" | "medium" | "semibold" | "bold";
  color?: string;
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

export const Text: React.FC<AppTextProps> = ({
  variant = "body",
  fontWeight = "regular",
  color = theme.colors.text.primary,
  align = "left",
  style,
  children,
  ...props
}) => {
  const textStyle = [
    styles.base,
    styles[variant],
    styles[fontWeight],
    { color, textAlign: align },
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.fonts.figtree,
  },
  h1: {
    fontSize: theme.typography.fontSize["3xl"],
    lineHeight: 36,
  },
  h2: {
    fontSize: theme.typography.fontSize["2xl"],
    lineHeight: 32,
  },
  h3: {
    fontSize: theme.typography.fontSize.xl,
    lineHeight: 28,
  },
  body: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: 24,
  },
  caption: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
  },
  small: {
    fontSize: theme.typography.fontSize.xs,
    lineHeight: 16,
  },
  regular: {
    fontWeight: theme.typography.fontWeight.normal,
  },
  medium: {
    fontWeight: theme.typography.fontWeight.medium,
  },
  semibold: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  bold: {
    fontWeight: theme.typography.fontWeight.bold,
  },
});