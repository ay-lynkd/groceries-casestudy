import { Text } from "@/components/common";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface TimelineEvent {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  isCurrent?: boolean;
  isCompleted?: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({
  events,
  currentStatus,
}) => {
  const getStatusColor = (status: string, isCurrent: boolean, isCompleted: boolean) => {
    if (isCurrent) return theme.colors.primary.green;
    if (isCompleted) return theme.colors.status.success;
    return theme.colors.border.light;
  };

  const getStatusIcon = (status: string, isCurrent: boolean, isCompleted: boolean) => {
    if (isCurrent) return "ellipse";
    if (isCompleted) return "checkmark-circle";
    return "ellipse-outline";
  };

  return (
    <View style={styles.container}>
      {events.map((event, index) => {
        const isCurrent = event.status === currentStatus;
        const isCompleted = events.findIndex(e => e.status === currentStatus) > index;
        const statusColor = getStatusColor(event.status, isCurrent, isCompleted);
        const statusIcon = getStatusIcon(event.status, isCurrent, isCompleted);

        return (
          <View key={event.id} style={styles.eventContainer}>
            {/* Timeline Line (except for last item) */}
            {index < events.length - 1 && (
              <View
                style={[
                  styles.timelineLine,
                  {
                    backgroundColor: isCompleted 
                      ? theme.colors.status.success 
                      : theme.colors.border.light,
                  },
                ]}
              />
            )}

            {/* Event Content */}
            <View style={styles.eventContent}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Ionicons
                  name={statusIcon}
                  size={24}
                  color={statusColor}
                />
              </View>

              {/* Event Details */}
              <View style={styles.eventDetails}>
                <View style={styles.eventHeader}>
                  <Text
                    variant="body"
                    fontWeight="semibold"
                    color={isCurrent || isCompleted ? theme.colors.text.primary : theme.colors.text.secondary}
                  >
                    {event.title}
                  </Text>
                  {isCurrent && (
                    <View style={styles.currentBadge}>
                      <Text variant="caption" fontWeight="medium" color="#FFFFFF">
                        Current
                      </Text>
                    </View>
                  )}
                </View>
                
                <Text
                  variant="caption"
                  color={theme.colors.text.secondary}
                  style={styles.eventDescription}
                >
                  {event.description}
                </Text>
                
                <Text
                  variant="caption"
                  color={theme.colors.text.light}
                  style={styles.eventTimestamp}
                >
                  {event.timestamp}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Sample data for demonstration
export const sampleOrderTimeline: TimelineEvent[] = [
  {
    id: "1",
    status: "placed",
    title: "Order Placed",
    description: "Customer placed the order successfully",
    timestamp: "Jan 15, 2024 • 10:30 AM",
    iconName: "cart",
    color: theme.colors.primary.green,
  },
  {
    id: "2",
    status: "confirmed",
    title: "Order Confirmed",
    description: "Seller confirmed the order and started preparation",
    timestamp: "Jan 15, 2024 • 11:15 AM",
    iconName: "checkmark-circle",
    color: theme.colors.status.success,
  },
  {
    id: "3",
    status: "preparing",
    title: "Preparing Order",
    description: "Items are being prepared for packaging",
    timestamp: "Jan 15, 2024 • 12:00 PM",
    iconName: "restaurant",
    color: theme.colors.primary.orange,
  },
  {
    id: "4",
    status: "ready",
    title: "Ready for Pickup",
    description: "Order is ready and waiting for pickup/delivery",
    timestamp: "Jan 15, 2024 • 1:30 PM",
    iconName: "bag-check",
    color: theme.colors.status.info,
  },
  {
    id: "5",
    status: "shipped",
    title: "Order Shipped",
    description: "Order has been dispatched for delivery",
    timestamp: "Jan 15, 2024 • 2:15 PM",
    iconName: "bicycle",
    color: theme.colors.primary.purple,
  },
  {
    id: "6",
    status: "delivered",
    title: "Order Delivered",
    description: "Order successfully delivered to customer",
    timestamp: "Jan 15, 2024 • 4:30 PM",
    iconName: "home",
    color: theme.colors.status.success,
  },
];

// Additional timeline configurations for different scenarios
export const getOrderTimelineConfig = (orderType: 'standard' | 'express' | 'pickup') => {
  switch (orderType) {
    case 'express':
      return [
        ...sampleOrderTimeline.slice(0, 3),
        {
          id: "4",
          status: "out_for_delivery",
          title: "Out for Delivery",
          description: "Order is on its way to the customer",
          timestamp: "Jan 15, 2024 • 1:45 PM",
          iconName: "bicycle",
          color: theme.colors.primary.purple,
        },
        sampleOrderTimeline[5], // delivered
      ];
    case 'pickup':
      return [
        ...sampleOrderTimeline.slice(0, 3),
        {
          id: "4",
          status: "ready_for_pickup",
          title: "Ready for Pickup",
          description: "Order is ready for customer pickup",
          timestamp: "Jan 15, 2024 • 1:30 PM",
          iconName: "location",
          color: theme.colors.status.info,
        },
        {
          id: "5",
          status: "picked_up",
          title: "Order Picked Up",
          description: "Customer has picked up the order",
          timestamp: "Jan 15, 2024 • 2:15 PM",
          iconName: "checkmark-circle",
          color: theme.colors.status.success,
        },
      ];
    default:
      return sampleOrderTimeline;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventContainer: {
    position: "relative",
    marginBottom: theme.spacing.lg,
  },
  timelineLine: {
    position: "absolute",
    left: 12,
    top: 24,
    width: 2,
    height: "100%",
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
    zIndex: 1,
  },
  eventDetails: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  currentBadge: {
    backgroundColor: theme.colors.primary.green,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  eventDescription: {
    marginBottom: theme.spacing.xs,
  },
  eventTimestamp: {
    marginBottom: theme.spacing.sm,
  },
});

export default OrderTimeline;