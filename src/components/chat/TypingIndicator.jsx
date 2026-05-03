import React from 'react';
import { FaRobot } from 'react-icons/fa';

export default function TypingIndicator() {
  return (
    <div className="message-wrapper assistant" aria-label="Assistant is thinking">
      <div className="message-avatar" aria-hidden="true"><FaRobot /></div>
      <div className="message-content-wrapper">
        <div className="message-bubble typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}
