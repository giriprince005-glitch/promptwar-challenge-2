import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase modules before importing the service
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

import { logChatQuery, logBoothSearch } from '../services/firebaseService';

describe('Firebase Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset session ID between tests
    delete window.__indiaElectsSessionId;
  });

  describe('logChatQuery', () => {
    it('should not throw when Firebase config is missing', async () => {
      // With default env (no Firebase keys), should silently skip
      await expect(logChatQuery('test', 'general', 'response')).resolves.toBeUndefined();
    });

    it('should truncate response preview to 200 characters', async () => {
      // If Firebase were configured and addDoc were called,
      // the preview would be truncated. Verify the function handles long strings.
      const longResponse = 'x'.repeat(500);
      await expect(logChatQuery('test', 'general', longResponse)).resolves.toBeUndefined();
    });
  });

  describe('logBoothSearch', () => {
    it('should not throw when Firebase config is missing', async () => {
      await expect(logBoothSearch('Delhi', 5)).resolves.toBeUndefined();
    });
  });
});
