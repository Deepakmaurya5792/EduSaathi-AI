# EduSaathi AI — Personalized Learning for Every Student 🎓
> **UN Sustainable Development Goal 4 (Quality Education) Aligned AI Platform**

EduSaathi AI is an intelligent, bilingual, accessible personalized learning platform engineered specifically for students in underserved and rural communities across Classes 6–10. Built entirely in **JSX & JavaScript (ESM)** without TypeScript complexity.

---

## 🌟 Key Highlights & SDG 4 Alignment

- **Socratic AI Personal Tutor:** Step-by-step guidance, real-world village analogies (e.g. sharing rotis, farm land division), and speech-to-speech support (TTS voice readout & microphone voice input).
- **Adaptive Learning Engine:** Real-time 0–100% Bayesian/weighted mastery scoring across curriculum topics with prerequisite alerts and remedial pathways.
- **Multilingual Support:** Instant toggling between **English** and **Hindi (हिन्दी)** across the entire UI, lessons, AI explanations, and quizzes.
- **Offline-First Resilience:** Client-side **IndexedDB** caching with background auto-sync so students can study without stable internet connections.
- **Self-Contained Execution:** Automated in-memory database fallback (`mongodb-memory-server`) and built-in deterministic pedagogical AI demo mode — works 100% out of the box with zero external setup or API keys required.

---

## 🔐 1-Click Demo Accounts

No manual sign-up required. Click the 1-click demo buttons on the authentication page (`/auth`):

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Student** | `student@edusaathi.ai` | `Student@123` | Personal Dashboard, AI Tutor, Adaptive Quizzes, Offline Library, Progress Analytics |
| **Teacher** | `teacher@edusaathi.ai` | `Teacher@123` | Class Performance, Student Mastery Monitoring, Gap Identification, Remedial Action Plans |
| **Admin** | `admin@edusaathi.ai` | `Admin@123` | UN SDG 4 Impact Metrics, User Role Management, Curriculum Authoring |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended; tested on v22)
- npm

### 1. Clone & Install
```bash
# Install root dependencies and workspace packages
npm install --prefix server
npm install --prefix client
```

### 2. Environment Variables (Optional)
The platform works **out of the box** in offline/demo mode without any configuration. To optionally configure Gemini API keys or a dedicated MongoDB instance:
- See `.env.example` in root
- See `client/.env.example` in client

### 3. Start Development Servers
You can now start **both** the backend and frontend together with a single command from the project root:

```bash
# Starts both Backend (nodemon) and Frontend (vite) concurrently!
npm run dev
```

Alternatively, you can run them individually:
```bash
npm run dev:server   # Backend only (nodemon)
npm run dev:client   # Frontend only (vite)
```

Open your browser at **`http://localhost:5173`**.

---

## 📂 Project Structure

```
EduSaathi AI/
├── client/                      # React 19 Frontend (100% JSX & JavaScript)
│   ├── src/
│   │   ├── components/          # Navbar, OfflineBanner, UI components
│   │   ├── context/             # AuthContext, LanguageContext, ThemeContext
│   │   ├── pages/               # 11 Dedicated views (Landing, Student, Teacher, Admin, Tutor, Quizzes, Library, etc.)
│   │   ├── services/            # Axios API client, IndexedDB offline storage, Web Speech API
│   │   ├── App.jsx              # Main router & layout
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind CSS v4 & custom glassmorphism styles
│   ├── vite.config.js           # Vite configuration with @tailwindcss/vite
│   └── package.json
│
├── server/                      # Node.js ESM Express Backend (100% JavaScript)
│   ├── src/
│   │   ├── config/              # Environment config & auto-fallback MongoDB connection
│   │   ├── controllers/         # Auth, Subject, Lesson, Tutor, Quiz, Progress, Teacher, Admin
│   │   ├── middleware/          # JWT Auth & Role Authorization
│   │   ├── models/              # Mongoose schemas (User, StudentProfile, TopicMastery, Quiz, etc.)
│   │   ├── routes/              # Express API route modules
│   │   ├── services/            # Adaptive Engine & AI Provider (Gemini + Offline Demo fallback)
│   │   ├── index.js             # Express server entry point
│   │   └── seed.js              # Comprehensive demo curriculum database seed script
│   ├── tests/                   # Vitest unit test suite
│   └── package.json
│
├── .gitignore                   # Strict protection ignoring .env, credentials, node_modules
├── .env.example                 # Root environment template
└── README.md
```

---

## 🧪 Testing

```bash
# Run backend AI Provider & Adaptive Engine tests
npm --prefix server run test

# Validate frontend production build
npm --prefix client run build
```

---

## 🌍 UN SDG 4 Impact

- **Target 4.1:** Free, equitable, quality primary and secondary education for all children.
- **Target 4.5:** Eliminate gender disparities and provide equal access for rural and vulnerable children.
- **Target 4.c:** Substantially increase the supply of qualified teachers through AI-powered remedial analytics.
