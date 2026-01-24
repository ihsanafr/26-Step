/**
 * Email validation utility
 * Validates email format using RFC 5322 compliant regex
 */

export const validateEmail = (email: string): { valid: boolean; message?: string } => {
  if (!email || email.trim() === '') {
    return { valid: false, message: 'Email is required' };
  }

  // RFC 5322 compliant email regex (simplified but comprehensive)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  // Additional checks
  if (email.length > 255) {
    return { valid: false, message: 'Email must not exceed 255 characters' };
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return { valid: false, message: 'Email cannot contain consecutive dots' };
  }

  // Check for leading/trailing dots in local part
  const [localPart, domain] = email.split('@');
  if (localPart && (localPart.startsWith('.') || localPart.endsWith('.'))) {
    return { valid: false, message: 'Email cannot start or end with a dot' };
  }

  // Check domain
  if (!domain || domain.length === 0) {
    return { valid: false, message: 'Email must have a valid domain' };
  }

  if (domain.startsWith('.') || domain.endsWith('.')) {
    return { valid: false, message: 'Domain cannot start or end with a dot' };
  }

  // Check for valid TLD (at least 2 characters)
  const domainParts = domain.split('.');
  if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return { valid: false, message: 'Email must have a valid top-level domain' };
  }

  return { valid: true };
};

/**
 * Password strength validation
 */
export const validatePassword = (password: string): { 
  valid: boolean; 
  strength: 'weak' | 'medium' | 'strong';
  message?: string;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
} => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (metRequirements >= 4) {
    strength = password.length >= 12 ? 'strong' : 'medium';
  } else if (metRequirements >= 3) {
    strength = 'medium';
  }

  const valid = requirements.minLength;

  let message: string | undefined;
  if (!valid) {
    message = 'Password must be at least 8 characters long';
  }

  return {
    valid,
    strength,
    message,
    requirements,
  };
};

/**
 * Name validation
 */
export const validateName = (name: string): { valid: boolean; message?: string } => {
  if (!name || name.trim() === '') {
    return { valid: false, message: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters long' };
  }

  if (name.length > 255) {
    return { valid: false, message: 'Name must not exceed 255 characters' };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true };
};
