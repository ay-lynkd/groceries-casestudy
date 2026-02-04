/**
 * Delivery OTP Verification Screen
 * Verify delivery with OTP from customer
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '@/contexts/OrderContext';
import * as Haptics from 'expo-haptics';

const OTP_LENGTH = 4;

export default function DeliveryOTPScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, updateOrderStatus } = useOrders();
  const { colors } = theme;
  
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<TextInput[]>([]);

  const order = orders.find(o => o.id === id);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
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

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== OTP_LENGTH) {
      Alert.alert('Invalid OTP', 'Please enter complete OTP');
      return;
    }

    setIsVerifying(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate API verification
    setTimeout(() => {
      // In production, verify against backend
      updateOrderStatus(order.id, 'delivered');
      setIsVerifying(false);
      
      Alert.alert(
        'Delivery Confirmed',
        'Order has been marked as delivered successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  const handleResend = () => {
    setOtp(new Array(OTP_LENGTH).fill(''));
    setTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    
    Alert.alert('OTP Resent', 'New OTP has been sent to customer');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Verify Delivery' }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.primary.green + '20' }]}>
            <Ionicons name="shield-checkmark-outline" size={48} color={colors.primary.green} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Verify Delivery</Text>
          <Text style={styles.subtitle}>
            Enter the {OTP_LENGTH}-digit OTP shared by the customer to confirm delivery
          </Text>

          {/* Order Info */}
          <Card style={styles.orderCard}>
            <Text style={styles.orderLabel}>Order</Text>
            <Text style={styles.orderId}>#{order.id}</Text>
            <Text style={styles.customerName}>{order.customer?.name || 'Customer'}</Text>
          </Card>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => { if (ref) inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  { borderColor: digit ? colors.primary.green : colors.border.light },
                ]}
                value={digit}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend Timer */}
          <View style={styles.resendContainer}>
            {canResend ? (
              <Button variant="outline" onPress={handleResend}>
                <Text style={{ color: colors.primary.green }}>Resend OTP</Text>
              </Button>
            ) : (
              <Text style={styles.timerText}>
                Resend OTP in <Text style={styles.timerValue}>{timer}s</Text>
              </Text>
            )}
          </View>

          {/* Verify Button */}
          <Button
            variant="primary"
            onPress={handleVerify}
            disabled={otp.some(d => !d) || isVerifying}
          >
            {isVerifying ? (
              <Text style={{ color: '#FFF' }}>Verifying...</Text>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={{ color: '#FFF', marginLeft: 8 }}>Verify & Complete</Text>
              </>
            )}
          </Button>

          {/* Help Text */}
          <Text style={styles.helpText}>
            Ask the customer to share the OTP displayed on their app
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  orderCard: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  orderLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    color: '#333',
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  otpInputFilled: {
    backgroundColor: '#F5F5F5',
  },
  resendContainer: {
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: '#666',
  },
  timerValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
});
