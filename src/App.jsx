import { useState } from 'react';
import './index.css';
import './styles/App.css';
import AssistantChat from './components/AssistantChat';
import Flashcards from './components/Flashcards';
import ElectionTimeline from './components/ElectionTimeline';
import ProcessWizard from './components/ProcessWizard';

function App() {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <div className="app-container">
      <header className="app-header glass-panel animate-fade-in">
        <div className="header-content">
          <h1>India Elects</h1>
          <p>Your interactive guide to the world's largest democratic process.</p>
        </div>
        <nav className="main-nav">
          <button 
            className={`nav-btn ${activeTab === 'assistant' ? 'active' : ''}`}
            onClick={() => setActiveTab('assistant')}
          >
            AI Assistant
          </button>
          <button 
            className={`nav-btn ${activeTab === 'wizard' ? 'active' : ''}`}
            onClick={() => setActiveTab('wizard')}
          >
            Voter Guide
          </button>
          <button 
            className={`nav-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
          <button 
            className={`nav-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
            onClick={() => setActiveTab('flashcards')}
          >
            Learn Terms
          </button>
        </nav>
      </header>

      <main className="main-content animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {activeTab === 'assistant' && <AssistantChat />}
        {activeTab === 'wizard' && <ProcessWizard />}
        {activeTab === 'timeline' && <ElectionTimeline />}
        {activeTab === 'flashcards' && <Flashcards />}
      </main>
      
      <footer className="app-footer">
        <p>Strictly Informational & Neutral. Powered by Gemini.</p>
      </footer>
    </div>
  );
}

export default App;
