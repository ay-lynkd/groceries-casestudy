import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SubCategoryTabsProps {
  tabs: string[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export const SubCategoryTabs: React.FC<SubCategoryTabsProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  showAddButton = false,
  onAddClick,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {showAddButton && (
        <TouchableOpacity style={styles.addButton} onPress={onAddClick} activeOpacity={0.8}>
          <Ionicons name="add" size={16} color={theme.colors.primary.green} />
          <Text style={styles.addText}>Add Product</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: theme.spacing.md 
  },
  tabs: { flexDirection: "row", gap: theme.spacing.lg },
  tab: { 
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
  },
  tabText: { 
    color: theme.colors.text.secondary, 
    fontSize: theme.typography.fontSize.base, 
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.fonts.figtree,
  },
  tabTextActive: { color: '#FFFFFF' },
  tabActive: {
    backgroundColor: theme.colors.primary.green,
    borderColor: theme.colors.primary.green,
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  addText: {
    color: theme.colors.primary.green,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.fonts.figtree,
  },
});
