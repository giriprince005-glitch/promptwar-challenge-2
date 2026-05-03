import { describe, it, expect } from 'vitest';
import AIFactory from '../services/ai/AIFactory';
import GeminiProvider from '../services/ai/GeminiProvider';

describe('AIFactory', () => {
  it('should create and return a GeminiProvider instance', () => {
    const provider = AIFactory.getProvider('gemini', 'fake-api-key');
    expect(provider).toBeInstanceOf(GeminiProvider);
  });

  it('should throw an error if no API key is provided', () => {
    expect(() => AIFactory.getProvider('gemini', null)).toThrow('API Key is required');
  });

  it('should reuse the same instance for the same key (singleton pattern)', () => {
    const p1 = AIFactory.getProvider('gemini', 'key-1');
    const p2 = AIFactory.getProvider('gemini', 'key-1');
    expect(p1).toBe(p2);
  });

  it('should throw for unsupported provider types', () => {
    expect(() => AIFactory.getProvider('unsupported-ai', 'key')).toThrow('Unsupported AI Provider');
  });
});
