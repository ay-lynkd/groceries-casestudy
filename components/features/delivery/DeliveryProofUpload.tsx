/**
 * Delivery Proof Upload Component
 * Upload photo or signature as delivery proof
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/common';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface DeliveryProofUploadProps {
  orderId: string;
  onSubmit: (proof: { type: 'photo' | 'signature'; uri: string; notes?: string }) => void;
  onCancel: () => void;
}

export function DeliveryProofUpload({ orderId, onSubmit, onCancel }: DeliveryProofUploadProps) {
  const { colors } = theme;
  const [selectedType, setSelectedType] = useState<'photo' | 'signature' | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Placeholder functions - install expo-image-picker for full functionality
  const takePhoto = async () => {
    // npx expo install expo-image-picker
    Alert.alert('Feature Available', 'Install expo-image-picker to enable photo capture');
    // Mock for demo
    setImageUri('mock_photo_uri');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const selectFromGallery = async () => {
    // npx expo install expo-image-picker
    Alert.alert('Feature Available', 'Install expo-image-picker to enable gallery selection');
    // Mock for demo
    setImageUri('mock_gallery_uri');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSubmit = async () => {
    if (!imageUri || !selectedType) return;

    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate upload
    setTimeout(() => {
      onSubmit({
        type: selectedType,
        uri: imageUri,
        notes: notes.trim() || undefined,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Delivery Proof</Text>
      <Text style={styles.subtitle}>
        Upload photo or signature as proof of delivery
      </Text>

      {/* Type Selection */}
      {!imageUri && (
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'photo' && { borderColor: colors.primary.green, backgroundColor: colors.primary.green + '10' },
            ]}
            onPress={() => {
              setSelectedType('photo');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons 
              name="camera-outline" 
              size={32} 
              color={selectedType === 'photo' ? colors.primary.green : colors.text.secondary} 
            />
            <Text style={[
              styles.typeLabel,
              selectedType === 'photo' && { color: colors.primary.green },
            ]}>
              Take Photo
            </Text>
            <Text style={styles.typeDescription}>
              Capture delivery location or package
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'signature' && { borderColor: colors.primary.green, backgroundColor: colors.primary.green + '10' },
            ]}
            onPress={() => {
              setSelectedType('signature');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons 
              name="create-outline" 
              size={32} 
              color={selectedType === 'signature' ? colors.primary.green : colors.text.secondary} 
            />
            <Text style={[
              styles.typeLabel,
              selectedType === 'signature' && { color: colors.primary.green },
            ]}>
              Signature
            </Text>
            <Text style={styles.typeDescription}>
              Customer signature on device
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Photo Upload Options */}
      {selectedType === 'photo' && !imageUri && (
        <View style={styles.uploadOptions}>
          <Button variant="primary" onPress={takePhoto}>
            <Ionicons name="camera" size={20} color="#FFF" />
            <Text style={{ color: '#FFF', marginLeft: 8 }}>Take Photo</Text>
          </Button>
          <Button variant="outline" onPress={selectFromGallery}>
            <Ionicons name="images-outline" size={20} />
            <Text style={{ marginLeft: 8 }}>Choose from Gallery</Text>
          </Button>
        </View>
      )}

      {/* Signature Placeholder */}
      {selectedType === 'signature' && !imageUri && (
        <View style={styles.signatureContainer}>
          <View style={styles.signaturePad}>
            <Text style={styles.signaturePlaceholder}>
              Customer signature will appear here
            </Text>
          </View>
          <Button variant="primary" onPress={() => setImageUri('signature_placeholder')}>
            <Text style={{ color: '#FFF' }}>Capture Signature</Text>
          </Button>
        </View>
      )}

      {/* Preview */}
      {imageUri && (
        <View style={styles.previewContainer}>
          <View style={styles.preview}>
            <Ionicons name="image" size={48} color="#4CAF50" />
            <Text>Image captured</Text>
          </View>
          <TouchableOpacity 
            style={styles.retakeButton}
            onPress={() => {
              setImageUri(null);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons name="refresh" size={16} color="#FFF" />
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button variant="outline" onPress={onCancel}>
          <Text>Cancel</Text>
        </Button>
        {imageUri && (
          <Button 
            variant="primary" 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={{ color: '#FFF' }}>Uploading...</Text>
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFF" />
                <Text style={{ color: '#FFF', marginLeft: 8 }}>Submit Proof</Text>
              </>
            )}
          </Button>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  uploadOptions: {
    gap: 12,
    marginBottom: 20,
  },
  signatureContainer: {
    marginBottom: 20,
  },
  signaturePad: {
    height: 150,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  signaturePlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  retakeText: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default DeliveryProofUpload;
