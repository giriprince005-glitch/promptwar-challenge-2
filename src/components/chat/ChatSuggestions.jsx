import React from 'react';

const SUGGESTIONS = [
  { text: "How do I register to vote online?", label: "How do I register?" },
  { text: "What documents do I need on polling day?", label: "Required documents?" },
  { text: "Explain how a VVPAT machine works.", label: "What is VVPAT?" },
  { text: "When are the next elections?", label: "Election schedule?" }
];

/**
 * Suggestions rail for common user queries.
 * @param {Object} props
 * @param {function(string): void} props.onSelect - Callback when a suggestion is clicked
 */
const ChatSuggestions = ({ onSelect }) => {
  return (
    <div className="suggested-questions" role="group" aria-label="Suggested questions">
      {SUGGESTIONS.map((q, i) => (
        <button 
          key={i}
          className="suggestion-btn"
          onClick={() => onSelect(q.text)}
          aria-label={`Ask: ${q.text}`}
        >
          {q.label}
        </button>
      ))}
    </div>
  );
};

export default ChatSuggestions;
