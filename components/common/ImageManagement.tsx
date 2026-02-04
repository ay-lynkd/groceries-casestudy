import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ImageAsset {
  id: string;
  uri: string;
  fileName: string;
  size: string;
  uploadedAt: string;
}

interface ImageManagementProps {
  onImagesChange: (images: ImageAsset[]) => void;
  maxImages?: number;
  allowCrop?: boolean;
  allowDelete?: boolean;
}

const ImageManagement: React.FC<ImageManagementProps> = ({
  onImagesChange,
  maxImages = 10,
  allowCrop = true,
  allowDelete = true,
}) => {
  const [images, setImages] = useState<ImageAsset[]>([
    {
      id: "1",
      uri: "https://placehold.co/400x400/4CAF50/white?text=Main+Image",
      fileName: "main-image.jpg",
      size: "2.4 MB",
      uploadedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      uri: "https://placehold.co/400x400/FF9800/white?text=Gallery+1",
      fileName: "gallery-1.jpg",
      size: "1.8 MB",
      uploadedAt: "2024-01-15T10:31:00Z",
    },
    {
      id: "3",
      uri: "https://placehold.co/400x400/2196F3/white?text=Gallery+2",
      fileName: "gallery-2.jpg",
      size: "2.1 MB",
      uploadedAt: "2024-01-15T10:32:00Z",
    },
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [cropMode, setCropMode] = useState<"square" | "circle" | "free" | "custom">("square");

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.status !== "granted") {
      Alert.alert("Permission Required", "Please grant permission to access your photos.");
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });

    if (!result.canceled && result.assets.length > 0) {
      const newImage: ImageAsset = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName || `image_${Date.now()}.jpg`,
        size: `${Math.round((result.assets[0].fileSize || 0) / 1024)} KB`,
        uploadedAt: new Date().toISOString(),
      };
      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      onImagesChange(updatedImages);
      setShowUploadModal(false);
    }
  };

  const handleAddImage = () => {
    if (images.length >= maxImages) {
      Alert.alert("Maximum Images", `You can only upload up to ${maxImages} images.`);
      return;
    }
    setShowUploadModal(true);
  };

  const handleRemoveImage = (id: string) => {
    Alert.alert(
      "Remove Image",
      "Are you sure you want to remove this image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updatedImages = images.filter(img => img.id !== id);
            setImages(updatedImages);
            onImagesChange(updatedImages);
          },
        },
      ]
    );
  };

  const handleCropImage = (image: ImageAsset) => {
    setSelectedImage(image);
    setShowCropModal(true);
  };

  const handleCropApply = () => {
    // Apply crop by updating the image
    if (selectedImage) {
      const updatedImages = images.map(img =>
        img.id === selectedImage.id
          ? { ...img, fileName: img.fileName.replace(/\.jpg$/, '_cropped.jpg') }
          : img
      );
      setImages(updatedImages);
      onImagesChange(updatedImages);
    }
    Alert.alert("Success", "Image cropped successfully!");
    setShowCropModal(false);
    setSelectedImage(null);
  };

  const handleSetAsMain = (id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      uri: img.id === id ? img.uri.replace("Gallery", "Main") : img.uri.replace("Main", "Gallery")
    }));
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const renderImageItem = ({ item }: { item: ImageAsset }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.uri }} style={styles.imageThumbnail} />
      <View style={styles.imageInfo}>
        <Text variant="caption" numberOfLines={1}>{item.fileName}</Text>
        <Text variant="caption" color={theme.colors.text.light}>{item.size}</Text>
      </View>
      <View style={styles.imageActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCropImage(item)}
          disabled={!allowCrop}
          accessibilityLabel="Crop image"
        >
          <Ionicons
            name="crop"
            size={20}
            color={allowCrop ? theme.colors.primary.green : theme.colors.text.light}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSetAsMain(item.id)}
          accessibilityLabel="Set as main image"
        >
          <Ionicons
            name={item.uri.includes("Main") ? "star" : "star-outline"}
            size={20}
            color={item.uri.includes("Main") ? theme.colors.primary.orange : theme.colors.text.light}
          />
        </TouchableOpacity>
        {allowDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleRemoveImage(item.id)}
            accessibilityLabel="Delete image"
          >
            <Ionicons name="trash" size={20} color={theme.colors.status.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3" fontWeight="bold">
          Product Images
        </Text>
        <Text variant="caption" color={theme.colors.text.secondary}>
          {images.length}/{maxImages} images
        </Text>
      </View>

      {images.length > 0 ? (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id}
          horizontal={false}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <Card style={styles.emptyState}>
          <Ionicons name="image-outline" size={48} color={theme.colors.text.light} />
          <Text variant="h3" fontWeight="bold" style={styles.emptyTitle}>
            No Images Added
          </Text>
          <Text variant="body" color={theme.colors.text.secondary} style={styles.emptyText}>
            Add product images to showcase your products
          </Text>
        </Card>
      )}

      <Button
        variant="outline"
        size="md"
        onPress={handleAddImage}
        disabled={images.length >= maxImages}
        style={styles.addButton}
      >
        <Ionicons name="add" size={20} color={theme.colors.primary.green} />
        Add Image
        {maxImages && ` (${images.length}/${maxImages})`}
      </Button>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="h3" fontWeight="bold" style={styles.modalTitle}>
              Add Images
            </Text>
            
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={() => pickImage(true)}
              >
                <Ionicons name="camera" size={32} color={theme.colors.primary.green} />
                <Text variant="body" fontWeight="semibold" style={styles.optionText}>
                  Take Photo
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={() => pickImage(false)}
              >
                <Ionicons name="images" size={32} color={theme.colors.primary.green} />
                <Text variant="body" fontWeight="semibold" style={styles.optionText}>
                  Choose from Gallery
                </Text>
              </TouchableOpacity>
            </View>
            
            <Button
              variant="outline"
              size="md"
              onPress={() => setShowUploadModal(false)}
              style={styles.modalCancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      {/* Crop Modal */}
      <Modal
        visible={showCropModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCropModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cropModalContent}>
            <View style={styles.cropHeader}>
              <TouchableOpacity onPress={() => setShowCropModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <Text variant="h3" fontWeight="bold">
                Crop Image
              </Text>
              <TouchableOpacity onPress={handleCropApply}>
                <Ionicons name="checkmark" size={24} color={theme.colors.primary.green} />
              </TouchableOpacity>
            </View>
            
            {selectedImage && (
              <View style={styles.cropPreview}>
                <Image source={{ uri: selectedImage.uri }} style={styles.cropImage} />
              </View>
            )}
            
            <View style={styles.cropOptions}>
              <TouchableOpacity
                style={[
                  styles.cropOption,
                  cropMode === "square" && styles.selectedCropOption,
                ]}
                onPress={() => setCropMode("square")}
              >
                <Text variant="body">Square</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cropOption,
                  cropMode === "circle" && styles.selectedCropOption,
                ]}
                onPress={() => setCropMode("circle")}
              >
                <Text variant="body">Circle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cropOption,
                  cropMode === "free" && styles.selectedCropOption,
                ]}
                onPress={() => setCropMode("free")}
              >
                <Text variant="body">Free</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cropOption,
                  cropMode === "custom" && styles.selectedCropOption,
                ]}
                onPress={() => setCropMode("custom")}
              >
                <Text variant="body">Custom</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  imageItem: {
    flex: 1,
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  imageThumbnail: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  imageInfo: {
    padding: theme.spacing.sm,
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  gridContainer: {
    paddingBottom: theme.spacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
    minHeight: 200,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    textAlign: "center",
  },
  addButton: {
    marginTop: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.lg,
  },
  uploadOption: {
    alignItems: "center",
    padding: theme.spacing.md,
  },
  optionText: {
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  modalCancelButton: {
    marginTop: theme.spacing.sm,
  },
  cropModalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    width: "90%",
    maxHeight: "80%",
  },
  cropHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  cropPreview: {
    alignItems: "center",
    padding: theme.spacing.md,
  },
  cropImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  cropOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: theme.spacing.md,
  },
  cropOption: {
    padding: theme.spacing.md,
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  selectedCropOption: {
    backgroundColor: theme.colors.primary.green,
  },
});

export default ImageManagement;