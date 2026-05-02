import { useState, useRef, useEffect, useCallback } from 'react';
import { askAssistant, analyzeBehavior } from '../services/geminiService';
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
  const [activeRecommendation, setActiveRecommendation] = useState(null);
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
      setActiveRecommendation(null);
    }
  }, [onNavigate]);

  const handleSend = async () => {
    setSecurityError(null);
    setActiveRecommendation(null);
    
    const sanitizedInput = sanitizeInput(input);
    if (!sanitizedInput) return;

    const validation = validateInput(sanitizedInput);
    if (!validation.isValid) {
      setSecurityError(validation.error);
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setApiKeyError(true);
      return;
    }

    setApiKeyError(false);
    const userMessage = sanitizedInput;
    setInput('');
    
    // Check Cache first
    const cachedResponse = getCachedAIResponse(userMessage);
    
    setMessages(previousMessages => [
      ...previousMessages, 
      { role: 'user', text: userMessage, intent: null, navigation: null }
    ]);
    setIsLoading(true);

    if (cachedResponse) {
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
        
        // Analyze behavior for recommendation
        const recommendation = analyzeBehavior(userMessage, cachedResponse.intent, messages);
        if (recommendation) setActiveRecommendation(recommendation);
        
        setIsLoading(false);
      }, 300);
      return;
    }

    if (!checkRateLimit('chat_cooldown', 2000)) {
      setSecurityError('Please wait a moment before sending another message.');
      setIsLoading(false);
      return;
    }

    try {
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

      // Analyze behavior for proactive recommendation
      const recommendation = analyzeBehavior(userMessage, response.intent, messages);
      if (recommendation) setActiveRecommendation(recommendation);

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
