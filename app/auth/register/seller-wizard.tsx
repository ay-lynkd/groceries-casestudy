/**
 * Seller Registration Wizard
 * Multi-step seller onboarding process
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

type Step = 'basic' | 'store' | 'documents' | 'bank' | 'review';

interface FormData {
  // Basic Info
  fullName: string;
  email: string;
  phone: string;
  password: string;
  
  // Store Info
  storeName: string;
  storeType: string;
  businessAddress: string;
  gstNumber: string;
  
  // Documents
  idProof: string | null;
  addressProof: string | null;
  businessLicense: string | null;
  
  // Bank
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

const STEPS: { id: Step; title: string; icon: string }[] = [
  { id: 'basic', title: 'Basic Info', icon: 'person-outline' },
  { id: 'store', title: 'Store', icon: 'storefront-outline' },
  { id: 'documents', title: 'Documents', icon: 'document-text-outline' },
  { id: 'bank', title: 'Bank', icon: 'card-outline' },
  { id: 'review', title: 'Review', icon: 'checkmark-circle-outline' },
];

export default function SellerWizardScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    storeName: '',
    storeType: '',
    businessAddress: '',
    gstNumber: '',
    idProof: null,
    addressProof: null,
    businessLicense: null,
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const pickDocument = async (type: 'idProof' | 'addressProof' | 'businessLicense') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to photo library to upload documents.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, [type]: result.assets[0].uri }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Document uploaded successfully!');
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Registration Submitted',
        'Your application is under review. We will notify you within 24-48 hours.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }, 2000);
  };

  const updateForm = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Personal Information</Text>
            <Text style={styles.stepDescription}>
              Tell us about yourself to get started
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.input}>
                <Text>{formData.fullName || 'Enter your full name'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <View style={styles.input}>
                <Text>{formData.email || 'Enter your email'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={styles.input}>
                <Text>{formData.phone || '+91 '}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.input}>
                <Text>••••••••</Text>
              </View>
            </View>
          </View>
        );

      case 'store':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Store Information</Text>
            <Text style={styles.stepDescription}>
              Details about your business
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Store Name *</Text>
              <View style={styles.input}>
                <Text>{formData.storeName || 'Enter store name'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Type</Text>
              <View style={styles.optionsRow}>
                {['Grocery', 'Restaurant', 'Pharmacy', 'Other'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionChip,
                      formData.storeType === type && styles.optionChipActive,
                    ]}
                    onPress={() => updateForm('storeType', type)}
                  >
                    <Text style={formData.storeType === type ? styles.optionTextActive : undefined}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Address *</Text>
              <View style={[styles.input, styles.textArea]}>
                <Text>{formData.businessAddress || 'Enter complete address'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>GST Number (Optional)</Text>
              <View style={styles.input}>
                <Text>{formData.gstNumber || '22AAAAA0000A1Z5'}</Text>
              </View>
            </View>
          </View>
        );

      case 'documents':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Document Verification</Text>
            <Text style={styles.stepDescription}>
              Upload required documents for verification
            </Text>

            <TouchableOpacity 
              style={[styles.uploadCard, formData.idProof && styles.uploadCardSuccess]}
              onPress={() => pickDocument('idProof')}
            >
              {formData.idProof ? (
                <Image source={{ uri: formData.idProof }} style={styles.uploadPreview} />
              ) : (
                <Ionicons name="id-card-outline" size={32} color={theme.colors.status.success} />
              )}
              <Text style={styles.uploadTitle}>ID Proof</Text>
              <Text style={styles.uploadSubtitle}>PAN Card / Aadhaar / Passport</Text>
              <Button 
                variant={formData.idProof ? "primary" : "outline"} 
                onPress={() => pickDocument('idProof')}
              >
                <Text style={{ color: formData.idProof ? theme.colors.background.primary : undefined }}>
                  {formData.idProof ? 'Change' : 'Upload'}
                </Text>
              </Button>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.uploadCard, formData.addressProof && styles.uploadCardSuccess]}
              onPress={() => pickDocument('addressProof')}
            >
              {formData.addressProof ? (
                <Image source={{ uri: formData.addressProof }} style={styles.uploadPreview} />
              ) : (
                <Ionicons name="home-outline" size={32} color={theme.colors.status.success} />
              )}
              <Text style={styles.uploadTitle}>Address Proof</Text>
              <Text style={styles.uploadSubtitle}>Utility Bill / Rent Agreement</Text>
              <Button 
                variant={formData.addressProof ? "primary" : "outline"} 
                onPress={() => pickDocument('addressProof')}
              >
                <Text style={{ color: formData.addressProof ? theme.colors.background.primary : undefined }}>
                  {formData.addressProof ? 'Change' : 'Upload'}
                </Text>
              </Button>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.uploadCard, formData.businessLicense && styles.uploadCardSuccess]}
              onPress={() => pickDocument('businessLicense')}
            >
              {formData.businessLicense ? (
                <Image source={{ uri: formData.businessLicense }} style={styles.uploadPreview} />
              ) : (
                <Ionicons name="business-outline" size={32} color={theme.colors.status.success} />
              )}
              <Text style={styles.uploadTitle}>Business License</Text>
              <Text style={styles.uploadSubtitle}>Shop License / FSSAI / Trade License</Text>
              <Button 
                variant={formData.businessLicense ? "primary" : "outline"} 
                onPress={() => pickDocument('businessLicense')}
              >
                <Text style={{ color: formData.businessLicense ? theme.colors.background.primary : undefined }}>
                  {formData.businessLicense ? 'Change' : 'Upload'}
                </Text>
              </Button>
            </TouchableOpacity>
          </View>
        );

      case 'bank':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Bank Details</Text>
            <Text style={styles.stepDescription}>
              For receiving payments from orders
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Holder Name *</Text>
              <View style={styles.input}>
                <Text>{formData.accountHolder || 'Enter account holder name'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number *</Text>
              <View style={styles.input}>
                <Text>{formData.accountNumber || 'Enter account number'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>IFSC Code *</Text>
              <View style={styles.input}>
                <Text>{formData.ifscCode || 'SBIN0001234'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bank Name *</Text>
              <View style={styles.input}>
                <Text>{formData.bankName || 'Select bank'}</Text>
              </View>
            </View>

            <View style={styles.securityNote}>
              <Ionicons name="lock-closed-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.securityText}>
                Your bank details are secured with 256-bit encryption
              </Text>
            </View>
          </View>
        );

      case 'review':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review & Submit</Text>
            <Text style={styles.stepDescription}>
              Please review your information before submitting
            </Text>

            <Card style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Full Name</Text>
                <Text style={styles.reviewValue}>{formData.fullName || 'John Doe'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Email</Text>
                <Text style={styles.reviewValue}>{formData.email || 'john@example.com'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Store</Text>
                <Text style={styles.reviewValue}>{formData.storeName || 'My Store'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Business Type</Text>
                <Text style={styles.reviewValue}>{formData.storeType || 'Grocery'}</Text>
              </View>
            </Card>

            <View style={styles.termsContainer}>
              <TouchableOpacity style={styles.checkbox}>
                <Ionicons name="checkbox-outline" size={24} color={theme.colors.status.success} />
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Become a Seller', headerShown: false }} />
      <View style={styles.container}>
        {/* Progress Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Become a Seller</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.stepsIndicator}>
            {STEPS.map((step, index) => (
              <View key={step.id} style={styles.stepIndicator}>
                <View style={[
                  styles.stepCircle,
                  index <= currentStepIndex && styles.stepCircleActive,
                ]}>
                  <Ionicons 
                    name={step.icon as any} 
                    size={16} 
                    color={index <= currentStepIndex ? theme.colors.background.primary : theme.colors.text.secondary} 
                  />
                </View>
                <Text style={[
                  styles.stepLabel,
                  index <= currentStepIndex && styles.stepLabelActive,
                ]}>
                  {step.title}
                </Text>
                {index < STEPS.length - 1 && (
                  <View style={[
                    styles.stepLine,
                    index < currentStepIndex && styles.stepLineActive,
                  ]} />
                )}
              </View>
            ))}
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <View style={styles.progressText}>
            <Text style={styles.progressLabel}>Step {currentStepIndex + 1} of {STEPS.length}</Text>
          </View>
          <View style={styles.buttonRow}>
            {currentStepIndex > 0 && (
              <Button variant="outline" onPress={handleBack}>
                <Text>Back</Text>
              </Button>
            )}
            {currentStep === 'review' ? (
              <Button 
                variant="primary" 
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={{ color: theme.colors.background.primary }}>Submitting...</Text>
                ) : (
                  <Text style={{ color: theme.colors.background.primary }}>Submit Application</Text>
                )}
              </Button>
            ) : (
              <Button variant="primary" onPress={handleNext}>
                <Text style={{ color: theme.colors.background.primary }}>Continue</Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl + 12,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.sm,
    width: theme.spacing.xl + 8,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md - 4,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: theme.spacing.xl + 4,
    height: theme.spacing.xl + 4,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: theme.colors.status.success,
  },
  stepLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  stepLabelActive: {
    color: theme.colors.status.success,
    fontWeight: '600',
  },
  stepLine: {
    position: 'absolute',
    top: theme.spacing.xl - 6,
    right: -theme.spacing.lg + 4,
    width: theme.spacing.xl + 8,
    height: 2,
    backgroundColor: theme.colors.border.light,
  },
  stepLineActive: {
    backgroundColor: theme.colors.status.success,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.xs,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.status.success,
    borderRadius: theme.borderRadius.xs,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  stepContent: {
    paddingBottom: theme.spacing.lg + 4,
  },
  stepTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  stepDescription: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg - 4,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm + 4,
    backgroundColor: theme.colors.background.secondary,
  },
  textArea: {
    height: theme.spacing.xxl + 32,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  optionChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  optionChipActive: {
    backgroundColor: theme.colors.status.success + '15',
    borderColor: theme.colors.status.success,
  },
  optionTextActive: {
    color: theme.colors.status.success,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  uploadCard: {
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  uploadCardSuccess: {
    borderColor: theme.colors.status.success,
    borderStyle: 'solid',
    backgroundColor: theme.colors.status.success + '10',
  },
  uploadPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: theme.spacing.md - 4,
  },
  uploadTitle: {
    fontSize: theme.typography.fontSize.lg - 2,
    fontWeight: theme.typography.fontWeight.semibold,
    marginTop: theme.spacing.md - 4,
    marginBottom: theme.spacing.xs,
  },
  uploadSubtitle: {
    fontSize: theme.typography.fontSize.sm - 1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.md,
  },
  securityText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  reviewCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg + 4,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md - 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  reviewLabel: {
    fontSize: theme.typography.fontSize.base - 2,
    color: theme.colors.text.secondary,
  },
  reviewValue: {
    fontSize: theme.typography.fontSize.base - 2,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  checkbox: {
    padding: 4,
  },
  termsText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base - 2,
    color: theme.colors.text.secondary,
  },
  footer: {
    padding: theme.spacing.lg + 4,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  progressText: {
    alignItems: 'center',
    marginBottom: theme.spacing.md - 4,
  },
  progressLabel: {
    fontSize: theme.typography.fontSize.base - 2,
    color: theme.colors.text.secondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
