/**
 * Form Validation Utilities
 * Provides validation functions for common form fields
 */

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validation rules type
export type ValidationRule<T> = (value: T) => ValidationResult;

/**
 * Email validation
 * Validates email format using RFC 5322 standard
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Indian mobile number validation
 * Validates 10-digit mobile numbers with optional +91 or 0 prefix
 */
export const validateIndianMobile = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Mobile number is required' };
  }

  // Remove spaces, dashes, and common prefixes
  const cleaned = phone.replace(/[\s\-]/g, '').replace(/^(\+91|0)/, '');
  
  // Validate 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return { isValid: false, error: 'Please enter a valid 10-digit mobile number' };
  }

  // Check for valid starting digits (6-9)
  if (!/^[6-9]/.test(cleaned)) {
    return { isValid: false, error: 'Mobile number should start with 6, 7, 8, or 9' };
  }

  // Check for repetitive digits
  if (/^(\d)\1{9}$/.test(cleaned)) {
    return { isValid: false, error: 'Invalid mobile number' };
  }

  return { isValid: true };
};

/**
 * Price validation
 * Validates positive numeric prices with up to 2 decimal places
 */
export const validatePrice = (price: string | number, maxPrice: number = 1000000): ValidationResult => {
  const priceStr = typeof price === 'number' ? price.toString() : price;
  
  if (!priceStr || priceStr.trim() === '') {
    return { isValid: false, error: 'Price is required' };
  }

  const numPrice = parseFloat(priceStr);
  
  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Please enter a valid price' };
  }

  if (numPrice <= 0) {
    return { isValid: false, error: 'Price must be greater than 0' };
  }

  if (numPrice > maxPrice) {
    return { isValid: false, error: `Price cannot exceed ₹${maxPrice.toLocaleString()}` };
  }

  // Check decimal places
  const decimalPlaces = (priceStr.split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { isValid: false, error: 'Price can have maximum 2 decimal places' };
  }

  return { isValid: true };
};

/**
 * Quantity validation
 * Validates positive numeric quantities
 */
export const validateQuantity = (quantity: string | number, maxQuantity: number = 10000): ValidationResult => {
  const qtyStr = typeof quantity === 'number' ? quantity.toString() : quantity;
  
  if (!qtyStr || qtyStr.trim() === '') {
    return { isValid: false, error: 'Quantity is required' };
  }

  const numQty = parseFloat(qtyStr);
  
  if (isNaN(numQty)) {
    return { isValid: false, error: 'Please enter a valid quantity' };
  }

  if (numQty <= 0) {
    return { isValid: false, error: 'Quantity must be greater than 0' };
  }

  if (numQty > maxQuantity) {
    return { isValid: false, error: `Quantity cannot exceed ${maxQuantity}` };
  }

  return { isValid: true };
};

/**
 * Name validation
 * Validates names with minimum and maximum length
 */
export const validateName = (
  name: string, 
  options: { minLength?: number; maxLength?: number; fieldName?: string } = {}
): ValidationResult => {
  const { minLength = 2, maxLength = 50, fieldName = 'Name' } = options;
  
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  if (trimmedName.length > maxLength) {
    return { isValid: false, error: `${fieldName} cannot exceed ${maxLength} characters` };
  }

  // Check for valid characters (letters, spaces, and common name characters)
  if (!/^[a-zA-Z\s\-\.\']+$/.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }

  // Check for consecutive spaces
  if (/\s{2,}/.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} cannot have consecutive spaces` };
  }

  return { isValid: true };
};

/**
 * Required field validation
 * Validates that a field is not empty
 */
export const validateRequired = (value: string, fieldName: string = 'This field'): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

/**
 * PIN code validation
 * Validates Indian 6-digit PIN codes
 */
export const validatePincode = (pincode: string): ValidationResult => {
  if (!pincode || pincode.trim() === '') {
    return { isValid: false, error: 'PIN code is required' };
  }

  if (!/^\d{6}$/.test(pincode)) {
    return { isValid: false, error: 'PIN code must be 6 digits' };
  }

  // Check for valid starting digit (1-9)
  if (!/^[1-9]/.test(pincode)) {
    return { isValid: false, error: 'Invalid PIN code' };
  }

  return { isValid: true };
};

/**
 * Compose multiple validation rules
 * Runs all validators and returns first error
 */
export const composeValidators = <T,>(...validators: ValidationRule<T>[]): ValidationRule<T> => {
  return (value: T) => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
};

// Default export with all validators
export default {
  email: validateEmail,
  mobile: validateIndianMobile,
  price: validatePrice,
  quantity: validateQuantity,
  name: validateName,
  required: validateRequired,
  pincode: validatePincode,
  compose: composeValidators,
};
