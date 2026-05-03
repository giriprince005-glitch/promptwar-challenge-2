import { GoogleGenAI } from '@google/genai';
import { detectIntent, buildContextPrompt, getNavigation, getFallbackResponse } from './aiService';
import { sanitizeInput, validateAIResponse } from '../../utils/security';

/**
 * @implements {AIProvider}
 */
class GeminiProvider {
  /**
   * @param {string} apiKey - Google Gemini API Key
   */
  constructor(apiKey) {
    // Defensive check: Ensure API key is present
    if (!apiKey) {
      throw new Error('Gemini API Key is missing. Check your environment variables.');
    }
    this.apiKey = apiKey;
    this.genAI = new GoogleGenAI(apiKey);
  }

  /**
   * Generates a context-aware response using Gemini Pro.
   * Includes security sanitization and response validation.
   * @param {string} userMessage - The user's input string
   * @returns {Promise<import('./types').AIResponse>}
   */
  async generateResponse(userMessage) {
    try {
      // 1. Sanitize user input (defensive coding)
      const sanitizedMessage = sanitizeInput(userMessage);
      
      const intent = detectIntent(sanitizedMessage);
      const contextPrompt = buildContextPrompt(sanitizedMessage, intent);
      const navigation = getNavigation(intent);

      // 2. Call Gemini API
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      let text = response.text();

      // 3. Validate AI response for safety/leaks
      text = validateAIResponse(text);

      return {
        text,
        intent,
        navigation,
      };
    } catch (error) {
      console.error("GeminiProvider Error:", error);
      const fallback = getFallbackResponse();
      // Augment fallback with error context
      return {
        ...fallback,
        text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment."
      };
    }
  }
}

export default GeminiProvider;
