/**
 * Security Utilities for Input Sanitization and Validation
 */

// Maximum allowed length for user input to prevent resource exhaustion or long prompt injection
const MAX_INPUT_LENGTH = 500;

// Patterns that might indicate prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore previous instructions/i,
  /disregard previous instructions/i,
  /system prompt/i,
  /you are now/i,
  /forget everything/i,
  /instead of your usual/i,
];

/**
 * Sanitizes user input by removing HTML tags and trimming.
 * 
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags using a simple regex
  let sanitized = input.replace(/<[^>]*>?/gm, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Truncate if too long
  if (sanitized.length > MAX_INPUT_LENGTH) {
    sanitized = sanitized.substring(0, MAX_INPUT_LENGTH);
  }
  
  return sanitized;
};

/**
 * Validates user input for basic safety and prompt injection.
 * 
 * @param {string} input - Sanitized user input
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateInput = (input) => {
  const trimmedInput = (input || '').trim();
  if (!trimmedInput || trimmedInput.length < 2) {
    return { isValid: false, error: 'Message is too short.' };
  }
  
  // Check for common prompt injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return { 
        isValid: false, 
        error: 'System detected an invalid query pattern. Please ask a direct question about elections.' 
      };
    }
  }
  
  return { isValid: true, error: null };
};

/**
 * Simple rate limiter helper using localStorage
 * 
 * @param {string} key - Unique key for the action (e.g. 'chat_cooldown')
 * @param {number} cooldownMs - Cooldown duration in milliseconds
 * @returns {boolean} - True if action is allowed, false if rate limited
 */
export const checkRateLimit = (key, cooldownMs = 2000) => {
  const now = Date.now();
  const lastAction = localStorage.getItem(key);
  
  if (lastAction && (now - parseInt(lastAction)) < cooldownMs) {
    return false;
  }
  
  localStorage.setItem(key, now.toString());
  return true;
};
