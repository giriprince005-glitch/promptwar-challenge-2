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
    <form className="search-box" onSubmit={handleSubmit} role="search">
      <div className="input-group">
        <FaMapMarkerAlt className="input-icon" />
        <input
          type="text"
          placeholder="Enter your address or city (e.g., Delhi, Mumbai...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search address for polling booth"
        />
      </div>
      <div className="search-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading || !query.trim()}
        >
          <FaSearch /> {isLoading ? 'Searching...' : 'Search'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onLocate}
          disabled={isLoading}
        >
          <FaCrosshairs /> Use My Location
        </button>
      </div>
    </form>
  );
};

// Internal icon for the search form
const FaMapMarkerAlt = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
  </svg>
);

export default BoothSearchForm;
