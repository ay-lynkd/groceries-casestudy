import { ScreenHeader, Text } from "@/components/common";
import RichTextEditor from "@/components/common/RichTextEditor";
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
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ReturnPolicy {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  allowReturns: boolean;
  returnPeriod: number; // in days
  conditions: string[];
  exceptions: string[];
  refundMethod: "store-credit" | "original-payment" | "exchange-only";
  restockingFee: number; // percentage
  shippingCosts: "customer" | "merchant" | "shared";
  policyText: string;
}

const ReturnPolicyEditor: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [policy, setPolicy] = useState<ReturnPolicy>({
    id: "default",
    title: "Standard Return Policy",
    description: "Our standard return policy for all products",
    isActive: true,
    allowReturns: true,
    returnPeriod: 30,
    conditions: ["Item must be in original condition", "Tags must be attached"],
    exceptions: ["Perishable goods", "Personal care items"],
    refundMethod: "original-payment",
    restockingFee: 0,
    shippingCosts: "customer",
    policyText: "Customers may return items within 30 days of purchase for a full refund. Items must be in original condition with tags attached. Perishable goods and personal care items are not eligible for return.",
  });
  const [loading, setLoading] = useState(false);

  const updatePolicy = (field: keyof ReturnPolicy, value: any) => {
    setPolicy(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert("Success", "Return policy updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update return policy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Policy",
      "Are you sure you want to reset to default return policy?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setPolicy({
              id: "default",
              title: "Standard Return Policy",
              description: "Our standard return policy for all products",
              isActive: true,
              allowReturns: true,
              returnPeriod: 30,
              conditions: ["Item must be in original condition", "Tags must be attached"],
              exceptions: ["Perishable goods", "Personal care items"],
              refundMethod: "original-payment",
              restockingFee: 0,
              shippingCosts: "customer",
              policyText: "Customers may return items within 30 days of purchase for a full refund. Items must be in original condition with tags attached. Perishable goods and personal care items are not eligible for return.",
            });
          },
        },
      ]
    );
  };

  const addCondition = () => {
    const newCondition = prompt("Enter new condition:");
    if (newCondition) {
      setPolicy(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition]
      }));
    }
  };

  const removeCondition = (index: number) => {
    setPolicy(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const addException = () => {
    const newException = prompt("Enter exception (e.g., product type):");
    if (newException) {
      setPolicy(prev => ({
        ...prev,
        exceptions: [...prev.exceptions, newException]
      }));
    }
  };

  const removeException = (index: number) => {
    setPolicy(prev => ({
      ...prev,
      exceptions: prev.exceptions.filter((_, i) => i !== index)
    }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Return Policy"
        showBack={true}
        rightElement={
          <TouchableOpacity
            onPress={handleReset}
            style={styles.resetButton}
            accessibilityLabel="Reset policy"
          >
            <Ionicons name="refresh" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Policy Status */}
        <Card style={styles.statusCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Policy Status
          </Text>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleContent}>
              <Text variant="body" fontWeight="semibold">
                Active Policy
              </Text>
              <Text variant="caption" color={theme.colors.text.light}>
                Toggle to enable/disable this return policy
              </Text>
            </View>
            <Switch
              value={policy.isActive}
              onValueChange={(value) => updatePolicy("isActive", value)}
              trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.green }}
            />
          </View>
        </Card>

        {/* Policy Details */}
        <Card style={styles.detailsCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Policy Details
          </Text>
          
          <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
            Policy Title
          </Text>
          <TextInput
            value={policy.title}
            onChangeText={(text) => updatePolicy("title", text)}
            placeholder="Enter policy title"
            style={styles.textInput}
          />

          <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
            Description
          </Text>
          <TextInput
            value={policy.description}
            onChangeText={(text) => updatePolicy("description", text)}
            placeholder="Brief description of this policy"
            style={styles.textArea}
            multiline
            numberOfLines={3}
          />
        </Card>

        {/* Return Settings */}
        <Card style={styles.settingsCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Return Settings
          </Text>
          
          <View style={styles.toggleContainer}>
            <View style={styles.toggleContent}>
              <Text variant="body" fontWeight="semibold">
                Allow Returns
              </Text>
              <Text variant="caption" color={theme.colors.text.light}>
                Enable/disable returns for this policy
              </Text>
            </View>
            <Switch
              value={policy.allowReturns}
              onValueChange={(value) => updatePolicy("allowReturns", value)}
              trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.green }}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: theme.spacing.md }}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Return Period (days)
              </Text>
              <TextInput
                value={policy.returnPeriod.toString()}
                onChangeText={(text) => updatePolicy("returnPeriod", parseInt(text) || 0)}
                placeholder="e.g., 30"
                style={styles.textInput}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Restocking Fee (%)
              </Text>
              <TextInput
                value={policy.restockingFee.toString()}
                onChangeText={(text) => updatePolicy("restockingFee", parseInt(text) || 0)}
                placeholder="e.g., 0"
                style={styles.textInput}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
            Refund Method
          </Text>
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                policy.refundMethod === "store-credit" && styles.selectedOption,
              ]}
              onPress={() => updatePolicy("refundMethod", "store-credit")}
            >
              <Text variant="body">Store Credit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                policy.refundMethod === "original-payment" && styles.selectedOption,
              ]}
              onPress={() => updatePolicy("refundMethod", "original-payment")}
            >
              <Text variant="body">Original Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                policy.refundMethod === "exchange-only" && styles.selectedOption,
              ]}
              onPress={() => updatePolicy("refundMethod", "exchange-only")}
            >
              <Text variant="body">Exchange Only</Text>
            </TouchableOpacity>
          </View>

          <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
            Shipping Costs
          </Text>
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                policy.shippingCosts === "customer" && styles.selectedOption,
              ]}
              onPress={() => updatePolicy("shippingCosts", "customer")}
            >
              <Text variant="body">Customer Pays</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                policy.shippingCosts === "merchant" && styles.selectedOption,
              ]}
              onPress={() => updatePolicy("shippingCosts", "merchant")}
            >
              <Text variant="body">Merchant Pays</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                policy.shippingCosts === "shared" && styles.selectedOption,
              ]}
              onPress={() => updatePolicy("shippingCosts", "shared")}
            >
              <Text variant="body">Shared</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Conditions */}
        <Card style={styles.conditionsCard}>
          <View style={styles.cardHeader}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Return Conditions
            </Text>
            <TouchableOpacity
              onPress={addCondition}
              style={styles.addAction}
            >
              <Ionicons name="add" size={20} color={theme.colors.primary.green} />
            </TouchableOpacity>
          </View>
          
          {policy.conditions.map((condition, index) => (
            <View key={index} style={styles.conditionItem}>
              <Text variant="body" style={styles.conditionText}>
                {condition}
              </Text>
              <TouchableOpacity
                onPress={() => removeCondition(index)}
                style={styles.removeConditionButton}
              >
                <Ionicons name="close" size={16} color={theme.colors.status.error} />
              </TouchableOpacity>
            </View>
          ))}
          
          {policy.conditions.length === 0 && (
            <Text variant="body" color={theme.colors.text.light} style={styles.emptyText}>
              No conditions added yet
            </Text>
          )}
        </Card>

        {/* Exceptions */}
        <Card style={styles.exceptionsCard}>
          <View style={styles.cardHeader}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Exceptions
            </Text>
            <TouchableOpacity
              onPress={addException}
              style={styles.addAction}
            >
              <Ionicons name="add" size={20} color={theme.colors.primary.green} />
            </TouchableOpacity>
          </View>
          
          {policy.exceptions.map((exception, index) => (
            <View key={index} style={styles.exceptionItem}>
              <Text variant="body" style={styles.exceptionText}>
                {exception}
              </Text>
              <TouchableOpacity
                onPress={() => removeException(index)}
                style={styles.removeExceptionButton}
              >
                <Ionicons name="close" size={16} color={theme.colors.status.error} />
              </TouchableOpacity>
            </View>
          ))}
          
          {policy.exceptions.length === 0 && (
            <Text variant="body" color={theme.colors.text.light} style={styles.emptyText}>
              No exceptions added yet
            </Text>
          )}
        </Card>

        {/* Policy Text */}
        <Card style={styles.policyCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Policy Text
          </Text>
          <Text variant="caption" color={theme.colors.text.light} style={styles.sectionSubtitle}>
            Detailed policy text that customers will see
          </Text>
          
          <RichTextEditor
            value={policy.policyText}
            onChange={(text) => updatePolicy("policyText", text)}
            placeholder="Enter detailed return policy text..."
            minHeight={200}
            maxLength={2000}
          />
        </Card>

        {/* Policy Tips */}
        <Card style={styles.tipsCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Policy Tips
          </Text>
          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={20} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.tipText}>
              Clear policies reduce customer disputes
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={20} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.tipText}>
              Comply with local consumer protection laws
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={20} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.tipText}>
              Be specific about condition requirements
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
          disabled={loading}
        >
          {loading ? (
            <>
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              Saving...
            </>
          ) : (
            <>
              <Ionicons name="save" size={20} color="#FFFFFF" />
              Save Policy
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
  resetButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  statusCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  detailsCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  settingsCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  conditionsCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  exceptionsCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  policyCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  tipsCard: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  sectionSubtitle: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  textArea: {
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: theme.spacing.md,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  toggleContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  optionButton: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: theme.colors.primary.green,
  },
  selectedOptionText: {
    color: "#FFFFFF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  addAction: {
    padding: theme.spacing.sm,
  },
  conditionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  conditionText: {
    flex: 1,
  },
  removeConditionButton: {
    padding: theme.spacing.sm,
  },
  exceptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  exceptionText: {
    flex: 1,
  },
  removeExceptionButton: {
    padding: theme.spacing.sm,
  },
  emptyText: {
    fontStyle: "italic",
    padding: theme.spacing.md,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
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

export default ReturnPolicyEditor;