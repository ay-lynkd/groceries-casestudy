import { Text } from "@/components/common";
import { Button, Card, Input } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

// Types for search filters
interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface SearchFilter {
  id: string;
  name: string;
  type: "range" | "select" | "multiselect" | "toggle" | "date";
  options?: FilterOption[];
  minValue?: number;
  maxValue?: number;
  currentValue: any;
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilter[];
  onFilterChange: (filterId: string, value: any) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, any>>({});

  React.useEffect(() => {
    // Initialize temp values with current filter values
    const initialTempValues: Record<string, any> = {};
    filters.forEach(filter => {
      initialTempValues[filter.id] = filter.currentValue;
    });
    setTempValues(initialTempValues);
  }, [filters]);

  const toggleFilter = (filterId: string) => {
    setExpandedFilter(expandedFilter === filterId ? null : filterId);
  };

  const handleRangeChange = (filterId: string, min: number, max: number) => {
    setTempValues(prev => ({
      ...prev,
      [filterId]: { min, max }
    }));
  };

  const handleSelectChange = (filterId: string, value: string) => {
    setTempValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleMultiSelectChange = (filterId: string, optionId: string) => {
    setTempValues(prev => {
      const current = prev[filterId] || [];
      const isSelected = current.includes(optionId);
      
      if (isSelected) {
        return {
          ...prev,
          [filterId]: current.filter((id: string) => id !== optionId)
        };
      } else {
        return {
          ...prev,
          [filterId]: [...current, optionId]
        };
      }
    });
  };

  const handleToggleChange = (filterId: string, value: boolean) => {
    setTempValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const applyFilters = () => {
    // Apply all temporary values to the actual filter values
    Object.entries(tempValues).forEach(([filterId, value]) => {
      onFilterChange(filterId, value);
    });
    onApplyFilters();
  };

  const resetFilters = () => {
    setTempValues({});
    onResetFilters();
  };

  const renderFilter = (filter: SearchFilter) => {
    const currentValue = tempValues[filter.id];
    
    switch (filter.type) {
      case "range":
        return (
          <View style={styles.rangeContainer}>
            <View style={styles.rangeInputs}>
              <Input
                placeholder="Min"
                value={currentValue?.min?.toString() || ""}
                onChangeText={(text) => {
                  const min = text ? parseInt(text) : 0;
                  handleRangeChange(filter.id, min, currentValue?.max || filter.maxValue || 100);
                }}
                keyboardType="numeric"
                style={styles.rangeInput}
              />
              <Text variant="body" style={styles.rangeSeparator}>-</Text>
              <Input
                placeholder="Max"
                value={currentValue?.max?.toString() || ""}
                onChangeText={(text) => {
                  const max = text ? parseInt(text) : filter.maxValue || 100;
                  handleRangeChange(filter.id, currentValue?.min || 0, max);
                }}
                keyboardType="numeric"
                style={styles.rangeInput}
              />
            </View>
            <View style={styles.rangeSlider}>
              <View style={styles.sliderTrack}>
                <View 
                  style={[
                    styles.sliderFill, 
                    { 
                      left: `${((currentValue?.min || 0) / (filter.maxValue || 100)) * 100}%`,
                      width: `${(((currentValue?.max || filter.maxValue || 100) - (currentValue?.min || 0)) / (filter.maxValue || 100)) * 100}%`
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        );

      case "select":
        const isExpanded = expandedFilter === filter.id;
        return (
          <View style={styles.selectContainer}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => toggleFilter(filter.id)}
            >
              <Text variant="body">
                {filter.options?.find(opt => opt.value === currentValue)?.label || "Select an option"}
              </Text>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={theme.colors.text.primary} 
              />
            </TouchableOpacity>
            {filter.options && isExpanded && (
              <FlatList
                data={filter.options}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      currentValue === item.value && styles.selectedOption
                    ]}
                    onPress={() => handleSelectChange(filter.id, item.value)}
                  >
                    <Text variant="body">{item.label}</Text>
                    {currentValue === item.value && (
                      <Ionicons name="checkmark" size={20} color={theme.colors.primary.green} />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.optionsList}
              />
            )}
          </View>
        );

      case "multiselect":
        return (
          <View style={styles.multiSelectContainer}>
            {filter.options?.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.multiSelectOption,
                  (currentValue || []).includes(option.id) && styles.selectedMultiOption
                ]}
                onPress={() => handleMultiSelectChange(filter.id, option.id)}
              >
                <Text variant="body">{option.label}</Text>
                {(currentValue || []).includes(option.id) && (
                  <Ionicons name="checkmark" size={16} color={theme.colors.primary.green} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case "toggle":
        return (
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                currentValue && styles.toggleButtonActive
              ]}
              onPress={() => handleToggleChange(filter.id, !currentValue)}
            >
              <View style={[
                styles.toggleThumb,
                currentValue && styles.toggleThumbActive
              ]}>
                <Ionicons 
                  name={currentValue ? "checkmark" : "close"} 
                  size={16} 
                  color={currentValue ? theme.colors.background.primary : theme.colors.text.primary} 
                />
              </View>
            </TouchableOpacity>
            <Text variant="body" style={styles.toggleLabel}>
              {currentValue ? "Enabled" : "Disabled"}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3" fontWeight="bold">Advanced Filters</Text>
        <TouchableOpacity onPress={resetFilters}>
          <Ionicons name="reload" size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.filtersList}>
        {filters.map(filter => (
          <View key={filter.id} style={styles.filterItem}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleFilter(filter.id)}
            >
              <Text variant="body" fontWeight="semibold">{filter.name}</Text>
              <Ionicons 
                name={expandedFilter === filter.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={theme.colors.text.primary} 
              />
            </TouchableOpacity>

            {expandedFilter === filter.id && (
              <View style={styles.filterContent}>
                {renderFilter(filter)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          variant="outline"
          size="md"
          onPress={resetFilters}
          style={styles.button}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          size="md"
          onPress={applyFilters}
          style={styles.button}
        >
          Apply Filters
        </Button>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  filtersList: {
    maxHeight: 300,
    marginBottom: theme.spacing.md,
  },
  filterItem: {
    marginBottom: theme.spacing.md,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  filterContent: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
  },
  rangeContainer: {
    gap: theme.spacing.md,
  },
  rangeInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  rangeInput: {
    flex: 1,
    height: 40,
  },
  rangeSeparator: {
    marginHorizontal: theme.spacing.xs,
  },
  rangeSlider: {
    paddingVertical: theme.spacing.sm,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 2,
    position: "relative",
  },
  sliderFill: {
    position: "absolute",
    height: "100%",
    backgroundColor: theme.colors.primary.green,
    borderRadius: 2,
  },
  selectContainer: {
    gap: theme.spacing.sm,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  optionsList: {
    maxHeight: 150,
    marginTop: theme.spacing.xs,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  selectedOption: {
    backgroundColor: theme.colors.background.card,
  },
  multiSelectContainer: {
    gap: theme.spacing.xs,
  },
  multiSelectOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  selectedMultiOption: {
    backgroundColor: theme.colors.primary.green + "20",
    borderColor: theme.colors.primary.green,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  toggleButton: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.border.light,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary.green,
    justifyContent: "flex-end",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.background.primary,
  },
  toggleThumbActive: {
    backgroundColor: theme.colors.background.primary,
  },
  toggleLabel: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
});

export default AdvancedSearchFilters;