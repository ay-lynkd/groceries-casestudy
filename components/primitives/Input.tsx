import { theme } from '@/theme/appTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ViewStyle,
  TextInputProps,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  error?: string;
  label?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  secureTextEntry,
  keyboardType = 'default',
  error,
  label,
  disabled = false,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  const isPassword = secureTextEntry;
  const effectiveSecureTextEntry = isPassword ? !isPasswordVisible : false;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          error && styles.containerError,
          disabled && styles.containerDisabled,
          style,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={22}
            color={error ? theme.colors.status.error : isFocused ? theme.colors.primary.green : theme.colors.text.secondary}
            style={styles.iconLeft}
          />
        )}
        
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.light}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          secureTextEntry={effectiveSecureTextEntry}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          {...textInputProps}
        />
        
        {isPassword && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <TouchableOpacity 
            onPress={onRightIconPress}
            style={styles.iconButton}
            disabled={!onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={rightIcon}
              size={22}
              color={onRightIconPress ? theme.colors.primary.green : theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

// Text component for error message
import { Text } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.border.light,
  },
  containerFocused: {
    borderColor: theme.colors.primary.green,
    elevation: 2,
    shadowColor: theme.colors.primary.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  containerError: {
    borderColor: theme.colors.status.error,
  },
  containerDisabled: {
    backgroundColor: theme.colors.background.secondary,
    opacity: 0.7,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
  iconLeft: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.figtree,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    paddingVertical: 0,
    marginVertical: 0,
    textAlignVertical: 'center',
  },
  iconButton: {
    padding: 4,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
});

export default Input;
