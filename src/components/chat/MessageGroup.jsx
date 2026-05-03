import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import ChatMessage from './ChatMessage';

export default function MessageGroup({ message, onNavigate }) {
  return (
    <div className="message-group">
      <ChatMessage message={message} />
      
      {/* Contextual Module Navigation */}
      {message.role === 'assistant' && message.navigation && (
        <button 
          className="navigation-card"
          onClick={() => onNavigate(message.navigation.component)}
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
  );
}
