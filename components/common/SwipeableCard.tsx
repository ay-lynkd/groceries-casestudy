/**
 * Swipeable Card Component
 * Adds swipe gestures for quick actions
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/appTheme';

interface SwipeAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeOpen?: (direction: 'left' | 'right') => void;
  onSwipeClose?: () => void;
  enabled?: boolean;
}

const SWIPE_THRESHOLD = 80;
const ACTION_WIDTH = 80;

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  leftActions,
  rightActions,
  onSwipeOpen,
  onSwipeClose,
  enabled = true,
}) => {
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const handleActionPress = useCallback((action: SwipeAction) => {
    translateX.value = withSpring(0);
    action.onPress();
  }, [translateX]);

  const gesture = Gesture.Pan()
    .enabled(enabled)
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      const newX = context.value.x + event.translationX;
      
      // Limit swipe based on available actions
      const maxLeft = rightActions ? -ACTION_WIDTH * rightActions.length : 0;
      const maxRight = leftActions ? ACTION_WIDTH * leftActions.length : 0;
      
      translateX.value = Math.max(maxLeft, Math.min(maxRight, newX));
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      
      if (translateX.value > SWIPE_THRESHOLD && leftActions) {
        // Open left actions
        translateX.value = withSpring(ACTION_WIDTH * leftActions.length);
        if (onSwipeOpen) {
          runOnJS(onSwipeOpen)('left');
        }
      } else if (translateX.value < -SWIPE_THRESHOLD && rightActions) {
        // Open right actions
        translateX.value = withSpring(-ACTION_WIDTH * rightActions.length);
        if (onSwipeOpen) {
          runOnJS(onSwipeOpen)('right');
        }
      } else {
        // Close
        translateX.value = withSpring(0);
        if (onSwipeClose) {
          runOnJS(onSwipeClose)();
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionsStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? 1 : 0,
    transform: [{ scale: translateX.value > 0 ? 1 : 0.8 }],
  }));

  const rightActionsStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? 1 : 0,
    transform: [{ scale: translateX.value < 0 ? 1 : 0.8 }],
  }));

  return (
    <View style={styles.container}>
      {/* Left Actions Background */}
      {leftActions && (
        <Animated.View style={[styles.actionsContainer, styles.leftActions, leftActionsStyle]}>
          {leftActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: action.backgroundColor }]}
              onPress={() => handleActionPress(action)}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
              <Text style={[styles.actionLabel, { color: action.color }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {/* Right Actions Background */}
      {rightActions && (
        <Animated.View style={[styles.actionsContainer, styles.rightActions, rightActionsStyle]}>
          {rightActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: action.backgroundColor }]}
              onPress={() => handleActionPress(action)}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
              <Text style={[styles.actionLabel, { color: action.color }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {/* Main Card */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  leftActions: {
    left: 0,
  },
  rightActions: {
    right: 0,
  },
  actionButton: {
    width: ACTION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

// Pre-built swipe actions for orders
export const orderSwipeActions = {
  accept: (onAccept: () => void): SwipeAction => ({
    icon: 'checkmark',
    label: 'Accept',
    color: '#FFF',
    backgroundColor: theme.colors.status.success,
    onPress: onAccept,
  }),

  decline: (onDecline: () => void): SwipeAction => ({
    icon: 'close',
    label: 'Decline',
    color: '#FFF',
    backgroundColor: theme.colors.status.error,
    onPress: () => {
      Alert.alert(
        'Decline Order',
        'Are you sure you want to decline this order?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Decline', style: 'destructive', onPress: onDecline },
        ]
      );
    },
  }),

  call: (phoneNumber: string): SwipeAction => ({
    icon: 'call',
    label: 'Call',
    color: '#FFF',
    backgroundColor: theme.colors.status.info,
    onPress: () => {
      console.log('Calling:', phoneNumber);
    },
  }),

  message: (onMessage: () => void): SwipeAction => ({
    icon: 'chatbubble',
    label: 'Message',
    color: '#FFF',
    backgroundColor: theme.colors.primary.purple,
    onPress: onMessage,
  }),

  track: (onTrack: () => void): SwipeAction => ({
    icon: 'location',
    label: 'Track',
    color: '#FFF',
    backgroundColor: theme.colors.primary.orange,
    onPress: onTrack,
  }),
};

export default SwipeableCard;
