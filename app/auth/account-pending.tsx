/**
 * Account Pending Screen
 * Shown while seller account is under review
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'in-review';
  icon: keyof typeof Ionicons.glyphMap;
}

const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: '1',
    title: 'Business Information',
    description: 'Company details and registration',
    status: 'completed',
    icon: 'business-outline',
  },
  {
    id: '2',
    title: 'Document Upload',
    description: 'PAN, GST, and bank documents',
    status: 'completed',
    icon: 'document-text-outline',
  },
  {
    id: '3',
    title: 'Verification Review',
    description: 'Our team is reviewing your documents',
    status: 'in-review',
    icon: 'shield-checkmark-outline',
  },
  {
    id: '4',
    title: 'Account Activation',
    description: 'Start selling on the platform',
    status: 'pending',
    icon: 'checkmark-circle-outline',
  },
];

export default function AccountPendingScreen() {
  const handleContactSupport = () => {
    router.push('/support/contact');
  };

  const handleViewStatus = () => {
    // Could refresh status from API
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Status Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="time-outline"
                size={theme.spacing.xxl + 24}
                color={theme.colors.primary.orange}
              />
            </View>
            <View style={styles.statusBadge}>
              <Text
                variant="caption"
                fontWeight="bold"
                color={theme.colors.primary.orange}
              >
                UNDER REVIEW
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text
            variant="h2"
            fontWeight="bold"
            style={[styles.title, { textAlign: 'center' }]}
          >
            Account Verification in Progress
          </Text>

          <Text
            variant="body"
            color={theme.colors.text.secondary}
            style={[styles.subtitle, { textAlign: 'center' }]}
          >
            Thank you for registering! Your account is being reviewed by our team.
            This usually takes 24-48 hours.
          </Text>

          {/* Progress Card */}
          <Card style={styles.progressCard}>
            <Text
              variant="h3"
              fontWeight="bold"
              style={styles.progressTitle}
            >
              Verification Progress
            </Text>

            <View style={styles.stepsContainer}>
              {VERIFICATION_STEPS.map((step, index) => (
                <View key={step.id} style={styles.stepRow}>
                  <View style={styles.stepLeft}>
                    <View
                      style={[
                        styles.stepIcon,
                        step.status === 'completed' && styles.stepIconCompleted,
                        step.status === 'in-review' && styles.stepIconInReview,
                      ]}
                    >
                      <Ionicons
                        name={step.icon}
                        size={theme.typography.fontSize.lg}
                        color={
                          step.status === 'completed'
                            ? theme.colors.background.primary
                            : step.status === 'in-review'
                            ? theme.colors.primary.orange
                            : theme.colors.text.light
                        }
                      />
                    </View>
                    {index < VERIFICATION_STEPS.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          step.status === 'completed' && styles.stepLineCompleted,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <Text
                        variant="body"
                        fontWeight="semibold"
                        color={
                          step.status === 'pending'
                            ? theme.colors.text.light
                            : theme.colors.text.primary
                        }
                      >
                        {step.title}
                      </Text>
                      <StatusBadge status={step.status} />
                    </View>
                    <Text
                      variant="caption"
                      color={theme.colors.text.secondary}
                    >
                      {step.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* Info Cards */}
          <View style={styles.infoGrid}>
            <Card style={styles.infoCard}>
              <Ionicons
                name="time-outline"
                size={theme.typography.fontSize['2xl']}
                color={theme.colors.status.info}
                style={styles.infoIcon}
              />
              <Text variant="h3" fontWeight="bold">
                24-48h
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                Average Review Time
              </Text>
            </Card>

            <Card style={styles.infoCard}>
              <Ionicons
                name="mail-outline"
                size={theme.typography.fontSize['2xl']}
                color={theme.colors.status.success}
                style={styles.infoIcon}
              />
              <Text variant="h3" fontWeight="bold">
                Email
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                Notification Sent
              </Text>
            </Card>
          </View>

          {/* What Happens Next */}
          <Card style={styles.nextCard}>
            <Text
              variant="h3"
              fontWeight="bold"
              style={styles.nextTitle}
            >
              What Happens Next?
            </Text>
            
            <View style={styles.nextList}>
              <NextItem
                icon="mail-unread-outline"
                text="You'll receive an email once your account is approved"
              />
              <NextItem
                icon="storefront-outline"
                text="Set up your store and add your first products"
              />
              <NextItem
                icon="card-outline"
                text="Configure your payment and withdrawal settings"
              />
              <NextItem
                icon="rocket-outline"
                text="Start selling and growing your business!"
              />
            </View>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              variant="outline"
              size="lg"
              onPress={handleViewStatus}
              style={styles.actionButton}
            >
              <Ionicons
                name="refresh-outline"
                size={theme.typography.fontSize.lg}
                color={theme.colors.text.primary}
                style={{ marginRight: theme.spacing.xs }}
              />
              Check Status
            </Button>

            <Button
              variant="primary"
              size="lg"
              onPress={handleContactSupport}
              style={styles.actionButton}
            >
              <Ionicons
                name="headset-outline"
                size={theme.typography.fontSize.lg}
                color={theme.colors.background.primary}
                style={{ marginRight: theme.spacing.xs }}
              />
              Contact Support
            </Button>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton}>
            <Text
              variant="body"
              color={theme.colors.status.error}
              fontWeight="semibold"
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

function StatusBadge({ status }: { status: VerificationStep['status'] }) {
  const config = {
    completed: {
      bg: theme.colors.status.success + '15',
      color: theme.colors.status.success,
      text: 'Done',
    },
    'in-review': {
      bg: theme.colors.primary.orange + '15',
      color: theme.colors.primary.orange,
      text: 'Reviewing',
    },
    pending: {
      bg: theme.colors.background.tertiary,
      color: theme.colors.text.light,
      text: 'Pending',
    },
  };

  const { bg, color, text } = config[status];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text variant="caption" fontWeight="semibold" color={color}>
        {text}
      </Text>
    </View>
  );
}

function NextItem({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.nextItem}>
      <Ionicons
        name={icon}
        size={theme.typography.fontSize.lg + 2}
        color={theme.colors.status.success}
        style={styles.nextItemIcon}
      />
      <Text variant="body" style={styles.nextItemText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconContainer: {
    width: theme.spacing.xxl * 2 + 16,
    height: theme.spacing.xxl * 2 + 16,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.orange + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.orange + '15',
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.fontSize.base + 6,
  },
  progressCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  progressTitle: {
    marginBottom: theme.spacing.lg,
  },
  stepsContainer: {
    gap: theme.spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  stepLeft: {
    alignItems: 'center',
    width: theme.spacing.xl,
  },
  stepIcon: {
    width: theme.spacing.xl,
    height: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepIconCompleted: {
    backgroundColor: theme.colors.status.success,
  },
  stepIconInReview: {
    backgroundColor: theme.colors.primary.orange + '15',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: -theme.spacing.xs,
  },
  stepLineCompleted: {
    backgroundColor: theme.colors.status.success,
  },
  stepContent: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs - 2,
    borderRadius: theme.borderRadius.full,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoCard: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  infoIcon: {
    marginBottom: theme.spacing.xs,
  },
  nextCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  nextTitle: {
    marginBottom: theme.spacing.md,
  },
  nextList: {
    gap: theme.spacing.md,
  },
  nextItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  nextItemIcon: {
    marginTop: theme.spacing.xs - 2,
  },
  nextItemText: {
    flex: 1,
    lineHeight: theme.typography.fontSize.base + 4,
  },
  actions: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    width: '100%',
  },
  logoutButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
});
