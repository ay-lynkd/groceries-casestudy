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
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Wizard Step Types
type StoreSetupStep = 
  | "business-info"
  | "store-details" 
  | "payment"
  | "shipping"
  | "policies"
  | "verification"
  | "review";

interface WizardStep {
  id: StoreSetupStep;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: "business-info",
    title: "Business Information",
    description: "Legal business details",
    icon: "business",
  },
  {
    id: "store-details",
    title: "Store Details",
    description: "Store name, logo, and contact",
    icon: "storefront",
  },
  {
    id: "payment",
    title: "Payment Methods",
    description: "Accept payments securely",
    icon: "card",
  },
  {
    id: "shipping",
    title: "Shipping Options",
    description: "Delivery zones and rates",
    icon: "bicycle",
  },
  {
    id: "policies",
    title: "Store Policies",
    description: "Return and privacy policies",
    icon: "document-text",
  },
  {
    id: "verification",
    title: "Verification",
    description: "Submit documents for approval",
    icon: "shield-checkmark",
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Final review before activation",
    icon: "checkmark-done",
  },
];

// Store Data Interface
interface StoreData {
  // Business Info
  businessName: string;
  businessType: string;
  registrationNumber: string;
  gstNumber: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZipCode: string;
  businessCountry: string;
  
  // Store Details
  storeName: string;
  storeDescription: string;
  storeContact: string;
  storeEmail: string;
  storeWebsite?: string;
  storeLogo?: string;
  
  // Payment
  paymentMethods: string[];
  bankAccountName: string;
  bankAccountNumber: string;
  bankIFSC: string;
  upiId?: string;
  
  // Shipping
  shippingZones: string[];
  shippingRates: { zone: string; rate: number }[];
  freeShippingThreshold?: number;
  shippingDays: number;
  
  // Policies
  returnPolicy: string;
  privacyPolicy: string;
  termsOfService: string;
  
  // Verification
  panCard: string;
  gstCertificate: string;
  bankStatement: string;
  businessRegistration: string;
}

const initialStoreData: StoreData = {
  businessName: "",
  businessType: "",
  registrationNumber: "",
  gstNumber: "",
  businessAddress: "",
  businessCity: "",
  businessState: "",
  businessZipCode: "",
  businessCountry: "India",
  
  storeName: "",
  storeDescription: "",
  storeContact: "",
  storeEmail: "",
  
  paymentMethods: ["upi", "bank-transfer"],
  bankAccountName: "",
  bankAccountNumber: "",
  bankIFSC: "",
  
  shippingZones: ["local"],
  shippingRates: [{ zone: "local", rate: 40 }],
  shippingDays: 3,
  
  returnPolicy: "Returns accepted within 7 days of delivery",
  privacyPolicy: "We protect your personal information",
  termsOfService: "Terms and conditions apply",
  
  panCard: "",
  gstCertificate: "",
  bankStatement: "",
  businessRegistration: "",
};

const StoreSetupWizard: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<StoreSetupStep>("business-info");
  const [storeData, setStoreData] = useState<StoreData>(initialStoreData);
  const [loading, setLoading] = useState(false);

  const currentStepIndex = WIZARD_STEPS.findIndex(step => step.id === currentStep);
  const currentStepData = WIZARD_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      const nextStep = WIZARD_STEPS[currentStepIndex + 1].id;
      setCurrentStep(nextStep as StoreSetupStep);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStep = WIZARD_STEPS[currentStepIndex - 1].id;
      setCurrentStep(prevStep as StoreSetupStep);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert("Success", "Store setup completed successfully! Your store is now under review and will be activated soon.");
      router.push("/(tabs)/store"); // Navigate to store dashboard
    } catch (error) {
      Alert.alert("Error", "Failed to submit store setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateStoreData = (field: keyof StoreData, value: any) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "business-info":
        return (
          <View style={styles.stepContent}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Business Information
            </Text>
            
            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Business Legal Name *
              </Text>
              <TextInput
                value={storeData.businessName}
                onChangeText={(text) => updateStoreData("businessName", text)}
                placeholder="Enter legal business name"
                style={styles.textInput}
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Business Type *
              </Text>
              <TouchableOpacity style={styles.selectButton}>
                <Text variant="body" color={theme.colors.text.secondary}>
                  {storeData.businessType || "Select business type"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Registration Number
              </Text>
              <TextInput
                value={storeData.registrationNumber}
                onChangeText={(text) => updateStoreData("registrationNumber", text)}
                placeholder="Enter registration number"
                style={styles.textInput}
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                GST Number
              </Text>
              <TextInput
                value={storeData.gstNumber}
                onChangeText={(text) => updateStoreData("gstNumber", text)}
                placeholder="Enter GST number"
                style={styles.textInput}
              />
            </Card>

            <Text variant="h3" fontWeight="bold" style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>
              Business Address
            </Text>
            
            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Street Address
              </Text>
              <TextInput
                value={storeData.businessAddress}
                onChangeText={(text) => updateStoreData("businessAddress", text)}
                placeholder="Enter street address"
                style={styles.textInput}
              />
            </Card>
             
            <View style={styles.row}>
              <Card style={styles.inputCardFlexTwoMargin}>
                <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                  City
                </Text>
                <TextInput
                  value={storeData.businessCity}
                  onChangeText={(text) => updateStoreData("businessCity", text)}
                  placeholder="City"
                  style={styles.textInput}
                />
              </Card>
              <Card style={styles.inputCardFlexOne}>
                <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                  State
                </Text>
                <TextInput
                  value={storeData.businessState}
                  onChangeText={(text) => updateStoreData("businessState", text)}
                  placeholder="State"
                  style={styles.textInput}
                />
              </Card>
            </View>

            <View style={styles.row}>
              <Card style={styles.inputCardFlexOneMargin}>
                <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                  ZIP Code
                </Text>
                <TextInput
                  value={storeData.businessZipCode}
                  onChangeText={(text) => updateStoreData("businessZipCode", text)}
                  placeholder="ZIP"
                  style={styles.textInput}
                  keyboardType="numeric"
                />
              </Card>
              <Card style={styles.inputCardFlexOne}>
                <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                  Country
                </Text>
                <TextInput
                  value={storeData.businessCountry}
                  onChangeText={(text) => updateStoreData("businessCountry", text)}
                  style={styles.textInput}
                />
              </Card>
            </View>
          </View>
        );

      case "store-details":
        return (
          <View style={styles.stepContent}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Store Details
            </Text>
            
            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Store Name *
              </Text>
              <TextInput
                value={storeData.storeName}
                onChangeText={(text) => updateStoreData("storeName", text)}
                placeholder="Enter store name"
                style={styles.textInput}
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Store Description
              </Text>
              <TextInput
                value={storeData.storeDescription}
                onChangeText={(text) => updateStoreData("storeDescription", text)}
                placeholder="Describe your store and products"
                style={styles.textArea}
                multiline
                numberOfLines={4}
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Contact Number *
              </Text>
              <TextInput
                value={storeData.storeContact}
                onChangeText={(text) => updateStoreData("storeContact", text)}
                placeholder="Enter contact number"
                style={styles.textInput}
                keyboardType="phone-pad"
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Email Address *
              </Text>
              <TextInput
                value={storeData.storeEmail}
                onChangeText={(text) => updateStoreData("storeEmail", text)}
                placeholder="Enter email address"
                style={styles.textInput}
                keyboardType="email-address"
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Website (Optional)
              </Text>
              <TextInput
                value={storeData.storeWebsite || ""}
                onChangeText={(text) => updateStoreData("storeWebsite", text)}
                placeholder="https://yourwebsite.com"
                style={styles.textInput}
                keyboardType="url"
              />
            </Card>
          </View>
        );

      case "payment":
        return (
          <View style={styles.stepContent}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Payment Methods
            </Text>
            
            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Accepted Payment Methods
              </Text>
              <View style={styles.checkboxGroup}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    storeData.paymentMethods.includes("upi") && styles.checkboxSelected,
                  ]}
                  onPress={() => {
                    const methods = storeData.paymentMethods.includes("upi")
                      ? storeData.paymentMethods.filter(m => m !== "upi")
                      : [...storeData.paymentMethods, "upi"];
                    updateStoreData("paymentMethods", methods);
                  }}
                >
                  <Ionicons
                    name={storeData.paymentMethods.includes("upi") ? "checkbox" : "square-outline"}
                    size={24}
                    color={theme.colors.primary.green}
                  />
                  <Text variant="body" style={styles.checkboxLabel}>UPI</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    storeData.paymentMethods.includes("bank-transfer") && styles.checkboxSelected,
                  ]}
                  onPress={() => {
                    const methods = storeData.paymentMethods.includes("bank-transfer")
                      ? storeData.paymentMethods.filter(m => m !== "bank-transfer")
                      : [...storeData.paymentMethods, "bank-transfer"];
                    updateStoreData("paymentMethods", methods);
                  }}
                >
                  <Ionicons
                    name={storeData.paymentMethods.includes("bank-transfer") ? "checkbox" : "square-outline"}
                    size={24}
                    color={theme.colors.primary.green}
                  />
                  <Text variant="body" style={styles.checkboxLabel}>Bank Transfer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    storeData.paymentMethods.includes("cod") && styles.checkboxSelected,
                  ]}
                  onPress={() => {
                    const methods = storeData.paymentMethods.includes("cod")
                      ? storeData.paymentMethods.filter(m => m !== "cod")
                      : [...storeData.paymentMethods, "cod"];
                    updateStoreData("paymentMethods", methods);
                  }}
                >
                  <Ionicons
                    name={storeData.paymentMethods.includes("cod") ? "checkbox" : "square-outline"}
                    size={24}
                    color={theme.colors.primary.green}
                  />
                  <Text variant="body" style={styles.checkboxLabel}>Cash on Delivery</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <Text variant="h3" fontWeight="bold" style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>
              Bank Details
            </Text>
            
            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Account Holder Name *
              </Text>
              <TextInput
                value={storeData.bankAccountName}
                onChangeText={(text) => updateStoreData("bankAccountName", text)}
                placeholder="Enter account holder name"
                style={styles.textInput}
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                Account Number *
              </Text>
              <TextInput
                value={storeData.bankAccountNumber}
                onChangeText={(text) => updateStoreData("bankAccountNumber", text)}
                placeholder="Enter account number"
                style={styles.textInput}
                keyboardType="numeric"
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                IFSC Code *
              </Text>
              <TextInput
                value={storeData.bankIFSC}
                onChangeText={(text) => updateStoreData("bankIFSC", text)}
                placeholder="Enter IFSC code"
                style={styles.textInput}
                autoCapitalize="characters"
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                UPI ID (Optional)
              </Text>
              <TextInput
                value={storeData.upiId || ""}
                onChangeText={(text) => updateStoreData("upiId", text)}
                placeholder="yourname@upi"
                style={styles.textInput}
              />
            </Card>
          </View>
        );

      case "review":
        return (
          <View style={styles.stepContent}>
            <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
              Review & Submit
            </Text>
            
            <Card style={styles.reviewCard}>
              <Text variant="h3" fontWeight="bold" color={theme.colors.primary.green}>
                {storeData.storeName || "Your Store Name"}
              </Text>
              <Text variant="body" color={theme.colors.text.secondary} style={styles.reviewSubtitle}>
                {storeData.businessName}
              </Text>
              
              <View style={styles.reviewSection}>
                <Text variant="body" fontWeight="semibold">Contact</Text>
                <Text variant="body">{storeData.storeContact}</Text>
                <Text variant="body">{storeData.storeEmail}</Text>
              </View>
              
              <View style={styles.reviewSection}>
                <Text variant="body" fontWeight="semibold">Business Address</Text>
                <Text variant="body">{storeData.businessAddress}</Text>
                <Text variant="body">{storeData.businessCity}, {storeData.businessState} - {storeData.businessZipCode}</Text>
              </View>
              
              <View style={styles.reviewSection}>
                <Text variant="body" fontWeight="semibold">Payment Methods</Text>
                <Text variant="body">{storeData.paymentMethods.join(", ")}</Text>
              </View>
            </Card>

            <Card style={styles.inputCard}>
              <View style={styles.switchContainer}>
                <View style={styles.switchContent}>
                  <Text variant="body" fontWeight="semibold">
                    I agree to the Terms of Service
                  </Text>
                  <Text variant="caption" color={theme.colors.text.secondary}>
                    By submitting, you agree to our terms and conditions
                  </Text>
                </View>
                <Switch
                  value={true}
                  trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.green }}
                />
              </View>
            </Card>
          </View>
        );

      default:
        return (
          <View style={styles.stepContent}>
            <Text variant="h3" fontWeight="bold">Step Coming Soon</Text>
            <Text variant="body" color={theme.colors.text.secondary}>
              This step is under development
            </Text>
          </View>
        );
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case "business-info":
        return storeData.businessName.length > 0 && 
               storeData.businessAddress.length > 0 &&
               storeData.businessCity.length > 0 &&
               storeData.businessState.length > 0 &&
               storeData.businessZipCode.length > 0;
      case "store-details":
        return storeData.storeName.length > 0 && 
               storeData.storeContact.length > 0 &&
               storeData.storeEmail.length > 0;
      case "payment":
        return storeData.bankAccountName.length > 0 && 
               storeData.bankAccountNumber.length > 0 &&
               storeData.bankIFSC.length > 0;
      default:
        return true;
    }
  };

  const canGoNext = currentStepIndex < WIZARD_STEPS.length - 1 && isStepValid();
  const showSubmit = currentStep === "review";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Store Setup
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStepIndex + 1) / WIZARD_STEPS.length) * 100}%` }
            ]} 
          />
        </View>
        <Text variant="caption" color={theme.colors.text.secondary} style={styles.progressText}>
          Step {currentStepIndex + 1} of {WIZARD_STEPS.length}: {currentStepData?.title}
        </Text>
      </View>

      {/* Step Info */}
      <View style={styles.stepHeader}>
        <View style={styles.stepIconContainer}>
          <Ionicons 
            name={currentStepData?.icon || "information-circle"} 
            size={24} 
            color={theme.colors.primary.green} 
          />
        </View>
        <View style={styles.stepInfo}>
          <Text variant="h3" fontWeight="bold">{currentStepData?.title}</Text>
          <Text variant="body" color={theme.colors.text.secondary}>
            {currentStepData?.description}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <View style={styles.buttonRow}>
          {currentStepIndex > 0 && (
            <Button
              variant="outline"
              size="md"
              onPress={handlePrevious}
              style={styles.navButton}
              disabled={loading}
            >
              <Ionicons name="chevron-back" size={20} color={theme.colors.primary.green} />
              Previous
            </Button>
          )}
          
          {showSubmit ? (
            <Button
              variant="primary"
              size="md"
              onPress={handleSubmit}
              style={styles.actionButton}
              disabled={loading}
            >
              {loading ? <Loading size="small" color={theme.colors.background.primary} /> : "Submit Store Setup"}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onPress={handleNext}
              style={styles.navButton}
              disabled={!canGoNext || loading}
            >
              Next
              <Ionicons name="chevron-forward" size={20} color={theme.colors.background.primary} style={styles.buttonIcon} />
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

// Adding the missing import for Loading
import { Loading } from "@/components/common";

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
  headerSpacer: {
    width: theme.spacing.xl + 8,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.sm / 4,
    marginBottom: theme.spacing.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary.green,
    borderRadius: theme.borderRadius.sm / 4,
  },
  progressText: {
    textAlign: "center",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary.green + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  stepInfo: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  stepContent: {
    gap: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  inputCard: {
    padding: theme.spacing.md,
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
  },
  textArea: {
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    minHeight: theme.spacing.xxl + 4,
    textAlignVertical: "top",
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  checkboxGroup: {
    gap: theme.spacing.md,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxSelected: {},
  reviewCard: {
    padding: theme.spacing.lg,
  },
  reviewSubtitle: {
    marginBottom: theme.spacing.lg,
  },
  reviewSection: {
    flexDirection: "column",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  navButton: {
    flex: 1,
  },
  actionButton: {
    flex: 1,
  },
  buttonIcon: {
    marginLeft: theme.spacing.sm,
  },
  flexOne: {
    flex: 1,
  },
  flexTwo: {
    flex: 2,
  },
  inputCardFlexOne: {
    padding: theme.spacing.md,
    flex: 1,
  },
  inputCardFlexTwo: {
    padding: theme.spacing.md,
    flex: 2,
  },
  inputCardFlexOneMargin: {
    padding: theme.spacing.md,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  inputCardFlexTwoMargin: {
    padding: theme.spacing.md,
    flex: 2,
    marginRight: theme.spacing.sm,
  },
});

export default StoreSetupWizard;