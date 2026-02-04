/**
 * Accessibility Utilities
 * Helper functions for creating accessible components
 */

import { AccessibilityProps, AccessibilityRole, AccessibilityState } from 'react-native';

// ARIA label builder
export const a11y = {
  // Button with action description
  button: (label: string, hint?: string): AccessibilityProps => ({
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: { disabled: false },
  }),

  // Disabled button
  disabledButton: (label: string): AccessibilityProps => ({
    accessibilityRole: 'button',
    accessibilityLabel: `${label} (disabled)`,
    accessibilityState: { disabled: true },
  }),

  // Link
  link: (label: string, hint?: string): AccessibilityProps => ({
    accessibilityRole: 'link',
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),

  // Header
  header: (level: 1 | 2 | 3 | 4 | 5 | 6 = 1): AccessibilityProps => ({
    accessibilityRole: 'header',
    accessibilityLabel: `Heading level ${level}`,
  }),

  // Image with description
  image: (label: string): AccessibilityProps => ({
    accessibilityRole: 'image',
    accessibilityLabel: label,
  }),

  // Search input
  search: (placeholder?: string): AccessibilityProps => ({
    accessibilityRole: 'search',
    accessibilityLabel: placeholder || 'Search',
    accessibilityHint: 'Enter search terms',
  }),

  // Text input
  textInput: (label: string, hint?: string, required?: boolean): AccessibilityProps => ({
    accessibilityRole: 'text',
    accessibilityLabel: `${label}${required ? ' (required)' : ''}`,
    accessibilityHint: hint,
  }),

  // Checkbox
  checkbox: (label: string, checked: boolean): AccessibilityProps => ({
    accessibilityRole: 'checkbox',
    accessibilityLabel: label,
    accessibilityState: { checked },
  }),

  // Switch/Toggle
  switch: (label: string, checked: boolean): AccessibilityProps => ({
    accessibilityRole: 'switch',
    accessibilityLabel: label,
    accessibilityState: { checked },
  }),

  // Tab
  tab: (label: string, selected: boolean): AccessibilityProps => ({
    accessibilityRole: 'tab',
    accessibilityLabel: label,
    accessibilityState: { selected },
  }),

  // Selected state
  selected: (selected: boolean): { accessibilityState: AccessibilityState } => ({
    accessibilityState: { selected },
  }),

  // Busy/Loading state
  busy: (isBusy: boolean): { accessibilityState: AccessibilityState } => ({
    accessibilityState: { busy: isBusy },
  }),

  // Hidden from screen reader
  hidden: (): AccessibilityProps => ({
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  }),

  // Live region for announcements
  liveRegion: (type: 'polite' | 'assertive' = 'polite'): AccessibilityProps => ({
    accessibilityLiveRegion: type,
  }),

  // Announce to screen reader
  announce: (message: string): void => {
    // This would use AccessibilityInfo.announceForAccessibility in a real app
    console.log(`[A11y Announce] ${message}`);
  },
};

// Focus management
export const focusManager = {
  // Set focus to an element (would need ref implementation)
  setFocus: (ref: React.RefObject<any>) => {
    if (ref.current?.focus) {
      ref.current.focus();
    }
  },

  // Announce page change
  announceScreenChange: (screenName: string) => {
    a11y.announce(`${screenName} screen loaded`);
  },

  // Announce action completion
  announceAction: (action: string, success: boolean) => {
    a11y.announce(`${action} ${success ? 'completed successfully' : 'failed'}`);
  },
};

// Color contrast checker
export const contrastChecker = {
  // Calculate relative luminance
  getLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio
  getContrastRatio: (color1: string, color2: string): number => {
    // Parse hex colors
    const parseColor = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
          ]
        : [0, 0, 0];
    };

    const [r1, g1, b1] = parseColor(color1);
    const [r2, g2, b2] = parseColor(color2);

    const lum1 = contrastChecker.getLuminance(r1, g1, b1);
    const lum2 = contrastChecker.getLuminance(r2, g2, b2);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsWCAG: (
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    largeText: boolean = false
  ): boolean => {
    const ratio = contrastChecker.getContrastRatio(foreground, background);
    const threshold = level === 'AAA' ? (largeText ? 4.5 : 7) : largeText ? 3 : 4.5;
    return ratio >= threshold;
  },
};

// Accessible touch targets
export const touchTargets = {
  minSize: 44, // WCAG 2.5.5 recommends 44x44 CSS pixels
  minSpacing: 8, // Minimum spacing between touch targets
};

// Semantic headings
export const headings = {
  h1: { accessibilityRole: 'header', accessibilityLevel: 1 },
  h2: { accessibilityRole: 'header', accessibilityLevel: 2 },
  h3: { accessibilityRole: 'header', accessibilityLevel: 3 },
  h4: { accessibilityRole: 'header', accessibilityLevel: 4 },
};

export default a11y;
