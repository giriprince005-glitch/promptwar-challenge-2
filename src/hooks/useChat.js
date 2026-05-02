import { useState, useRef, useEffect, useCallback } from 'react';
import { askAssistant } from '../services/geminiService';
import { logChatQuery } from '../services/firebaseService';

/**
 * Custom hook to manage chat state and interactions.
 * Now supports context-aware responses with navigation suggestions.
 * 
 * @param {function} onNavigate - Callback to navigate to a different app module
 */
export const useChat = (onNavigate) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      text: "Namaste! 🇮🇳 I am the India Elects Assistant — your context-aware guide to Indian elections.\n\nI can help you with:\n• 📋 Voter registration & eligibility\n• 📅 Election schedules & timelines\n• 🗳️ Polling day procedures\n• 🃏 Electoral terminology (EVM, VVPAT, NOTA...)\n\nAsk me anything, and I'll guide you to the right resource!",
      intent: null,
      navigation: null,
    }
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

  /**
   * Navigate to a module suggested by the AI
   */
  const handleNavigate = useCallback((component) => {
    if (onNavigate && component) {
      onNavigate(component);
    }
  }, [onNavigate]);

  /**
   * Send a message through the intent-aware pipeline
   */
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
    setMessages(previousMessages => [
      ...previousMessages, 
      { role: 'user', text: userMessage, intent: null, navigation: null }
    ]);
    setIsLoading(true);

    try {
      // askAssistant now returns { text, intent, navigation }
      const response = await askAssistant(userMessage, apiKey);
      
      setMessages(previousMessages => [
        ...previousMessages, 
        { 
          role: 'assistant', 
          text: response.text,
          intent: response.intent,
          navigation: response.navigation, 
        }
      ]);

      // Log to Firebase (non-blocking)
      logChatQuery(userMessage, response.intent, response.text);
    } catch (error) {
      console.error("Chat Hook Error:", error);
      setMessages(previousMessages => [
        ...previousMessages, 
        { 
          role: 'assistant', 
          text: "Sorry, I encountered an error connecting to the knowledge base. Please try again later.",
          intent: null,
          navigation: null,
        }
      ]);
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

  return {
    messages,
    input,
    setInput,
    isLoading,
    apiKeyError,
    messagesEndRef,
    handleSend,
    handleKeyPress,
    handleNavigate,
  };
};
