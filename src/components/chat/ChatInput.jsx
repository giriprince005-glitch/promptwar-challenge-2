import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

/**
 * Chat input field with send button.
 * @param {Object} props
 * @param {string} props.value - Current input value
 * @param {function(string): void} props.onChange - Change handler
 * @param {function(): void} props.onSend - Send handler
 * @param {boolean} props.disabled - Whether input is disabled
 */
const ChatInput = ({ value, onChange, onSend, disabled }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-input-wrapper">
      <input
        type="text"
        className="chat-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about Form 6, EVMs, or polling rules..."
        disabled={disabled}
        aria-label="Ask a question about Indian elections"
      />
      <button 
        className="send-btn" 
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default ChatInput;
