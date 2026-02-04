import { Card } from '@/components/primary';
import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface OrderProcessFlowProps {
  currentStatus: string;
  onStatusChange?: (status: string) => void;
}

export const OrderProcessFlow: React.FC<OrderProcessFlowProps> = ({ currentStatus, onStatusChange }) => {
  // Define the order process steps
  const processSteps = [
    { id: 'new', label: 'New Order', icon: 'document-text-outline' },
    { id: 'accepted', label: 'Order Accepted', icon: 'checkmark-circle-outline' },
    { id: 'confirmed', label: 'Confirmed', icon: 'checkbox-outline' },
    { id: 'preparing', label: 'Preparing', icon: 'construct-outline' },
    { id: 'ready_for_pickup', label: 'Ready for Pickup', icon: 'bag-check-outline' },
    { id: 'in_transit', label: 'In Transit', icon: 'car-outline' },
    { id: 'delivered', label: 'Delivered', icon: 'home-outline' },
  ];

  // Function to get status indicator style
  const getStatusIndicatorStyle = (stepId: string) => {
    if (processSteps.findIndex(step => step.id === currentStatus) >= processSteps.findIndex(step => step.id === stepId)) {
      // Completed step
      return {
        backgroundColor: theme.colors.primary.green,
        borderColor: theme.colors.primary.green,
      };
    } else if (stepId === currentStatus) {
      // Current step
      return {
        backgroundColor: theme.colors.primary.green,
        borderColor: theme.colors.primary.green,
      };
    } else {
      // Future step
      return {
        backgroundColor: theme.colors.background.card,
        borderColor: theme.colors.border.light,
      };
    }
  };

  // Function to get status text style
  const getStatusTextStyle = (stepId: string) => {
    if (processSteps.findIndex(step => step.id === currentStatus) >= processSteps.findIndex(step => step.id === stepId)) {
      // Completed step
      return {
        color: theme.colors.text.primary,
        fontWeight: theme.typography.fontWeight.semibold,
      };
    } else if (stepId === currentStatus) {
      // Current step
      return {
        color: theme.colors.text.primary,
        fontWeight: theme.typography.fontWeight.semibold,
      };
    } else {
      // Future step
      return {
        color: theme.colors.text.light,
      };
    }
  };

  // Function to get connector style
  const getConnectorStyle = (index: number) => {
    if (index === processSteps.length - 1) {
      // Last step doesn't need a connector
      return {};
    }
    
    const stepIndex = processSteps.findIndex(step => step.id === currentStatus);
    const currentIndex = index;
    
    if (stepIndex >= currentIndex + 1) {
      // Connector should be completed
      return {
        backgroundColor: theme.colors.primary.green,
      };
    } else {
      // Connector should be inactive
      return {
        backgroundColor: theme.colors.border.light,
      };
    }
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Order Progress</Text>
      
      <View style={styles.flowContainer}>
        {processSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <View style={styles.stepContainer}>
              <View style={[styles.statusIndicator, getStatusIndicatorStyle(step.id)]}>
                {processSteps.findIndex(s => s.id === currentStatus) >= index ? (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={step.id === currentStatus ? "#FFFFFF" : theme.colors.background.card} 
                  />
                ) : (
                  <Ionicons 
                    name={step.icon as any} 
                    size={20} 
                    color={step.id === currentStatus ? "#FFFFFF" : theme.colors.text.light} 
                  />
                )}
              </View>
              <Text 
                style={[
                  styles.statusText, 
                  getStatusTextStyle(step.id),
                  { textAlign: 'center', marginTop: 8, maxWidth: 80 }
                ]}
                numberOfLines={2}
              >
                {step.label}
              </Text>
            </View>
            
            {index < processSteps.length - 1 && (
              <View style={[styles.connector, getConnectorStyle(index)]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  flowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    zIndex: 1,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.card,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.sm,
    color: theme.colors.text.light,
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border.light,
  },
});