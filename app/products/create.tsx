/**
 * Product Creation Wizard
 * Multi-step product creation with image upload, pricing, and inventory
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, ScreenHeader } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useProducts } from '@/contexts/ProductContext';

type Step = 'basic' | 'pricing' | 'inventory' | 'images' | 'review';

interface ProductForm {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  comparePrice: string;
  costPerItem: string;
  sku: string;
  barcode: string;
  quantity: string;
  lowStockAlert: string;
  trackInventory: boolean;
  images: string[];
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
}

const STEPS: { id: Step; title: string; icon: string }[] = [
  { id: 'basic', title: 'Basic', icon: 'cube-outline' },
  { id: 'pricing', title: 'Pricing', icon: 'cash-outline' },
  { id: 'inventory', title: 'Stock', icon: 'archive-outline' },
  { id: 'images', title: 'Images', icon: 'image-outline' },
  { id: 'review', title: 'Review', icon: 'checkmark-circle-outline' },
];

const CATEGORIES = [
  'Groceries',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Beverages',
  'Snacks',
  'Personal Care',
  'Household',
];

export default function ProductWizardScreen() {
  const { addProduct } = useProducts();
  const { colors } = theme;
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    comparePrice: '',
    costPerItem: '',
    sku: '',
    barcode: '',
    quantity: '0',
    lowStockAlert: '10',
    trackInventory: true,
    images: [],
    weight: '',
    dimensions: { length: '', width: '', height: '' },
  });

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const updateForm = (key: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (!validateStep()) return;
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

  const validateStep = () => {
    switch (currentStep) {
      case 'basic':
        if (!form.name.trim()) {
          Alert.alert('Required', 'Product name is required');
          return false;
        }
        if (!form.category) {
          Alert.alert('Required', 'Please select a category');
          return false;
        }
        return true;
      case 'pricing':
        if (!form.price || parseFloat(form.price) <= 0) {
          Alert.alert('Required', 'Please enter a valid price');
          return false;
        }
        return true;
      case 'inventory':
        if (form.trackInventory && (!form.quantity || parseInt(form.quantity) < 0)) {
          Alert.alert('Required', 'Please enter a valid quantity');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      await addProduct({
        name: form.name,
        description: form.description,
        quantity: '1 unit',
        currentPrice: parseFloat(form.price),
        originalPrice: parseFloat(form.comparePrice) || parseFloat(form.price),
        discount: form.comparePrice ? Math.round(((parseFloat(form.comparePrice) - parseFloat(form.price)) / parseFloat(form.comparePrice)) * 100) : 0,
        inStock: parseInt(form.quantity) > 0,
        image: form.images[0],
        images: form.images,
      });

      Alert.alert(
        'Product Created',
        'Your product has been added successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMockImage = () => {
    const mockImages = [
      'https://via.placeholder.com/300/4CAF50/FFFFFF?text=Product+1',
      'https://via.placeholder.com/300/2196F3/FFFFFF?text=Product+2',
      'https://via.placeholder.com/300/FF9800/FFFFFF?text=Product+3',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    updateForm('images', [...form.images, randomImage]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => updateForm('name', text)}
                placeholder="e.g., Organic Basmati Rice 1kg"
                placeholderTextColor={theme.colors.text.light}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      form.category === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => updateForm('category', cat)}
                  >
                    <Text style={form.category === cat ? styles.categoryTextActive : undefined}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.description}
                onChangeText={(text) => updateForm('description', text)}
                placeholder="Describe your product..."
                placeholderTextColor={theme.colors.text.light}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        );

      case 'pricing':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pricing</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Selling Price (₹) *</Text>
              <TextInput
                style={styles.input}
                value={form.price}
                onChangeText={(text) => updateForm('price', text)}
                placeholder="0.00"
                placeholderTextColor={theme.colors.text.light}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Compare at Price (₹)</Text>
              <TextInput
                style={styles.input}
                value={form.comparePrice}
                onChangeText={(text) => updateForm('comparePrice', text)}
                placeholder="Original price (optional)"
                placeholderTextColor={theme.colors.text.light}
                keyboardType="decimal-pad"
              />
              <Text style={styles.hint}>Shows as strikethrough to indicate discount</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cost per Item (₹)</Text>
              <TextInput
                style={styles.input}
                value={form.costPerItem}
                onChangeText={(text) => updateForm('costPerItem', text)}
                placeholder="Your cost (for profit calculation)"
                placeholderTextColor={theme.colors.text.light}
                keyboardType="decimal-pad"
              />
            </View>

            {form.price && form.costPerItem && (
              <Card style={styles.profitCard}>
                <View style={styles.profitRow}>
                  <Text>Profit Margin:</Text>
                  <Text style={styles.profitValue}>
                    ₹{(parseFloat(form.price) - parseFloat(form.costPerItem || '0')).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.profitRow}>
                  <Text>Margin %:</Text>
                  <Text style={styles.profitValue}>
                    {((parseFloat(form.price) - parseFloat(form.costPerItem || '0')) / parseFloat(form.price) * 100).toFixed(1)}%
                  </Text>
                </View>
              </Card>
            )}
          </View>
        );

      case 'inventory':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Inventory Management</Text>
            
            <View style={styles.toggleRow}>
              <Text style={styles.label}>Track Inventory</Text>
              <TouchableOpacity
                style={[styles.toggle, form.trackInventory && styles.toggleActive]}
                onPress={() => updateForm('trackInventory', !form.trackInventory)}
              >
                <View style={[styles.toggleKnob, form.trackInventory && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>

            {form.trackInventory && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Quantity Available *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.quantity}
                    onChangeText={(text) => updateForm('quantity', text)}
                    placeholder="0"
                    placeholderTextColor={theme.colors.text.light}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Low Stock Alert At</Text>
                  <TextInput
                    style={styles.input}
                    value={form.lowStockAlert}
                    onChangeText={(text) => updateForm('lowStockAlert', text)}
                    placeholder="10"
                    placeholderTextColor={theme.colors.text.light}
                    keyboardType="number-pad"
                  />
                  <Text style={styles.hint}>You'll be notified when stock reaches this level</Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>SKU (Stock Keeping Unit)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.sku}
                    onChangeText={(text) => updateForm('sku', text)}
                    placeholder="e.g., RICE-001"
                    placeholderTextColor={theme.colors.text.light}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Barcode (ISBN, UPC, etc.)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.barcode}
                    onChangeText={(text) => updateForm('barcode', text)}
                    placeholder="Scan or enter barcode"
                    placeholderTextColor={theme.colors.text.light}
                    keyboardType="number-pad"
                  />
                </View>
              </>
            )}
          </View>
        );

      case 'images':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Product Images</Text>
            <Text style={styles.stepDescription}>
              Add up to 5 images. First image will be the cover.
            </Text>

            <View style={styles.imageGrid}>
              {form.images.map((img, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: img }} style={styles.productImage} />
                  {index === 0 && (
                    <View style={styles.coverBadge}>
                      <Text style={styles.coverText}>Cover</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.removeImage}
                    onPress={() => {
                      const newImages = form.images.filter((_, i) => i !== index);
                      updateForm('images', newImages);
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color={theme.colors.status.error} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {form.images.length < 5 && (
                <TouchableOpacity style={styles.addImage} onPress={addMockImage}>
                  <Ionicons name="camera-outline" size={32} color={theme.colors.text.secondary} />
                  <Text style={styles.addImageText}>Add Image</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.imageHint}>
              Tip: Use clear, well-lit images on a white background
            </Text>
          </View>
        );

      case 'review':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review Product</Text>
            
            <Card style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                {form.images[0] ? (
                  <Image source={{ uri: form.images[0] }} style={styles.reviewImage} />
                ) : (
                  <View style={styles.reviewImagePlaceholder}>
                    <Ionicons name="image-outline" size={32} color={theme.colors.text.light} />
                  </View>
                )}
                <View style={styles.reviewHeaderText}>
                  <Text style={styles.reviewName}>{form.name || 'Product Name'}</Text>
                  <Text style={styles.reviewCategory}>{form.category}</Text>
                </View>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Price</Text>
                <Text style={styles.reviewValue}>₹{form.price}</Text>
              </View>

              {form.comparePrice && (
                <View style={styles.reviewSection}>
                  <Text style={styles.reviewLabel}>Compare at</Text>
                  <Text style={[styles.reviewValue, styles.strikethrough]}>₹{form.comparePrice}</Text>
                </View>
              )}

              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Stock</Text>
                <Text style={styles.reviewValue}>{form.quantity} units</Text>
              </View>

              {form.trackInventory && (
                <View style={styles.reviewSection}>
                  <Text style={styles.reviewLabel}>Low stock alert</Text>
                  <Text style={styles.reviewValue}>{form.lowStockAlert} units</Text>
                </View>
              )}
            </Card>
          </View>
        );
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Add Product', headerShown: false }} />
      <View style={styles.container}>
        <ScreenHeader 
          title="Add New Product"
          showBack={true}
          onBackPress={handleBack}
          size="medium"
        />

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
        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
          >
            {renderStepContent()}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            {currentStepIndex > 0 && (
              <Button variant="outline" onPress={handleBack}>
                <Text>Back</Text>
              </Button>
            )}
            {currentStep === 'review' ? (
              <Button 
                variant="primary" 
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={{ color: theme.colors.background.primary }}>Creating...</Text>
                ) : (
                  <Text style={{ color: theme.colors.background.primary }}>Create Product</Text>
                )}
              </Button>
            ) : (
              <Button variant="primary" onPress={handleNext}>
                <Text style={{ color: theme.colors.background.primary }}>Continue</Text>
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
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl + 28,
    paddingBottom: 16,
  },
  backButton: {
    padding: theme.spacing.sm,
    width: 40,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: theme.colors.status.success,
  },
  stepLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  stepLabelActive: {
    color: theme.colors.status.success,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.sm / 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary.green,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  stepContent: {
    paddingBottom: 20,
    minHeight: '100%',
  },
  stepTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  stepDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md + 4,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md - 4,
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    minHeight: 48,
  },
  textArea: {
    height: 100,
  },
  hint: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.status.success + '15',
    borderColor: theme.colors.primary.green,
  },
  categoryTextActive: {
    color: theme.colors.primary.green,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  profitCard: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary.green + '15',
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  profitValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: theme.borderRadius.lg - 2,
    backgroundColor: '#E0E0E0',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary.green,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    transform: [{ translateX: 0 }],
  },
  toggleKnobActive: {
    transform: [{ translateX: 22 }],
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md - 4,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  coverBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: theme.colors.primary.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm / 2,
  },
  coverText: {
    color: theme.colors.background.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  addImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  imageHint: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  reviewCard: {
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  reviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  reviewImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewHeaderText: {
    marginLeft: theme.spacing.md - 4,
    flex: 1,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewCategory: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  reviewSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  reviewLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  reviewValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.light,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
