import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PollingBoothFinder from '../components/PollingBoothFinder';
import * as mapsService from '../services/mapsService';

// Mock the Maps Service
vi.mock('../services/mapsService');

// Mock Google Maps API Loader
vi.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: null }),
  GoogleMap: ({ children, onLoad }) => {
    if (onLoad) onLoad({ getCenter: () => ({}) });
    return <div>{children}</div>;
  },
  Marker: () => <div data-testid="map-marker" />,
  InfoWindow: ({ children }) => <div>{children}</div>,
}));

// Mock global google object
global.window.google = {
  maps: {
    Geocoder: class {},
    GeocoderStatus: { OK: 'OK' }
  }
};

describe('PollingBoothFinder Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display an error for invalid locations', async () => {
    mapsService.geocodeAddress.mockRejectedValue(new Error('Location not found'));

    render(<PollingBoothFinder />);
    
    const input = screen.getByLabelText(/Search address/i);
    const searchBtn = screen.getByText(/Search/i);

    fireEvent.change(input, { target: { value: 'InvalidPlaceXYZ' } });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/Location not found/i)).toBeInTheDocument();
    });
  });

  it('should display results when a valid location is searched', async () => {
    mapsService.geocodeAddress.mockResolvedValue({ lat: 28.6139, lng: 77.2090 });
    mapsService.searchPollingStations.mockResolvedValue([
      { id: '1', name: 'Nagar Palika School', address: 'Delhi Sector 1', location: { lat: 28.614, lng: 77.21 } }
    ]);

    render(<PollingBoothFinder />);
    
    const input = screen.getByLabelText(/Search address/i);
    const searchBtn = screen.getByText(/Search/i);

    fireEvent.change(input, { target: { value: 'Delhi' } });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText('Nagar Palika School')).toBeInTheDocument();
      expect(screen.getByText(/1 Stations Found/i)).toBeInTheDocument();
    });
  });
});
