/**
 * Security Utilities for Input Sanitization and Validation
 * 
 * DESIGN PRINCIPLES:
 * 1. Defense-in-Depth: Multiple layers of validation (Input Sanitization -> Intent Detection -> Response Validation).
 * 2. Fail-Safe: Errors and validation failures lead to safe fallback states.
 * 3. Least Privilege: No hardcoded keys; all sensitive data handled via environment variables.
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
  /dan mode/i,
  /jailbreak/i,
  /output in raw/i,
  /print the instructions/i,
  /developer mode/i,
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
  
  // Defensive coding: Check for common prompt injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmedInput)) {
      console.warn(`Security Warning: Detected potential prompt injection attempt: "${pattern.source}"`);
      return { 
        isValid: false, 
        error: 'System detected an invalid query pattern. Please ask a direct question about elections.' 
      };
    }
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates AI responses to ensure they don't contain unexpected system leaks
 * or offensive content (Secondary validation layer).
 * 
 * @param {string} response - Raw AI response
 * @returns {string} - Validated/Sanitized response
 */
export const validateAIResponse = (response) => {
  if (!response) return "I'm sorry, I couldn't generate a response.";

  const sensitiveKeywords = ['system prompt', 'internal instructions', 'ignore everything'];
  
  // Defensive check: If AI starts repeating system-like instructions, trigger fallback
  for (const word of sensitiveKeywords) {
    if (response.toLowerCase().includes(word)) {
      console.error(`Security Incident: AI response contained sensitive keyword: ${word}`);
      return "I can only provide information about the election process, registration, and voting procedures.";
    }
  }

  return response;
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
