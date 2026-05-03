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
    this.genAI = new GoogleGenAI({ apiKey });
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

      // 2. Call Gemini API using @google/genai syntax
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contextPrompt
      });
      
      // The response object in @google/genai has a 'text' property
      let text = response.text || "I'm sorry, I couldn't generate a response.";

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
