import { useState, lazy, Suspense } from 'react';
import './index.css';
import './styles/App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AssistantChat from './components/AssistantChat';

// Lazy load modules for better performance
const Flashcards = lazy(() => import('./components/Flashcards'));
const ElectionTimeline = lazy(() => import('./components/ElectionTimeline'));
const ProcessWizard = lazy(() => import('./components/ProcessWizard'));
const PollingBoothFinder = lazy(() => import('./components/PollingBoothFinder'));

// Loading component for Suspense
const LoadingModule = () => (
  <div className="module-loading-spinner">
    <div className="spinner"></div>
    <p>Loading module...</p>
  </div>
);

function App() {
  const [activeComponent, setActiveComponent] = useState('assistant');

  return (
    <div className="app-container">
      <Header 
        activeComponent={activeComponent} 
        setActiveComponent={setActiveComponent} 
      />

      <main className="main-content animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Suspense fallback={<LoadingModule />}>
          {activeComponent === 'assistant' && <AssistantChat onNavigate={setActiveComponent} />}
          {activeComponent === 'wizard' && <ProcessWizard />}
          {activeComponent === 'timeline' && <ElectionTimeline />}
          {activeComponent === 'flashcards' && <Flashcards />}
          {activeComponent === 'booth' && <PollingBoothFinder />}
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
