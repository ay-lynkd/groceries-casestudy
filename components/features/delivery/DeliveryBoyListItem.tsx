import type { DeliveryBoy } from '@/mocks/deliveryBoysData';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DeliveryBoyListItemProps {
  deliveryBoy: DeliveryBoy;
  onSelect?: () => void;
  onAssign?: (id: string) => void;
  isSelected?: boolean;
}

export const DeliveryBoyListItem: React.FC<DeliveryBoyListItemProps> = ({
  deliveryBoy,
  onSelect,
  onAssign,
  isSelected = false,
}) => {
  const handlePress = () => {
    if (onSelect) {
      onSelect();
    } else if (onAssign) {
      onAssign(deliveryBoy.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        {deliveryBoy.profileImage ? (
          <Image source={{ uri: deliveryBoy.profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{deliveryBoy.name.charAt(0)}</Text>
          </View>
        )}
        
        <View style={styles.details}>
          <Text style={styles.name}>{deliveryBoy.name}</Text>
          <Text style={styles.phone}>{deliveryBoy.phoneNumber}</Text>
          {deliveryBoy.email && (
            <Text style={styles.email} numberOfLines={1}>
              {deliveryBoy.email}
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.selectionIndicator, isSelected && styles.selectionIndicatorSelected]}>
        {isSelected && (
          <Ionicons name="checkmark" size={16} color="#FFF" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.card,
  },
  containerSelected: {
    backgroundColor: theme.colors.primary.green + '08',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: theme.spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.text.secondary,
    fontSize: 20,
    fontWeight: theme.typography.fontWeight.bold,
  },
  details: {
    flex: 1,
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 2,
  },
  phone: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  email: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    marginLeft: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionIndicatorSelected: {
    backgroundColor: theme.colors.primary.green,
    borderColor: theme.colors.primary.green,
  },
});

export default DeliveryBoyListItem;
