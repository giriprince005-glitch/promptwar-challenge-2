# 🇮🇳 India Elects: Context-Aware Election Assistant

![India Elects Banner](./india_elects_banner_1777740782672.png)

## 🌟 Overview
**India Elects** is a state-of-the-art, AI-powered interactive platform designed to guide citizens through the world's largest democratic process. Built with a focus on **context-aware intelligence**, **production-level security**, and **inclusive design**, it transforms the complex election landscape into a seamless, user-friendly experience.

Whether you are a first-time voter looking for registration steps or a seasoned citizen tracking election timelines, India Elects provides accurate, neutral, and real-time guidance.

---

## 🚀 Key Features

### 🧠 Context-Aware AI Assistant
*   **Intent Detection:** Automatically identifies user queries (Registration, Results, Polling, Terms) using a weighted keyword-scoring engine.
*   **Smart Routing:** The AI doesn't just talk—it guides. It suggests the most relevant app module (Timeline, Voter Guide, etc.) based on your conversation.
*   **Neutrality-First:** Powered by Gemini AI with custom prompt engineering to ensure 100% political neutrality and factual accuracy.

### 🗺️ Polling Booth Finder
*   **Interactive Mapping:** Integrated with Google Maps API to help users find their nearest polling station.
*   **Geolocation Support:** One-click "Find My Location" for instant results.
*   **Directions & Data:** Get precise distances and turn-by-turn directions to your designated booth.

### 📚 Learning & Progress Modules
*   **Voter Guide (Wizard):** A step-by-step interactive walkthrough for the registration process.
*   **Election Timeline:** A visual, horizontal scrollable journey through the election cycle.
*   **Flashcards:** Interactive cards to learn complex electoral terminology (EVM, VVPAT, NOTA).

---

## 🛡️ Production-Grade Security
Built with a "Security-First" mindset to protect against common web vulnerabilities and AI misuse:
*   **Input Sanitization:** Automated stripping of HTML/Script tags to prevent XSS.
*   **Prompt Injection Protection:** A robust validation layer that detects and blocks "jailbreak" attempts.
*   **Rate Limiting:** Intelligent client-side cooldowns to prevent API quota abuse and spam.
*   **Environment Isolation:** Zero hardcoded keys. All sensitive credentials are managed via secure `.env` variables.

---

## 🏗️ Technical Architecture
The project follows a modular, scalable architecture inspired by industry best practices:

*   **UI Layer:** React 19 with a custom **Glassmorphism Design System** for a premium, modern feel.
*   **Logic Layer:** Decoupled **Services & Hooks** architecture to separate business logic from UI components.
*   **Intelligence Layer:** A decision-making engine that sits between the user and the Gemini API for intent routing.
*   **Services Layer:** Dedicated modules for Google Maps (Geocoding/Places), Firebase (Logging), and AI interactions.

---

## 🛠️ Tech Stack
*   **Frontend:** React 19, Vite
*   **AI Engine:** Google Gemini Pro (via `@google/genai`)
*   **Maps Service:** Google Maps JavaScript & Places API
*   **Database/Logs:** Firebase Firestore
*   **Testing:** Vitest, React Testing Library
*   **Styling:** Vanilla CSS (Custom tokens & animations)

---

## 🧪 Testing & Quality
The project includes a comprehensive test suite to ensure stability:
*   **Unit Tests:** Validating intent detection, security sanitization, and logic.
*   **Component Tests:** Verifying navigation, accessibility, and UI rendering.
*   **Accessibility:** WCAG 2.1 compliant with full ARIA support and keyboard navigation.

Run the tests with:
```bash
npm test
```

---

## 📦 Getting Started

1. **Clone & Install:**
   ```bash
   git clone https://github.com/onemoremohit/India-Elects.git
   cd India-Elects
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file and add your keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_GOOGLE_MAPS_API_KEY=your_maps_key
   ```

3. **Run Locally:**
   ```bash
   npm run dev
   ```

---

## 📸 Screenshots
*(Add your app screenshots here)*

---

*Made with ❤️ for the world's largest democracy.*
