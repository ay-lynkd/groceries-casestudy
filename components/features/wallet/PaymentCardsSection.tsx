import { theme } from "@/theme/appTheme";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { PaymentCard } from "./PaymentCard";

export interface CardData {
  id: string;
  title: string;
  cardNumber: string;
  variant: "green" | "blue";
}

interface PaymentCardsSectionProps {
  cards: CardData[];
}

export const PaymentCardsSection: React.FC<PaymentCardsSectionProps> = ({
  cards,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {cards.map((card) => (
        <PaymentCard
          key={card.id}
          title={card.title}
          cardNumber={card.cardNumber}
          variant={card.variant}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
});
