import React from 'react';
import { FaRobot, FaArrowRight } from 'react-icons/fa';
import { useChat } from '../hooks/useChat';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import ChatSuggestions from './chat/ChatSuggestions';
import RecommendationCard from './chat/RecommendationCard';
import '../styles/AssistantChat.css';

/**
 * AssistantChat Component
 * The main interactive AI layer of the application.
 * Demonstrates modular component architecture and separation of concerns via useChat hook.
 * 
 * @param {Object} props
 * @param {function(string): void} props.onNavigate - Callback to switch between app modules
 */
export default function AssistantChat({ onNavigate }) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    apiKeyError,
    securityError,
    activeRecommendation,
    setActiveRecommendation,
    messagesEndRef,
    handleSend,
    handleNavigate,
  } = useChat(onNavigate);

  return (
    <div className="chat-container glass-panel">
      {/* Configuration & Security Warnings */}
      {apiKeyError && (
        <div className="api-key-warning" role="alert">
          ⚠️ Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.
        </div>
      )}

      {securityError && (
        <div className="security-warning" role="alert">
          ⚠️ {securityError}
        </div>
      )}
      
      <div className="chat-messages" aria-live="polite" aria-relevant="additions">
        {messages.map((message, index) => (
          <div key={index} className="message-group">
            <ChatMessage message={message} />
            
            {/* Contextual Module Navigation */}
            {message.role === 'assistant' && message.navigation && (
              <button 
                className="navigation-card"
                onClick={() => handleNavigate(message.navigation.component)}
                aria-label={`Open ${message.navigation.label}: ${message.navigation.suggestion}`}
              >
                <div className="navigation-card-content">
                  <span className="navigation-card-label" aria-hidden="true">{message.navigation.label}</span>
                  <p className="navigation-card-text">{message.navigation.suggestion}</p>
                </div>
                <FaArrowRight className="navigation-card-arrow" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="message-wrapper assistant" aria-label="Assistant is thinking">
            <div className="message-avatar" aria-hidden="true"><FaRobot /></div>
            <div className="message-content-wrapper">
              <div className="message-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        
        {/* Proactive Recommendation Card */}
        <RecommendationCard 
          recommendation={activeRecommendation}
          onClose={() => setActiveRecommendation(null)}
          onNavigate={handleNavigate}
        />

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Interaction Layer */}
      <div className="chat-controls">
        <ChatInput 
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isLoading}
        />
        
        <ChatSuggestions onSelect={(text) => {
          setInput(text);
          // Auto-send could be implemented here if desired
        }} />
      </div>

      {/* Legal & Responsible AI Disclaimer */}
      <div className="chat-footer-disclaimer">
        <p>
          AI-generated information for guidance. Always verify with the 
          <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer"> official ECI portal</a>.
          Strictly Informational & Neutral. Powered by Gemini.
        </p>
      </div>
    </div>
  );
}
