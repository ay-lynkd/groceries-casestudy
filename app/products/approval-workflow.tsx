import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ApprovalRequest {
  id: string;
  productId: string;
  productName: string;
  submitter: string;
  submittedAt: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approver?: string;
  approvedAt?: string;
  rejectionReason?: string;
  images: string[];
}

const ProductApprovalWorkflow: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests: ApprovalRequest[] = [
      {
        id: "1",
        productId: "PROD-001",
        productName: "Organic Basmati Rice 5kg",
        submitter: "Rakesh Kumar",
        submittedAt: "2024-01-15T10:30:00Z",
        reason: "New product addition",
        status: "pending",
        images: [
          "https://placehold.co/400x400/4CAF50/white?text=Front",
          "https://placehold.co/400x400/FF9800/white?text=Back",
          "https://placehold.co/400x400/2196F3/white?text=Side",
        ],
      },
      {
        id: "2",
        productId: "PROD-002",
        productName: "Premium Moong Dal 1kg",
        submitter: "Priya Sharma",
        submittedAt: "2024-01-14T15:45:00Z",
        reason: "Price update",
        status: "approved",
        approver: "Admin User",
        approvedAt: "2024-01-15T09:15:00Z",
        images: [
          "https://placehold.co/400x400/9C27B0/white?text=Front",
        ],
      },
      {
        id: "3",
        productId: "PROD-003",
        productName: "Fortune Sunflower Oil 2L",
        submitter: "Vijay Singh",
        submittedAt: "2024-01-14T12:20:00Z",
        reason: "Category change",
        status: "rejected",
        approver: "Admin User",
        approvedAt: "2024-01-14T18:30:00Z",
        rejectionReason: "Incorrect category assignment",
        images: [
          "https://placehold.co/400x400/607D8B/white?text=Front",
        ],
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setApprovalRequests(mockRequests);
      setLoading(false);
    }, 800);
  }, []);

  const handleApprove = () => {
    if (!selectedRequest) return;

    const updatedRequests = approvalRequests.map(req => 
      req.id === selectedRequest.id
        ? { 
            ...req, 
            status: "approved" as const,
            approver: "Current Admin",
            approvedAt: new Date().toISOString()
          }
        : req
    );

    setApprovalRequests(updatedRequests);
    setSelectedRequest(null);
    setShowApprovalModal(false);
    Alert.alert("Success", "Product has been approved successfully.");
  };

  const handleReject = () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }

    const updatedRequests = approvalRequests.map(req => 
      req.id === selectedRequest.id
        ? { 
            ...req, 
            status: "rejected" as const,
            approver: "Current Admin",
            approvedAt: new Date().toISOString(),
            rejectionReason: rejectionReason
          }
        : req
    );

    setApprovalRequests(updatedRequests);
    setSelectedRequest(null);
    setShowRejectionModal(false);
    setRejectionReason("");
    Alert.alert("Success", "Product has been rejected successfully.");
  };

  const handleViewRequest = (request: ApprovalRequest) => {
    setSelectedRequest(request);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderRequestItem = ({ item }: { item: ApprovalRequest }) => (
    <Card style={styles.requestCard}>
      <TouchableOpacity
        onPress={() => handleViewRequest(item)}
        style={styles.requestRow}
        accessibilityLabel={`Product approval request for ${item.productName}`}
      >
        <View style={styles.requestInfo}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor:
                    item.status === "pending"
                      ? theme.colors.status.warning
                      : item.status === "approved"
                      ? theme.colors.status.success
                      : theme.colors.status.error,
                },
              ]}
            />
            <Text variant="body" fontWeight="semibold">
              {item.productName}
            </Text>
          </View>
          <Text variant="caption" color={theme.colors.text.light}>
            ID: {item.productId}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            Submitted by: {item.submitter}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {formatDate(item.submittedAt)}
          </Text>
        </View>

        <View style={styles.requestActions}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "pending"
                    ? theme.colors.status.warning + "20"
                    : item.status === "approved"
                    ? theme.colors.status.success + "20"
                    : theme.colors.status.error + "20",
              },
            ]}
          >
            <Text
              variant="caption"
              color={
                item.status === "pending"
                  ? theme.colors.status.warning
                  : item.status === "approved"
                  ? theme.colors.status.success
                  : theme.colors.status.error
              }
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
        </View>
      </TouchableOpacity>
    </Card>
  );

  const renderRequestDetail = () => {
    if (!selectedRequest) return null;

    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <Text variant="h3" fontWeight="bold">
            {selectedRequest.productName}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            ID: {selectedRequest.productId}
          </Text>
        </View>

        <Card style={styles.detailCard}>
          <Text variant="body" fontWeight="semibold" style={styles.detailTitle}>
            Request Details
          </Text>
          <View style={styles.detailRow}>
            <Text variant="caption" color={theme.colors.text.light}>
              Submitter:
            </Text>
            <Text variant="caption" fontWeight="semibold">
              {selectedRequest.submitter}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text variant="caption" color={theme.colors.text.light}>
              Submitted:
            </Text>
            <Text variant="caption" fontWeight="semibold">
              {formatDate(selectedRequest.submittedAt)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text variant="caption" color={theme.colors.text.light}>
              Reason:
            </Text>
            <Text variant="caption" fontWeight="semibold">
              {selectedRequest.reason}
            </Text>
          </View>
        </Card>

        <Card style={styles.detailCard}>
          <Text variant="body" fontWeight="semibold" style={styles.detailTitle}>
            Product Images
          </Text>
          <View style={styles.imageGrid}>
            {selectedRequest.images.map((image, index) => (
              <View key={index} style={styles.imageView}>
                <Ionicons name="image" size={24} color={theme.colors.text.light} />
                <Text variant="caption" style={styles.imageCaption}>
                  Image {index + 1}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {selectedRequest.rejectionReason && (
          <Card style={styles.detailCard}>
            <Text variant="body" fontWeight="semibold" style={styles.detailTitle}>
              Rejection Reason
            </Text>
            <Text variant="body">{selectedRequest.rejectionReason}</Text>
          </Card>
        )}

        {selectedRequest.status === "pending" && (
          <View style={styles.actionButtons}>
            <Button
              variant="outline"
              size="md"
              onPress={() => setShowRejectionModal(true)}
              style={styles.actionButton}
            >
              <Ionicons name="close" size={20} color={theme.colors.status.error} />
              Reject
            </Button>
            <Button
              variant="primary"
              size="md"
              onPress={() => setShowApprovalModal(true)}
              style={styles.actionButton}
            >
              <Ionicons name="checkmark" size={20} color={theme.colors.background.primary} />
              Approve
            </Button>
          </View>
        )}

        {selectedRequest.status !== "pending" && (
          <Card style={styles.detailCard}>
            <Text variant="body" fontWeight="semibold" style={styles.detailTitle}>
              Resolution
            </Text>
            <View style={styles.detailRow}>
              <Text variant="caption" color={theme.colors.text.light}>
                Approved by:
              </Text>
              <Text variant="caption" fontWeight="semibold">
                {selectedRequest.approver}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="caption" color={theme.colors.text.light}>
                Date:
              </Text>
              <Text variant="caption" fontWeight="semibold">
                {formatDate(selectedRequest.approvedAt || "")}
              </Text>
            </View>
          </Card>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Product Approvals
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => router.push('/notifications/push-center')}
            style={styles.notificationButton}
          >
            <Ionicons name="notifications" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={48} color={theme.colors.primary.green} />
            <Text variant="h3" style={styles.loadingText}>
              Loading approval requests...
            </Text>
          </View>
        ) : approvalRequests.length > 0 ? (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="time" size={24} color={theme.colors.status.warning} />
                </View>
                <View>
                  <Text variant="h3" fontWeight="bold">
                    {approvalRequests.filter(r => r.status === "pending").length}
                  </Text>
                  <Text variant="caption" color={theme.colors.text.light}>
                    Pending
                  </Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.status.success} />
                </View>
                <View>
                  <Text variant="h3" fontWeight="bold">
                    {approvalRequests.filter(r => r.status === "approved").length}
                  </Text>
                  <Text variant="caption" color={theme.colors.text.light}>
                    Approved
                  </Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="close-circle" size={24} color={theme.colors.status.error} />
                </View>
                <View>
                  <Text variant="h3" fontWeight="bold">
                    {approvalRequests.filter(r => r.status === "rejected").length}
                  </Text>
                  <Text variant="caption" color={theme.colors.text.light}>
                    Rejected
                  </Text>
                </View>
              </View>
            </View>

            {selectedRequest ? (
              renderRequestDetail()
            ) : (
              <FlatList
                data={approvalRequests}
                renderItem={renderRequestItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text" size={48} color={theme.colors.text.light} />
            <Text variant="h3" fontWeight="bold" style={styles.emptyTitle}>
              No Approval Requests
            </Text>
            <Text variant="body" color={theme.colors.text.secondary} style={styles.emptyText}>
              There are no pending approval requests at the moment.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Approval Confirmation Modal */}
      <Modal
        visible={showApprovalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowApprovalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Ionicons name="checkmark-circle" size={48} color={theme.colors.status.success} style={styles.modalIcon} />
            <Text variant="h3" fontWeight="bold" style={styles.modalTitle}>
              Approve Product?
            </Text>
            <Text variant="body" color={theme.colors.text.secondary} style={styles.modalSubtitle}>
              Are you sure you want to approve this product? This action cannot be undone.
            </Text>
            
            <View style={styles.modalActions}>
              <Button
                variant="outline"
                size="md"
                onPress={() => setShowApprovalModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={handleApprove}
                style={styles.modalButton}
              >
                Approve
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        visible={showRejectionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rejectionModal}>
            <Ionicons name="close-circle" size={48} color={theme.colors.status.error} style={styles.modalIcon} />
            <Text variant="h3" fontWeight="bold" style={styles.modalTitle}>
              Reject Product
            </Text>
            <Text variant="body" color={theme.colors.text.secondary} style={styles.modalSubtitle}>
              Please provide a reason for rejecting this product:
            </Text>
            
            <View style={styles.textAreaContainer}>
              <TextInput
                value={rejectionReason}
                onChangeText={setRejectionReason}
                placeholder="Enter reason for rejection..."
                style={styles.textArea}
                multiline
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalActions}>
              <Button
                variant="outline"
                size="md"
                onPress={() => {
                  setShowRejectionModal(false);
                  setRejectionReason("");
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={handleReject}
                style={styles.modalButton}
              >
                Reject
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Adding the missing import for TextInput
import { TextInput } from "react-native";

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
  notificationButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  },
  statIconContainer: {
    width: theme.spacing.xl + theme.spacing.sm,
    height: theme.spacing.xl + theme.spacing.sm,
    borderRadius: (theme.spacing.xl + theme.spacing.sm) / 2,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  requestCard: {
    marginBottom: theme.spacing.sm,
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
  },
  requestInfo: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  statusIndicator: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  requestActions: {
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.xl + theme.spacing.lg - theme.spacing.sm,
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.xxl * 2 + theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.text.light,
  },
  detailContainer: {
    gap: theme.spacing.md,
  },
  detailHeader: {
    marginBottom: theme.spacing.md,
  },
  detailCard: {
    padding: theme.spacing.md,
  },
  detailTitle: {
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  imageView: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  imageCaption: {
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationModal: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  rejectionModal: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: "90%",
    maxWidth: 400,
  },
  modalIcon: {
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  modalSubtitle: {
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    color: theme.colors.text.secondary,
  },
  textAreaContainer: {
    marginBottom: theme.spacing.lg,
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    width: "100%",
  },
  modalButton: {
    flex: 1,
  },
});

export default ProductApprovalWorkflow;