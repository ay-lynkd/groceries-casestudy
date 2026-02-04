import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  day: string;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

const WorkingHoursManagement: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      day: "Monday",
      isOpen: true,
      timeSlots: [{ startTime: "09:00", endTime: "21:00" }],
    },
    {
      day: "Tuesday",
      isOpen: true,
      timeSlots: [{ startTime: "09:00", endTime: "21:00" }],
    },
    {
      day: "Wednesday",
      isOpen: true,
      timeSlots: [{ startTime: "09:00", endTime: "21:00" }],
    },
    {
      day: "Thursday",
      isOpen: true,
      timeSlots: [{ startTime: "09:00", endTime: "21:00" }],
    },
    {
      day: "Friday",
      isOpen: true,
      timeSlots: [{ startTime: "09:00", endTime: "22:00" }],
    },
    {
      day: "Saturday",
      isOpen: true,
      timeSlots: [{ startTime: "10:00", endTime: "22:00" }],
    },
    {
      day: "Sunday",
      isOpen: false,
      timeSlots: [],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const updateDaySchedule = (dayIndex: number, field: keyof DaySchedule, value: any) => {
    setSchedule(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], [field]: value };
      return updated;
    });
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: keyof TimeSlot, value: string) => {
    setSchedule(prev => {
      const updated = [...prev];
      if (updated[dayIndex].timeSlots[slotIndex]) {
        updated[dayIndex].timeSlots[slotIndex] = { 
          ...updated[dayIndex].timeSlots[slotIndex], 
          [field]: value 
        };
      }
      return updated;
    });
  };

  const addTimeSlot = (dayIndex: number) => {
    setSchedule(prev => {
      const updated = [...prev];
      updated[dayIndex].timeSlots.push({ startTime: "10:00", endTime: "18:00" });
      return updated;
    });
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedule(prev => {
      const updated = [...prev];
      if (updated[dayIndex].timeSlots.length > 1) {
        updated[dayIndex].timeSlots.splice(slotIndex, 1);
      } else {
        // If removing the last slot, just close the day
        updated[dayIndex].isOpen = false;
        updated[dayIndex].timeSlots = [];
      }
      return updated;
    });
  };

  const toggleDay = (dayIndex: number) => {
    setSchedule(prev => {
      const updated = [...prev];
      updated[dayIndex].isOpen = !updated[dayIndex].isOpen;
      if (!updated[dayIndex].isOpen) {
        updated[dayIndex].timeSlots = [];
      } else if (updated[dayIndex].timeSlots.length === 0) {
        updated[dayIndex].timeSlots.push({ startTime: "10:00", endTime: "18:00" });
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert("Success", "Working hours updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update working hours. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Schedule",
      "Are you sure you want to reset to default working hours?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setSchedule([
              {
                day: "Monday",
                isOpen: true,
                timeSlots: [{ startTime: "09:00", endTime: "21:00" }],
              },
              {
                day: "Tuesday",
                isOpen: true,
                timeSlots: [{ startTime: "09:00", endTime: "21:00" }],
              },
              {
                day: "Wednesday",
                isOpen: true,
                timeSlots: [{ startTime: "09:00", endTime: "21:00" }],
              },
              {
                day: "Thursday",
                isOpen: true,
                timeSlots: [{ startTime: "09:00", endTime: "21:00" }],
              },
              {
                day: "Friday",
                isOpen: true,
                timeSlots: [{ startTime: "09:00", endTime: "22:00" }],
              },
              {
                day: "Saturday",
                isOpen: true,
                timeSlots: [{ startTime: "10:00", endTime: "22:00" }],
              },
              {
                day: "Sunday",
                isOpen: false,
                timeSlots: [],
              },
            ]);
          },
        },
      ]
    );
  };

  const renderTimePicker = (value: string, onChange: (value: string) => void, label: string) => {
    return (
      <View style={styles.timePickerContainer}>
        <Text variant="caption" color={theme.colors.text.light}>
          {label}
        </Text>
        <TouchableOpacity
          style={styles.timePicker}
          onPress={() => Alert.alert("Time Picker", "In a real app, this would open a time picker")}
        >
          <Text variant="body" fontWeight="semibold">
            {value}
          </Text>
          <Ionicons name="time" size={16} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDaySchedule = (day: DaySchedule, index: number) => (
    <Card key={index} style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <Text variant="body" fontWeight="semibold">
          {day.day}
        </Text>
        <Switch
          value={day.isOpen}
          onValueChange={() => toggleDay(index)}
          trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.green }}
        />
      </View>

      {day.isOpen && (
        <View style={styles.timeSlotsContainer}>
          {day.timeSlots.map((slot, slotIndex) => (
            <View key={slotIndex} style={styles.timeSlot}>
              <View style={styles.timeInputs}>
                {renderTimePicker(slot.startTime, (val) => updateTimeSlot(index, slotIndex, "startTime", val), "Open")}
                <Text variant="body" fontWeight="bold" style={styles.timeSeparator}>
                  to
                </Text>
                {renderTimePicker(slot.endTime, (val) => updateTimeSlot(index, slotIndex, "endTime", val), "Close")}
              </View>
              {day.timeSlots.length > 1 && (
                <TouchableOpacity
                  style={styles.removeSlotButton}
                  onPress={() => removeTimeSlot(index, slotIndex)}
                >
                  <Ionicons name="trash" size={16} color={theme.colors.status.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <TouchableOpacity
            style={styles.addSlotButton}
            onPress={() => addTimeSlot(index)}
            disabled={day.timeSlots.length >= 3}
          >
            <Ionicons name="add" size={16} color={theme.colors.primary.green} />
            <Text variant="caption" color={theme.colors.primary.green}>
              Add Time Slot
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!day.isOpen && (
        <View style={styles.closedDay}>
          <Ionicons name="close-circle" size={16} color={theme.colors.status.error} />
          <Text variant="body" color={theme.colors.status.error}>
            Closed
          </Text>
        </View>
      )}
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Working Hours
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleReset}
            style={styles.resetButton}
            accessibilityLabel="Reset to default"
          >
            <Ionicons name="refresh" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Weekly Overview */}
        <Card style={styles.overviewCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Weekly Overview
          </Text>
          <View style={styles.weeklyOverview}>
            {schedule.map((day, index) => (
              <View key={index} style={styles.dayOverview}>
                <Text variant="caption" fontWeight="semibold">
                  {day.day.substring(0, 3)}
                </Text>
                <View
                  style={[
                    styles.dayStatus,
                    { backgroundColor: day.isOpen ? theme.colors.status.success + "20" : theme.colors.status.error + "20" }
                  ]}
                >
                  <Text
                    variant="caption"
                    color={day.isOpen ? theme.colors.status.success : theme.colors.status.error}
                  >
                    {day.isOpen ? "Open" : "Closed"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Daily Schedules */}
        <Card style={styles.scheduleCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Daily Schedule
          </Text>
          <Text variant="caption" color={theme.colors.text.light} style={styles.sectionSubtitle}>
            Set opening and closing times for each day
          </Text>
          
          <View style={styles.daysList}>
            {schedule.map(renderDaySchedule)}
          </View>
        </Card>

        {/* Business Info */}
        <Card style={styles.infoCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Business Hours Info
          </Text>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={16} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.infoText}>
              Customers will only be able to place orders during your active hours
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={16} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.infoText}>
              Orders placed outside business hours will be queued for the next open time
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Button
          variant="primary"
          size="md"
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              Saving...
            </>
          ) : (
            <>
              <Ionicons name="save" size={20} color="#FFFFFF" />
              Save Changes
            </>
          )}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  resetButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  overviewCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  scheduleCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoCard: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  sectionSubtitle: {
    marginBottom: theme.spacing.lg,
  },
  weeklyOverview: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayOverview: {
    alignItems: "center",
  },
  dayStatus: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.xs,
  },
  daysList: {
    gap: theme.spacing.md,
  },
  dayCard: {
    padding: theme.spacing.md,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  timeSlotsContainer: {
    gap: theme.spacing.md,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  timeSeparator: {
    marginHorizontal: theme.spacing.sm,
  },
  timePickerContainer: {
    flex: 1,
  },
  timePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
  },
  removeSlotButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.md,
  },
  addSlotButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  closedDay: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    justifyContent: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
});

export default WorkingHoursManagement;