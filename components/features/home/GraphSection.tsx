import { theme } from '@/theme/appTheme';
import type { GraphData } from '@/types/home';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AccessibilityInfo,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

interface GraphSectionProps {
  title: string;
  data: GraphData[];
  tooltipValue?: number;
  tooltipLabel?: string;
  accessibilityLabel?: string;
}

const CHART_COLOR = theme.colors.primary.green;
const screenWidth = Dimensions.get('window').width;

export const GraphSection: React.FC<GraphSectionProps> = ({
  title,
  data,
  tooltipLabel = 'Today Appointments',
  accessibilityLabel,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { width, height, paddingTop, paddingBottom, paddingHorizontal, chartWidth, chartHeight } =
    useMemo(
      () => ({
        width: screenWidth - 32,
        height: 180,
        paddingTop: 50,
        paddingBottom: 10,
        paddingHorizontal: 30,
        chartWidth: screenWidth - 32 - 30 * 2,
        chartHeight: 180 - 50 - 10,
      }),
      []
    );

  const { maxValue, minValue, points } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value)) * 0.8;
    const pts = data.map((d, i) => ({
      x: paddingHorizontal + (i / (data.length - 1)) * chartWidth,
      y: paddingTop + chartHeight - ((d.value - min) / (max - min)) * chartHeight,
      value: d.value,
      day: d.day,
      date: d.date,
      index: i,
    }));
    return { maxValue: max, minValue: min, points: pts };
  }, [data, chartWidth, chartHeight, paddingHorizontal, paddingTop]);

  // Create smooth bezier curve path
  const createSmoothPath = useCallback(() => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlPointX1 = current.x + (next.x - current.x) / 3;
      const controlPointX2 = current.x + (2 * (next.x - current.x)) / 3;

      path += ` C ${controlPointX1} ${current.y}, ${controlPointX2} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  }, [points]);

  // Create filled area path
  const createAreaPath = useCallback(() => {
    const linePath = createSmoothPath();
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];

    return `${linePath} L ${lastPoint.x} ${height - paddingBottom} L ${firstPoint.x} ${height - paddingBottom} Z`;
  }, [createSmoothPath, points, height, paddingBottom]);

  // Create dashed line path for future projection
  const createDashedPath = useCallback(() => {
    if (selectedIndex === null || selectedIndex >= points.length - 1) return '';

    let path = `M ${points[selectedIndex].x} ${points[selectedIndex].y}`;

    for (let i = selectedIndex; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlPointX1 = current.x + (next.x - current.x) / 3;
      const controlPointX2 = current.x + (2 * (next.x - current.x)) / 3;

      path += ` C ${controlPointX1} ${current.y}, ${controlPointX2} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  }, [selectedIndex, points]);

  const handlePointPress = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      // Announce to screen reader
      const point = points[index];
      AccessibilityInfo.announceForAccessibility(
        `${point.day} ${point.date}: ${point.value} ${tooltipLabel}`
      );
    },
    [points, tooltipLabel]
  );

  const selectedPoint = selectedIndex !== null ? points[selectedIndex] : null;

  // Calculate accessibility data summary
  const dataSummary = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const average = Math.round(total / data.length);
    const highest = Math.max(...data.map((d) => d.value));
    const lowest = Math.min(...data.map((d) => d.value));
    return `Chart showing ${data.length} days. Average: ${average}, Highest: ${highest}, Lowest: ${lowest}`;
  }, [data]);

  return (
    <View
      style={styles.container}
      accessibilityLabel={accessibilityLabel || `${title}. ${dataSummary}`}
      accessibilityRole="image">
      <Text style={styles.title}>{title}</Text>

      {/* Day and Date Labels */}
      <View style={styles.labelsRow}>
        {points.map((point, index) => (
          <TouchableOpacity
            key={index}
            style={styles.labelItem}
            onPress={() => handlePointPress(index)}
            accessibilityLabel={`${point.day} ${point.date}: ${point.value} ${tooltipLabel}`}
            accessibilityHint="Tap to view details"
            accessibilityRole="button"
            accessibilityState={{ selected: selectedIndex === index }}>
            <Text
              style={[
                styles.dayLabel,
                selectedIndex === index && styles.dayLabelSelected,
              ]}>
              {point.day}
            </Text>
            <Text
              style={[
                styles.dateLabel,
                selectedIndex === index && styles.dateLabelSelected,
              ]}>
              {point.date}
            </Text>
            {selectedIndex === index && <View style={styles.selectedDot} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <View style={styles.chartContainer} accessibilityElementsHidden>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={CHART_COLOR} stopOpacity="0.3" />
              <Stop offset="50%" stopColor={CHART_COLOR} stopOpacity="0.15" />
              <Stop offset="100%" stopColor={CHART_COLOR} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>

          {/* Dotted vertical lines */}
          {points.map((point, index) => (
            <Line
              key={`vline-${index}`}
              x1={point.x}
              y1={paddingTop - 10}
              x2={point.x}
              y2={height - paddingBottom}
              stroke="#E5E5E5"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          ))}

          {/* Filled area */}
          <Path d={createAreaPath()} fill="url(#areaGradient)" />

          {/* Main line */}
          <Path
            d={createSmoothPath()}
            stroke={CHART_COLOR}
            strokeWidth={2.5}
            fill="none"
          />

          {/* Dashed line for future projection */}
          {selectedIndex !== null && selectedIndex < points.length - 1 && (
            <Path
              d={createDashedPath()}
              stroke={CHART_COLOR}
              strokeWidth={2}
              strokeDasharray="6,4"
              fill="none"
            />
          )}

          {/* Selected point indicator */}
          {selectedPoint && (
            <G>
              {/* Vertical line from point down */}
              <Line
                x1={selectedPoint.x}
                y1={selectedPoint.y + 8}
                x2={selectedPoint.x}
                y2={height - paddingBottom}
                stroke={CHART_COLOR}
                strokeWidth={2}
              />

              {/* Selected point circle */}
              <Circle
                cx={selectedPoint.x}
                cy={selectedPoint.y}
                r={6}
                fill="white"
                stroke={CHART_COLOR}
                strokeWidth={3}
              />

              {/* Tooltip bubble */}
              <G>
                <Rect
                  x={selectedPoint.x - 75}
                  y={selectedPoint.y - 45}
                  width={150}
                  height={32}
                  rx={8}
                  fill="white"
                  stroke="#E8E8E8"
                  strokeWidth={1}
                />
                {/* Tooltip arrow */}
                <Polygon
                  points={`${selectedPoint.x - 6},${selectedPoint.y - 13} ${selectedPoint.x + 6},${selectedPoint.y - 13} ${selectedPoint.x},${selectedPoint.y - 5}`}
                  fill="white"
                  stroke="#E8E8E8"
                  strokeWidth={1}
                />
                <Rect
                  x={selectedPoint.x - 6}
                  y={selectedPoint.y - 14}
                  width={12}
                  height={4}
                  fill="white"
                />
                <SvgText
                  x={selectedPoint.x - 45}
                  y={selectedPoint.y - 24}
                  fill={CHART_COLOR}
                  fontSize={14}
                  fontWeight="700">
                  {selectedPoint.value}
                </SvgText>
              </G>
            </G>
          )}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  labelItem: {
    alignItems: 'center',
    minWidth: 40,
  },
  dayLabel: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 4,
  },
  dayLabelSelected: {
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  dateLabel: {
    color: theme.colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  dateLabelSelected: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: CHART_COLOR,
    marginTop: 4,
  },
  chartContainer: {
    marginHorizontal: -16,
  },
});

export default GraphSection;
