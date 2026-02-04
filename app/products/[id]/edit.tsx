import { Button, Card } from '@/components/primary';
import { ROUTES } from '@/constants';
import { PRODUCT_CATEGORIES, PRODUCT_SUBCATEGORIES, TAX_CLASSES } from '@/constants/productCategories';
import { productsData } from '@/mocks/storeProductsData';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = productsData.find((p) => p.id === id);
  
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [taxClassModalVisible, setTaxClassModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    title: product?.name ?? '',
    brand: product?.sellerDetails ?? 'Himalaya Store',
    sku: '',
    slug: '',
    
    // Description
    shortDescription: product?.description ?? '',
    longDescription: product?.description ?? '',
    
    // Categories
    category: '',
    subCategory: '',
    tags: product?.description ? [product.description] : [],
    
    // Pricing
    regularPrice: product?.originalPrice?.toString() ?? '',
    salePrice: product?.currentPrice?.toString() ?? '',
    costPrice: '',
    taxClass: 'standard',
    
    // Inventory
    stockQuantity: product?.inStock ? '10' : '0',
    lowStockThreshold: '5',
    
    // Other
    productName: product?.name ?? '',
    nutritionalFacts: product?.nutritionalFacts ?? '',
    amount: product?.amount?.toString() ?? '',
    minimumAmount: product?.minimumAmount?.toString() ?? '',
    suggestedAmount: product?.suggestedAmount?.toString() ?? '',
  });

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const handleBack = () => router.back();
  const handleCancel = () => router.back();
  const handleViewProduct = () => router.push(ROUTES.PRODUCT.BY_ID(id) as any);
  
  const setField = (field: string, value: string | string[]) => setFormData((prev) => ({ ...prev, [field]: value }));
  
  const handleSave = () => {
    Alert.alert(
      'Save Changes',
      'Are you sure you want to save the changes to this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          style: 'default',
          onPress: () => {
            // In a real app, this would call an API to save the product
            console.log('Saving product:', formData);
            // Navigate back to the product details screen after saving
            router.push(ROUTES.PRODUCT.BY_ID(id) as any);
          },
        },
      ]
    );
  };

  const renderCategoryModal = () => (
    <TouchableOpacity 
      style={styles.modalOverlay} 
      onPress={() => setCategoryModalVisible(false)}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Category</Text>
          <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalOptionsContainer}>
          {PRODUCT_CATEGORIES.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.modalOption} 
              onPress={() => {
                setField('category', category);
                setCategoryModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );

  const renderSubCategoryModal = () => (
    <TouchableOpacity 
      style={styles.modalOverlay} 
      onPress={() => setSubCategoryModalVisible(false)}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Sub-category</Text>
          <TouchableOpacity onPress={() => setSubCategoryModalVisible(false)}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalOptionsContainer}>
          {PRODUCT_SUBCATEGORIES[formData.category as keyof typeof PRODUCT_SUBCATEGORIES]?.map((subcategory, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.modalOption} 
              onPress={() => {
                setField('subCategory', subcategory);
                setSubCategoryModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>{subcategory}</Text>
            </TouchableOpacity>
          )) || <Text style={styles.modalEmptyText}>Select a category first</Text>}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );

  const renderTaxClassModal = () => (
    <TouchableOpacity 
      style={styles.modalOverlay} 
      onPress={() => setTaxClassModalVisible(false)}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Tax Class</Text>
          <TouchableOpacity onPress={() => setTaxClassModalVisible(false)}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalOptionsContainer}>
          {TAX_CLASSES.map((taxClass, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.modalOption} 
              onPress={() => {
                setField('taxClass', taxClass);
                setTaxClassModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>{taxClass}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Product</Text>
        <View style={styles.headerBtn} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Product Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(v) => setField('title', v)}
              placeholder="Enter product title"
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              value={formData.brand}
              onChangeText={(v) => setField('brand', v)}
              placeholder="Enter brand name"
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>SKU</Text>
            <TextInput
              style={styles.input}
              value={formData.sku}
              onChangeText={(v) => setField('sku', v)}
              placeholder="Enter product SKU"
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>URL Slug</Text>
            <TextInput
              style={styles.input}
              value={formData.slug}
              onChangeText={(v) => setField('slug', v)}
              placeholder="product-url-slug"
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
        </Card>
        
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Short Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.shortDescription}
              onChangeText={(v) => setField('shortDescription', v)}
              placeholder="Brief product description (150 characters max)"
              placeholderTextColor={theme.colors.text.light}
              multiline
              numberOfLines={3}
              maxLength={150}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Long Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.longDescription}
              onChangeText={(v) => setField('longDescription', v)}
              placeholder="Detailed product description..."
              placeholderTextColor={theme.colors.text.light}
              multiline
              numberOfLines={6}
            />
          </View>
        </Card>
        
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Categories & Tags</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity style={styles.selectButton} onPress={() => setCategoryModalVisible(true)}>
              <Text style={styles.selectButtonText}>{formData.category || 'Select category'}</Text>
              <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Sub-category</Text>
            <TouchableOpacity style={styles.selectButton} onPress={() => setSubCategoryModalVisible(true)}>
              <Text style={styles.selectButtonText}>{formData.subCategory || 'Select sub-category'}</Text>
              <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Tags</Text>
            <TextInput
              style={styles.input}
              value={formData.tags.join(', ')}
              onChangeText={(v) => setField('tags', v.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))}
              placeholder="Enter tags separated by commas"
              placeholderTextColor={theme.colors.text.light}
            />
            <Text style={styles.helperText}>Tags help customers find your product</Text>
          </View>
        </Card>
        
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Pricing Information</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Regular Price *</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.priceInput}
                value={formData.regularPrice}
                onChangeText={(v) => setField('regularPrice', v.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                placeholderTextColor={theme.colors.text.light}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Sale Price</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.priceInput}
                value={formData.salePrice}
                onChangeText={(v) => setField('salePrice', v.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                placeholderTextColor={theme.colors.text.light}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Cost Price</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.priceInput}
                value={formData.costPrice}
                onChangeText={(v) => setField('costPrice', v.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                placeholderTextColor={theme.colors.text.light}
                keyboardType="decimal-pad"
              />
            </View>
            <Text style={styles.helperText}>Used for profit calculation (not shown to customers)</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Tax Class</Text>
            <TouchableOpacity style={styles.selectButton} onPress={() => setTaxClassModalVisible(true)}>
              <Text style={styles.selectButtonText}>{formData.taxClass === 'standard' ? 'Standard Rate' : 'Tax Exempt'}</Text>
              <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </Card>
        
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Inventory</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput
              style={styles.input}
              value={formData.stockQuantity}
              onChangeText={(v) => setField('stockQuantity', v.replace(/[^0-9]/g, ''))}
              placeholder="Enter stock quantity"
              placeholderTextColor={theme.colors.text.light}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Low Stock Threshold</Text>
            <TextInput
              style={styles.input}
              value={formData.lowStockThreshold}
              onChangeText={(v) => setField('lowStockThreshold', v.replace(/[^0-9]/g, ''))}
              placeholder="Enter threshold"
              placeholderTextColor={theme.colors.text.light}
              keyboardType="numeric"
            />
          </View>
        </Card>
        
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Fields</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              value={formData.productName}
              onChangeText={(v) => setField('productName', v)}
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Nutritional Facts</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.nutritionalFacts}
              onChangeText={(v) => setField('nutritionalFacts', v)}
              placeholderTextColor={theme.colors.text.light}
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(v) => setField('amount', v)}
              placeholder="Enter amount"
              placeholderTextColor={theme.colors.text.light}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Minimum Amount</Text>
            <TextInput
              style={styles.input}
              value={formData.minimumAmount}
              onChangeText={(v) => setField('minimumAmount', v)}
              placeholder="Enter minimum amount"
              placeholderTextColor={theme.colors.text.light}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Suggested Amount</Text>
            <TextInput
              style={styles.input}
              value={formData.suggestedAmount}
              onChangeText={(v) => setField('suggestedAmount', v)}
              placeholder="Enter suggested amount"
              placeholderTextColor={theme.colors.text.light}
              keyboardType="numeric"
            />
          </View>
        </Card>
        
        <View style={styles.actions}>
          <Button variant="primary" size="lg" onPress={handleSave} style={styles.actionBtn}>
            Save Changes
          </Button>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {categoryModalVisible && renderCategoryModal()}
      {subCategoryModalVisible && renderSubCategoryModal()}
      {taxClassModalVisible && renderTaxClassModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.secondary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.secondary },
  errorText: { color: theme.colors.text.primary, fontSize: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    backgroundColor: theme.colors.background.primary,
  },
  headerBtn: { padding: 8, minWidth: 40 },
  headerTitle: { color: theme.colors.text.primary, fontSize: 18, fontWeight: '600' },
  content: { padding: 16, paddingBottom: 32 },
  searchWrap: { marginBottom: 16 },
  card: { marginBottom: 16 },
  label: { color: theme.colors.text.secondary, fontSize: 14, marginBottom: 8 },
  input: {
    color: theme.colors.text.primary,
    fontSize: 16,
    padding: 0,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  sectionTitle: { color: theme.colors.text.primary, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  subtitle: { color: theme.colors.text.secondary, fontSize: 14, marginBottom: 16 },
  imageUpload: {
    height: 160,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  uploadBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  field: { marginBottom: 16 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 8 },
  actionBtn: { flex: 1 },
  cancelBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: theme.colors.status.error,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { color: theme.colors.status.error, fontSize: 16, fontWeight: '600' },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.primary,
  },
  selectButtonText: {
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  helperText: {
    color: theme.colors.text.light,
    fontSize: 12,
    marginTop: 4,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.primary,
    overflow: 'hidden',
  },
  currencySymbol: {
    color: theme.colors.text.primary,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background.secondary,
  },
  priceInput: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  modalOptionsContainer: {
    maxHeight: 400,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  modalOptionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  modalEmptyText: {
    padding: 16,
    textAlign: 'center',
    color: theme.colors.text.light,
    fontStyle: 'italic',
  },
});
