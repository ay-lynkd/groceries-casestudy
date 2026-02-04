/**
 * OTP Verification Screen
 * For phone number verification during auth
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/common';
import { Button } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 30;

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_TIMEOUT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError('');

    // Move to next input
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimer(RESEND_TIMEOUT);
    setOtp(new Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== OTP_LENGTH) {
      setError('Please enter all 6 digits');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (otpString === '123456') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)');
      } else {
        setError('Invalid OTP. Please try again.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setOtp(new Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={theme.typography.fontSize.lg + 6}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={theme.spacing.xxl + 16}
                color={theme.colors.status.success}
              />
            </View>

            <Text
              variant="h2"
              fontWeight="bold"
              style={styles.title}
            >
              Verify Your Phone
            </Text>

            <Text
              variant="body"
              color={theme.colors.text.secondary}
              style={styles.subtitle}
            >
              We've sent a 6-digit verification code to{'\n'}
              <Text fontWeight="semibold" color={theme.colors.text.primary}>
                +91 98765 43210
              </Text>
            </Text>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    error && styles.otpInputError,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  textAlign="center"
                />
              ))}
            </View>

            {error ? (
              <Text
                variant="caption"
                color={theme.colors.status.error}
                style={styles.errorText}
              >
                {error}
              </Text>
            ) : null}

            {/* Verify Button */}
            <Button
              variant="primary"
              size="lg"
              onPress={handleVerify}
              disabled={!isComplete || isLoading}
              style={styles.verifyButton}
            >
              {isLoading ? (
                <Text style={{ color: theme.colors.background.primary }}>
                  Verifying...
                </Text>
              ) : (
                <Text
                  style={{
                    color: isComplete
                      ? theme.colors.background.primary
                      : theme.colors.text.secondary,
                  }}
                >
                  Verify OTP
                </Text>
              )}
            </Button>

            {/* Resend Section */}
            <View style={styles.resendContainer}>
              <Text variant="body" color={theme.colors.text.secondary}>
                Didn't receive the code?
              </Text>
              <TouchableOpacity
                onPress={handleResend}
                disabled={timer > 0}
                style={styles.resendButton}
              >
                <Text
                  variant="body"
                  fontWeight="semibold"
                  color={
                    timer > 0
                      ? theme.colors.text.light
                      : theme.colors.status.success
                  }
                >
                  Resend {timer > 0 ? `(${timer}s)` : ''}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Change Number */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.changeNumberButton}
            >
              <Text
                variant="body"
                fontWeight="semibold"
                color={theme.colors.text.secondary}
              >
                Change Phone Number
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text
              variant="caption"
              color={theme.colors.text.light}
              style={styles.footerText}
            >
              By verifying, you agree to our{' '}
              <Text fontWeight="semibold" color={theme.colors.text.secondary}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text fontWeight="semibold" color={theme.colors.text.secondary}>
                Privacy Policy
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginTop: theme.spacing.xl,
  },
  backButton: {
    padding: theme.spacing.sm,
    width: theme.spacing.xl + 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
  },
  iconContainer: {
    width: theme.spacing.xxl * 2,
    height: theme.spacing.xxl * 2,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.status.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.fontSize.lg + 6,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  otpInput: {
    width: theme.spacing.xl,
    height: theme.spacing.xl + 8,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
  },
  otpInputFilled: {
    borderColor: theme.colors.status.success,
    backgroundColor: theme.colors.status.success + '08',
  },
  otpInputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  verifyButton: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  resendButton: {
    paddingVertical: theme.spacing.xs,
  },
  changeNumberButton: {
    padding: theme.spacing.sm,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: theme.spacing.lg,
  },
  footerText: {
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.base + 4,
  },
});
