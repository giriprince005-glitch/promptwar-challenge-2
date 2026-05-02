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
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-wrapper ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'assistant' ? <FaRobot /> : <FaUser />}
            </div>
            <div className="message-content-wrapper">
              <div className={`message-bubble ${message.role}`}>
                {message.text}
              </div>
              
              {/* Navigation Suggestion Card */}
              {message.role === 'assistant' && message.navigation && (
                <div 
                  className="navigation-card"
                  onClick={() => handleNavigate(message.navigation.component)}
                >
                  <div className="navigation-card-content">
                    <span className="navigation-card-label">{message.navigation.label}</span>
                    <p className="navigation-card-text">{message.navigation.suggestion}</p>
                  </div>
                  <FaArrowRight className="navigation-card-arrow" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper assistant">
            <div className="message-avatar"><FaRobot /></div>
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
        />
        <button className="send-btn" onClick={handleSend} disabled={isLoading || !input.trim()}>
          <FaPaperPlane />
        </button>
      </div>
      
      <div className="suggested-questions">
        <span onClick={() => setInput("How do I register to vote online?")}>How do I register?</span>
        <span onClick={() => setInput("What documents do I need on polling day?")}>Required documents?</span>
        <span onClick={() => setInput("Explain how a VVPAT machine works.")}>What is VVPAT?</span>
        <span onClick={() => setInput("When are the next elections?")}>Election schedule?</span>
      </div>
    </div>
  );
}
