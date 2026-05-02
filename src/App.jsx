import { useState } from 'react';
import './index.css';
import './styles/App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AssistantChat from './components/AssistantChat';
import Flashcards from './components/Flashcards';
import ElectionTimeline from './components/ElectionTimeline';
import ProcessWizard from './components/ProcessWizard';

function App() {
  const [activeComponent, setActiveComponent] = useState('assistant');

  return (
    <div className="app-container">
      <Header 
        activeComponent={activeComponent} 
        setActiveComponent={setActiveComponent} 
      />

      <main className="main-content animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {activeComponent === 'assistant' && <AssistantChat onNavigate={setActiveComponent} />}
        {activeComponent === 'wizard' && <ProcessWizard />}
        {activeComponent === 'timeline' && <ElectionTimeline />}
        {activeComponent === 'flashcards' && <Flashcards />}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
