import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CancelOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => void;
  orderInfo: {
    orderId: string;
    customerName: string;
    totalAmount: number;
  };
}

interface CancelReason {
  id: string;
  label: string;
  description: string;
  requiresNotes: boolean;
}

const CANCEL_REASONS: CancelReason[] = [
  {
    id: "out_of_stock",
    label: "Item out of stock",
    description: "Product is no longer available",
    requiresNotes: false,
  },
  {
    id: "pricing_error",
    label: "Pricing error",
    description: "Incorrect price listed",
    requiresNotes: true,
  },
  {
    id: "quality_issue",
    label: "Quality concerns",
    description: "Product quality doesn't meet standards",
    requiresNotes: true,
  },
  {
    id: "customer_request",
    label: "Customer requested cancellation",
    description: "Customer asked to cancel order",
    requiresNotes: false,
  },
  {
    id: "address_issue",
    label: "Delivery address problem",
    description: "Invalid or unreachable address",
    requiresNotes: true,
  },
  {
    id: "payment_failed",
    label: "Payment processing failed",
    description: "Unable to process payment",
    requiresNotes: false,
  },
  {
    id: "other",
    label: "Other reason",
    description: "Specify custom reason",
    requiresNotes: true,
  },
];

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  visible,
  onClose,
  onConfirm,
  orderInfo,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customNotes, setCustomNotes] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const selectedReasonData = CANCEL_REASONS.find(
    (reason) => reason.id === selectedReason
  );

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
    const reason = CANCEL_REASONS.find((r) => r.id === reasonId);
    setShowCustomInput(reason?.requiresNotes || reasonId === "other");
    if (reasonId !== "other") {
      setCustomNotes("");
    }
  };

  const handleConfirm = () => {
    if (selectedReason) {
      const reasonLabel = CANCEL_REASONS.find(
        (r) => r.id === selectedReason
      )?.label;
      const fullNotes = showCustomInput
        ? `${reasonLabel}: ${customNotes}`
        : reasonLabel || "";
      onConfirm(selectedReason, fullNotes);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedReason("");
    setCustomNotes("");
    setShowCustomInput(false);
    onClose();
  };

  const isConfirmDisabled =
    !selectedReason ||
    (showCustomInput && !customNotes.trim()) ||
    (selectedReason === "other" && !customNotes.trim());

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
                name="close-circle"
                size={24}
                color={theme.colors.status.error}
              />
              <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
                Cancel Order
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
            <Text variant="h3" fontWeight="bold" color={theme.colors.status.error}>
              ₹{orderInfo.totalAmount.toFixed(2)}
            </Text>
          </Card>

          {/* Warning Message */}
          <View style={styles.warningContainer}>
            <Ionicons
              name="warning"
              size={20}
              color={theme.colors.status.warning}
            />
            <Text
              variant="caption"
              color={theme.colors.status.warning}
              style={styles.warningText}
            >
              This action cannot be undone. The customer will be notified of the cancellation.
            </Text>
          </View>

          {/* Reason Selection */}
          <View style={styles.section}>
            <Text variant="body" fontWeight="semibold" style={styles.sectionTitle}>
              Why are you cancelling this order?
            </Text>
            <Text
              variant="caption"
              color={theme.colors.text.secondary}
              style={styles.sectionSubtitle}
            >
              Select the most appropriate reason
            </Text>
          </View>

          <ScrollView style={styles.reasonsContainer} showsVerticalScrollIndicator={false}>
            {CANCEL_REASONS.map((reason) => (
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
          </ScrollView>

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
                Please provide more details about why you're cancelling this order
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

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Button
              variant="outline"
              size="md"
              onPress={resetForm}
              style={styles.cancelButton}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onPress={handleConfirm}
              disabled={isConfirmDisabled}
              style={styles.confirmButton}
            >
              Cancel Order
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
    maxHeight: "90%",
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
    color: theme.colors.status.error,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  orderInfo: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  orderHeader: {
    marginBottom: theme.spacing.sm,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.status.warning + "20",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  warningText: {
    flex: 1,
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
  reasonsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
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