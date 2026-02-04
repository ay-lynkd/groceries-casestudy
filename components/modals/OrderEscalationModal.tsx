import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface OrderEscalationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onEscalate: (reason: string, priority: 'low' | 'medium' | 'high' | 'critical') => void;
  orderId?: string;
}

export const OrderEscalationModal: React.FC<OrderEscalationModalProps> = ({
  isVisible,
  onClose,
  onEscalate,
  orderId,
}) => {
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [customReason, setCustomReason] = useState('');

  if (!isVisible) {
    return null;
  }

  const handleEscalate = () => {
    const escalationReason = reason === 'other' ? customReason : reason;
    onEscalate(escalationReason, priority);
    setReason('');
    setCustomReason('');
    setPriority('medium');
  };

  const escalationOptions = [
    { id: 'delay', label: 'Delivery Delay', icon: 'time' },
    { id: 'damaged', label: 'Damaged Items', icon: 'alert' },
    { id: 'missing', label: 'Missing Items', icon: 'close-circle' },
    { id: 'quality', label: 'Quality Issues', icon: 'star-half' },
    { id: 'wrong_item', label: 'Wrong Item Delivered', icon: 'swap' },
    { id: 'other', label: 'Other', icon: 'help-circle' },
  ];

  const priorityOptions = [
    { id: 'low', label: 'Low', color: theme.colors.status.info },
    { id: 'medium', label: 'Medium', color: theme.colors.status.warning },
    { id: 'high', label: 'High', color: theme.colors.status.error },
    { id: 'critical', label: 'Critical', color: '#D32F2F' },
  ];

  return (
    <View style={styles.overlay}>
      <Card style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Escalate Order Issue</Text>
          <Text style={styles.subtitle}>Order ID: {orderId || 'N/A'}</Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Select Issue Type</Text>
          <View style={styles.optionsContainer}>
            {escalationOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.option,
                  reason === option.id && styles.selectedOption,
                ]}
                onPress={() => setReason(option.id)}
              >
                <View style={[
                  styles.optionIcon,
                  reason === option.id && styles.selectedOptionIcon,
                ]}>
                  <Ionicons 
                    name={option.icon as any} 
                    size={20} 
                    color={reason === option.id ? theme.colors.primary.green : theme.colors.text.secondary} 
                  />
                </View>
                <Text style={[
                  styles.optionText,
                  reason === option.id && styles.selectedOptionText,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {reason === 'other' && (
            <View style={styles.customReasonContainer}>
              <Text style={styles.sectionTitle}>Describe the Issue</Text>
              <View style={styles.multilineInputContainer}>
                <TextInput
                  style={styles.multilineInput}
                  placeholder="Enter issue details here..."
                  value={customReason}
                  onChangeText={setCustomReason}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor={theme.colors.text.light}
                />
              </View>
            </View>
          )}

          <Text style={styles.sectionTitle}>Priority Level</Text>
          <View style={styles.priorityContainer}>
            {priorityOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.priorityOption,
                  priority === opt.id && styles.selectedPriority,
                  { borderColor: opt.color },
                ]}
                onPress={() => setPriority(opt.id as any)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === opt.id && { color: opt.color }
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <View style={styles.multilineInputContainer}>
            <TextInput
              style={styles.multilineInput}
              placeholder="Any additional details..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <Button variant="outline" size="md" onPress={onClose} style={styles.cancelButton}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onPress={handleEscalate} 
            style={styles.confirmButton}
            disabled={!reason || (reason === 'other' && !customReason)}
          >
            Escalate Issue
          </Button>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: 0,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  content: {
    padding: theme.spacing.lg,
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  option: {
    flex: 1,
    minWidth: 120,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    borderColor: theme.colors.primary.green,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  selectedOptionIcon: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  optionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  customReasonContainer: {
    marginBottom: theme.spacing.lg,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  priorityOption: {
    flex: 1,
    minWidth: 70,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPriority: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  priorityText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  multilineInputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
  },
  multilineInput: {
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    minHeight: 100,
  },
});