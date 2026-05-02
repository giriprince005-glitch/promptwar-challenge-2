import { describe, it, expect } from 'vitest';
import { detectIntent, INTENTS } from '../services/aiService';

describe('AI Service - Intent Detection', () => {
  it('should detect REGISTRATION intent for queries about signing up to vote', () => {
    const query = 'How can I register as a new voter?';
    expect(detectIntent(query)).toBe(INTENTS.REGISTRATION);
  });

  it('should detect BOOTH_FINDER intent for queries about polling locations', () => {
    const query = 'Where is my nearest polling booth?';
    expect(detectIntent(query)).toBe(INTENTS.BOOTH_FINDER);
  });

  it('should detect LEARNING intent for queries about terminology', () => {
    const query = 'What is the full form of EVM?';
    expect(detectIntent(query)).toBe(INTENTS.LEARNING);
  });

  it('should default to GENERAL intent for unrelated queries', () => {
    const query = 'Tell me a joke about elections';
    expect(detectIntent(query)).toBe(INTENTS.GENERAL);
  });
});
