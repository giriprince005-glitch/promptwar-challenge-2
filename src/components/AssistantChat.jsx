import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import '../styles/AssistantChat.css';

const SYSTEM_PROMPT = `You are a neutral, purely informational assistant focused EXCLUSIVELY on the Indian election process (Lok Sabha, Vidhan Sabha, Panchayats, etc.).
Your goal is to explain mechanics, rules, timelines, and terminology (like EVM, VVPAT, Model Code of Conduct, Form 6).
CRITICAL RULES:
1. NEVER express a political opinion.
2. NEVER evaluate, endorse, or criticize any specific political party or candidate.
3. If asked about a subjective political topic or a specific politician, reply: "I can only provide factual information about the Indian election process and rules. I cannot discuss specific parties or political opinions."
4. Keep answers concise, easy to read, and step-by-step if applicable.`;

export default function AssistantChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Namaste! I am the India Elects Assistant. Ask me anything about voter registration, polling day rules, EVMs, or the general election process in India." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setApiKeyError(true);
      return;
    }

    setApiKeyError(false);
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT + "\\n\\nUser question: " + userMessage }] }
        ]
      });

      const replyText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'assistant', text: replyText }]);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I encountered an error connecting to the knowledge base. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container glass-panel">
      {apiKeyError && (
        <div className="api-key-warning">
          ⚠️ Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.
        </div>
      )}
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'assistant' ? <FaRobot /> : <FaUser />}
            </div>
            <div className={`message-bubble ${msg.role}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper assistant">
            <div className="message-avatar"><FaRobot /></div>
            <div className="message-bubble typing-indicator">
              <span></span><span></span><span></span>
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
      </div>
    </div>
  );
}
