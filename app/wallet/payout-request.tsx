/**
 * Payout Request Screen
 * Request withdrawal from wallet balance
 */

import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency } from '@/utils/formatters';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000];

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  isDefault: boolean;
}

const MOCK_BANKS: BankAccount[] = [
  {
    id: '1',
    bankName: 'State Bank of India',
    accountNumber: '****1234',
    ifscCode: 'SBIN0001234',
    isDefault: true,
  },
  {
    id: '2',
    bankName: 'HDFC Bank',
    accountNumber: '****5678',
    ifscCode: 'HDFC0005678',
    isDefault: false,
  },
];

export default function PayoutRequestScreen() {
  const { availableBalance } = useWallet();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState<string>(MOCK_BANKS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [newBank, setNewBank] = useState({ bankName: '', accountNumber: '', ifscCode: '' });
  const [banks, setBanks] = useState<BankAccount[]>(MOCK_BANKS);
  const minPayout = 100;
  const maxPayout = availableBalance;

  const handleAddBank = () => {
    if (!newBank.bankName || !newBank.accountNumber || !newBank.ifscCode) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const bank: BankAccount = {
      id: Date.now().toString(),
      bankName: newBank.bankName,
      accountNumber: `****${newBank.accountNumber.slice(-4)}`,
      ifscCode: newBank.ifscCode,
      isDefault: false,
    };
    setBanks([...banks, bank]);
    setSelectedBank(bank.id);
    setNewBank({ bankName: '', accountNumber: '', ifscCode: '' });
    setShowAddBankModal(false);
    Alert.alert('Success', 'Bank account added successfully!');
  };

  const handleAmountSelect = (preset: number) => {
    setAmount(preset.toString());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCustomAmount = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const handleSubmit = async () => {
    const payoutAmount = parseFloat(amount);

    if (!payoutAmount || payoutAmount < minPayout) {
      Alert.alert('Invalid Amount', `Minimum payout amount is ${formatCurrency(minPayout)}`);
      return;
    }

    if (payoutAmount > maxPayout) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough balance for this payout');
      return;
    }

    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Payout Requested',
        `Your payout of ${formatCurrency(payoutAmount)} has been requested. It will be processed within 24-48 hours.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 1500);
  };

  const selectedBankData = MOCK_BANKS.find(b => b.id === selectedBank);

  return (
    <>
      <Stack.Screen options={{ title: 'Request Payout' }} />
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
        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount} numberOfLines={1} adjustsFontSizeToFit>{formatCurrency(availableBalance)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Min Payout</Text>
              <Text style={styles.balanceItemValue}>{formatCurrency(minPayout)}</Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Processing</Text>
              <Text style={styles.balanceItemValue}>24-48 hrs</Text>
            </View>
          </View>
        </Card>

        {/* Amount Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Amount</Text>
          
          <View style={styles.presetGrid}>
            {PRESET_AMOUNTS.map(preset => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetButton,
                  amount === preset.toString() && styles.presetButtonActive,
                  preset > availableBalance && styles.presetButtonDisabled,
                ]}
                onPress={() => preset <= availableBalance && handleAmountSelect(preset)}
                disabled={preset > availableBalance}
              >
                <Text style={[
                  styles.presetText,
                  amount === preset.toString() && styles.presetTextActive,
                  preset > availableBalance && styles.presetTextDisabled,
                ]}>
                  {formatCurrency(preset)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.orText}>OR</Text>

          <View style={styles.customAmountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <View style={styles.customInput}>
              <Text style={styles.customAmountText}>
                {amount || 'Enter amount'}
              </Text>
            </View>
          </View>

          {amount && (
            <View style={styles.calculationCard}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Amount</Text>
                <Text style={styles.calcValue}>{formatCurrency(parseFloat(amount) || 0)}</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Processing Fee (0%)</Text>
                <Text style={styles.calcValue}>{formatCurrency(0)}</Text>
              </View>
              <View style={[styles.calcRow, styles.calcTotal]}>
                <Text style={styles.calcTotalLabel}>You'll Receive</Text>
                <Text style={styles.calcTotalValue}>{formatCurrency(parseFloat(amount) || 0)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Bank Account Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transfer To</Text>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowAddBankModal(true);
              }}
            >
              <Text style={styles.addNewText}>+ Add New</Text>
            </TouchableOpacity>
          </View>

          {banks.map(bank => (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.bankCard,
                selectedBank === bank.id && styles.bankCardSelected,
              ]}
              onPress={() => {
                setSelectedBank(bank.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View style={styles.bankIcon}>
                <Ionicons name="business-outline" size={24} color={theme.colors.status.success} />
              </View>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{bank.bankName}</Text>
                <Text style={styles.bankDetails}>
                  A/C: {bank.accountNumber} • IFSC: {bank.ifscCode}
                </Text>
              </View>
              {selectedBank === bank.id && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.status.success} />
              )}
              {bank.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={theme.colors.status.info} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Payout Schedule</Text>
            <Text style={styles.infoText}>
              • Request before 3 PM for same-day processing{'\n'}
              • Requests after 3 PM processed next business day{'\n'}
              • Funds credited within 24-48 hours
            </Text>
          </View>
        </Card>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Button
            variant="primary"
            onPress={handleSubmit}
            disabled={!amount || parseFloat(amount) < minPayout || isSubmitting}
          >
            {isSubmitting ? (
              <Text style={{ color: theme.colors.background.primary }}>Processing...</Text>
            ) : (
              <Text style={{ color: theme.colors.background.primary }}>
                Request Payout {amount && `(${formatCurrency(parseFloat(amount))})`}
              </Text>
            )}
          </Button>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Add Bank Modal */}
      <Modal
        visible={showAddBankModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddBankModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bank Account</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bank Name</Text>
              <TextInput
                style={styles.input}
                value={newBank.bankName}
                onChangeText={(text) => setNewBank({ ...newBank, bankName: text })}
                placeholder="Enter bank name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Number</Text>
              <TextInput
                style={styles.input}
                value={newBank.accountNumber}
                onChangeText={(text) => setNewBank({ ...newBank, accountNumber: text })}
                placeholder="Enter account number"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                value={newBank.ifscCode}
                onChangeText={(text) => setNewBank({ ...newBank, ifscCode: text })}
                placeholder="Enter IFSC code"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                variant="outline"
                onPress={() => setShowAddBankModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={handleAddBank}
                style={styles.modalButton}
              >
                Add Bank
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  balanceCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.status.success,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.background.primary + 'CC',
    marginBottom: theme.spacing.sm,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background.primary,
    marginBottom: theme.spacing.md,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.background.primary + '4D',
  },
  balanceItemLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.background.primary + 'B3',
  },
  balanceItemValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.background.primary,
    marginTop: 2,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  addNewText: {
    color: theme.colors.status.success,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  presetButton: {
    width: '30%',
    minHeight: 48,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButtonActive: {
    backgroundColor: theme.colors.status.success + '15',
    borderColor: theme.colors.status.success,
  },
  presetButtonDisabled: {
    opacity: 0.5,
  },
  presetText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  presetTextActive: {
    color: theme.colors.status.success,
  },
  presetTextDisabled: {
    color: theme.colors.text.light,
  },
  orText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginVertical: theme.spacing.md,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    minHeight: 60,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.status.success,
    marginRight: theme.spacing.sm,
  },
  customInput: {
    flex: 1,
  },
  customAmountText: {
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  calculationCard: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  calcLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  calcValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  calcTotal: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  calcTotalLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  calcTotalValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.status.success,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    minHeight: 72,
  },
  bankCardSelected: {
    borderColor: theme.colors.status.success,
    backgroundColor: theme.colors.status.success + '08',
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.status.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  bankName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 4,
    color: theme.colors.text.primary,
  },
  bankDetails: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  defaultBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.status.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    color: theme.colors.background.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  infoCard: {
    flexDirection: 'row',
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.status.info + '15',
  },
  infoContent: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.status.info,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.status.info,
    lineHeight: 20,
  },
  footer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.primary,
    minHeight: 48,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
  },
});
