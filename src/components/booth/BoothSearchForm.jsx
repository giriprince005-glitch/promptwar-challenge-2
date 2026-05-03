import React from 'react';
import { FaSearch, FaCrosshairs } from 'react-icons/fa';

/**
 * Search form for the Polling Booth Finder.
 * @param {Object} props
 * @param {string} props.query - Current search query
 * @param {function(string): void} props.setQuery - Query setter
 * @param {function(): void} props.onSearch - Search handler
 * @param {function(): void} props.onLocate - "Use my location" handler
 * @param {boolean} props.isLoading - Loading state
 */
const BoothSearchForm = ({ query, setQuery, onSearch, onLocate, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="booth-search-bar glass-panel" onSubmit={handleSubmit} role="search">
      <div className="booth-search-input-group">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Enter your address or city (e.g., Delhi, Mumbai...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search address for polling booth"
        />
      </div>
      <button 
        type="submit" 
        className="btn booth-search-btn"
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? 'Searching...' : 'Search Booth'}
      </button>
      <button 
        type="button" 
        className="btn btn-secondary booth-location-btn"
        onClick={onLocate}
        disabled={isLoading}
      >
        <FaCrosshairs /> Use Location
      </button>
    </form>
  );
};

export default BoothSearchForm;
