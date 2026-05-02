/**
 * Cache Service
 * 
 * Handles caching for AI responses and Geocoding results
 * to reduce API usage and improve speed for repeated queries.
 */

const CACHE_PREFIX = 'india_elects_cache_';
const AI_CACHE_KEY = `${CACHE_PREFIX}ai_responses`;
const GEO_CACHE_KEY = `${CACHE_PREFIX}geo_results`;

// Max items to keep in cache to prevent storage bloat
const MAX_CACHE_SIZE = 50;

/**
 * Get a cached value
 * 
 * @param {string} cacheKey - The key category (AI or GEO)
 * @param {string} query - The query string (normalized)
 * @returns {any|null} - Cached value or null
 */
const getCachedValue = (cacheKey, query) => {
  try {
    const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    const normalizedQuery = query.toLowerCase().trim();
    return cache[normalizedQuery] || null;
  } catch (e) {
    return null;
  }
};

/**
 * Set a cached value
 * 
 * @param {string} cacheKey - The key category
 * @param {string} query - The query string
 * @param {any} value - The value to cache
 */
const setCachedValue = (cacheKey, query, value) => {
  try {
    const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    const normalizedQuery = query.toLowerCase().trim();
    
    // Add new value
    cache[normalizedQuery] = value;
    
    // Simple cache eviction (FIFO-ish based on key count)
    const keys = Object.keys(cache);
    if (keys.length > MAX_CACHE_SIZE) {
      delete cache[keys[0]];
    }
    
    localStorage.setItem(cacheKey, JSON.stringify(cache));
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
};

// --- Specialized Exports ---

export const getCachedAIResponse = (query) => getCachedValue(AI_CACHE_KEY, query);
export const setCachedAIResponse = (query, response) => setCachedValue(AI_CACHE_KEY, query, response);

export const getCachedGeoResult = (query) => getCachedValue(GEO_CACHE_KEY, query);
export const setCachedGeoResult = (query, result) => setCachedValue(GEO_CACHE_KEY, query, result);

export const clearAllCache = () => {
  localStorage.removeItem(AI_CACHE_KEY);
  localStorage.removeItem(GEO_CACHE_KEY);
};
