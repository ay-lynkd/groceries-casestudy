/**
 * Help & Support Screen
 * FAQ, guides, and support contact
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { Text } from '@/components/common';
import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'Orders',
    question: 'How do I accept a new order?',
    answer: 'When you receive a new order notification, tap on it to view details. Review the items and customer information, then tap "Accept Order" to confirm. You have 15 minutes to accept before it expires.',
  },
  {
    id: '2',
    category: 'Orders',
    question: 'What if an item is out of stock?',
    answer: 'If an item is unavailable, tap "Mark Unavailable" on the order details page. You can suggest alternatives to the customer or proceed with the remaining items. The customer will be notified automatically.',
  },
  {
    id: '3',
    category: 'Payments',
    question: 'When will I receive my payout?',
    answer: 'Payouts are processed within 24-48 hours of request. For instant transfers, use the "Instant Payout" feature (fees may apply). Regular payouts are free and credited directly to your registered bank account.',
  },
  {
    id: '4',
    category: 'Payments',
    question: 'How are delivery fees calculated?',
    answer: 'Delivery fees are calculated based on distance (₹10/km) with a minimum of ₹20. Orders above ₹500 qualify for free delivery. You can set your own delivery radius and fees in Store Settings.',
  },
  {
    id: '5',
    category: 'Products',
    question: 'How do I add a new product?',
    answer: 'Go to Store tab → Tap "+" → Fill product details (name, price, stock) → Upload images → Set category → Save. Products are live immediately and visible to customers.',
  },
  {
    id: '6',
    category: 'Products',
    question: 'Can I set different prices for different customers?',
    answer: 'Yes! You can create customer segments (VIP, Regular, etc.) and set tiered pricing. Go to Settings → Pricing Tiers to configure special rates for different customer groups.',
  },
  {
    id: '7',
    category: 'Account',
    question: 'How do I update my bank details?',
    answer: 'Go to Profile → Wallet → Bank Accounts → Add/Edit. For security, changes require OTP verification. New bank accounts may take 24 hours to be verified before use.',
  },
  {
    id: '8',
    category: 'Account',
    question: 'What documents are required for verification?',
    answer: 'You need: 1) ID Proof (PAN/Aadhaar), 2) Address Proof (Utility Bill), 3) Business License (GST/Trade License), 4) Bank Account Details. Upload in Profile → Verification.',
  },
];

const CATEGORIES = ['All', 'Orders', 'Payments', 'Products', 'Account', 'Delivery'];

const SUPPORT_CHANNELS = [
  { icon: 'chatbubble-ellipses-outline', title: 'Live Chat', subtitle: 'Avg response: 2 mins', color: theme.colors.status.success, action: 'chat' },
  { icon: 'call-outline', title: 'Call Support', subtitle: '24x7 Helpline', color: theme.colors.status.info, action: 'call' },
  { icon: 'mail-outline', title: 'Email Us', subtitle: 'support@kirana.com', color: theme.colors.primary.orange, action: 'email' },
  { icon: 'logo-whatsapp', title: 'WhatsApp', subtitle: 'Quick queries', color: theme.colors.status.success, action: 'whatsapp' },
];

export default function HelpScreen() {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSupportAction = (action: string) => {
    switch (action) {
      case 'call':
        Linking.openURL('tel:+919876543210');
        break;
      case 'email':
        Linking.openURL('mailto:support@kirana.com');
        break;
      case 'whatsapp':
        Linking.openURL('https://wa.me/919876543210');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Help & Support' }} />
      <ScrollView 
        style={[styles.container, { paddingTop: insets.top }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + theme.spacing.lg }}
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Ionicons name="search-outline" size={20} color={theme.colors.text.secondary} />
            <TextInput
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchText}
            />
          </View>
        </View>

        {/* Support Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.channelsGrid}>
            {SUPPORT_CHANNELS.map((channel, index) => (
              <TouchableOpacity
                key={index}
                style={styles.channelCard}
                onPress={() => handleSupportAction(channel.action)}
              >
                <View style={[styles.channelIcon, { backgroundColor: channel.color + '20' }]}>
                  <Ionicons name={channel.icon as any} size={24} color={channel.color} />
                </View>
                <Text style={styles.channelTitle}>{channel.title}</Text>
                <Text style={styles.channelSubtitle}>{channel.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Guides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Guides</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { icon: 'cube-outline', title: 'Adding Products', color: theme.colors.status.success },
              { icon: 'bicycle-outline', title: 'Managing Delivery', color: theme.colors.status.info },
              { icon: 'cash-outline', title: 'Understanding Payouts', color: theme.colors.primary.orange },
              { icon: 'star-outline', title: 'Getting Reviews', color: theme.colors.primary.purple },
              { icon: 'trending-up-outline', title: 'Boosting Sales', color: theme.colors.status.error },
            ].map((guide, index) => (
              <TouchableOpacity key={index} style={styles.guideCard}>
                <View style={[styles.guideIcon, { backgroundColor: guide.color + '20' }]}>
                  <Ionicons name={guide.icon as any} size={28} color={guide.color} />
                </View>
                <Text style={styles.guideTitle}>{guide.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* FAQ List */}
          {filteredFAQs.map(faq => (
            <Card key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
              >
                <View style={styles.faqCategoryBadge}>
                  <Text style={styles.faqCategoryText}>{faq.category}</Text>
                </View>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons 
                  name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={theme.colors.text.secondary} 
                />
              </TouchableOpacity>
              
              {expandedFAQ === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  <View style={styles.faqActions}>
                    <TouchableOpacity style={styles.faqAction}>
                      <Ionicons name="thumbs-up-outline" size={16} color={theme.colors.text.secondary} />
                      <Text style={styles.faqActionText}>Helpful</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.faqAction}>
                      <Ionicons name="thumbs-down-outline" size={16} color={theme.colors.text.secondary} />
                      <Text style={styles.faqActionText}>Not Helpful</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Card>
          ))}

          {filteredFAQs.length === 0 && (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color={theme.colors.border.medium} />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>Try different keywords or category</Text>
            </View>
          )}
        </View>

        {/* Video Tutorials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Tutorials</Text>
          <TouchableOpacity style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <Ionicons name="play-circle" size={48} color="#FFF" />
              <View style={styles.videoDuration}>
                <Text style={styles.videoDurationText}>5:32</Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>Complete Store Setup Guide</Text>
              <Text style={styles.videoDesc}>Learn how to set up your store in 5 minutes</Text>
              <View style={styles.videoStats}>
                <Ionicons name="eye-outline" size={14} color={theme.colors.text.secondary} />
                <Text style={styles.videoStatsText}>12.5K views</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <Ionicons name="play-circle" size={48} color="#FFF" />
              <View style={styles.videoDuration}>
                <Text style={styles.videoDurationText}>3:45</Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>Order Management Tips</Text>
              <Text style={styles.videoDesc}>Best practices for handling orders efficiently</Text>
              <View style={styles.videoStats}>
                <Ionicons name="eye-outline" size={14} color={theme.colors.text.secondary} />
                <Text style={styles.videoStatsText}>8.2K views</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Still need help?</Text>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerButtonText}>Create Support Ticket</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  searchText: {
    flex: 1,
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  channelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  channelCard: {
    width: '47%',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  channelIcon: {
    width: theme.spacing.xxl,
    height: theme.spacing.xxl,
    borderRadius: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  channelTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs / 2,
  },
  channelSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  guideCard: {
    width: 120,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    alignItems: 'center',
  },
  guideIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  guideTitle: {
    fontSize: theme.typography.fontSize.sm - 1,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
  categoryScroll: {
    marginBottom: theme.spacing.md,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.border.light,
    marginRight: theme.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.status.success,
  },
  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  categoryTextActive: {
    color: theme.colors.background.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  faqCard: {
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  faqHeader: {
    padding: theme.spacing.md,
  },
  faqCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.badge.delivered,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm / 2,
    marginBottom: theme.spacing.sm,
  },
  faqCategoryText: {
    fontSize: theme.typography.fontSize.xs - 1,
    color: theme.colors.status.info,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  faqQuestion: {
    fontSize: theme.typography.fontSize.base - 1,
    fontWeight: theme.typography.fontWeight.semibold,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  faqAnswer: {
    padding: theme.spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background.secondary,
  },
  faqAnswerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  faqActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  faqAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  faqActionText: {
    fontSize: theme.typography.fontSize.sm - 1,
    color: theme.colors.text.secondary,
  },
  noResults: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  noResultsText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginTop: theme.spacing.md,
  },
  noResultsSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  videoThumbnail: {
    width: 120,
    height: 90,
    backgroundColor: theme.colors.text.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoDuration: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: theme.spacing.xs + 2,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm / 2,
  },
  videoDurationText: {
    color: theme.colors.background.primary,
    fontSize: theme.typography.fontSize.xs - 1,
  },
  videoInfo: {
    flex: 1,
    padding: theme.spacing.md,
  },
  videoTitle: {
    fontSize: theme.typography.fontSize.base - 1,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  videoDesc: {
    fontSize: theme.typography.fontSize.sm - 1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  videoStatsText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  footer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  footerButton: {
    backgroundColor: theme.colors.status.success,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.xl,
  },
  footerButtonText: {
    color: theme.colors.background.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
