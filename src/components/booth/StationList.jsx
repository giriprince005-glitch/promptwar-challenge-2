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
      <div className="stations-list" role="list">
        {stations.map((station) => (
          <button 
            key={station.id} 
            className={`booth-result-card ${selectedStation?.id === station.id ? 'active' : ''}`}
            onClick={() => onSelect(station)}
            aria-label={`Select station: ${station.name}`}
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
                aria-label={`Get directions to ${station.name}`}
              >
                <FaDirections />
              </a>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StationList;
