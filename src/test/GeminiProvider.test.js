import { describe, it, expect, vi, beforeEach } from 'vitest';
import GeminiProvider from '../services/ai/GeminiProvider';
import { GoogleGenAI } from '@google/genai';

vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();
  return {
    GoogleGenAI: vi.fn(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    }))
  };
});

describe('GeminiProvider', () => {
  let provider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new GeminiProvider('test-key');
  });

  it('should throw if no API key is provided', () => {
    expect(() => new GeminiProvider()).toThrow('Gemini API Key is missing.');
  });

  it('should generate a response successfully', async () => {
    // We need to mock the genAI instance created inside the provider
    const mockGenerateContent = vi.fn().mockResolvedValue({
      text: 'This is a mocked response'
    });
    provider.genAI.models.generateContent = mockGenerateContent;

    const response = await provider.generateResponse('Hello');
    expect(response.text).toBe('This is a mocked response');
    expect(response.intent).toBeDefined();
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('should handle RECITATION block reason', async () => {
    const mockGenerateContent = vi.fn().mockResolvedValue({
      text: '',
      candidates: [{ finishReason: 'RECITATION' }]
    });
    provider.genAI.models.generateContent = mockGenerateContent;

    const response = await provider.generateResponse('list IDs');
    expect(response.text).toContain('safety filters');
  });

  it('should handle empty text without RECITATION', async () => {
    const mockGenerateContent = vi.fn().mockResolvedValue({
      text: ''
    });
    provider.genAI.models.generateContent = mockGenerateContent;

    const response = await provider.generateResponse('test');
    expect(response.text).toBe("I'm sorry, I couldn't generate a response.");
  });

  it('should handle errors gracefully', async () => {
    const mockGenerateContent = vi.fn().mockRejectedValue(new Error('API Error'));
    provider.genAI.models.generateContent = mockGenerateContent;

    const response = await provider.generateResponse('test');
    expect(response.text).toContain('having trouble connecting');
  });
});
