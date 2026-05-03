import React from 'react';

/**
 * Navigation item definitions for the main header.
 * Each entry maps a component key to its display label and ARIA description.
 */
const NAV_ITEMS = [
  { key: 'assistant', label: 'AI Assistant', ariaLabel: 'Open AI Assistant' },
  { key: 'learning_mode', label: 'Learn Mode', ariaLabel: 'Start Guided Learning Mode' },
  { key: 'wizard', label: 'Voter Guide', ariaLabel: 'Open Voter Registration Guide' },
  { key: 'timeline', label: 'Timeline', ariaLabel: 'View Election Timeline' },
  { key: 'flashcards', label: 'Learn Terms', ariaLabel: 'Learn Electoral Terminology' },
  { key: 'booth', label: 'Find Booth', ariaLabel: 'Open Polling Booth Finder' },
];

/**
 * Application header with main navigation.
 *
 * @param {Object} props
 * @param {string} props.activeComponent - Currently active component key
 * @param {function(string): void} props.setActiveComponent - Callback to switch views
 */
const Header = ({ activeComponent, setActiveComponent }) => {
  return (
    <header className="app-header glass-panel animate-fade-in">
      <div className="header-content">
        <h1>India Elects</h1>
        <p>Your interactive guide to the world's largest democratic process.</p>
      </div>
      <nav className="main-nav" aria-label="Main Navigation">
        {NAV_ITEMS.map(({ key, label, ariaLabel }) => (
          <button
            key={key}
            className={`nav-btn ${activeComponent === key ? 'active' : ''}`}
            onClick={() => setActiveComponent(key)}
            aria-current={activeComponent === key ? 'page' : undefined}
            aria-label={ariaLabel}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
