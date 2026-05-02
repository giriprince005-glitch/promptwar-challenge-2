import React from 'react';

const Header = ({ activeComponent, setActiveComponent }) => {
  return (
    <header className="app-header glass-panel animate-fade-in">
      <div className="header-content">
        <h1>India Elects</h1>
        <p>Your interactive guide to the world's largest democratic process.</p>
      </div>
      <nav className="main-nav">
        <button 
          className={`nav-btn ${activeComponent === 'assistant' ? 'active' : ''}`}
          onClick={() => setActiveComponent('assistant')}
        >
          AI Assistant
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'wizard' ? 'active' : ''}`}
          onClick={() => setActiveComponent('wizard')}
        >
          Voter Guide
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveComponent('timeline')}
        >
          Timeline
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveComponent('flashcards')}
        >
          Learn Terms
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'booth' ? 'active' : ''}`}
          onClick={() => setActiveComponent('booth')}
        >
          Find Booth
        </button>
      </nav>
    </header>
  );
};

export default Header;
