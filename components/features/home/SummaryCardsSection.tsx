import type { SummaryCardData } from "@/types/home";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SummaryCard } from "./SummaryCard";

interface SummaryCardsSectionProps {
  cards: SummaryCardData[];
}

export const SummaryCardsSection: React.FC<SummaryCardsSectionProps> = ({
  cards,
}) => {
  return (
    <View style={styles.container}>
      {cards.map((card) => (
        <View key={card.id} style={styles.cardWrapper}>
          <SummaryCard
            iconType={card.iconType}
            iconColor={card.iconColor}
            iconBackgroundColor={card.iconBackgroundColor}
            title={card.title}
            value={card.value}
            change={card.change}
            variant={card.variant}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 24,
  },
  cardWrapper: { width: "50%", padding: 4 },
});
