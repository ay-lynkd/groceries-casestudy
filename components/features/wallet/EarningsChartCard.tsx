import type { EarningData } from "@/mocks/walletData";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CustomAreaChart } from "./CustomAreaChart";

interface EarningsChartCardProps {
  data: EarningData[];
  total: number;
  periods?: string[];
  onRefresh?: () => void;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

export const EarningsChartCard: React.FC<EarningsChartCardProps> = ({
  data,
  total,
  periods = ["Day", "Week", "Month", "Year"],
  onRefresh,
  selectedPeriod: externalSelectedPeriod,
  onPeriodChange,
}) => {
  const [internalSelectedPeriod, setInternalSelectedPeriod] = useState("Week");
  const selectedPeriod = externalSelectedPeriod ?? internalSelectedPeriod;
  const handlePeriodChange = (period: string) => {
    if (onPeriodChange) {
      onPeriodChange(period);
    } else {
      setInternalSelectedPeriod(period);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earning This Week</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons
            name="sync-outline"
            size={20}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.totalAmount}>
        ₹ {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </Text>

      <View style={styles.periodFilter}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => handlePeriodChange(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chartContainer}>
        <CustomAreaChart data={data} selectedIndex={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  refreshButton: {
    padding: theme.spacing.xs,
  },
  totalAmount: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  periodFilter: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  periodButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  periodButtonActive: {
    backgroundColor: "#1BA672",
  },
  periodText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  periodTextActive: {
    color: "white",
  },
  chartContainer: {
    alignItems: "center",
    marginHorizontal: -theme.spacing.md,
  },
});
