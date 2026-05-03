import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCachedAIResponse,
  setCachedAIResponse,
  getCachedGeoResult,
  setCachedGeoResult,
  clearAllCache,
} from '../services/cacheService';

describe('Cache Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('AI Response Cache', () => {
    it('should return null for a cache miss', () => {
      expect(getCachedAIResponse('unknown query')).toBeNull();
    });

    it('should cache and retrieve an AI response', () => {
      const mockResponse = { text: 'Test response', intent: 'general' };
      setCachedAIResponse('how to vote', mockResponse);

      const cached = getCachedAIResponse('how to vote');
      expect(cached).toEqual(mockResponse);
    });

    it('should normalize query keys to lowercase', () => {
      setCachedAIResponse('HOW TO VOTE', { text: 'Response' });
      expect(getCachedAIResponse('how to vote')).toBeDefined();
    });
  });

  describe('Geo Result Cache', () => {
    it('should return null for a cache miss', () => {
      expect(getCachedGeoResult('unknown')).toBeNull();
    });

    it('should cache and retrieve a geo result', () => {
      const location = { lat: 28.6, lng: 77.2 };
      setCachedGeoResult('Delhi', location);

      const cached = getCachedGeoResult('Delhi');
      expect(cached).toEqual(location);
    });
  });

  describe('clearAllCache', () => {
    it('should clear both AI and Geo caches', () => {
      setCachedAIResponse('test', { text: 'hi' });
      setCachedGeoResult('test', { lat: 0, lng: 0 });

      clearAllCache();

      expect(getCachedAIResponse('test')).toBeNull();
      expect(getCachedGeoResult('test')).toBeNull();
    });
  });

  describe('Cache eviction', () => {
    it('should evict oldest entry when cache exceeds max size', () => {
      // Fill cache beyond max size (50)
      for (let i = 0; i < 52; i++) {
        setCachedAIResponse(`query_${i}`, { text: `response_${i}` });
      }

      // The first two entries should have been evicted
      expect(getCachedAIResponse('query_0')).toBeNull();
      expect(getCachedAIResponse('query_1')).toBeNull();

      // Recent entries should still exist
      expect(getCachedAIResponse('query_51')).toBeDefined();
    });
  });
});
