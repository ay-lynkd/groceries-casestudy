import type { Transaction } from "@/contexts/WalletContext";
import { theme } from "@/theme/appTheme";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { TransactionItem } from "./TransactionItem";

interface TransactionHistoryCardProps {
  transactions: Transaction[];
  dateHeader?: string;
  onShowAll?: () => void;
}

export const TransactionHistoryCard: React.FC<TransactionHistoryCardProps> = ({
  transactions,
  dateHeader = "Today, Mar 20",
  onShowAll,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <TouchableOpacity onPress={onShowAll}>
          <Text style={styles.showAll}>Show all</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dateHeader}>{dateHeader}</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  showAll: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: theme.typography.fontWeight.medium,
  },
  dateHeader: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.md,
  },
});
