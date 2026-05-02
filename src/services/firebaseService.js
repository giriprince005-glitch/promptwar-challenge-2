import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Firebase Service
 * 
 * Handles Firebase initialization and Firestore operations.
 * Only initializes if Firebase config env variables are present.
 */

let app = null;
let db = null;
let isInitialized = false;

/**
 * Initialize Firebase if config is available.
 * Safe to call multiple times — only initializes once.
 */
const initFirebase = () => {
  if (isInitialized) return;

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  // Only initialize if at least the critical config values are present
  if (!apiKey || !projectId) {
    console.info('Firebase: Config not found in .env — running without Firebase.');
    isInitialized = true;
    return;
  }

  try {
    const firebaseConfig = {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isInitialized = true;
    console.info('Firebase: Initialized successfully.');
  } catch (error) {
    console.error('Firebase: Initialization failed:', error);
    isInitialized = true; // Prevent repeated attempts
  }
};

/**
 * Log a user chat query to Firestore.
 * Silently fails if Firebase is not configured.
 * 
 * @param {string} userMessage - The user's query text
 * @param {string} intent - The detected intent
 * @param {string} responsePreview - First 200 chars of the AI response
 */
export const logChatQuery = async (userMessage, intent, responsePreview = '') => {
  initFirebase();

  if (!db) return; // Firebase not configured — skip silently

  try {
    await addDoc(collection(db, 'chatQueries'), {
      message: userMessage,
      intent: intent || 'unknown',
      responsePreview: responsePreview.substring(0, 200),
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
    });
  } catch (error) {
    // Non-critical — log and continue
    console.warn('Firebase: Failed to log query:', error.message);
  }
};

/**
 * Log a polling booth search to Firestore.
 * 
 * @param {string} searchQuery - The location searched
 * @param {number} resultsCount - Number of results found
 */
export const logBoothSearch = async (searchQuery, resultsCount) => {
  initFirebase();

  if (!db) return;

  try {
    await addDoc(collection(db, 'boothSearches'), {
      query: searchQuery,
      resultsCount,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
    });
  } catch (error) {
    console.warn('Firebase: Failed to log booth search:', error.message);
  }
};

/**
 * Generate or retrieve a simple session ID for the current browser session.
 * Persists for the duration of the tab session.
 */
const getSessionId = () => {
  if (!window.__indiaElectsSessionId) {
    window.__indiaElectsSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  return window.__indiaElectsSessionId;
};
