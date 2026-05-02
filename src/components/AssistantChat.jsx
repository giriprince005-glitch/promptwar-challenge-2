import { FaPaperPlane, FaRobot, FaUser, FaArrowRight } from 'react-icons/fa';
import { useChat } from '../hooks/useChat';
import '../styles/AssistantChat.css';

export default function AssistantChat({ onNavigate }) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    apiKeyError,
    securityError,
    messagesEndRef,
    handleSend,
    handleKeyPress,
    handleNavigate,
  } = useChat(onNavigate);

  return (
    <div className="chat-container glass-panel">
      {apiKeyError && (
        <div className="api-key-warning">
          ⚠️ Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.
        </div>
      )}

      {securityError && (
        <div className="security-warning">
          ⚠️ {securityError}
        </div>
      )}
      
      <div className="chat-messages" aria-live="polite" aria-relevant="additions">
        {messages.map((message, index) => (
          <div key={index} className={`message-wrapper ${message.role}`} role="log">
            <div className="message-avatar" aria-hidden="true">
              {message.role === 'assistant' ? <FaRobot /> : <FaUser />}
            </div>
            <div className="message-content-wrapper">
              <div className={`message-bubble ${message.role}`}>
                {message.text}
              </div>
              
              {/* Navigation Suggestion Card */}
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
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper assistant" aria-label="Assistant is typing">
            <div className="message-avatar" aria-hidden="true"><FaRobot /></div>
            <div className="message-content-wrapper">
              <div className="message-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about Form 6, EVMs, or polling rules..."
          disabled={isLoading}
          rows={1}
          aria-label="Message India Elects Assistant"
        />
        <button 
          className="send-btn" 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <FaPaperPlane />
        </button>
      </div>
      
      <div className="suggested-questions" role="group" aria-label="Suggested questions">
        {[
          { text: "How do I register to vote online?", label: "How do I register?" },
          { text: "What documents do I need on polling day?", label: "Required documents?" },
          { text: "Explain how a VVPAT machine works.", label: "What is VVPAT?" },
          { text: "When are the next elections?", label: "Election schedule?" }
        ].map((q, i) => (
          <button 
            key={i}
            className="suggestion-btn"
            onClick={() => setInput(q.text)}
            aria-label={`Ask: ${q.text}`}
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
