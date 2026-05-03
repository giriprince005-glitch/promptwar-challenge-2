import React from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { FaDirections } from 'react-icons/fa';

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

/**
 * Google Map display component.
 * @param {Object} props
 * @param {Object} props.center - Map center coordinates
 * @param {number} props.zoom - Map zoom level
 * @param {Array} props.stations - List of marker stations
 * @param {function(Object): void} props.onLoad - Map load callback
 * @param {function(Object): void} props.onSelectStation - Callback when a marker is clicked
 * @param {Object} props.selectedStation - The currently active station for InfoWindow
 * @param {function(): void} props.onCloseInfo - Close InfoWindow handler
 */
const MapDisplay = ({ 
  center, 
  zoom, 
  stations, 
  onLoad, 
  onSelectStation, 
  selectedStation, 
  onCloseInfo 
}) => {
  return (
    <div className="map-wrapper" aria-hidden="true">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        options={mapOptions}
        onLoad={onLoad}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={station.location}
            onClick={() => onSelectStation(station)}
            icon={station.isUserLocation ? undefined : {
              url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
            }}
          />
        ))}

        {selectedStation && (
          <InfoWindow
            position={selectedStation.location}
            onCloseClick={onCloseInfo}
          >
            <div className="map-info-window">
              <h4>{selectedStation.name}</h4>
              <p>{selectedStation.address}</p>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStation.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-small"
              >
                <FaDirections /> Get Directions
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapDisplay;
