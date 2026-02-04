import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

interface SettingsToggleItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  showDivider?: boolean;
}

export const SettingsToggleItem: React.FC<SettingsToggleItemProps> = ({
  icon,
  label,
  value,
  onToggle,
  showDivider = true,
}) => {
  return (
    <View style={styles.container} accessibilityLabel={`${label} setting`}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={22}
              color={theme.colors.text.secondary}
            />
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{
            false: theme.colors.border.medium,
            true: theme.colors.primary.green,
          }}
          thumbColor="white"
          ios_backgroundColor={theme.colors.border.medium}
          accessibilityLabel={`Toggle ${label}`}
        />
      </View>
      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.md,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginLeft: 52,
  },
});
