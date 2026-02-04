import { Text } from "@/components/common";
import { Button, Card } from "@/components/primary";
import { theme } from "@/theme/appTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
}

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
  notes?: string;
}

const MapBasedAddressPicker: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      street: "123, Electronic City Phase 1",
      city: "Bengaluru",
      state: "Karnataka",
      zipCode: "560100",
      country: "India",
      isPrimary: true,
    },
    {
      id: "2",
      name: "Office",
      street: "456, Outer Ring Road",
      city: "Bengaluru",
      state: "Karnataka",
      zipCode: "560048",
      country: "India",
      isPrimary: false,
    },
    {
      id: "3",
      name: "Parents House",
      street: "789, MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India",
      isPrimary: false,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    notes: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock locations for demonstration
  const mockLocations = [
    {
      id: "loc1",
      name: "Electronic City",
      address: "Electronic City Phase 1, Bengaluru, Karnataka",
      latitude: 12.8406,
      longitude: 77.6556,
      isPrimary: false,
    },
    {
      id: "loc2",
      name: "MG Road",
      address: "MG Road, Bengaluru, Karnataka",
      latitude: 12.9716,
      longitude: 77.5946,
      isPrimary: false,
    },
    {
      id: "loc3",
      name: "Whitefield",
      address: "Whitefield, Bengaluru, Karnataka",
      latitude: 12.9698,
      longitude: 77.7507,
      isPrimary: false,
    },
  ];

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setNewAddress({
      name: location.name,
      street: location.address.split(',')[0],
      city: location.address.split(',')[1]?.trim() || "",
      state: location.address.split(',')[2]?.trim() || "",
      zipCode: "",
      country: "India",
      notes: "",
    });
  };

  const handleAddNewAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      ...newAddress,
      isPrimary: addresses.length === 0, // First address is primary
    };

    setAddresses([...addresses, newAddr]);
    setIsAddingNew(false);
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      notes: "",
    });
    setSelectedLocation(null);
    Alert.alert("Success", "Address added successfully!");
  };

  const handleSetPrimary = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isPrimary: addr.id === id,
    }));
    setAddresses(updatedAddresses);
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      Alert.alert("Error", "You must have at least one address");
      return;
    }

    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const filtered = addresses.filter(addr => addr.id !== id);
            setAddresses(filtered);
          },
        },
      ]
    );
  };

  const filteredLocations = mockLocations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleSelectLocation(item)}
    >
      <View style={styles.locationIcon}>
        <Ionicons name="location" size={20} color={theme.colors.primary.green} />
      </View>
      <View style={styles.locationInfo}>
        <Text variant="body" fontWeight="semibold">
          {item.name}
        </Text>
        <Text variant="caption" color={theme.colors.text.light}>
          {item.address}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
    </TouchableOpacity>
  );

  const renderAddressItem = ({ item }: { item: Address }) => (
    <Card style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View>
          <Text variant="body" fontWeight="semibold">
            {item.name}
            {item.isPrimary && (
              <Text variant="caption" color={theme.colors.primary.orange} style={styles.primaryBadge}>
                {" "}• Primary
              </Text>
            )}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.street}
          </Text>
          <Text variant="caption" color={theme.colors.text.light}>
            {item.city}, {item.state} - {item.zipCode}
          </Text>
          {item.notes && (
            <Text variant="caption" color={theme.colors.text.secondary} style={styles.notes}>
              {item.notes}
            </Text>
          )}
        </View>
        <View style={styles.addressActions}>
          {!item.isPrimary && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetPrimary(item.id)}
              accessibilityLabel="Set as primary"
            >
              <Ionicons name="star-outline" size={20} color={theme.colors.text.light} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteAddress(item.id)}
            accessibilityLabel="Delete address"
          >
            <Ionicons name="trash" size={20} color={theme.colors.status.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h2" fontWeight="bold" style={styles.headerTitle}>
          Addresses
        </Text>
        <TouchableOpacity
          onPress={() => setIsAddingNew(true)}
          style={styles.addButton}
          accessibilityLabel="Add new address"
        >
          <Ionicons name="add" size={24} color={theme.colors.primary.green} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {isAddingNew ? (
          <>
            {/* Search Bar */}
            <Card style={styles.searchCard}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.text.light} style={styles.searchIcon} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search for location..."
                  style={styles.searchInput}
                />
              </View>
            </Card>

            {/* Map Placeholder */}
            <Card style={styles.mapCard}>
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map" size={48} color={theme.colors.text.light} />
                <Text variant="body" color={theme.colors.text.light} style={styles.mapPlaceholderText}>
                  Interactive Map View
                </Text>
                <Text variant="caption" color={theme.colors.text.light} style={styles.mapPlaceholderSubtext}>
                  Tap on the map to select your location
                </Text>
              </View>
              <View style={styles.mapControls}>
                <TouchableOpacity style={styles.mapControlButton}>
                  <Ionicons name="locate" size={20} color={theme.colors.primary.green} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.mapControlButton}>
                  <Ionicons name="refresh" size={20} color={theme.colors.primary.green} />
                </TouchableOpacity>
              </View>
            </Card>

            {/* Location Results */}
            {searchQuery ? (
              <Card style={styles.resultsCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Search Results
                </Text>
                <FlatList
                  data={filteredLocations}
                  renderItem={renderLocationItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              </Card>
            ) : (
              <Card style={styles.instructionsCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  How to Add Address
                </Text>
                <View style={styles.instructionItem}>
                  <View style={styles.instructionIcon}>
                    <Ionicons name="locate" size={16} color="#FFFFFF" />
                  </View>
                  <Text variant="body" style={styles.instructionText}>
                    Search for your location using the search bar
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <View style={styles.instructionIcon}>
                    <Ionicons name="pin" size={16} color="#FFFFFF" />
                  </View>
                  <Text variant="body" style={styles.instructionText}>
                    Select your exact location on the map
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <View style={styles.instructionIcon}>
                    <Ionicons name="save" size={16} color="#FFFFFF" />
                  </View>
                  <Text variant="body" style={styles.instructionText}>
                    Confirm and save your address details
                  </Text>
                </View>
              </Card>
            )}

            {/* Selected Location Details */}
            {selectedLocation && (
              <Card style={styles.locationDetailsCard}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Confirm Location
                </Text>
                <View style={styles.selectedLocation}>
                  <Ionicons name="location" size={24} color={theme.colors.primary.green} />
                  <View style={styles.locationText}>
                    <Text variant="body" fontWeight="semibold">
                      {selectedLocation.name}
                    </Text>
                    <Text variant="caption" color={theme.colors.text.light}>
                      {selectedLocation.address}
                    </Text>
                  </View>
                </View>

                {/* Address Form */}
                <Text variant="h3" fontWeight="bold" style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>
                  Address Details
                </Text>
                
                <Card style={styles.formCard}>
                  <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                    Address Nickname *
                  </Text>
                  <TextInput
                    value={newAddress.name}
                    onChangeText={(text) => setNewAddress({...newAddress, name: text})}
                    placeholder="e.g., Home, Office"
                    style={styles.textInput}
                  />

                  <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                    Street Address *
                  </Text>
                  <TextInput
                    value={newAddress.street}
                    onChangeText={(text) => setNewAddress({...newAddress, street: text})}
                    placeholder="Street address, building, floor"
                    style={styles.textInput}
                  />

                  <View style={styles.row}>
                    <View style={{ flex: 2, marginRight: theme.spacing.sm }}>
                      <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                        City *
                      </Text>
                      <TextInput
                        value={newAddress.city}
                        onChangeText={(text) => setNewAddress({...newAddress, city: text})}
                        placeholder="City"
                        style={styles.textInput}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                        State *
                      </Text>
                      <TextInput
                        value={newAddress.state}
                        onChangeText={(text) => setNewAddress({...newAddress, state: text})}
                        placeholder="State"
                        style={styles.textInput}
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
                      <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                        ZIP Code
                      </Text>
                      <TextInput
                        value={newAddress.zipCode}
                        onChangeText={(text) => setNewAddress({...newAddress, zipCode: text})}
                        placeholder="ZIP"
                        style={styles.textInput}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                        Country
                      </Text>
                      <TextInput
                        value={newAddress.country}
                        onChangeText={(text) => setNewAddress({...newAddress, country: text})}
                        style={styles.textInput}
                      />
                    </View>
                  </View>

                  <Text variant="body" fontWeight="semibold" style={styles.inputLabel}>
                    Additional Notes
                  </Text>
                  <TextInput
                    value={newAddress.notes}
                    onChangeText={(text) => setNewAddress({...newAddress, notes: text})}
                    placeholder="Landmark, gate number, etc."
                    style={[styles.textInput, styles.textArea]}
                    multiline
                    numberOfLines={3}
                  />
                </Card>

                <View style={styles.formActions}>
                  <Button
                    variant="outline"
                    size="md"
                    onPress={() => {
                      setIsAddingNew(false);
                      setSelectedLocation(null);
                    }}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onPress={handleAddNewAddress}
                    style={styles.saveButton}
                  >
                    Save Address
                  </Button>
                </View>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Saved Addresses */}
            <Card style={styles.savedAddressesCard}>
              <View style={styles.cardHeader}>
                <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                  Saved Addresses
                </Text>
                <Text variant="caption" color={theme.colors.text.light}>
                  {addresses.length} addresses
                </Text>
              </View>
              
              {addresses.length > 0 ? (
                <FlatList
                  data={addresses}
                  renderItem={renderAddressItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="location-outline" size={48} color={theme.colors.text.light} />
                  <Text variant="h3" fontWeight="bold" style={styles.emptyTitle}>
                    No Addresses Yet
                  </Text>
                  <Text variant="body" color={theme.colors.text.secondary} style={styles.emptyText}>
                    Add your first address to get started
                  </Text>
                </View>
              )}
            </Card>

            {/* Address Tips */}
            <Card style={styles.tipsCard}>
              <Text variant="h3" fontWeight="bold" style={styles.sectionTitle}>
                Address Tips
              </Text>
              <View style={styles.tipItem}>
                <Ionicons name="bulb" size={20} color={theme.colors.primary.orange} />
                <Text variant="body" style={styles.tipText}>
                  Add your most frequently used addresses
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="bulb" size={20} color={theme.colors.primary.orange} />
                <Text variant="body" style={styles.tipText}>
                  Include landmarks for easier delivery
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="bulb" size={20} color={theme.colors.primary.orange} />
                <Text variant="body" style={styles.tipText}>
                  Set your primary address for default delivery
                </Text>
              </View>
            </Card>
          </>
        )}
      </ScrollView>

      {!isAddingNew && (
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <Button
            variant="primary"
            size="md"
            onPress={() => setIsAddingNew(true)}
            style={styles.addAddressButton}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            Add New Address
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  addButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  searchCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  mapCard: {
    padding: 0,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  mapPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
  },
  mapPlaceholderText: {
    marginTop: theme.spacing.sm,
  },
  mapPlaceholderSubtext: {
    marginTop: theme.spacing.xs,
  },
  mapControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
  },
  mapControlButton: {
    padding: theme.spacing.md,
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.full,
  },
  resultsCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  instructionsCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  instructionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary.green,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
  },
  locationDetailsCard: {
    padding: theme.spacing.md,
  },
  selectedLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  locationText: {
    flex: 1,
  },
  formCard: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  inputLabel: {
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    fontFamily: theme.fonts.figtree,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  formActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  savedAddressesCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  addressCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  primaryBadge: {
    fontSize: theme.typography.fontSize.xs,
  },
  notes: {
    fontStyle: "italic",
    marginTop: theme.spacing.xs,
  },
  addressActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.text.light,
  },
  tipsCard: {
    padding: theme.spacing.md,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  tipText: {
    flex: 1,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
});

export default MapBasedAddressPicker;