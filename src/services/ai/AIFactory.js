import GeminiProvider from './GeminiProvider';

/**
 * AI Factory - Centralized entry point for AI services.
 * Demonstrates the Factory Pattern to decouple component logic from specific AI implementations.
 */
class AIFactory {
  /** @type {Object<string, AIProvider>} */
  static instances = {};

  /**
   * Returns an AI provider instance.
   * @param {string} type - The provider type ('gemini' is supported)
   * @param {string} apiKey - The API key for the provider
   * @returns {AIProvider}
   */
  static getProvider(type = 'gemini', apiKey) {
    if (!apiKey) {
      throw new Error("API Key is required to initialize AI Provider");
    }

    const cacheKey = `${type}_${apiKey.substring(0, 5)}`;
    
    if (!this.instances[cacheKey]) {
      switch (type.toLowerCase()) {
        case 'gemini':
          this.instances[cacheKey] = new GeminiProvider(apiKey);
          break;
        default:
          throw new Error(`Unsupported AI Provider type: ${type}`);
      }
    }

    return this.instances[cacheKey];
  }
}

export default AIFactory;
