import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geocodeAddress, searchPollingStations, getCurrentLocation } from '../services/mapsService';

describe('mapsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('geocodeAddress', () => {
    it('should resolve with lat/lng on success', async () => {
      const mockGeocoder = {
        geocode: vi.fn((req, callback) => {
          callback([{ geometry: { location: { lat: () => 10, lng: () => 20 } } }], 'OK');
        })
      };
      const result = await geocodeAddress(mockGeocoder, 'Delhi');
      expect(result).toEqual({ lat: 10, lng: 20 });
    });

    it('should reject on failure', async () => {
      const mockGeocoder = {
        geocode: vi.fn((req, callback) => {
          callback([], 'ZERO_RESULTS');
        })
      };
      await expect(geocodeAddress(mockGeocoder, 'Unknown')).rejects.toThrow('Geocoding failed: ZERO_RESULTS');
    });
  });

  describe('searchPollingStations', () => {
    it('should resolve with formatted places', async () => {
      const mockPlacesService = {
        textSearch: vi.fn((req, callback) => {
          callback([
            {
              place_id: '1',
              name: 'Booth 1',
              geometry: { location: { lat: () => 10.1, lng: () => 20.1 } },
            }
          ], 'OK');
        })
      };

      global.window.google = {
        maps: {
          places: {
            PlacesService: vi.fn(() => mockPlacesService),
            PlacesServiceStatus: { OK: 'OK' }
          },
          LatLng: vi.fn((lat, lng) => ({ lat, lng }))
        }
      };

      const result = await searchPollingStations({}, { lat: 10, lng: 20 });
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toBe('Booth 1');
    });
  });

  describe('getCurrentLocation', () => {
    it('should resolve with location on success', async () => {
      global.navigator.geolocation = {
        getCurrentPosition: vi.fn((success) => success({ coords: { latitude: 30, longitude: 40 } }))
      };
      const result = await getCurrentLocation();
      expect(result).toEqual({ lat: 30, lng: 40 });
    });

    it('should reject if geolocation is unsupported', async () => {
      global.navigator.geolocation = undefined;
      await expect(getCurrentLocation()).rejects.toThrow('Geolocation is not supported by your browser.');
    });

    it('should reject on error', async () => {
      global.navigator.geolocation = {
        getCurrentPosition: vi.fn((success, error) => error({ code: 1, PERMISSION_DENIED: 1 }))
      };
      await expect(getCurrentLocation()).rejects.toThrow('Location access was denied');
    });
  });
});
