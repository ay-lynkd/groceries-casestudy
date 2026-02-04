/**
 * Store Setup Wizard
 * Multi-step store configuration for new sellers
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type Step = 'basic' | 'address' | 'hours' | 'delivery' | 'complete';

interface StoreForm {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  hours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  deliveryRadius: number;
  minimumOrder: string;
  deliveryFee: string;
  freeDeliveryAbove: string;
  gstNumber: string;
  fssaiNumber: string;
}

const STEPS: { id: Step; title: string; icon: string }[] = [
  { id: 'basic', title: 'Basic', icon: 'storefront-outline' },
  { id: 'address', title: 'Address', icon: 'location-outline' },
  { id: 'hours', title: 'Hours', icon: 'time-outline' },
  { id: 'delivery', title: 'Delivery', icon: 'bicycle-outline' },
  { id: 'complete', title: 'Done', icon: 'checkmark-circle-outline' },
];

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const DEFAULT_HOURS = {
  open: '09:00',
  close: '21:00',
  isOpen: true,
};

export default function StoreSetupWizardScreen() {
  const { colors } = theme;
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<StoreForm>({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    hours: DAYS.reduce((acc, day) => ({ ...acc, [day.key]: { ...DEFAULT_HOURS } }), {}),
    deliveryRadius: 5,
    minimumOrder: '100',
    deliveryFee: '20',
    freeDeliveryAbove: '500',
    gstNumber: '',
    fssaiNumber: '',
  });

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const updateForm = (key: keyof StoreForm, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateHours = (day: string, field: 'open' | 'close' | 'isOpen', value: any) => {
    setForm(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: { ...prev.hours[day], [field]: value },
      },
    }));
  };

  const applyToAllDays = (sourceDay: string) => {
    const sourceHours = form.hours[sourceDay];
    const newHours = DAYS.reduce((acc, day) => ({
      ...acc,
      [day.key]: { ...sourceHours },
    }), {});
    updateForm('hours', newHours);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

  const handleComplete = async () => {
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Store Information</Text>
            <Text style={styles.stepDescription}>
              Tell customers about your store
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Store Name *</Text>
              <View style={styles.input}>
                <Text>{form.name || 'e.g., Krishna General Store'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={[styles.input, styles.textArea]}>
                <Text>{form.description || 'Brief description of your store'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Store Phone *</Text>
              <View style={styles.input}>
                <Text>{form.phone || '+91 '}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Store Email</Text>
              <View style={styles.input}>
                <Text>{form.email || 'store@example.com'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>GST Number (Optional)</Text>
              <View style={styles.input}>
                <Text>{form.gstNumber || '22AAAAA0000A1Z5'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>FSSAI License (For Food)</Text>
              <View style={styles.input}>
                <Text>{form.fssaiNumber || 'License number'}</Text>
              </View>
            </View>
          </View>
        );

      case 'address':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Store Address</Text>
            <Text style={styles.stepDescription}>
              Where is your store located?
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Complete Address *</Text>
              <View style={[styles.input, styles.textArea]}>
                <Text>{form.address || 'Street address, building name'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>City *</Text>
                <View style={styles.input}>
                  <Text>{form.city || 'City'}</Text>
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>State *</Text>
                <View style={styles.input}>
                  <Text>{form.state || 'State'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>PIN Code *</Text>
                <View style={styles.input}>
                  <Text>{form.pincode || '560001'}</Text>
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>Landmark</Text>
                <View style={styles.input}>
                  <Text>{form.landmark || 'Nearby landmark'}</Text>
                </View>
              </View>
            </View>

            <Card style={styles.mapCard}>
              <Ionicons name="map-outline" size={48} color={theme.colors.status.success} />
              <Text style={styles.mapText}>Pick location on map</Text>
              <Button 
                variant="outline" 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/address/map-picker');
                }}
              >
                <Text>Open Map</Text>
              </Button>
            </Card>
          </View>
        );

      case 'hours':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Working Hours</Text>
            <Text style={styles.stepDescription}>
              When is your store open?
            </Text>

            <TouchableOpacity
              style={styles.applyAllButton}
              onPress={() => applyToAllDays('monday')}
            >
              <Ionicons name="copy-outline" size={16} color={theme.colors.status.success} />
              <Text style={styles.applyAllText}>Apply Monday hours to all days</Text>
            </TouchableOpacity>

            {DAYS.map(day => (
              <Card key={day.key} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayLabel}>{day.label}</Text>
                  <Switch
                    value={form.hours[day.key].isOpen}
                    onValueChange={(value) => updateHours(day.key, 'isOpen', value)}
                    trackColor={{ false: theme.colors.border.light, true: theme.colors.status.success + '80' }}
                    thumbColor={form.hours[day.key].isOpen ? theme.colors.status.success : theme.colors.background.tertiary}
                  />
                </View>
                
                {form.hours[day.key].isOpen && (
                  <View style={styles.hoursRow}>
                    <View style={styles.timeInput}>
                      <Text style={styles.timeLabel}>Open</Text>
                      <Text style={styles.timeValue}>{form.hours[day.key].open}</Text>
                    </View>
                    <Text style={styles.hoursSeparator}>to</Text>
                    <View style={styles.timeInput}>
                      <Text style={styles.timeLabel}>Close</Text>
                      <Text style={styles.timeValue}>{form.hours[day.key].close}</Text>
                    </View>
                  </View>
                )}
              </Card>
            ))}
          </View>
        );

      case 'delivery':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Delivery Settings</Text>
            <Text style={styles.stepDescription}>
              Configure your delivery options
            </Text>

            <Card style={styles.settingCard}>
              <Text style={styles.settingLabel}>Delivery Radius</Text>
              <Text style={styles.settingValue}>{form.deliveryRadius} km</Text>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${(form.deliveryRadius / 10) * 100}%` }]} />
              </View>
              <Text style={styles.settingHint}>How far you'll deliver orders</Text>
            </Card>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Minimum Order Value (₹)</Text>
              <View style={styles.input}>
                <Text>{form.minimumOrder}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Delivery Fee (₹)</Text>
                <View style={styles.input}>
                  <Text>{form.deliveryFee}</Text>
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>Free Above (₹)</Text>
                <View style={styles.input}>
                  <Text>{form.freeDeliveryAbove}</Text>
                </View>
              </View>
            </View>

            <Card style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={24} color={theme.colors.status.info} />
              <Text style={styles.infoText}>
                Orders above ₹{form.freeDeliveryAbove} will get free delivery
              </Text>
            </Card>
          </View>
        );

      case 'complete':
        return (
          <View style={styles.stepContent}>
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={80} color={theme.colors.status.success} />
              </View>
              <Text style={styles.successTitle}>Setup Complete!</Text>
              <Text style={styles.successDescription}>
                Your store is ready. You can now start accepting orders.
              </Text>

              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Store Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Name</Text>
                  <Text style={styles.summaryValue}>{form.name || 'Your Store'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Location</Text>
                  <Text style={styles.summaryValue}>{form.city || 'City'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Hours</Text>
                  <Text style={styles.summaryValue}>Mon-Sun</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery</Text>
                  <Text style={styles.summaryValue}>{form.deliveryRadius}km radius</Text>
                </View>
              </Card>
            </View>
          </View>
        );
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Setup Store', headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Setup Your Store</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.stepsRow}>
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

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            {currentStepIndex > 0 && currentStep !== 'complete' && (
              <Button variant="outline" onPress={handleBack}>
                <Text>Back</Text>
              </Button>
            )}
            {currentStep === 'complete' ? (
              <Button 
                variant="primary" 
                onPress={handleComplete}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={{ color: theme.colors.background.primary }}>Finishing...</Text>
                ) : (
                  <Text style={{ color: theme.colors.background.primary }}>Go to Dashboard</Text>
                )}
              </Button>
            ) : (
              <Button variant="primary" onPress={handleNext}>
                <Text style={{ color: theme.colors.background.primary }}>
                  {currentStepIndex === STEPS.length - 2 ? 'Finish' : 'Continue'}
                </Text>
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
    width: theme.spacing.xl + 12,
    height: theme.spacing.xl + 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md - 4,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: theme.spacing.xl + 12,
    height: theme.spacing.xl + 12,
    borderRadius: theme.borderRadius.xl + 2,
    backgroundColor: theme.colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: theme.colors.status.success,
  },
  stepLabel: {
    fontSize: theme.typography.fontSize.xs - 2,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  stepLabelActive: {
    color: theme.colors.status.success,
    fontWeight: '600',
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
    padding: theme.spacing.lg + 4,
  },
  stepContent: {
    paddingBottom: theme.spacing.lg + 4,
  },
  stepTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  stepDescription: {
    fontSize: theme.typography.fontSize.base - 2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl - 8,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg + 4,
  },
  label: {
    fontSize: theme.typography.fontSize.base - 2,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm + 4,
    backgroundColor: theme.colors.background.secondary,
  },
  textArea: {
    height: theme.spacing.xxl + 32,
  },
  row: {
    flexDirection: 'row',
  },
  mapCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  mapText: {
    fontSize: theme.typography.fontSize.lg - 2,
    marginVertical: theme.spacing.md - 4,
    color: theme.colors.text.primary,
  },
  applyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.status.success + '15',
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  applyAllText: {
    color: theme.colors.status.success,
    marginLeft: theme.spacing.sm - 2,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  dayCard: {
    marginBottom: theme.spacing.md - 4,
    padding: theme.spacing.md,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: theme.typography.fontSize.lg - 2,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md - 4,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  timeValue: {
    fontSize: theme.typography.fontSize.lg - 2,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  hoursSeparator: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text.secondary,
  },
  settingCard: {
    padding: 16,
    marginBottom: theme.spacing.lg + 4,
  },
  settingLabel: {
    fontSize: theme.typography.fontSize.base - 2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  settingValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.status.success,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.xs,
    marginTop: theme.spacing.md - 4,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: theme.colors.status.success,
    borderRadius: theme.borderRadius.xs,
  },
  settingHint: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm + 4,
    backgroundColor: theme.colors.status.info + '15',
  },
  infoText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base - 2,
    color: theme.colors.status.info,
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl + 8,
  },
  successIcon: {
    marginBottom: theme.spacing.xl - 8,
  },
  successTitle: {
    fontSize: theme.typography.fontSize['3xl'] - 2,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  successDescription: {
    fontSize: theme.typography.fontSize.lg - 2,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl - 16,
  },
  summaryCard: {
    width: '100%',
    padding: theme.spacing.lg + 4,
  },
  summaryTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.base - 2,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.base - 2,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  footer: {
    padding: theme.spacing.lg + 4,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
});
