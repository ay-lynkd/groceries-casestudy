import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Document {
  id: string;
  name: string;
  type: "pan-card" | "gst-certificate" | "bank-statement" | "business-registration" | "shop-license";
  status: "pending" | "verified" | "rejected";
  uploadedAt: string;
  expiryDate?: string;
  rejectionReason?: string;
  fileUri?: string;
}

const DocumentVerificationScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: "1",
        name: "PAN Card",
        type: "pan-card",
        status: "verified",
        uploadedAt: "2024-01-10T10:30:00Z",
        fileUri: "https://example.com/documents/pan.pdf",
      },
      {
        id: "2",
        name: "GST Certificate",
        type: "gst-certificate",
        status: "pending",
        uploadedAt: "2024-01-12T14:20:00Z",
        expiryDate: "2025-01-12",
        fileUri: "https://example.com/documents/gst.pdf",
      },
      {
        id: "3",
        name: "Bank Statement",
        type: "bank-statement",
        status: "rejected",
        uploadedAt: "2024-01-13T09:15:00Z",
        rejectionReason: "Document is more than 3 months old",
        fileUri: "https://example.com/documents/bank.pdf",
      },
      {
        id: "4",
        name: "Shop License",
        type: "shop-license",
        status: "pending",
        uploadedAt: "2024-01-15T16:45:00Z",
        expiryDate: "2026-01-15",
        fileUri: "https://example.com/documents/shop-license.pdf",
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 800);
  }, []);

  const pickDocument = async (docType: Document["type"], useCamera: boolean) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.status !== "granted") {
      Alert.alert("Permission Required", "Please grant permission to access your photos.");
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });

    if (!result.canceled) {
      // Update document status to pending after upload
      setDocuments(prev => 
        prev.map(doc => 
          doc.type === docType ? { ...doc, status: "pending" as const, fileUri: result.assets[0].uri } : doc
        )
      );
      Alert.alert("Success", "Document uploaded successfully!");
    }
  };

  const handleUploadDocument = (docType: Document["type"]) => {
    Alert.alert(
      "Upload Document",
      `Please upload your ${getDocumentTypeName(docType)}`,
      [
        { text: "Take Photo", onPress: () => pickDocument(docType, true) },
        { text: "Choose from Gallery", onPress: () => pickDocument(docType, false) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleResubmit = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    Alert.alert(
      "Resubmit Document",
      "Please upload an updated version of this document",
      [
        { text: "Take Photo", onPress: () => pickDocument(doc.type, true) },
        { text: "Choose from Gallery", onPress: () => pickDocument(doc.type, false) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const getDocumentTypeName = (type: Document["type"]): string => {
    switch (type) {
      case "pan-card": return "PAN Card";
      case "gst-certificate": return "GST Certificate";
      case "bank-statement": return "Bank Statement";
      case "business-registration": return "Business Registration";
      case "shop-license": return "Shop License";
      default: return type;
    }
  };

  const getDocumentIcon = (type: Document["type"]): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "pan-card": return "card";
      case "gst-certificate": return "document";
      case "bank-statement": return "receipt";
      case "business-registration": return "business";
      case "shop-license": return "key";
      default: return "document";
    }
  };

  const getStatusColor = (status: Document["status"]): string => {
    switch (status) {
      case "verified": return theme.colors.status.success;
      case "rejected": return theme.colors.status.error;
      case "pending": return theme.colors.status.warning;
      default: return theme.colors.text.light;
    }
  };

  const getStatusBackgroundColor = (status: Document["status"]): string => {
    switch (status) {
      case "verified": return theme.colors.status.success + "20";
      case "rejected": return theme.colors.status.error + "20";
      case "pending": return theme.colors.status.warning + "20";
      default: return theme.colors.background.secondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderDocumentItem = (doc: Document) => (
    <Card key={doc.id} style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <View style={styles.documentIconContainer}>
          <Ionicons name={getDocumentIcon(doc.type)} size={24} color={getStatusColor(doc.status)} />
        </View>
        <View style={styles.documentInfo}>
          <Text variant="body" fontWeight="semibold">
            {getDocumentTypeName(doc.type)}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            Uploaded: {formatDate(doc.uploadedAt)}
          </Text>
          {doc.expiryDate && (
            <Text variant="caption" color={theme.colors.text.light}>
              Expires: {formatDate(doc.expiryDate)}
            </Text>
          )}
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBackgroundColor(doc.status) }
            ]}
          >
            <Text
              variant="caption"
              color={getStatusColor(doc.status)}
              fontWeight="medium"
            >
              {doc.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {doc.rejectionReason && doc.status === "rejected" && (
        <View style={styles.rejectionContainer}>
          <Ionicons name="alert" size={16} color={theme.colors.status.error} />
          <Text variant="caption" color={theme.colors.status.error} style={styles.rejectionText}>
            {doc.rejectionReason}
          </Text>
        </View>
      )}

      <View style={styles.documentActions}>
        {doc.status === "verified" ? (
          <Button
            variant="outline"
            size="sm"
            onPress={() => Alert.alert("Download", `Downloading ${doc.name}`)}
            style={styles.actionButton}
          >
            <Ionicons name="download" size={16} color={theme.colors.primary.green} />
            Download
          </Button>
        ) : doc.status === "rejected" ? (
          <Button
            variant="primary"
            size="sm"
            onPress={() => handleResubmit(doc.id)}
            style={styles.actionButton}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            Resubmit
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onPress={() => handleUploadDocument(doc.type)}
            style={styles.actionButton}
          >
            <Ionicons name="cloud-upload" size={16} color={theme.colors.primary.green} />
            Replace
          </Button>
        )}
      </View>
    </Card>
  );

  const verifiedDocs = documents.filter(d => d.status === "verified").length;
  const pendingDocs = documents.filter(d => d.status === "pending").length;
  const rejectedDocs = documents.filter(d => d.status === "rejected").length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Document Verification
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => Alert.alert("Help", "Contact support for document verification assistance")}
            style={styles.helpButton}
          >
            <Ionicons name="help-circle" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCardSuccess}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.status.success} />
            </View>
            <View>
              <Text variant="h3" fontWeight="bold">
                {verifiedDocs}
              </Text>
              <Text variant="caption" color={theme.colors.text.light}>
                Verified
              </Text>
            </View>
          </Card>
          
          <Card style={styles.statCardWarning}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={theme.colors.status.warning} />
            </View>
            <View>
              <Text variant="h3" fontWeight="bold">
                {pendingDocs}
              </Text>
              <Text variant="caption" color={theme.colors.text.light}>
                Pending
              </Text>
            </View>
          </Card>
          
          <Card style={styles.statCardError}>
            <View style={styles.statIconContainer}>
              <Ionicons name="close-circle" size={24} color={theme.colors.status.error} />
            </View>
            <View>
              <Text variant="h3" fontWeight="bold">
                {rejectedDocs}
              </Text>
              <Text variant="caption" color={theme.colors.text.light}>
                Rejected
              </Text>
            </View>
          </Card>
        </View>

        {/* Required Documents */}
        <Card style={styles.sectionCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Required Documents
          </Text>
          <Text variant="caption" color={theme.colors.text.light} style={styles.sectionSubtitle}>
            Upload these documents to complete your verification
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={24} color={theme.colors.primary.green} />
              <Text variant="body">Loading documents...</Text>
            </View>
          ) : documents.length > 0 ? (
            <View style={styles.documentsList}>
              {documents.map(renderDocumentItem)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document" size={48} color={theme.colors.text.light} />
              <Text variant="h3" fontWeight="bold" style={styles.emptyTitle}>
                No Documents
              </Text>
              <Text variant="body" color={theme.colors.text.secondary} style={styles.emptyText}>
                No documents have been uploaded yet.
              </Text>
            </View>
          )}
        </Card>

        {/* Verification Tips */}
        <Card style={styles.tipsCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Verification Tips
          </Text>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.tipText}>
              Ensure all documents are clear and readable
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.tipText}>
              Use recent bank statements (within 3 months)
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.tipText}>
              All documents must be in PDF or JPEG format
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary.orange} />
            <Text variant="body" style={styles.tipText}>
              Verification typically takes 1-2 business days
            </Text>
          </View>
        </Card>

        {/* Verification Status */}
        <Card style={styles.statusCard}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Account Status
          </Text>
          <View style={styles.accountStatus}>
            <View style={styles.statusIcon}>
              <Ionicons 
                name={verifiedDocs === documents.length ? "checkmark-circle" : "time"} 
                size={48} 
                color={verifiedDocs === documents.length ? theme.colors.status.success : theme.colors.status.warning} 
              />
            </View>
            <Text variant="h3" fontWeight="bold" style={styles.statusText}>
              {verifiedDocs === documents.length ? "Verified" : "Pending Verification"}
            </Text>
            <Text variant="body" color={theme.colors.text.secondary} style={styles.statusDescription}>
              {verifiedDocs === documents.length 
                ? "Your account is fully verified and ready to go!" 
                : `Complete ${documents.length - verifiedDocs} more document${documents.length - verifiedDocs > 1 ? 's' : ''} for verification.`}
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Action Button */}
      {verifiedDocs === documents.length && (
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <Button
            variant="primary"
            size="md"
            onPress={() => router.push("/(tabs)/store")}
            style={styles.continueButton}
          >
            Continue to Dashboard
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </Button>
        </View>
      )}
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
  helpButton: {
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
    borderLeftWidth: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  statCardSuccess: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.success,
  },
  statCardWarning: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.warning,
  },
  statCardError: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.error,
  },
  sectionCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  documentsList: {
    gap: theme.spacing.md,
  },
  documentCard: {
    padding: theme.spacing.md,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  rejectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.status.error + "10",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  rejectionText: {
    flex: 1,
  },
  documentActions: {
    alignItems: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
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
  tipsCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
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
  statusCard: {
    padding: theme.spacing.md,
  },
  accountStatus: {
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  statusIcon: {
    marginBottom: theme.spacing.md,
  },
  statusText: {
    marginBottom: theme.spacing.sm,
  },
  statusDescription: {
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  buttonIcon: {
    marginLeft: theme.spacing.sm,
  },
});

export default DocumentVerificationScreen;