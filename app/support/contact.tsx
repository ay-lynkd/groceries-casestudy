/**
 * Support Contact Screen
 * Multiple channels for seller support
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface SupportChannel {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
  color: string;
  available?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I update my store information?',
    answer: 'Go to Store Settings > Edit Profile. You can update your store name, address, contact details, and working hours from there.',
  },
  {
    id: '2',
    question: 'When will I receive my payouts?',
    answer: 'Payouts are processed within 24-48 hours of a successful delivery. You can check your payout status in the Wallet section.',
  },
  {
    id: '3',
    question: 'How do I handle customer returns?',
    answer: 'You can manage returns from the Orders section. Tap on the order and select "Process Return" to initiate the return workflow.',
  },
  {
    id: '4',
    question: 'What documents are required for verification?',
    answer: 'You need PAN card, GST registration, bank account details, and a valid ID proof. Upload these in the Store Setup section.',
  },
];

export default function SupportContactScreen() {
  const insets = useSafeAreaInsets();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('tel:+919876543210');
  };

  const handleEmail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('mailto:support@kiranastore.com');
  };

  const handleWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://wa.me/919876543210');
  };

  const handleChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/messages');
  };

  const supportChannels: SupportChannel[] = [
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: 'chatbubble-ellipses',
      action: handleChat,
      color: theme.colors.status.success,
      available: 'Available 24/7',
    },
    {
      id: 'call',
      title: 'Phone Support',
      description: '+91 98765 43210',
      icon: 'call',
      action: handleCall,
      color: theme.colors.status.info,
      available: '9 AM - 9 PM',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Quick responses on WhatsApp',
      icon: 'logo-whatsapp',
      action: handleWhatsApp,
      color: theme.colors.status.success,
      available: 'Available 24/7',
    },
    {
      id: 'email',
      title: 'Email Us',
      description: 'support@kiranastore.com',
      icon: 'mail',
      action: handleEmail,
      color: theme.colors.primary.orange,
      available: 'Response in 24h',
    },
  ];

  const handleSubmitTicket = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setShowContactForm(false);
      setFormData({ subject: '', message: '', category: 'general' });
      Alert.alert(
        'Ticket Submitted',
        'We\'ve received your message and will get back to you within 24 hours.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const filteredFAQs = FAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Help & Support',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={theme.typography.fontSize.lg + 4} color={theme.colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Ionicons name="alert-circle" size={theme.typography.fontSize.lg + 4} color={theme.colors.status.error} />
          <Text variant="body" style={styles.emergencyText}>
            For urgent issues, please call our 24/7 hotline
          </Text>
        </View>

        {/* Support Channels */}
        <View style={styles.section}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Contact Us
          </Text>
          <View style={styles.channelsGrid}>
            {supportChannels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={styles.channelCard}
                onPress={channel.action}
              >
                <View
                  style={[
                    styles.channelIcon,
                    { backgroundColor: channel.color + '15' },
                  ]}
                >
                  <Ionicons name={channel.icon} size={theme.typography.fontSize.xl} color={channel.color} />
                </View>
                <Text variant="body" fontWeight="semibold" style={styles.channelTitle}>
                  {channel.title}
                </Text>
                <Text variant="caption" color={theme.colors.text.secondary} style={{ textAlign: 'center' }}>
                  {channel.description}
                </Text>
                {channel.available && (
                  <View style={[styles.availabilityBadge, { backgroundColor: channel.color + '15' }]}>
                    <Text variant="caption" fontWeight="semibold" color={channel.color}>
                      {channel.available}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Ticket Button */}
        <View style={styles.section}>
          <Card style={styles.ticketCard}>
            <View style={styles.ticketContent}>
              <View style={styles.ticketIconContainer}>
                <Ionicons
                  name="ticket-outline"
                  size={theme.typography.fontSize['2xl']}
                  color={theme.colors.primary.purple}
                />
              </View>
              <View style={styles.ticketText}>
                <Text variant="h3" fontWeight="bold">
                  Submit a Ticket
                </Text>
                <Text variant="body" color={theme.colors.text.secondary}>
                  Create a support ticket for complex issues
                </Text>
              </View>
            </View>
            <Button
              variant="primary"
              size="md"
              onPress={() => setShowContactForm(true)}
              style={styles.ticketButton}
            >
              Create Ticket
            </Button>
          </Card>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
            Frequently Asked Questions
          </Text>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={theme.typography.fontSize.lg}
              color={theme.colors.text.light}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search FAQs..."
              placeholderTextColor={theme.colors.text.light}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* FAQ List */}
          <View style={styles.faqList}>
            {filteredFAQs.map((faq) => (
              <TouchableOpacity
                key={faq.id}
                style={styles.faqItem}
                onPress={() => {
                  setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View style={styles.faqHeader}>
                  <Text variant="body" fontWeight="semibold" style={styles.faqQuestion}>
                    {faq.question}
                  </Text>
                  <Ionicons
                    name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                    size={theme.typography.fontSize.lg}
                    color={theme.colors.text.light}
                  />
                </View>
                {expandedFAQ === faq.id && (
                  <Text
                    variant="body"
                    color={theme.colors.text.secondary}
                    style={styles.faqAnswer}
                  >
                    {faq.answer}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {filteredFAQs.length === 0 && (
            <View style={styles.noResults}>
              <Ionicons
                name="search-outline"
                size={theme.spacing.xxl}
                color={theme.colors.text.light}
              />
              <Text variant="body" color={theme.colors.text.secondary}>
                No FAQs found matching your search
              </Text>
            </View>
          )}
        </View>

        {/* Contact Form Modal */}
        {showContactForm && (
          <View style={styles.formOverlay}>
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <Text variant="h3" fontWeight="bold">
                  Submit Support Ticket
                </Text>
                <TouchableOpacity onPress={() => setShowContactForm(false)}>
                  <Ionicons name="close" size={theme.typography.fontSize.xl} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formContent}>
                <Text variant="body" fontWeight="semibold" style={styles.label}>
                  Category
                </Text>
                <View style={styles.categoryContainer}>
                  {['general', 'technical', 'billing', 'account'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        formData.category === cat && styles.categoryChipActive,
                      ]}
                      onPress={() => setFormData({ ...formData, category: cat })}
                    >
                      <Text
                        variant="caption"
                        fontWeight={formData.category === cat ? 'semibold' : 'regular'}
                        color={
                          formData.category === cat
                            ? theme.colors.background.primary
                            : theme.colors.text.secondary
                        }
                        style={{ textTransform: 'capitalize' }}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text variant="body" fontWeight="semibold" style={styles.label}>
                  Subject
                </Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Brief description of your issue"
                  placeholderTextColor={theme.colors.text.light}
                  value={formData.subject}
                  onChangeText={(text) => setFormData({ ...formData, subject: text })}
                />

                <Text variant="body" fontWeight="semibold" style={styles.label}>
                  Message
                </Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="Describe your issue in detail..."
                  placeholderTextColor={theme.colors.text.light}
                  value={formData.message}
                  onChangeText={(text) => setFormData({ ...formData, message: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </ScrollView>

              <View style={styles.formFooter}>
                <Button
                  variant="outline"
                  size="lg"
                  onPress={() => setShowContactForm(false)}
                  style={styles.formButton}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={handleSubmitTicket}
                  disabled={submitting}
                  style={styles.formButton}
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.status.error + '10',
    padding: theme.spacing.md,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  emergencyText: {
    flex: 1,
    color: theme.colors.status.error,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  channelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  channelCard: {
    width: '47%',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  channelIcon: {
    width: theme.spacing.xl + 8,
    height: theme.spacing.xl + 8,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  channelTitle: {
    marginBottom: theme.spacing.xs,
  },
  availabilityBadge: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs - 2,
    borderRadius: theme.borderRadius.full,
  },
  ticketCard: {
    padding: theme.spacing.lg,
  },
  ticketContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  ticketIconContainer: {
    width: theme.spacing.xl + 8,
    height: theme.spacing.xl + 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.purple + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  ticketText: {
    flex: 1,
  },
  ticketButton: {
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md - 4,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  faqList: {
    gap: theme.spacing.sm,
  },
  faqItem: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  faqAnswer: {
    marginTop: theme.spacing.sm,
    lineHeight: theme.typography.fontSize.base + 4,
  },
  noResults: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '80%',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  formContent: {
    padding: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.tertiary,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.status.success,
  },
  formInput: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  formTextArea: {
    minHeight: theme.spacing.xxl * 2,
    textAlignVertical: 'top',
  },
  formFooter: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  formButton: {
    flex: 1,
  },
});
