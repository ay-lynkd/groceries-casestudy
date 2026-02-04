/**
 * Voice Search Component
 * Speech-to-text search functionality
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { theme } from '@/theme/appTheme';

interface VoiceSearchProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onResult,
  onError,
  language = 'en-IN',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [recognizedText, setRecognizedText] = useState('');

  // Pulse animation when listening
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  const startListening = useCallback(async () => {
    try {
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        onError?.('Microphone permission denied');
        return;
      }

      setIsListening(true);
      setRecognizedText('Listening...');

      // Simulate voice recognition (in production, use expo-speech-recognition or similar)
      // For demo, we'll simulate recognition after 3 seconds
      setTimeout(() => {
        const demoPhrases = [
          'rice',
          'wheat flour',
          'cooking oil',
          'sugar',
          'milk',
          'bread',
          'eggs',
          'vegetables',
        ];
        const randomPhrase = demoPhrases[Math.floor(Math.random() * demoPhrases.length)];
        setRecognizedText(randomPhrase);
        
        setTimeout(() => {
          setIsListening(false);
          onResult(randomPhrase);
        }, 500);
      }, 2000);

    } catch (error) {
      setIsListening(false);
      onError?.('Failed to start voice recognition');
    }
  }, [onResult, onError]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setRecognizedText('');
  }, []);

  const handlePress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View style={styles.container}>
      {isListening && (
        <View style={styles.listeningContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <View style={styles.micContainer}>
            <Ionicons name="mic" size={40} color="#FFF" />
          </View>
          <Text style={styles.listeningText}>{recognizedText}</Text>
          <Text style={styles.tapToStop}>Tap to stop</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={[styles.button, isListening && styles.buttonActive]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isListening ? 'stop' : 'mic'}
          size={24}
          color={isListening ? '#FFF' : theme.colors.primary.green}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  buttonActive: {
    backgroundColor: theme.colors.status.error,
    borderColor: theme.colors.status.error,
  },
  listeningContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 24,
    borderRadius: 16,
    minWidth: 200,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary.green + '30',
  },
  micContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  listeningText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tapToStop: {
    color: theme.colors.text.light,
    fontSize: 12,
  },
});

export default VoiceSearch;
