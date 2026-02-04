import { Button } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <Button
          key={category}
          variant="secondary"
          size="md"
          active={selectedCategory === category}
          shiny={true}
          onPress={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
  },
});
