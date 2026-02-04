import { Button } from '@/components/primary';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface PeriodFilterProps {
  periods: string[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  periods,
  selectedPeriod,
  onPeriodChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      accessibilityLabel="Period filter"
      accessibilityRole="tablist">
      {periods.map((period) => (
        <View key={period} style={styles.buttonWrapper}>
          <Button
            variant="secondary"
            size="md"
            active={selectedPeriod === period}
            shiny={true}
            onPress={() => onPeriodChange(period)}
            style={styles.button}
            accessibilityLabel={`${period} period`}
            accessibilityHint={`Show data for ${period}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedPeriod === period }}
            testID={`period-button-${period}`}>
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Button>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  buttonWrapper: {
    minWidth: 90,
  },
  button: {
    width: '100%',
  },
});

export default PeriodFilter;
