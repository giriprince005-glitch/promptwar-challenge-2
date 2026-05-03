import { describe, it, expect } from 'vitest';
import {
  detectIntent,
  buildContextPrompt,
  getNavigation,
  getFallbackResponse,
  analyzeBehavior,
  INTENTS,
  RECOMMENDATIONS,
} from '../services/ai/aiService';

describe('AI Service', () => {
  // ─── Intent Detection ──────────────────────────────────────────
  describe('detectIntent', () => {
    it('should detect REGISTRATION for voter registration queries', () => {
      expect(detectIntent('How can I register as a new voter?')).toBe(INTENTS.REGISTRATION);
    });

    it('should detect REGISTRATION for voter ID queries', () => {
      expect(detectIntent('Where do I get my voter id?')).toBe(INTENTS.REGISTRATION);
    });

    it('should detect REGISTRATION for eligibility queries', () => {
      expect(detectIntent('What is the eligibility to vote?')).toBe(INTENTS.REGISTRATION);
    });

    it('should detect RESULTS for schedule queries', () => {
      expect(detectIntent('When is the election schedule?')).toBe(INTENTS.RESULTS);
    });

    it('should detect RESULTS for timeline queries', () => {
      expect(detectIntent('Show me the election timeline')).toBe(INTENTS.RESULTS);
    });

    it('should detect LEARNING for EVM queries', () => {
      expect(detectIntent('What is EVM?')).toBe(INTENTS.LEARNING);
    });

    it('should detect LEARNING for VVPAT queries', () => {
      expect(detectIntent('Explain how VVPAT works')).toBe(INTENTS.LEARNING);
    });

    it('should detect POLLING for polling day queries', () => {
      expect(detectIntent('What happens on polling day?')).toBe(INTENTS.POLLING);
    });

    it('should detect POLLING for casting vote queries', () => {
      expect(detectIntent('How do I cast vote?')).toBe(INTENTS.POLLING);
    });

    it('should detect BOOTH_FINDER for booth queries', () => {
      expect(detectIntent('Where is my nearest polling booth?')).toBe(INTENTS.BOOTH_FINDER);
    });

    it('should detect BOOTH_FINDER for "where to vote" queries', () => {
      expect(detectIntent('Where to vote in Delhi?')).toBe(INTENTS.BOOTH_FINDER);
    });

    it('should default to GENERAL for unrelated queries', () => {
      expect(detectIntent('Tell me a joke about elections')).toBe(INTENTS.GENERAL);
    });

    it('should be case-insensitive', () => {
      expect(detectIntent('HOW DO I REGISTER TO VOTE?')).toBe(INTENTS.REGISTRATION);
    });

    it('should handle whitespace-padded input', () => {
      expect(detectIntent('  register to vote  ')).toBe(INTENTS.REGISTRATION);
    });
  });

  // ─── Prompt Building ───────────────────────────────────────────
  describe('buildContextPrompt', () => {
    it('should include the user message in the prompt', () => {
      const prompt = buildContextPrompt('How to register?', INTENTS.REGISTRATION);
      expect(prompt).toContain('How to register?');
    });

    it('should include CORE_RULES in every prompt', () => {
      const prompt = buildContextPrompt('test', INTENTS.GENERAL);
      expect(prompt).toContain('CRITICAL RULES');
      expect(prompt).toContain('NEVER express a political opinion');
    });

    it('should include registration-specific context for REGISTRATION intent', () => {
      const prompt = buildContextPrompt('test', INTENTS.REGISTRATION);
      expect(prompt).toContain('Form 6');
      expect(prompt).toContain('Voter Service Portal');
    });

    it('should include learning-specific context for LEARNING intent', () => {
      const prompt = buildContextPrompt('test', INTENTS.LEARNING);
      expect(prompt).toContain('terminology');
    });

    it('should fall back to GENERAL context for unknown intents', () => {
      const prompt = buildContextPrompt('test', 'nonexistent_intent');
      expect(prompt).toContain('neutral');
    });
  });

  // ─── Navigation Mapping ────────────────────────────────────────
  describe('getNavigation', () => {
    it('should return wizard component for REGISTRATION intent', () => {
      const nav = getNavigation(INTENTS.REGISTRATION);
      expect(nav).not.toBeNull();
      expect(nav.component).toBe('wizard');
    });

    it('should return timeline component for RESULTS intent', () => {
      const nav = getNavigation(INTENTS.RESULTS);
      expect(nav.component).toBe('timeline');
    });

    it('should return flashcards component for LEARNING intent', () => {
      const nav = getNavigation(INTENTS.LEARNING);
      expect(nav.component).toBe('flashcards');
    });

    it('should return booth component for BOOTH_FINDER intent', () => {
      const nav = getNavigation(INTENTS.BOOTH_FINDER);
      expect(nav.component).toBe('booth');
    });

    it('should return null for GENERAL intent', () => {
      expect(getNavigation(INTENTS.GENERAL)).toBeNull();
    });

    it('should return null for an unknown intent', () => {
      expect(getNavigation('unknown')).toBeNull();
    });
  });

  // ─── Fallback Response ─────────────────────────────────────────
  describe('getFallbackResponse', () => {
    it('should return a valid response object', () => {
      const fallback = getFallbackResponse();
      expect(fallback).toHaveProperty('text');
      expect(fallback).toHaveProperty('intent', INTENTS.GENERAL);
      expect(fallback).toHaveProperty('navigation', null);
    });

    it('should return a new object each time (not a shared reference)', () => {
      const a = getFallbackResponse();
      const b = getFallbackResponse();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });
  });

  // ─── Behavior Analysis & Recommendations ──────────────────────
  describe('analyzeBehavior', () => {
    it('should recommend LEARN_MODE for broad educational queries', () => {
      const result = analyzeBehavior('how do elections work', INTENTS.GENERAL);
      expect(result).toEqual(RECOMMENDATIONS.LEARN_MODE);
    });

    it('should recommend WIZARD for first-time voter queries', () => {
      const result = analyzeBehavior('I am a first time voter', INTENTS.GENERAL);
      expect(result).toEqual(RECOMMENDATIONS.WIZARD);
    });

    it('should recommend WIZARD for REGISTRATION intent', () => {
      const result = analyzeBehavior('documents needed', INTENTS.REGISTRATION);
      expect(result).toEqual(RECOMMENDATIONS.WIZARD);
    });

    it('should recommend FLASHCARDS for confused users', () => {
      const result = analyzeBehavior("I don't understand EVM", INTENTS.GENERAL);
      expect(result).toEqual(RECOMMENDATIONS.FLASHCARDS);
    });

    it('should recommend FLASHCARDS when user has 2+ LEARNING history items', () => {
      const history = [
        { intent: INTENTS.LEARNING },
        { intent: INTENTS.LEARNING },
      ];
      const result = analyzeBehavior('hello', INTENTS.GENERAL, history);
      expect(result).toEqual(RECOMMENDATIONS.FLASHCARDS);
    });

    it('should recommend BOOTH for POLLING intent', () => {
      const result = analyzeBehavior('where do I go on polling day', INTENTS.POLLING);
      expect(result).toEqual(RECOMMENDATIONS.BOOTH);
    });

    it('should recommend BOOTH for BOOTH_FINDER intent', () => {
      const result = analyzeBehavior('find my booth', INTENTS.BOOTH_FINDER);
      expect(result).toEqual(RECOMMENDATIONS.BOOTH);
    });

    it('should return null when no recommendation matches', () => {
      const result = analyzeBehavior('random chat', INTENTS.GENERAL);
      expect(result).toBeNull();
    });
  });
});
