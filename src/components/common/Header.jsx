import React from 'react';

const Header = ({ activeComponent, setActiveComponent }) => {
  return (
    <header className="app-header glass-panel animate-fade-in">
      <div className="header-content">
        <h1>India Elects</h1>
        <p>Your interactive guide to the world's largest democratic process.</p>
      </div>
      <nav className="main-nav" aria-label="Main Navigation">
        <button 
          className={`nav-btn ${activeComponent === 'assistant' ? 'active' : ''}`}
          onClick={() => setActiveComponent('assistant')}
          aria-current={activeComponent === 'assistant' ? 'page' : undefined}
          aria-label="Open AI Assistant"
        >
          AI Assistant
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'learning_mode' ? 'active' : ''}`}
          onClick={() => setActiveComponent('learning_mode')}
          aria-current={activeComponent === 'learning_mode' ? 'page' : undefined}
          aria-label="Start Guided Learning Mode"
        >
          Learn Mode
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'wizard' ? 'active' : ''}`}
          onClick={() => setActiveComponent('wizard')}
          aria-current={activeComponent === 'wizard' ? 'page' : undefined}
          aria-label="Open Voter Registration Guide"
        >
          Voter Guide
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveComponent('timeline')}
          aria-current={activeComponent === 'timeline' ? 'page' : undefined}
          aria-label="View Election Timeline"
        >
          Timeline
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveComponent('flashcards')}
          aria-current={activeComponent === 'flashcards' ? 'page' : undefined}
          aria-label="Learn Electoral Terminology"
        >
          Learn Terms
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'booth' ? 'active' : ''}`}
          onClick={() => setActiveComponent('booth')}
          aria-current={activeComponent === 'booth' ? 'page' : undefined}
          aria-label="Open Polling Booth Finder"
        >
          Find Booth
        </button>
      </nav>
    </header>
  );
};

export default Header;
