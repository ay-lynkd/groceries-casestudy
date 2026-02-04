import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileAvatarSectionProps {
  imageUrl: string;
  name: string;
  role: string;
  onEditPhoto?: () => void;
}

export const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  imageUrl,
  name,
  role,
  onEditPhoto,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBorder}>
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        </View>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={onEditPhoto}
          activeOpacity={0.8}
          accessibilityLabel="Edit profile photo"
          accessibilityRole="button"
          accessibilityHint="Change your profile picture"
        >
          <Ionicons name="camera" size={16} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.role}>{role}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatarBorder: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 3,
    borderColor: "#E8F4F8",
    padding: 3,
    backgroundColor: theme.colors.background.primary,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 58,
    backgroundColor: theme.colors.background.secondary,
  },
  cameraButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1A1A2E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  name: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  role: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
