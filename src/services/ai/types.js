/**
 * @typedef {Object} AIResponse
 * @property {string} text - The AI generated text response
 * @property {string} intent - The detected user intent
 * @property {Object|null} navigation - Navigation suggestion object
 * @property {string} navigation.component - Target component name
 * @property {string} navigation.label - Label for the navigation action
 * @property {string} navigation.suggestion - Explanation for the suggestion
 */

/**
 * @typedef {Object} AIProvider
 * @property {function(string, string): Promise<AIResponse>} generateResponse - Function to get AI response
 */

export {};
