import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RefundRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number, reason: string, notes: string) => void;
  orderInfo: {
    orderId: string;
    customerName: string;
    totalAmount: number;
    paidAmount: number;
  };
}

interface RefundReason {
  id: string;
  label: string;
  description: string;
  requiresNotes: boolean;
}

const REFUND_REASONS: RefundReason[] = [
  {
    id: "quality_issue",
    label: "Product quality issue",
    description: "Item was damaged or not as described",
    requiresNotes: true,
  },
  {
    id: "wrong_item",
    label: "Wrong item delivered",
    description: "Customer received incorrect product",
    requiresNotes: true,
  },
  {
    id: "customer_request",
    label: "Customer requested refund",
    description: "Customer asked for refund",
    requiresNotes: false,
  },
  {
    id: "duplicate_payment",
    label: "Duplicate payment processed",
    description: "Payment was charged multiple times",
    requiresNotes: false,
  },
  {
    id: "cancellation",
    label: "Order cancelled",
    description: "Refund for cancelled order",
    requiresNotes: false,
  },
  {
    id: "delayed_delivery",
    label: "Severe delivery delay",
    description: "Significant delay in delivery",
    requiresNotes: true,
  },
  {
    id: "other",
    label: "Other reason",
    description: "Specify custom reason",
    requiresNotes: true,
  },
];

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  visible,
  onClose,
  onConfirm,
  orderInfo,
}) => {
  const insets = useSafeAreaInsets();
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [refundAmount, setRefundAmount] = useState(orderInfo.paidAmount.toString());
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customNotes, setCustomNotes] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const selectedReasonData = REFUND_REASONS.find(
    (reason) => reason.id === selectedReason
  );

  const handleRefundTypeChange = (type: "full" | "partial") => {
    setRefundType(type);
    if (type === "full") {
      setRefundAmount(orderInfo.paidAmount.toString());
    } else {
      setRefundAmount("");
    }
  };

  const handleAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const numericValue = text.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const decimalParts = numericValue.split(".");
    if (decimalParts.length > 2) return;
    
    const amount = parseFloat(numericValue) || 0;
    if (amount <= orderInfo.paidAmount) {
      setRefundAmount(numericValue);
    }
  };

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
    const reason = REFUND_REASONS.find((r) => r.id === reasonId);
    setShowCustomInput(reason?.requiresNotes || reasonId === "other");
    if (reasonId !== "other") {
      setCustomNotes("");
    }
  };

  const handleConfirm = () => {
    const amount = parseFloat(refundAmount) || 0;
    if (amount > 0 && amount <= orderInfo.paidAmount && selectedReason) {
      const reasonLabel = REFUND_REASONS.find(
        (r) => r.id === selectedReason
      )?.label;
      const fullNotes = showCustomInput
        ? `${reasonLabel}: ${customNotes}`
        : reasonLabel || "";
      onConfirm(amount, selectedReason, fullNotes);
      resetForm();
    }
  };

  const resetForm = () => {
    setRefundType("full");
    setRefundAmount(orderInfo.paidAmount.toString());
    setSelectedReason("");
    setCustomNotes("");
    setShowCustomInput(false);
    onClose();
  };

  const isConfirmDisabled =
    !selectedReason ||
    !refundAmount ||
    parseFloat(refundAmount) <= 0 ||
    parseFloat(refundAmount) > orderInfo.paidAmount ||
    (showCustomInput && !customNotes.trim()) ||
    (selectedReason === "other" && !customNotes.trim());

  const refundAmountValue = parseFloat(refundAmount) || 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={resetForm}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { paddingTop: insets.top + theme.spacing.lg },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Ionicons
                name="cash"
                size={24}
                color={theme.colors.primary.green}
              />
              <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
                Process Refund
              </Text>
            </View>
            <TouchableOpacity onPress={resetForm} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          {/* Order Info */}
          <Card style={styles.orderInfo}>
            <View style={styles.orderHeader}>
              <Text variant="body" fontWeight="semibold">
                Order #{orderInfo.orderId}
              </Text>
              <Text variant="body" color={theme.colors.text.secondary}>
                {orderInfo.customerName}
              </Text>
            </View>
            <View style={styles.amountInfo}>
              <Text
                variant="caption"
                color={theme.colors.text.secondary}
                style={styles.amountLabel}
              >
                Paid Amount
              </Text>
              <Text variant="h3" fontWeight="bold" color={theme.colors.text.primary}>
                ₹{orderInfo.paidAmount.toFixed(2)}
              </Text>
            </View>
          </Card>

          {/* Refund Type Selection */}
          <View style={styles.section}>
            <Text variant="body" fontWeight="semibold" style={styles.sectionTitle}>
              Refund Type
            </Text>
          </View>

          <View style={styles.typeSelection}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                refundType === "full" && styles.selectedType,
              ]}
              onPress={() => handleRefundTypeChange("full")}
              activeOpacity={0.7}
            >
              <View style={styles.typeContent}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={refundType === "full" ? theme.colors.primary.green : theme.colors.border.light}
                />
                <View style={styles.typeText}>
                  <Text
                    variant="body"
                    fontWeight="semibold"
                    color={refundType === "full" ? theme.colors.primary.green : theme.colors.text.primary}
                  >
                    Full Refund
                  </Text>
                  <Text
                    variant="caption"
                    color={theme.colors.text.secondary}
                    style={styles.typeDescription}
                  >
                    Refund entire paid amount
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeOption,
                refundType === "partial" && styles.selectedType,
              ]}
              onPress={() => handleRefundTypeChange("partial")}
              activeOpacity={0.7}
            >
              <View style={styles.typeContent}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={refundType === "partial" ? theme.colors.primary.green : theme.colors.border.light}
                />
                <View style={styles.typeText}>
                  <Text
                    variant="body"
                    fontWeight="semibold"
                    color={refundType === "partial" ? theme.colors.primary.green : theme.colors.text.primary}
                  >
                    Partial Refund
                  </Text>
                  <Text
                    variant="caption"
                    color={theme.colors.text.secondary}
                    style={styles.typeDescription}
                  >
                    Refund specific amount
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          {refundType === "partial" && (
            <View style={styles.amountSection}>
              <Text variant="body" fontWeight="semibold" style={styles.amountLabel}>
                Refund Amount
              </Text>
              <Card style={styles.amountInput}>
                <View style={styles.amountInputContent}>
                  <Text variant="h2" fontWeight="bold" color={theme.colors.text.primary}>
                    ₹
                  </Text>
                  <TextInput
                    value={refundAmount}
                    onChangeText={handleAmountChange}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    style={styles.amountTextInput}
                  />
                </View>
                {refundAmountValue > orderInfo.paidAmount && (
                  <Text variant="caption" color={theme.colors.status.error} style={styles.amountError}>
                    Amount cannot exceed paid amount
                  </Text>
                )}
              </Card>
            </View>
          )}

          {/* Reason Selection */}
          <View style={styles.section}>
            <Text variant="body" fontWeight="semibold" style={styles.sectionTitle}>
              Reason for Refund
            </Text>
            <Text
              variant="caption"
              color={theme.colors.text.secondary}
              style={styles.sectionSubtitle}
            >
              Select the most appropriate reason
            </Text>
          </View>

          <View style={styles.reasonsContainer}>
            {REFUND_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonCard,
                  selectedReason === reason.id && styles.selectedReason,
                ]}
                onPress={() => handleReasonSelect(reason.id)}
                activeOpacity={0.7}
              >
                <View style={styles.reasonContent}>
                  <View style={styles.reasonText}>
                    <Text
                      variant="body"
                      fontWeight="semibold"
                      color={
                        selectedReason === reason.id
                          ? theme.colors.primary.green
                          : theme.colors.text.primary
                      }
                    >
                      {reason.label}
                    </Text>
                    <Text
                      variant="caption"
                      color={theme.colors.text.secondary}
                      style={styles.reasonDescription}
                    >
                      {reason.description}
                    </Text>
                  </View>
                  {selectedReason === reason.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={theme.colors.primary.green}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Notes Input */}
          {showCustomInput && (
            <View style={styles.notesSection}>
              <Text variant="body" fontWeight="semibold" style={styles.notesLabel}>
                Additional Details
              </Text>
              <Text
                variant="caption"
                color={theme.colors.text.secondary}
                style={styles.notesSubtitle}
              >
                Please provide more details about why you're processing this refund
              </Text>
              <Card style={styles.notesInput}>
                <TextInput
                  value={customNotes}
                  onChangeText={setCustomNotes}
                  placeholder="Enter additional details..."
                  multiline
                  numberOfLines={3}
                  style={styles.textInput}
                  textAlignVertical="top"
                />
                <Text
                  variant="caption"
                  color={theme.colors.text.light}
                  style={styles.characterCount}
                >
                  {customNotes.length}/200
                </Text>
              </Card>
            </View>
          )}

          {/* Summary */}
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text variant="body" fontWeight="semibold">
                Refund Amount:
              </Text>
              <Text variant="body" fontWeight="bold" color={theme.colors.primary.green}>
                ₹{refundAmountValue.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="body" color={theme.colors.text.secondary}>
                Remaining Balance:
              </Text>
              <Text variant="body" color={theme.colors.text.secondary}>
                ₹{(orderInfo.paidAmount - refundAmountValue).toFixed(2)}
              </Text>
            </View>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Button
              variant="outline"
              size="md"
              onPress={resetForm}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onPress={handleConfirm}
              disabled={isConfirmDisabled}
              style={styles.confirmButton}
            >
              Process Refund
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: "95%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerTitle: {
    color: theme.colors.primary.green,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  orderInfo: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  orderHeader: {
    marginBottom: theme.spacing.md,
  },
  amountInfo: {
    alignItems: "flex-end",
  },
  amountLabel: {
    marginBottom: theme.spacing.xs,
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    marginBottom: theme.spacing.md,
  },
  typeSelection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  typeOption: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  selectedType: {
    borderColor: theme.colors.primary.green,
    backgroundColor: theme.colors.primary.green + "10",
  },
  typeContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  typeText: {
    flex: 1,
  },
  typeDescription: {
    marginTop: theme.spacing.xs,
  },
  amountSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  amountInput: {
    padding: theme.spacing.md,
  },
  amountInputContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  amountTextInput: {
    flex: 1,
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  amountError: {
    marginTop: theme.spacing.sm,
  },
  reasonsContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  reasonCard: {
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  selectedReason: {
    borderColor: theme.colors.primary.green,
    backgroundColor: theme.colors.primary.green + "10",
  },
  reasonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
  },
  reasonText: {
    flex: 1,
  },
  reasonDescription: {
    marginTop: theme.spacing.xs,
  },
  notesSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  notesLabel: {
    marginBottom: theme.spacing.xs,
  },
  notesSubtitle: {
    marginBottom: theme.spacing.md,
  },
  notesInput: {
    minHeight: 100,
    justifyContent: "space-between",
  },
  textInput: {
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    flex: 1,
    padding: theme.spacing.sm,
  },
  characterCount: {
    alignSelf: "flex-end",
    padding: theme.spacing.sm,
  },
  summaryCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  actionContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});