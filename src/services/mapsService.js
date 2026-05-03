/**
 * Google Maps Service
 * 
 * Handles geocoding, places search, and map-related operations
 * for the Polling Booth Finder feature.
 */
import { calculateDistance } from '../utils/geo';

/**
 * Geocode an address string into lat/lng coordinates.
 * Geocodes a string address into latitude and longitude coordinates.
 * @param {google.maps.Geocoder} geocoder - The Google Maps Geocoder instance
 * @param {string} address - The human-readable address string
 * @returns {Promise<{lat: number, lng: number}>}
 * @throws {Error} If geocoding fails or address is not found
 */
export const geocodeAddress = (geocoder, address) => {
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        resolve({ lat: lat(), lng: lng() });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

/**
 * Search for nearby polling stations using the Places API.
 * Searches for "polling station" and "polling booth" near the given location.
 * 
 * @param {google.maps.Map} map - Google Maps instance
 * @param {google.maps.LatLngLiteral} location - Center point for search
 * @param {number} radius - Search radius in meters (default: 5000)
 * @returns {Promise<Array>} - Array of place results
 */
export const searchPollingStations = (map, location, radius = 5000) => {
  return new Promise((resolve, _reject) => {
    const service = new window.google.maps.places.PlacesService(map);

    const searchQueries = [
      'polling station',
      'polling booth',
      'voter registration center',
    ];

    const allResults = [];
    let completedSearches = 0;
    const seenPlaceIds = new Set();

    searchQueries.forEach((query) => {
      service.textSearch(
        {
          query: query,
          location: new window.google.maps.LatLng(location.lat, location.lng),
          radius: radius,
        },
        (results, status) => {
          completedSearches++;

          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            results.forEach((place) => {
              if (!seenPlaceIds.has(place.place_id)) {
                seenPlaceIds.add(place.place_id);
                allResults.push(formatPlaceResult(place, location));
              }
            });
          }

          // Once all searches have completed, resolve
          if (completedSearches === searchQueries.length) {
            // Sort by distance
            allResults.sort((a, b) => a.distanceValue - b.distanceValue);
            resolve(allResults);
          }
        }
      );
    });
  });
};

/**
 * Format a raw Google Places result into a clean object.
 * 
 * @param {google.maps.places.PlaceResult} place - Raw place result
 * @param {google.maps.LatLngLiteral} origin - User's search location
 * @returns {object}
 */
const formatPlaceResult = (place, origin) => {
  const placeLocation = {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
  };

  const distance = calculateDistance(
    origin.lat, origin.lng,
    placeLocation.lat, placeLocation.lng
  );

  return {
    id: place.place_id,
    name: place.name,
    address: place.formatted_address || 'Address not available',
    location: placeLocation,
    rating: place.rating || null,
    isOpen: place.opening_hours?.isOpen?.() ?? null,
    distance: distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`,
    distanceValue: distance,
  };
};



/**
 * Get the user's current location via the browser's Geolocation API.
 * 
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'Unable to get your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access was denied. Please allow location access or enter your address manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });
};
