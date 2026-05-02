import { GoogleGenAI } from '@google/genai';
import { detectIntent, buildContextPrompt, getNavigation, getFallbackResponse } from './aiService';

/**
 * Service to interact with Gemini API.
 * Now uses the AI Service layer for intent detection
 * and context-aware prompt building.
 */

/**
 * Sends a user message through the intent detection pipeline,
 * builds a context-aware prompt, and queries Gemini.
 * 
 * @param {string} userMessage - The raw user message
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<object>} - { text, intent, navigation }
 */
export const askAssistant = async (userMessage, apiKey) => {
  try {
    // 1. Detect user intent
    const intent = detectIntent(userMessage);

    // 2. Build a context-aware prompt based on intent
    const contextPrompt = buildContextPrompt(userMessage, intent);

    // 3. Get navigation suggestion (if applicable)
    const navigation = getNavigation(intent);

    // 4. Call Gemini API with the enriched prompt
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { 
          role: 'user', 
          parts: [{ text: contextPrompt }] 
        }
      ]
    });

    const responseText = response.text || "I'm sorry, I couldn't process that request.";

    return {
      text: responseText,
      intent,
      navigation,
    };
  } catch (error) {
    console.error("Gemini Service Error:", error);
    
    // Return fallback for API errors
    const fallback = getFallbackResponse();
    fallback.text = "Sorry, I encountered an error connecting to the knowledge base. Please try again later.";
    throw error;
  }
};
