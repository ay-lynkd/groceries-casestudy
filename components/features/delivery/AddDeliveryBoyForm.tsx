import { Button, Input } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { validateEmail, validateIndianMobile, validateName } from '@/utils/validation';
import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

interface AddDeliveryBoyFormProps {
  onSubmit: (data: { fullName: string; mobileNumber: string; email: string }) => void;
  onCancel?: () => void;
}

interface FormErrors {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
}

export const AddDeliveryBoyForm: React.FC<AddDeliveryBoyFormProps> = ({ onSubmit, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((field: string, value: string): string | undefined => {
    switch (field) {
      case 'fullName':
        return validateName(value, { fieldName: 'Full name' }).error;
      case 'mobileNumber':
        return validateIndianMobile(value).error;
      case 'email':
        return validateEmail(value).error;
      default:
        return undefined;
    }
  }, []);

  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, 
      field === 'fullName' ? fullName : 
      field === 'mobileNumber' ? mobileNumber : email
    );
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [fullName, mobileNumber, email, validateField]);

  const handleChange = useCallback((field: string, value: string) => {
    switch (field) {
      case 'fullName':
        setFullName(value);
        break;
      case 'mobileNumber':
        // Only allow numbers and limit to 10 digits
        const cleaned = value.replace(/\D/g, '').slice(0, 10);
        setMobileNumber(cleaned);
        break;
      case 'email':
        setEmail(value);
        break;
    }
    
    // Clear error when user starts typing
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [touched, validateField]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      fullName: validateName(fullName, { fieldName: 'Full name' }).error,
      mobileNumber: validateIndianMobile(mobileNumber).error,
      email: validateEmail(email).error,
    };
    
    setErrors(newErrors);
    setTouched({ fullName: true, mobileNumber: true, email: true });
    
    return !Object.values(newErrors).some(error => error !== undefined);
  }, [fullName, mobileNumber, email]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit({ 
        fullName: fullName.trim(), 
        mobileNumber: `+91 ${mobileNumber}`, 
        email: email.trim().toLowerCase() 
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add delivery boy. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [fullName, mobileNumber, email, validateForm, onSubmit]);

  const formatPhoneDisplay = (phone: string): string => {
    if (phone.length === 0) return '';
    if (phone.length <= 5) return phone;
    return `${phone.slice(0, 5)}-${phone.slice(5)}`;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add Delivery Partner</Text>
          <Text style={styles.subtitle}>Enter the details of the new delivery partner</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter full name (e.g., Rahul Kumar)"
            value={fullName}
            onChangeText={(value) => handleChange('fullName', value)}
            onBlur={() => handleBlur('fullName')}
            error={touched.fullName ? errors.fullName : undefined}
            leftIcon="person-outline"
            autoCapitalize="words"
            editable={!isSubmitting}
          />

          <View>
            <Input
              label="Mobile Number"
              placeholder="Enter 10-digit mobile number"
              value={formatPhoneDisplay(mobileNumber)}
              onChangeText={(value) => handleChange('mobileNumber', value.replace(/\D/g, ''))}
              onBlur={() => handleBlur('mobileNumber')}
              error={touched.mobileNumber ? errors.mobileNumber : undefined}
              leftIcon="call-outline"
              keyboardType="phone-pad"
              maxLength={11} // 5 + 1 hyphen + 5
              editable={!isSubmitting}
            />
            <Text style={styles.prefix}>+91 </Text>
          </View>

          <Input
            label="Email Address"
            placeholder="Enter email address"
            value={email}
            onChangeText={(value) => handleChange('email', value)}
            onBlur={() => handleBlur('email')}
            error={touched.email ? errors.email : undefined}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            • An invitation will be sent to their mobile number{'\n'}
            • They need to download the delivery partner app{'\n'}
            • Complete KYC verification before starting
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {onCancel && (
            <Button
              variant="outline"
              size="lg"
              onPress={onCancel}
              disabled={isSubmitting}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={!onCancel ? StyleSheet.flatten([styles.submitButton, styles.fullWidthButton]) : styles.submitButton}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              'Add Delivery Partner'
            )}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  form: {
    gap: theme.spacing.md,
  },
  prefix: {
    position: 'absolute',
    left: 50,
    top: 46,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  infoBox: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: 'auto',
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
  fullWidthButton: {
    flex: 1,
  },
});

export default AddDeliveryBoyForm;
