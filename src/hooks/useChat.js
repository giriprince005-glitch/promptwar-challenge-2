import { useState, useRef, useEffect, useCallback } from 'react';
import GeminiProvider from '../services/ai/GeminiProvider';
import { analyzeBehavior } from '../services/ai/aiService';
import { logChatQuery } from '../services/firebaseService';
import { sanitizeInput, validateInput, checkRateLimit } from '../utils/security';
import { getCachedAIResponse, setCachedAIResponse } from '../services/cacheService';

/**
 * Custom hook to manage chat state and interactions.
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
  const [securityError, setSecurityError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNavigate = useCallback((component) => {
    if (onNavigate && component) {
      onNavigate(component);
    }
  }, [onNavigate]);

  const handleCachedResponse = (cachedResponse, userMessage) => {
    setTimeout(() => {
      setMessages(previousMessages => [
        ...previousMessages, 
        { 
          role: 'assistant', 
          text: cachedResponse.text,
          intent: cachedResponse.intent,
          navigation: cachedResponse.navigation, 
          isCached: true
        }
      ]);
      analyzeBehavior(userMessage, cachedResponse.intent, messages);
      setIsLoading(false);
    }, 300);
  };

  const fetchAndProcessResponse = async (apiKey, userMessage) => {
    try {
      const provider = new GeminiProvider(apiKey);
      const response = await provider.generateResponse(userMessage);
      
      setMessages(previousMessages => [
        ...previousMessages, 
        { 
          role: 'assistant', 
          text: response.text,
          intent: response.intent,
          navigation: response.navigation, 
        }
      ]);

      analyzeBehavior(userMessage, response.intent, messages);
      setCachedAIResponse(userMessage, response);
      logChatQuery(userMessage, response.intent, response.text);
    } catch (error) {
      console.error("Chat Hook Error:", error);
      setMessages(previousMessages => [
        ...previousMessages, 
        { 
          role: 'assistant', 
          text: "Sorry, I encountered an error. Please try again later.",
          intent: null,
          navigation: null,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    setSecurityError(null);
    setApiKeyError(false);
    
    const sanitizedInput = sanitizeInput(input);
    if (!sanitizedInput) return;

    const validation = validateInput(sanitizedInput);
    if (!validation.isValid) {
      setSecurityError(validation.error);
      return;
    }

    if (!checkRateLimit('chat_cooldown', 2000)) {
      setSecurityError('Please wait a moment before sending another message.');
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setApiKeyError(true);
      return;
    }

    const userMessage = sanitizedInput;
    setInput('');
    
    const cachedResponse = getCachedAIResponse(userMessage);
    
    setMessages(previousMessages => [
      ...previousMessages, 
      { role: 'user', text: userMessage, intent: null, navigation: null }
    ]);
    setIsLoading(true);

    if (cachedResponse) {
      handleCachedResponse(cachedResponse, userMessage);
      return;
    }

    await fetchAndProcessResponse(apiKey, userMessage);
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
    securityError,
    messagesEndRef,
    handleSend,
    handleKeyPress,
    handleNavigate,
  };
};
