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
          aria-current={activeComponent === 'assistant' ? 'page' : undefined}
        >
          AI Assistant
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'wizard' ? 'active' : ''}`}
          onClick={() => setActiveComponent('wizard')}
          aria-current={activeComponent === 'wizard' ? 'page' : undefined}
        >
          Voter Guide
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveComponent('timeline')}
          aria-current={activeComponent === 'timeline' ? 'page' : undefined}
        >
          Timeline
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveComponent('flashcards')}
          aria-current={activeComponent === 'flashcards' ? 'page' : undefined}
        >
          Learn Terms
        </button>
        <button 
          className={`nav-btn ${activeComponent === 'booth' ? 'active' : ''}`}
          onClick={() => setActiveComponent('booth')}
          aria-current={activeComponent === 'booth' ? 'page' : undefined}
        >
          Find Booth
        </button>
      </nav>
    </header>
  );
};

export default Header;
