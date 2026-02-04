import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { useConfetti } from '@/contexts/ConfettiContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ConfettiDemoScreen() {
  const router = useRouter();
  const { showConfetti } = useConfetti();

  const handleBack = () => router.back();

  const triggerConfetti = () => {
    showConfetti();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button 
          variant="secondary" 
          size="sm" 
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color={theme.colors.text.primary} />
        </Button>
        <Text style={styles.headerTitle}>Confetti Demo</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.demoCard}>
          <Text style={styles.title}>Confetti Demo</Text>
          <Text style={styles.description}>
            Click the buttons below to see confetti animations for different success scenarios
          </Text>
        </Card>

        <View style={styles.buttonContainer}>
          <Button 
            variant="primary" 
            size="lg" 
            onPress={triggerConfetti}
            style={styles.confettiButton}
          >
            Show Confetti
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg" 
            onPress={() => {
              showConfetti();
              setTimeout(() => {
                alert('Success! Confetti triggered for demo purposes.');
              }, 1000);
            }}
            style={styles.confettiButton}
          >
            Success Action
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onPress={() => {
              showConfetti();
              setTimeout(() => {
                alert('Product created successfully!');
              }, 1000);
            }}
            style={styles.confettiButton}
          >
            Product Created
          </Button>
          
          <Button 
            variant="primary" 
            size="lg" 
            onPress={() => {
              showConfetti();
              setTimeout(() => {
                alert('Order assigned successfully!');
              }, 1000);
            }}
            style={styles.successButton}
          >
            Order Assigned
          </Button>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Confetti is implemented across:</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Product deletion</Text>
            <Text style={styles.listItem}>• Delivery boy assignment</Text>
            <Text style={styles.listItem}>• Product creation/publishing</Text>
            <Text style={styles.listItem}>• Store setup completion</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    minWidth: 40,
  },
  headerTitle: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  demoCard: {
    marginBottom: 24,
    padding: 20,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
  },
  confettiButton: {
    paddingVertical: 16,
  },
  infoCard: {
    padding: 20,
  },
  infoTitle: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  list: {
    gap: 8,
  },
  listItem: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
  },
  successButton: {
    paddingVertical: 16,
    backgroundColor: theme.colors.status.success,
  },
});