/**
 * Animation Utilities
 * Centralized animation presets and helpers for consistent UX
 */

import { Animated, Easing } from 'react-native';

// ============================================
// Animation Configurations
// ============================================

export const animationConfig = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: Easing.inOut(Easing.ease),
    bounce: Easing.out(Easing.back(1.5)),
    smooth: Easing.bezier(0.4, 0, 0.2, 1),
    spring: {
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    },
  },
};

// ============================================
// Fade Animations
// ============================================

export const fadeIn = (
  value: Animated.Value,
  duration: number = animationConfig.duration.normal,
  callback?: () => void
) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    easing: animationConfig.easing.smooth,
    useNativeDriver: true,
  }).start(callback);
};

export const fadeOut = (
  value: Animated.Value,
  duration: number = animationConfig.duration.normal,
  callback?: () => void
) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    easing: animationConfig.easing.smooth,
    useNativeDriver: true,
  }).start(callback);
};

export const useFadeAnimation = (initialValue: number = 0) => {
  const opacity = new Animated.Value(initialValue);

  const fadeInAnim = (duration?: number, callback?: () => void) =>
    fadeIn(opacity, duration, callback);

  const fadeOutAnim = (duration?: number, callback?: () => void) =>
    fadeOut(opacity, duration, callback);

  return { opacity, fadeIn: fadeInAnim, fadeOut: fadeOutAnim };
};

// ============================================
// Scale Press Animations
// ============================================

export const scalePress = {
  pressIn: (value: Animated.Value, scale: number = 0.95) => {
    Animated.spring(value, {
      toValue: scale,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  },
  pressOut: (value: Animated.Value, scale: number = 1) => {
    Animated.spring(value, {
      toValue: scale,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  },
};

export const useScaleAnimation = (initialValue: number = 1) => {
  const scale = new Animated.Value(initialValue);

  const onPressIn = (targetScale: number = 0.95) => {
    scalePress.pressIn(scale, targetScale);
  };

  const onPressOut = (targetScale: number = 1) => {
    scalePress.pressOut(scale, targetScale);
  };

  return { scale, onPressIn, onPressOut };
};

// ============================================
// Elevation Change Animation
// ============================================

export const useElevationAnimation = (
  initialElevation: number = 3,
  pressedElevation: number = 6
) => {
  const elevation = new Animated.Value(initialElevation);
  const shadowOpacity = new Animated.Value(0.08);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(elevation, {
        toValue: pressedElevation,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.15,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(elevation, {
        toValue: initialElevation,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.08,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { elevation, shadowOpacity, onPressIn, onPressOut };
};

// ============================================
// Slide Animations
// ============================================

export type SlideDirection = 'up' | 'down' | 'left' | 'right';

export const slideIn = (
  translateValue: Animated.Value,
  direction: SlideDirection = 'up',
  distance: number = 100,
  duration: number = animationConfig.duration.normal,
  callback?: () => void
) => {
  const toValue = 0;
  const initialValue =
    direction === 'up' || direction === 'left' ? distance : -distance;

  translateValue.setValue(initialValue);

  return Animated.timing(translateValue, {
    toValue,
    duration,
    easing: animationConfig.easing.bounce,
    useNativeDriver: true,
  }).start(callback);
};

export const slideOut = (
  translateValue: Animated.Value,
  direction: SlideDirection = 'down',
  distance: number = 100,
  duration: number = animationConfig.duration.normal,
  callback?: () => void
) => {
  const toValue =
    direction === 'up' || direction === 'left' ? distance : -distance;

  return Animated.timing(translateValue, {
    toValue,
    duration,
    easing: animationConfig.easing.smooth,
    useNativeDriver: true,
  }).start(callback);
};

export const useSlideAnimation = (
  direction: SlideDirection = 'up',
  distance: number = 100
) => {
  const translateY = new Animated.Value(distance);
  const translateX = new Animated.Value(0);
  const opacity = new Animated.Value(0);

  const isVertical = direction === 'up' || direction === 'down';

  const slideInAnim = (duration?: number, callback?: () => void) => {
    if (isVertical) {
      translateY.setValue(direction === 'up' ? distance : -distance);
    } else {
      translateX.setValue(direction === 'left' ? distance : -distance);
    }
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(isVertical ? translateY : translateX, {
        toValue: 0,
        duration: duration || animationConfig.duration.normal,
        easing: animationConfig.easing.bounce,
        useNativeDriver: true,
      }),
      fadeIn(opacity, duration),
    ]).start(callback);
  };

  const slideOutAnim = (duration?: number, callback?: () => void) => {
    Animated.parallel([
      Animated.timing(isVertical ? translateY : translateX, {
        toValue:
          direction === 'up' || direction === 'left' ? distance : -distance,
        duration: duration || animationConfig.duration.normal,
        easing: animationConfig.easing.smooth,
        useNativeDriver: true,
      }),
      fadeOut(opacity, duration),
    ]).start(callback);
  };

  const animatedStyle = {
    transform: [
      { translateY: isVertical ? translateY : 0 },
      { translateX: !isVertical ? translateX : 0 },
    ],
    opacity,
  };

  return {
    translateY,
    translateX,
    opacity,
    slideIn: slideInAnim,
    slideOut: slideOutAnim,
    animatedStyle,
  };
};

// ============================================
// Stagger Animations for Lists
// ============================================

export const staggerFadeIn = (
  animatedValues: Animated.Value[],
  duration: number = animationConfig.duration.fast,
  staggerDelay: number = 50,
  callback?: () => void
) => {
  const animations = animatedValues.map((value) =>
    Animated.timing(value, {
      toValue: 1,
      duration,
      easing: animationConfig.easing.smooth,
      useNativeDriver: true,
    })
  );

  return Animated.stagger(staggerDelay, animations).start(callback);
};

export const staggerSlideIn = (
  animatedValues: Array<{ translateY: Animated.Value; opacity: Animated.Value }>,
  direction: SlideDirection = 'up',
  distance: number = 30,
  duration: number = animationConfig.duration.normal,
  staggerDelay: number = 50,
  callback?: () => void
) => {
  const isVertical = direction === 'up' || direction === 'down';
  const initialValue =
    direction === 'up' || direction === 'left' ? distance : -distance;

  const animations = animatedValues.map((item) => {
    item.translateY.setValue(isVertical ? initialValue : 0);
    item.opacity.setValue(0);

    return Animated.parallel([
      Animated.timing(item.translateY, {
        toValue: 0,
        duration,
        easing: animationConfig.easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(item.opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]);
  });

  return Animated.stagger(staggerDelay, animations).start(callback);
};

export const useStaggerAnimation = (itemCount: number, baseDelay: number = 50) => {
  const animatedValues = Array.from({ length: itemCount }, () => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(20),
    scale: new Animated.Value(0.95),
  }));

  const staggerIn = (callback?: () => void) => {
    const animations = animatedValues.map((item) =>
      Animated.parallel([
        Animated.timing(item.opacity, {
          toValue: 1,
          duration: animationConfig.duration.normal,
          easing: animationConfig.easing.smooth,
          useNativeDriver: true,
        }),
        Animated.spring(item.translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(item.scale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(baseDelay, animations).start(callback);
  };

  const getItemStyle = (index: number) => ({
    opacity: animatedValues[index]?.opacity || 1,
    transform: [
      { translateY: animatedValues[index]?.translateY || 0 },
      { scale: animatedValues[index]?.scale || 1 },
    ],
  });

  return { animatedValues, staggerIn, getItemStyle };
};

// ============================================
// Combined Animation Hooks
// ============================================

export const usePressAnimation = (
  scaleValue: number = 0.95,
  initialElevation: number = 3,
  pressedElevation: number = 6
) => {
  const scale = new Animated.Value(1);
  const elevation = new Animated.Value(initialElevation);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: scaleValue,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(elevation, {
        toValue: pressedElevation,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(elevation, {
        toValue: initialElevation,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { scale, elevation, onPressIn, onPressOut };
};

// ============================================
// Modal Animations
// ============================================

export const useModalAnimation = () => {
  const backdropOpacity = new Animated.Value(0);
  const contentTranslateY = new Animated.Value(100);
  const contentScale = new Animated.Value(0.95);
  const contentOpacity = new Animated.Value(0);

  const open = (callback?: () => void) => {
    Animated.parallel([
      fadeIn(backdropOpacity, animationConfig.duration.normal),
      Animated.spring(contentTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      fadeIn(contentOpacity, animationConfig.duration.normal),
    ]).start(callback);
  };

  const close = (callback?: () => void) => {
    Animated.parallel([
      fadeOut(backdropOpacity, animationConfig.duration.fast),
      Animated.timing(contentTranslateY, {
        toValue: 100,
        duration: animationConfig.duration.fast,
        easing: animationConfig.easing.smooth,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.95,
        duration: animationConfig.duration.fast,
        useNativeDriver: true,
      }),
      fadeOut(contentOpacity, animationConfig.duration.fast),
    ]).start(callback);
  };

  const backdropStyle = { opacity: backdropOpacity };
  const contentStyle = {
    transform: [{ translateY: contentTranslateY }, { scale: contentScale }],
    opacity: contentOpacity,
  };

  return { backdropStyle, contentStyle, open, close };
};

// ============================================
// Page Transition Animations
// ============================================

export const usePageTransition = () => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(20);

  const enter = (callback?: () => void) => {
    Animated.parallel([
      fadeIn(opacity, animationConfig.duration.normal),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const exit = (callback?: () => void) => {
    Animated.parallel([
      fadeOut(opacity, animationConfig.duration.fast),
      Animated.timing(translateY, {
        toValue: -20,
        duration: animationConfig.duration.fast,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const style = {
    opacity,
    transform: [{ translateY }],
  };

  return { style, enter, exit };
};

// ============================================
// Utility Functions
// ============================================

export const interpolateValue = (
  value: Animated.Value,
  inputRange: number[],
  outputRange: number[] | string[]
) => {
  return value.interpolate({
    inputRange,
    outputRange,
  });
};

export const createPulseAnimation = (
  value: Animated.Value,
  min: number = 0.95,
  max: number = 1.05,
  duration: number = 1000
) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: max,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: min,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

export default {
  fadeIn,
  fadeOut,
  scalePress,
  slideIn,
  slideOut,
  staggerFadeIn,
  staggerSlideIn,
  useFadeAnimation,
  useScaleAnimation,
  useElevationAnimation,
  useSlideAnimation,
  useStaggerAnimation,
  usePressAnimation,
  useModalAnimation,
  usePageTransition,
  interpolateValue,
  createPulseAnimation,
  config: animationConfig,
};
