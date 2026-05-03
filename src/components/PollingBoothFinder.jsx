import React, { useState, useRef, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { geocodeAddress, searchPollingStations, getCurrentLocation } from '../services/mapsService';
import { logBoothSearch } from '../services/firebaseService';
import { sanitizeInput, checkRateLimit } from '../utils/security';
import { getCachedGeoResult, setCachedGeoResult } from '../services/cacheService';

import BoothSearchForm from './booth/BoothSearchForm';
import MapDisplay from './booth/MapDisplay';
import StationList from './booth/StationList';

import '../styles/PollingBoothFinder.css';

const LIBRARIES = ['places'];
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // Center of India
const DEFAULT_ZOOM = 5;
const SEARCH_ZOOM = 13;

/**
 * PollingBoothFinder Component
 * An advanced interactive tool to locate polling stations in India.
 * Demonstrates modular UI design and integration with Google Maps Services.
 */
export default function PollingBoothFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const mapRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    libraries: LIBRARIES,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  /**
   * Performs the location search and polling station lookup.
   */
  const handleSearch = async () => {
    const sanitizedSearch = sanitizeInput(searchQuery);
    if (!sanitizedSearch || !mapRef.current) return;

    if (!checkRateLimit('maps_search_cooldown', 2000)) {
      setErrorMessage('Please wait a moment before searching again.');
      return;
    }

    setIsSearching(true);
    setErrorMessage('');
    setStations([]);
    setSelectedStation(null);

    try {
      let location = getCachedGeoResult(sanitizedSearch);
      
      if (!location) {
        const geocoder = new window.google.maps.Geocoder();
        location = await geocodeAddress(geocoder, sanitizedSearch + ', India');
        setCachedGeoResult(sanitizedSearch, location);
      }
      
      setMapCenter(location);
      setMapZoom(SEARCH_ZOOM);

      const results = await searchPollingStations(mapRef.current, location);
      setStations(results);
      setHasSearched(true);

      logBoothSearch(searchQuery, results.length);

      if (results.length === 0) {
        setErrorMessage('No polling stations found in this immediate area. Try a different location or check the official ECI portal.');
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
      setErrorMessage(error.message || 'Geocoding failed. Please try a different location or check your connection.');
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Detects user's current location and searches for booths nearby.
   */
  const handleUseMyLocation = async () => {
    setIsSearching(true);
    setErrorMessage('');
    try {
      const pos = await getCurrentLocation();
      const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      
      setMapCenter(location);
      setMapZoom(SEARCH_ZOOM);
      
      const results = await searchPollingStations(mapRef.current, location);
      setStations(results);
      setHasSearched(true);
      setSearchQuery('Current Location');
    } catch (error) {
      setErrorMessage('Could not determine your location. Please check browser permissions.');
    } finally {
      setIsSearching(false);
    }
  };

  if (loadError) return <div className="error-panel glass-panel">Error loading Google Maps. Please check your API key and connection.</div>;
  if (!isLoaded) return <div className="loading-panel glass-panel">Initializing Map Services...</div>;

  return (
    <div className="booth-finder-container animate-fade-in">
      <header className="booth-finder-header">
        <h2>🗺️ Find Your Polling Booth</h2>
        <p>Enter your address or use your current location to find nearby polling stations.</p>
      </header>

      <div className="booth-finder-content glass-panel">
        <div className="booth-finder-controls">
          <BoothSearchForm 
            query={searchQuery}
            setQuery={setSearchQuery}
            onSearch={handleSearch}
            onLocate={handleUseMyLocation}
            isLoading={isSearching}
          />

          {errorMessage && (
            <div className="booth-error-message" role="alert">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="booth-results-layout">
            <MapDisplay 
              center={mapCenter}
              zoom={mapZoom}
              stations={stations}
              onLoad={onMapLoad}
              onSelectStation={setSelectedStation}
              selectedStation={selectedStation}
              onCloseInfo={() => setSelectedStation(null)}
            />

            <StationList 
              stations={stations}
              selectedStation={selectedStation}
              onSelect={setSelectedStation}
            />
          </div>
        </div>
      </div>

      {!hasSearched && (
        <div className="booth-finder-onboarding">
          <p>Did you know? You can also find your booth by checking your Voter Information Slip distributed by your BLO.</p>
        </div>
      )}
    </div>
  );
}
