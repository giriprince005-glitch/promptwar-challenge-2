import React from 'react';
import { FaDirections } from 'react-icons/fa';

/**
 * List of found polling stations.
 * @param {Object} props
 * @param {Array} props.stations - List of station objects
 * @param {function(Object): void} props.onSelect - Callback when a station is clicked
 * @param {Object} props.selectedStation - The currently active station
 */
const StationList = ({ stations, onSelect, selectedStation }) => {
  if (stations.length === 0) return null;

  return (
    <div className="stations-results">
      <div className="results-header">
        <span className="results-count">📍 {stations.length} Stations Found</span>
      </div>
      <ul className="stations-list" aria-label="Available Polling Stations">
        {stations.map((station) => (
          <li key={station.id}>
            <button 
              className={`booth-result-card ${selectedStation?.id === station.id ? 'active' : ''}`}
              onClick={() => onSelect(station)}
              aria-label={`Select station: ${station.name}`}
              aria-current={selectedStation?.id === station.id ? 'true' : 'false'}
            >
              <div className="station-info">
                <h4 className="station-name">{station.name}</h4>
                <p className="station-address">{station.address}</p>
                {station.distance && (
                  <span className="station-distance">{station.distance}</span>
                )}
              </div>
              <div className="station-actions">
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(station.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="directions-link"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Get directions to ${station.name} on Google Maps`}
                >
                  <FaDirections aria-hidden="true" />
                </a>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StationList;
