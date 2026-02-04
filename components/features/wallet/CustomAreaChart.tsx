import { theme } from "@/theme/appTheme";
import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
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
} from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const CHART_COLOR = "#1BA672";

interface DataPoint {
  day: string;
  value: number;
}

interface CustomAreaChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  selectedIndex?: number;
  onSelectPoint?: (index: number) => void;
}

export const CustomAreaChart: React.FC<CustomAreaChartProps> = ({
  data,
  width = screenWidth - 64,
  height = 220,
  selectedIndex: initialSelectedIndex = 4,
  onSelectPoint,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

  const paddingTop = 60;
  const paddingBottom = 40;
  const paddingHorizontal = 20;

  const chartWidth = width - paddingHorizontal * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value)) * 0.5;

  // Calculate points
  const points = data.map((d, i) => ({
    x: paddingHorizontal + (i / (data.length - 1)) * chartWidth,
    y:
      paddingTop +
      chartHeight -
      ((d.value - minValue) / (maxValue - minValue)) * chartHeight,
    value: d.value,
    day: d.day,
  }));

  // Create smooth bezier curve path
  const createSmoothPath = () => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlPointX1 = current.x + (next.x - current.x) / 3;
      const controlPointX2 = current.x + (2 * (next.x - current.x)) / 3;

      path += ` C ${controlPointX1} ${current.y}, ${controlPointX2} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  // Create filled area path
  const createAreaPath = () => {
    const linePath = createSmoothPath();
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];

    return `${linePath} L ${lastPoint.x} ${height - paddingBottom} L ${firstPoint.x} ${height - paddingBottom} Z`;
  };

  const handlePointPress = (index: number) => {
    setSelectedIndex(index);
    onSelectPoint?.(index);
  };

  const selectedPoint = points[selectedIndex];

  return (
    <View style={[styles.container, { width, height: height + 30 }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={CHART_COLOR} stopOpacity="0.4" />
            <Stop offset="50%" stopColor={CHART_COLOR} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={CHART_COLOR} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>

        {/* Filled area */}
        <Path d={createAreaPath()} fill="url(#areaGradient)" />

        {/* Line */}
        <Path
          d={createSmoothPath()}
          stroke={CHART_COLOR}
          strokeWidth={2.5}
          fill="none"
        />

        {/* Selected point indicator */}
        {selectedPoint && (
          <G>
            {/* Vertical line from point to tag */}
            <Line
              x1={selectedPoint.x}
              y1={selectedPoint.y + 8}
              x2={selectedPoint.x}
              y2={height - paddingBottom - 5}
              stroke={CHART_COLOR}
              strokeWidth={2}
            />

            {/* Tag/Pin shape */}
            <G>
              <Rect
                x={selectedPoint.x - 16}
                y={height - paddingBottom - 50}
                width={32}
                height={48}
                rx={8}
                fill={CHART_COLOR}
              />
              {/* Small circle dot at bottom of tag */}
              <Circle
                cx={selectedPoint.x}
                cy={height - paddingBottom - 12}
                r={4}
                fill="white"
              />
            </G>

            {/* Selected point circle on line */}
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
                x={selectedPoint.x - 50}
                y={selectedPoint.y - 42}
                width={100}
                height={30}
                rx={8}
                fill={CHART_COLOR}
              />
              {/* Tooltip arrow */}
              <Polygon
                points={`${selectedPoint.x - 6},${selectedPoint.y - 12} ${selectedPoint.x + 6},${selectedPoint.y - 12} ${selectedPoint.x},${selectedPoint.y - 4}`}
                fill={CHART_COLOR}
              />
              <SvgText
                x={selectedPoint.x}
                y={selectedPoint.y - 22}
                fill="white"
                fontSize={13}
                fontWeight="600"
                textAnchor="middle"
              >
                {`₹${selectedPoint.value.toFixed(2)}`}
              </SvgText>
            </G>
          </G>
        )}
      </Svg>

      {/* Day labels */}
      <View style={styles.labelsContainer}>
        {points.map((point, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.labelWrapper, { left: point.x - 15 }]}
            onPress={() => handlePointPress(index)}
          >
            <Text
              style={[
                styles.dayLabel,
                selectedIndex === index && styles.dayLabelSelected,
              ]}
            >
              {point.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  labelsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  labelWrapper: {
    position: "absolute",
    width: 30,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.normal,
  },
  dayLabelSelected: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
