/**
 * Add Delivery Boy Screen
 * Form to add new delivery partner
 */

import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Alert, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DeliveryBoyForm {
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
}

const VEHICLE_TYPES = [
  { id: 'bike', label: 'Bike', icon: 'bicycle-outline' },
  { id: 'scooter', label: 'Scooter', icon: 'speedometer-outline' },
  { id: 'bicycle', label: 'Bicycle', icon: 'walk-outline' },
];

export default function AddDeliveryBoyScreen() {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<DeliveryBoyForm>({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    licenseNumber: '',
  });

  const updateForm = (key: keyof DeliveryBoyForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      Alert.alert('Required', 'Please enter full name');
      return false;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      Alert.alert('Required', 'Please enter valid 10-digit phone number');
      return false;
    }
    if (!form.vehicleNumber.trim()) {
      Alert.alert('Required', 'Please enter vehicle number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Success',
        `${form.name} has been added as a delivery partner!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Add Delivery Partner' }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView 
          style={styles.container} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + theme.spacing.lg }}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add-outline" size={32} color={theme.colors.status.success} />
          </View>
          <Text style={styles.title}>Add New Delivery Partner</Text>
          <Text style={styles.subtitle}>
            Fill in the details to onboard a new delivery person
          </Text>
        </View>

        {/* Personal Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => updateForm('name', text)}
              placeholder="Enter full name (e.g., Rahul Kumar)"
              placeholderTextColor={theme.colors.text.light}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(text) => updateForm('phone', text.replace(/[^0-9]/g, ''))}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor={theme.colors.text.light}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(text) => updateForm('email', text)}
              placeholder="Enter email address"
              placeholderTextColor={theme.colors.text.light}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </Card>

        {/* Vehicle Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          
          <Text style={styles.label}>Vehicle Type *</Text>
          <View style={styles.vehicleTypeContainer}>
            {VEHICLE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.vehicleTypeButton,
                  form.vehicleType === type.id && styles.vehicleTypeButtonActive,
                ]}
                onPress={() => updateForm('vehicleType', type.id)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={form.vehicleType === type.id ? theme.colors.status.success : theme.colors.text.secondary}
                />
                <Text
                  style={[
                    styles.vehicleTypeLabel,
                    form.vehicleType === type.id && styles.vehicleTypeLabelActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Number *</Text>
            <TextInput
              style={styles.input}
              value={form.vehicleNumber}
              onChangeText={(text) => updateForm('vehicleNumber', text.toUpperCase())}
              placeholder="e.g., KA01AB1234"
              placeholderTextColor={theme.colors.text.light}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>License Number</Text>
            <TextInput
              style={styles.input}
              value={form.licenseNumber}
              onChangeText={(text) => updateForm('licenseNumber', text.toUpperCase())}
              placeholder="Enter driving license number"
              placeholderTextColor={theme.colors.text.light}
              autoCapitalize="characters"
            />
          </View>
        </Card>

        {/* Documents Upload */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="id-card-outline" size={24} color={theme.colors.status.success} />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadTitle}>ID Proof</Text>
              <Text style={styles.uploadSubtitle}>Aadhaar / PAN / Passport</Text>
            </View>
            <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="document-text-outline" size={24} color={theme.colors.status.success} />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadTitle}>Driving License</Text>
              <Text style={styles.uploadSubtitle}>Upload front and back</Text>
            </View>
            <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="bicycle-outline" size={24} color={theme.colors.status.success} />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadTitle}>Vehicle Document</Text>
              <Text style={styles.uploadSubtitle}>RC Book / Insurance</Text>
            </View>
            <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </Card>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={theme.colors.status.info} />
          <Text style={styles.infoText}>
            The delivery partner will receive an SMS with login credentials once approved.
          </Text>
        </Card>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Button
            variant="outline"
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            <Text>Cancel</Text>
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.submitButton}
          >
            {isSubmitting ? (
              <Text style={{ color: '#FFF' }}>Adding...</Text>
            ) : (
              <Text style={{ color: '#FFF' }}>Add Delivery Partner</Text>
            )}
          </Button>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.status.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    margin: theme.spacing.md,
    marginTop: 0,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.primary,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  vehicleTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.secondary,
    minHeight: 80,
    justifyContent: 'center',
  },
  vehicleTypeButtonActive: {
    borderColor: theme.colors.status.success,
    backgroundColor: theme.colors.status.success + '15',
  },
  vehicleTypeLabel: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  vehicleTypeLabelActive: {
    color: theme.colors.status.success,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    minHeight: 60,
  },
  uploadTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  uploadTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  uploadSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.md,
    marginTop: 0,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.status.info + '15',
  },
  infoText: {
    flex: 1,
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.status.info,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
