import { theme } from '@/theme/appTheme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface ConfettiProps {
  onAnimationComplete?: () => void;
  duration?: number;
}

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  size: number;
  delay: number;
}

const COLORS = [
  theme.colors.primary.purple,
  theme.colors.primary.green,
  theme.colors.status.success,
  theme.colors.status.warning,
  theme.colors.status.error,
];

export const Confetti: React.FC<ConfettiProps> = ({ 
  onAnimationComplete =()=>{},
  duration = 3000 
}) => {
  const animationRef = useRef(new Animated.Value(0)).current;
  
  // Generate confetti pieces
  const confettiPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 10 + 5,
    delay: Math.random() * 1000,
  }));

  useEffect(() => {
    Animated.timing(animationRef, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start(() => {
      onAnimationComplete?.();
    });

    return () => {
      animationRef.setValue(0);
    };
  }, [animationRef, duration, onAnimationComplete]);

  const renderConfettiPiece = (piece: ConfettiPiece) => {
    const translateY = animationRef.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, Math.random() * 300 + 500], // Random fall distance
    });

    const translateX = animationRef.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.random() * 100 - 50], // Random horizontal drift
    });

    const opacity = animationRef.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [1, 1, 0],
    });

    const rotate = animationRef.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${Math.random() * 360}deg`],
    });

    return (
      <Animated.View
        key={piece.id}
        style={[
          styles.confettiPiece,
          {
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            opacity,
            transform: [
              { translateY },
              { translateX },
              { rotate },
            ],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map(renderConfettiPiece)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  confettiPiece: {
    position: 'absolute',
    top: -20,
    borderRadius: 2,
  },
});