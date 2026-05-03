import { GoogleGenAI } from '@google/genai';
import { detectIntent, buildContextPrompt, getNavigation, getFallbackResponse } from './aiService';

/**
 * @implements {AIProvider}
 */
class GeminiProvider {
  /**
   * @param {string} apiKey - Google Gemini API Key
   */
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenAI(apiKey);
  }

  /**
   * Generates a context-aware response using Gemini Pro.
   * @param {string} userMessage - The user's input string
   * @returns {Promise<import('./types').AIResponse>}
   */
  async generateResponse(userMessage) {
    try {
      const intent = detectIntent(userMessage);
      const contextPrompt = buildContextPrompt(userMessage, intent);
      const navigation = getNavigation(intent);

      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();

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
