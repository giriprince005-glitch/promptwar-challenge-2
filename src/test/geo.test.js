import { describe, it, expect } from 'vitest';
import { calculateDistance, toRad } from '../utils/geo';

describe('Geo Utilities', () => {
  describe('toRad', () => {
    it('should convert 0 degrees to 0 radians', () => {
      expect(toRad(0)).toBe(0);
    });

    it('should convert 180 degrees to PI radians', () => {
      expect(toRad(180)).toBeCloseTo(Math.PI);
    });

    it('should convert 90 degrees to PI/2 radians', () => {
      expect(toRad(90)).toBeCloseTo(Math.PI / 2);
    });
  });

  describe('calculateDistance', () => {
    it('should return 0 for the same point', () => {
      expect(calculateDistance(28.6, 77.2, 28.6, 77.2)).toBe(0);
    });

    it('should calculate correct distance between Delhi and Mumbai (~1,150 km)', () => {
      const distance = calculateDistance(28.6139, 77.2090, 19.0760, 72.8777);
      expect(distance).toBeGreaterThan(1100);
      expect(distance).toBeLessThan(1200);
    });

    it('should return a positive value regardless of coordinate order', () => {
      const d1 = calculateDistance(28.6, 77.2, 19.0, 72.8);
      const d2 = calculateDistance(19.0, 72.8, 28.6, 77.2);
      expect(d1).toBeCloseTo(d2);
    });
  });
});
