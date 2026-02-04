import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LowStockAlertConfig {
  id: string;
  productName: string;
  currentStock: number;
  threshold: number;
  enabled: boolean;
  notificationMethod: "push" | "email" | "both";
}

const LowStockAlertConfiguration: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [alerts, setAlerts] = useState<LowStockAlertConfig[]>([]);
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [globalThreshold, setGlobalThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockAlerts: LowStockAlertConfig[] = [
      {
        id: "1",
        productName: "Basmati Rice 10kg",
        currentStock: 3,
        threshold: 5,
        enabled: true,
        notificationMethod: "both",
      },
      {
        id: "2",
        productName: "Moong Dal 1kg",
        currentStock: 15,
        threshold: 10,
        enabled: true,
        notificationMethod: "push",
      },
      {
        id: "3",
        productName: "Fortune Oil 1L",
        currentStock: 0,
        threshold: 5,
        enabled: true,
        notificationMethod: "email",
      },
      {
        id: "4",
        productName: "Sugar 5kg",
        currentStock: 25,
        threshold: 20,
        enabled: false,
        notificationMethod: "push",
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 800);
  }, []);

  const updateAlertConfig = (id: string, field: keyof LowStockAlertConfig, value: any) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, [field]: value } : alert
      )
    );
  };

  const updateGlobalThreshold = (value: number) => {
    setGlobalThreshold(value);
    // Update all alerts to use the new global threshold
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, threshold: value }))
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert("Success", "Low stock alert settings saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefault = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all low stock alert settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setGlobalEnabled(true);
            setGlobalThreshold(5);
            setAlerts(prev => 
              prev.map(alert => ({ ...alert, threshold: 5, enabled: true }))
            );
          },
        },
      ]
    );
  };

  const renderAlertItem = ({ item }: { item: LowStockAlertConfig }) => (
    <Card style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <Text variant="body" fontWeight="semibold" numberOfLines={1}>
          {item.productName}
        </Text>
        <Switch
          value={item.enabled}
          onValueChange={(value) => updateAlertConfig(item.id, "enabled", value)}
          trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.green }}
        />
      </View>

      <View style={styles.alertDetails}>
        <View style={styles.detailRow}>
          <Text variant="caption" color={theme.colors.text.light}>
            Current Stock:
          </Text>
          <Text
            variant="caption"
            fontWeight="semibold"
            color={
              item.currentStock <= item.threshold
                ? theme.colors.status.error
                : item.currentStock <= item.threshold * 2
                ? theme.colors.status.warning
                : theme.colors.status.success
            }
          >
            {item.currentStock} units
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text variant="caption" color={theme.colors.text.light}>
            Threshold:
          </Text>
          <View style={styles.thresholdContainer}>
            <TouchableOpacity
              onPress={() => {
                const newValue = Math.max(1, item.threshold - 1);
                updateAlertConfig(item.id, "threshold", newValue);
              }}
              style={styles.thresholdButton}
            >
              <Ionicons name="remove" size={16} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text variant="caption" fontWeight="semibold" style={styles.thresholdValue}>
              {item.threshold}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const newValue = item.threshold + 1;
                updateAlertConfig(item.id, "threshold", newValue);
              }}
              style={styles.thresholdButton}
            >
              <Ionicons name="add" size={16} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text variant="caption" color={theme.colors.text.light}>
            Notification:
          </Text>
          <View style={styles.notificationBadge}>
            <Text variant="caption" color={theme.colors.background.primary}>
              {item.notificationMethod === "push" ? "Push" : 
               item.notificationMethod === "email" ? "Email" : "Both"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.alertStatus}>
        {item.currentStock <= item.threshold ? (
          <View style={styles.statusAlert}>
            <Ionicons name="alert" size={16} color={theme.colors.status.error} />
            <Text variant="caption" color={theme.colors.status.error}>
              Low stock! Current: {item.currentStock}, Threshold: {item.threshold}
            </Text>
          </View>
        ) : (
          <View style={styles.statusNormal}>
            <Ionicons name="checkmark" size={16} color={theme.colors.status.success} />
            <Text variant="caption" color={theme.colors.status.success}>
              Stock level is adequate
            </Text>
          </View>
        )}
      </View>
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
          Low Stock Alerts
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleResetToDefault}
            style={styles.resetButton}
            accessibilityLabel="Reset settings"
          >
            <Ionicons name="refresh" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content - Using FlatList as primary scrollable */}
      <FlatList
        style={styles.content}
        data={alerts}
        renderItem={renderAlertItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {}} />}
        ListHeaderComponent={
          <>
            {/* Global Settings */}
            <Card style={styles.globalSettingsCard}>
              <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                Global Settings
              </Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text variant="body" fontWeight="semibold">
                    Enable Low Stock Alerts
                  </Text>
                  <Text variant="caption" color={theme.colors.text.light}>
                    Turn on/off all low stock notifications
                  </Text>
                </View>
                <Switch
                  value={globalEnabled}
                  onValueChange={setGlobalEnabled}
                  trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.green }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text variant="body" fontWeight="semibold">
                    Default Threshold
                  </Text>
                  <Text variant="caption" color={theme.colors.text.light}>
                    Default number of units before alert
                  </Text>
                </View>
                <View style={styles.thresholdContainer}>
                  <TouchableOpacity
                    onPress={() => updateGlobalThreshold(Math.max(1, globalThreshold - 1))}
                    style={styles.thresholdButton}
                  >
                    <Ionicons name="remove" size={16} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                  <Text variant="body" fontWeight="semibold" style={styles.thresholdValue}>
                    {globalThreshold}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateGlobalThreshold(globalThreshold + 1)}
                    style={styles.thresholdButton}
                  >
                    <Ionicons name="add" size={16} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            {/* Product Alerts Header */}
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Product Alerts
                </Text>
                <Text variant="caption" color={theme.colors.text.light}>
                  {alerts.filter(a => a.enabled).length} active
                </Text>
              </View>
            </Card>
          </>
        }
        ListFooterComponent={
          <Card style={styles.tipsCard}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Pro Tips
            </Text>
            <View style={styles.tipItem}>
              <Ionicons name="bulb" size={20} color={theme.colors.primary.orange} />
              <Text variant="body" style={styles.tipText}>
                Set lower thresholds for fast-moving products
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="bulb" size={20} color={theme.colors.primary.orange} />
              <Text variant="body" style={styles.tipText}>
                Use email notifications for critical low stock situations
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="bulb" size={20} color={theme.colors.primary.orange} />
              <Text variant="body" style={styles.tipText}>
                Monitor alerts regularly to avoid stockouts
              </Text>
            </View>
          </Card>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={24} color={theme.colors.primary.green} />
              <Text variant="body">Loading alerts...</Text>
            </View>
          ) : (
            <Card style={styles.sectionCard}>
              <View style={styles.emptyState}>
                <Ionicons name="alert" size={48} color={theme.colors.text.light} />
                <Text variant="h3" fontWeight="bold" style={styles.emptyTitle}>
                  No Alerts Configured
                </Text>
                <Text variant="body" color={theme.colors.text.secondary} style={styles.emptyText}>
                  Configure low stock alerts for your products
                </Text>
              </View>
            </Card>
          )
        }
      />

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Button
          variant="primary"
          size="md"
          onPress={handleSave}
          style={styles.saveButton}
          disabled={loading}
        >
          {loading ? (
            <>
              <Ionicons name="refresh" size={20} color={theme.colors.background.primary} />
              Saving...
            </>
          ) : (
            <>
              <Ionicons name="save" size={20} color={theme.colors.background.primary} />
              Save Settings
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
  globalSettingsCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  tipsCard: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  settingInfo: {
    flex: 1,
  },
  alertCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  alertDetails: {
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  thresholdContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.full,
  },
  thresholdButton: {
    padding: theme.spacing.sm,
  },
  thresholdValue: {
    marginHorizontal: theme.spacing.md,
  },
  notificationBadge: {
    backgroundColor: theme.colors.primary.green,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  alertStatus: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  statusAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  statusNormal: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  loadingContainer: {
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  emptyState: {
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.text.light,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  tipText: {
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

export default LowStockAlertConfiguration;