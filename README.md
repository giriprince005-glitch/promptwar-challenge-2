# 🇮🇳 India-Elects

An interactive and neutral **Election Information Assistant** designed to guide individuals through the world's largest democratic process. This application is built with React and deployed on Google Cloud Run, powered by the Gemini API to provide intelligent, conversational responses.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Platform](https://img.shields.io/badge/Platform-GCP_Cloud_Run-blue)
![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)

---

## 🌟 Features

India-Elects is divided into four main interactive modules:

1. **AI Assistant (`AssistantChat`)**: A conversational bot powered by Gemini, designed to answer specific questions regarding election dates, voter eligibility, and polling stations in a strictly neutral and informational manner.
2. **Voter Guide (`ProcessWizard`)**: A step-by-step wizard guiding new voters through the registration and voting process.
3. **Timeline (`ElectionTimeline`)**: A chronological view of key election events, phases, and result declarations.
4. **Learn Terms (`Flashcards`)**: Interactive flashcards to help users familiarize themselves with common electoral terminology (e.g., EVM, VVPAT, Model Code of Conduct).

---

## 🏗️ Architecture & Component Diagrams

### System Architecture

The application is a containerized frontend deployed seamlessly on Google Cloud Run, leveraging the Gemini API for its intelligent chat capabilities.

```mermaid
graph TD
    User([User / Browser]) -->|HTTPS Request| CloudRun[Google Cloud Run]
    
    subgraph GCP [Google Cloud Platform]
        CloudRun -->|Serves| ReactApp[React + Vite Frontend]
        ReactApp -.->|API Calls| Gemini[Gemini API]
    end

    classDef gcp fill:#f2f6fa,stroke:#4285f4,stroke-width:2px,color:#333
    classDef external fill:#f9f9f9,stroke:#666,stroke-width:2px,color:#333
    
    class GCP gcp
    class User,Gemini external
```

### Component Structure

A breakdown of the React components that make up the user interface:

```mermaid
graph TD
    App[App.jsx] --> Header[Header / Navigation]
    App --> Main[Main Content Area]
    App --> Footer[Footer]

    Main -->|State: activeTab| Router{Tab Switcher}

    Router -->|'assistant'| Assistant[AssistantChat.jsx]
    Router -->|'wizard'| Wizard[ProcessWizard.jsx]
    Router -->|'timeline'| Timeline[ElectionTimeline.jsx]
    Router -->|'flashcards'| Flashcards[Flashcards.jsx]

    classDef component fill:#e1f5fe,stroke:#039be5,stroke-width:2px,color:#000
    class App,Header,Main,Footer,Assistant,Wizard,Timeline,Flashcards component
```

---

## 🚀 Local Development

This template provides a minimal setup to get React working in Vite with Hot Module Replacement (HMR).

### Prerequisites
- Node.js (v18+)
- A Gemini API Key (Set up your `.env` file with `VITE_GEMINI_API_KEY`)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/onemoremohit/India-Elects.git
   cd India-Elects
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## ☁️ Deployment (Google Cloud Run)

This project includes a `Dockerfile` and `nginx.conf` for optimized production serving.

```bash
# Set your Google Cloud project
gcloud config set project [YOUR_PROJECT_ID]

# Deploy directly from source
gcloud run deploy promptwar2 \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```
