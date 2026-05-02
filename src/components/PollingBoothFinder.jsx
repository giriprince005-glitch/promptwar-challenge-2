import { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaSearch, FaCrosshairs, FaDirections } from 'react-icons/fa';
import { geocodeAddress, searchPollingStations, getCurrentLocation } from '../services/mapsService';
import { logBoothSearch } from '../services/firebaseService';
import { sanitizeInput, checkRateLimit } from '../utils/security';
import { getCachedGeoResult, setCachedGeoResult } from '../services/cacheService';
import '../styles/PollingBoothFinder.css';

const LIBRARIES = ['places'];
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // Center of India
const DEFAULT_ZOOM = 5;
const SEARCH_ZOOM = 13;

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#0e1626' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
    { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  ],
};

export default function PollingBoothFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);
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

  const handleSearch = async () => {
    const sanitizedSearch = sanitizeInput(searchQuery);
    if (!sanitizedSearch) return;
    if (!mapRef.current) return;

    // Rate limiting to prevent API quota abuse
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
      
      setSearchLocation(location);
      setMapCenter(location);
      setMapZoom(SEARCH_ZOOM);

      const results = await searchPollingStations(mapRef.current, location);
      setStations(results);
      setHasSearched(true);

      // Log search to Firebase (non-blocking)
      logBoothSearch(searchQuery, results.length);

      if (results.length === 0) {
        setErrorMessage('No polling stations found in this area. Try expanding your search or check the official ECI portal.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setErrorMessage(error.message || 'Search failed. Please try a different location.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseMyLocation = async () => {
    setIsLocating(true);
    setErrorMessage('');

    try {
      const location = await getCurrentLocation();
      setSearchLocation(location);
      setMapCenter(location);
      setMapZoom(SEARCH_ZOOM);
      setSearchQuery('My Current Location');

      if (mapRef.current) {
        const results = await searchPollingStations(mapRef.current, location);
        setStations(results);
        setHasSearched(true);
        logBoothSearch('Current Location', results.length);

        if (results.length === 0) {
          setErrorMessage('No polling stations found near your location.');
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLocating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openDirections = (station) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.location.lat},${station.location.lng}`;
    window.open(url, '_blank');
  };

  // No API key state
  if (!apiKey) {
    return (
      <div className="booth-finder-container">
        <h2>🗺️ Find Your Polling Booth</h2>
        <div className="booth-api-warning glass-panel">
          <h3>⚠️ Google Maps API Key Required</h3>
          <p>To use the Polling Booth Finder, add your Google Maps API key to the <code>.env</code> file:</p>
          <pre>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</pre>
          <p>You'll need to enable <strong>Maps JavaScript API</strong> and <strong>Places API</strong> in your Google Cloud Console.</p>
          <a href="https://console.cloud.google.com/apis/library" target="_blank" rel="noopener noreferrer" className="btn">
            Open Google Cloud Console
          </a>
        </div>
      </div>
    );
  }

  // Loading or error state
  if (loadError) {
    return (
      <div className="booth-finder-container">
        <h2>🗺️ Find Your Polling Booth</h2>
        <div className="booth-api-warning glass-panel">
          <p>Failed to load Google Maps. Please check your API key and ensure Maps JavaScript API is enabled.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="booth-finder-container">
        <h2>🗺️ Find Your Polling Booth</h2>
        <div className="booth-loading">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="booth-finder-container">
      <h2>🗺️ Find Your Polling Booth</h2>
      <p className="subtitle">Enter your address or use your current location to find nearby polling stations.</p>

      {/* Search Bar */}
      <div className="booth-search-bar glass-panel" role="search" aria-label="Polling booth search">
        <div className="booth-search-input-group">
          <FaMapMarkerAlt className="search-icon" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your area, city, or pincode..."
            disabled={isSearching || isLocating}
            aria-label="Search location for polling booths"
          />
        </div>
        <button 
          className="btn booth-search-btn" 
          onClick={handleSearch} 
          disabled={isSearching || !searchQuery.trim()}
          aria-label={isSearching ? 'Searching...' : 'Search for polling booths'}
        >
          {isSearching ? 'Searching...' : <><FaSearch aria-hidden="true" /> Search</>}
        </button>
        <button 
          className="btn btn-secondary booth-location-btn" 
          onClick={handleUseMyLocation}
          disabled={isLocating || isSearching}
          aria-label={isLocating ? 'Locating...' : 'Use my current location'}
        >
          {isLocating ? 'Locating...' : <><FaCrosshairs aria-hidden="true" /> Use My Location</>}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="booth-error-message" role="alert">{errorMessage}</div>
      )}

      {/* Map and Results Layout */}
      <div className="booth-content-layout">
        {/* Map */}
        <div className="booth-map-container glass-panel" aria-label="Interactive map showing polling booths">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={mapZoom}
            options={mapOptions}
            onLoad={onMapLoad}
          >
            {/* User location marker */}
            {searchLocation && (
              <Marker
                position={searchLocation}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><circle cx="12" cy="12" r="10" fill="#FF9933" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>'
                  ),
                  scaledSize: new window.google.maps.Size(32, 32),
                }}
                title="Your Location"
              />
            )}

            {/* Polling station markers */}
            {stations.map((station) => (
              <Marker
                key={station.id}
                position={station.location}
                onClick={() => setSelectedStation(station)}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="10" fill="#138808" stroke="#fff" stroke-width="2"/><text x="12" y="16" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">P</text></svg>'
                  ),
                  scaledSize: new window.google.maps.Size(28, 28),
                }}
                title={station.name}
              />
            ))}

            {/* Info window for selected station */}
            {selectedStation && (
              <InfoWindow
                position={selectedStation.location}
                onCloseClick={() => setSelectedStation(null)}
              >
                <div className="booth-info-window" role="dialog" aria-labelledby="booth-title">
                  <h4 id="booth-title">{selectedStation.name}</h4>
                  <p>{selectedStation.address}</p>
                  <p><strong>{selectedStation.distance}</strong> away</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {/* Results List */}
        <div className="booth-results-panel" role="region" aria-label="Polling booth search results">
          {hasSearched && stations.length > 0 && (
            <>
              <h3 aria-live="polite">📍 {stations.length} Station{stations.length > 1 ? 's' : ''} Found</h3>
              <div className="booth-results-list" role="list">
                {stations.map((station) => (
                  <button 
                    key={station.id} 
                    className={`booth-result-card glass-panel ${selectedStation?.id === station.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedStation(station);
                      setMapCenter(station.location);
                      setMapZoom(15);
                    }}
                    role="listitem"
                    aria-pressed={selectedStation?.id === station.id}
                    aria-label={`${station.name}, ${station.distance} away. Address: ${station.address}`}
                  >
                    <div className="booth-result-info">
                      <h4>{station.name}</h4>
                      <p className="booth-result-address">{station.address}</p>
                      <span className="booth-result-distance">{station.distance}</span>
                    </div>
                    <div 
                      className="booth-directions-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDirections(station);
                      }}
                      role="button"
                      aria-label={`Get directions to ${station.name}`}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') openDirections(station); }}
                    >
                      <FaDirections aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          {hasSearched && stations.length === 0 && !errorMessage && (
            <div className="booth-no-results">
              <p>No polling stations found in this area.</p>
            </div>
          )}
          {!hasSearched && (
            <div className="booth-placeholder">
              <FaMapMarkerAlt className="booth-placeholder-icon" />
              <p>Search for your location to find nearby polling stations</p>
              <p className="booth-placeholder-tip">
                💡 Also check the official ECI portal at <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer">voters.eci.gov.in</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
