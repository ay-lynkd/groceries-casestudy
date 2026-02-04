import { theme } from "@/theme/appTheme";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: number;
  shadow?: boolean;
  borderRadius?: number;
  padding?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  onPress, 
  style,
  elevation = 2,
  shadow = false,
  borderRadius = theme.borderRadius.md,
  padding = theme.spacing.md,
  accessibilityLabel,
  accessibilityHint,
  testID
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  
  const cardStyle = [
    styles.card,
    { 
      borderRadius,
      padding,
      elevation: shadow ? elevation : 0,
      shadowOpacity: shadow ? 0.1 : 0,
      shadowRadius: shadow ? 4 : 0,
      shadowOffset: shadow ? { width: 0, height: 2 } : { width: 0, height: 0 },
    },
    style
  ];
  
  return (
    <Wrapper 
      onPress={onPress} 
      activeOpacity={onPress ? 0.9 : 1}
      style={cardStyle}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.card,
    shadowColor: "#000",
  },
});
