# 🎯 AI Interview Simulator

> **An intelligent interview coaching platform powered by AI that provides real-time feedback, skill assessment, and personalized growth recommendations.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://694a1189e7e868433f22abf2--comforting-seahorse-44ee79.netlify.app)
[![Backend API](https://img.shields.io/badge/API-Live-green?style=for-the-badge)](https://ai-interview-simulator-q03y.onrender.com/health)

---

## 🚀 The Problem

Technical interviews are stressful and unpredictable. Candidates often:
- ❌ Don't know their weak areas until it's too late
- ❌ Lack personalized feedback on their answers
- ❌ Can't track improvement over time
- ❌ Don't have access to realistic practice environments

## 💡 The Solution

An AI-powered interview simulator that:
- ✅ Conducts realistic technical interviews across multiple roles (Frontend, Backend, ML, SDE)
- ✅ Provides instant, detailed feedback on every answer
- ✅ Identifies skill gaps with radar chart visualization
- ✅ Generates personalized growth plans
- ✅ Tracks progress with comprehensive PDF reports

---

## 🎥 Demo

**Live Application:** [https://694a1189e7e868433f22abf2--comforting-seahorse-44ee79.netlify.app](https://694a1189e7e868433f22abf2--comforting-seahorse-44ee79.netlify.app)

**Backend API:** [https://ai-interview-simulator-q03y.onrender.com](https://ai-interview-simulator-q03y.onrender.com)

### Key Features in Action:
1. **Dynamic Interview Sessions** - Choose role, difficulty, and interview length
2. **Real-time AI Feedback** - Get scored on correctness, clarity, and confidence
3. **Skill Assessment** - Visual radar chart showing strengths and gaps
4. **Growth Recommendations** - Personalized action items (Quick Fix, Build Strength, Interview Ready)
5. **PDF Reports** - Downloadable interview summaries

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend (React + Vite)"]
        UI[User Interface]
        Auth[Auth Context]
        API[Axios API Client]
    end

    subgraph Backend["Backend (Node.js + Express)"]
        Routes[API Routes]
        Controllers[Controllers]
        Middleware[Auth Middleware]
        Services[AI Service]
    end

    subgraph External["External Services"]
        OpenRouter[OpenRouter AI]
        MongoDB[(MongoDB Atlas)]
    end

    UI --> Auth
    Auth --> API
    API -->|JWT Token| Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services -->|API Call| OpenRouter
    Controllers -->|CRUD| MongoDB
```

### Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS for styling
- Recharts for data visualization
- Axios for API calls
- React Router for navigation

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (Access + Refresh tokens)
- OpenRouter AI (GPT-4o-mini)
- PDFKit for report generation

**Deployment:**
- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas

---

## 🧠 How AI is Used

### 1. **Intelligent Question Generation**
- AI generates contextual follow-up questions based on previous answers
- Adapts difficulty based on role (Frontend, Backend, ML, SDE) and level (Junior, Mid, Senior)
- Maintains conversation flow for realistic interview experience

### 2. **Multi-Dimensional Scoring**
Every answer is evaluated on:
- **Correctness** (0-10): Technical accuracy
- **Clarity** (0-10): Communication effectiveness
- **Confidence** (0-10): Presentation quality

### 3. **Skill Detection & Assessment**
- AI identifies skills demonstrated in each answer
- Tracks skill proficiency over time with weighted updates
- Maps skills to role-specific taxonomy (e.g., React, Node.js, DSA)

### 4. **Personalized Recommendations**
AI generates actionable growth plans:
- **Quick Fix (1-2 days)**: Immediate improvements
- **Build Strength (1-2 weeks)**: Skill development
- **Interview Ready (1 month)**: Long-term mastery

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant MongoDB

    User->>Frontend: Login/Register
    Frontend->>Backend: POST /api/auth/login
    Backend->>MongoDB: Verify credentials
    MongoDB-->>Backend: User data
    Backend-->>Frontend: Access Token + Refresh Token (httpOnly cookie)
    Frontend->>Frontend: Store access token in localStorage
    
    Note over Frontend,Backend: Token Expiration Handling
    Frontend->>Backend: API request with expired token
    Backend-->>Frontend: 401 TOKEN_EXPIRED
    Frontend->>Backend: POST /api/auth/refresh (with cookie)
    Backend-->>Frontend: New access token
    Frontend->>Backend: Retry original request
```

### Security Features:
- **JWT Access Tokens** (15 min expiry) - Stored in localStorage
- **Refresh Tokens** (7 days) - httpOnly cookies for XSS protection
- **Automatic Token Refresh** - Seamless user experience
- **CORS Protection** - Whitelist-based origin validation
- **Rate Limiting** - Prevent abuse
- **Input Sanitization** - XSS and NoSQL injection protection

---

## 📊 Skill Assessment Logic

### Data Flow:
```
Answer → AI Analysis → Skill Detection → Score Calculation → Radar Chart Update
```

### Scoring Algorithm:
1. **Initial Score**: AI assigns 0-100 for each detected skill
2. **Weighted Update**: `newScore = (oldScore × 0.7) + (aiScore × 0.3)`
3. **Taxonomy Mapping**: Skills mapped to role-specific categories
4. **Gap Identification**: Skills < 60 flagged as priority gaps
5. **Recommendation Generation**: AI creates targeted improvement plans

### Visualization:
- **Radar Chart**: 6-axis skill profile (role-specific)
- **Progress Bars**: Individual skill tracking
- **Gap Analysis**: Top 3 weaknesses highlighted

---

## 🧪 Edge Cases Handled

### 1. **Token Expiration**
- ✅ Automatic refresh on 401 errors
- ✅ Retry failed requests with new token
- ✅ Graceful logout on refresh failure

### 2. **Interview Length Limits**
- ✅ Quick (5 questions), Full (10), Deep (15), Unlimited
- ✅ Enforced server-side with question counting
- ✅ Completion screen with summary scores

### 3. **Session State Management**
- ✅ Resume interrupted sessions
- ✅ Prevent duplicate question generation
- ✅ Handle completed sessions gracefully

### 4. **Network Failures**
- ✅ Retry logic for transient errors
- ✅ User-friendly error messages
- ✅ Loading states for async operations

### 5. **Data Consistency**
- ✅ Single source of truth for question counts
- ✅ Atomic database operations
- ✅ Proper error rollback

---

## 🎨 Key Features

### For Users:
- 🎯 **4 Interview Modes**: Technical, Behavioral, System Design, Mixed
- 📏 **Flexible Length**: Quick (5), Full (10), Deep (15), Unlimited
- 📊 **Real-time Feedback**: Instant scoring on every answer
- 📈 **Progress Tracking**: Visual skill radar charts
- 📄 **PDF Reports**: Downloadable interview summaries
- 🔄 **Session History**: Review past interviews

### For Developers:
- 🔐 **Secure Auth**: JWT with refresh token rotation
- 🚀 **Scalable Architecture**: Modular service layer
- 📦 **Clean Code**: ESLint + Prettier configured
- 🧪 **Error Handling**: Comprehensive try-catch with logging
- 🌐 **CORS**: Production-ready cross-origin setup
- 📝 **API Documentation**: RESTful endpoints

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenRouter API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/prudhivisaikiran/ai-interview-simulator.git
cd ai-interview-simulator
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

### Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Direct OpenAI (default):
OPENAI_API_KEY=your_openai_key
AI_MODEL=gpt-5-mini

# OR, to route through OpenRouter instead, uncomment and use OpenRouter's
# provider-prefixed model names (e.g. "openai/gpt-4o-mini"):
# OPENAI_API_KEY=your_openrouter_key
# OPENAI_BASE_URL=https://openrouter.ai/api/v1
# AI_MODEL=openai/gpt-4o-mini

NODE_ENV=development
```


**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
ai-interview-simulator/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic (AI, Assessment, PDF)
│   │   ├── middlewares/      # Auth, error handling
│   │   └── utils/            # Helper functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API client, auth
│   │   ├── context/          # React context (Auth)
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Interview Sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions/:id/start` - Start interview
- `POST /api/sessions/:id/answer` - Submit answer
- `GET /api/sessions/:id/assessment` - Get skill assessment
- `GET /api/sessions/:id/report` - Download PDF report

---

## 🚢 Deployment Runbook

This project deploys as three independent pieces: **Netlify** (frontend), **Render** (backend), **MongoDB Atlas** (database). This is the correct, appropriately simple architecture for this app's size — no migration needed.

### 1. Database — MongoDB Atlas
1. Create a free/shared cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Database Access → add a user with a strong generated password.
3. Network Access → add `0.0.0.0/0` (Render uses dynamic IPs) or Render's specific egress IPs if you're on a paid Atlas tier that supports IP lists.
4. Copy the connection string (`mongodb+srv://...`) — this is your `MONGO_URI`.
5. Atlas → Backup: enable Cloud Backup (paid tiers) or set a manual export schedule (`mongodump` on a cron) if staying on the free tier, which has **no automated backups**.

### 2. Backend — Render
1. New → Web Service → connect the `ai-interview-simulator` repo, root directory `backend`.
2. Build command: `npm install`. Start command: `npm start`.
3. Environment → add these variables (values only in Render's dashboard, never in git):
   `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`, `OPENAI_API_KEY`, `AI_MODEL`, `CLIENT_ORIGIN` (your Netlify URL), `NODE_ENV=production`.
   Generate `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` locally with `openssl rand -base64 48` — never reuse example values.
4. Render's free tier sleeps after inactivity (cold start delay on the next request) — acceptable for a demo, not for "always on"; upgrade to a paid instance if you need that.
5. After deploy, verify: `https://<your-render-app>.onrender.com/health` returns `{"status":"ok"}`.

### 3. Frontend — Netlify
1. New site from Git → same repo, base directory `frontend`, build command `npm run build`, publish directory `frontend/dist`.
2. Environment variable: `VITE_API_URL=https://<your-render-app>.onrender.com/api`.
3. Deploy, then open the site and confirm registration/login work end-to-end (this exercises frontend → backend → Atlas in one flow).
4. Note your final Netlify **production** domain (not a deploy-preview URL with a random hash) and set it as `CLIENT_ORIGIN` back on Render, then redeploy the backend so CORS allows it.

### Rollback
- **Render:** Dashboard → Deploys tab → pick a previous successful deploy → "Redeploy".
- **Netlify:** Dashboard → Deploys tab → pick a previous deploy → "Publish deploy".
- Both keep prior build artifacts, so rollback is a click, not a rebuild.

## 🛟 Recovery Plan (if this breaks 6 months from now)

1. **Repo:** `github.com/prudhivisaikiran/ai-interview-simulator` — clone it, this README has the full setup.
2. **Hosting:** Render (backend) + Netlify (frontend) — check both dashboards for build/deploy failure logs first.
3. **Database:** MongoDB Atlas — check cluster status; free-tier clusters can be auto-paused after long inactivity and need manual resume.
4. **Required env vars:** listed above — re-generate JWT secrets and re-enter the OpenAI/OpenRouter key if rotated or expired.
5. **Redeploy:** push to `main` (both Render and Netlify auto-deploy on push if connected to GitHub), or trigger manually from each dashboard.
6. **Health check:** `GET /health` on the Render URL should return `200`. If it doesn't, check Render's live logs for the exact error before changing anything.
7. **Common failure causes to check first:** OpenAI/OpenRouter API key expired or billing lapsed; Atlas free-tier cluster paused; Render free-tier service spun down (just needs a request to wake, ~30–60s); `CLIENT_ORIGIN` mismatch after a Netlify domain change (breaks CORS with a clear rejected-origin log line on the backend).



- [ ] Voice-based interviews with speech recognition
- [ ] Video recording for body language analysis
- [ ] Collaborative mock interviews (peer-to-peer)
- [ ] Company-specific interview prep (FAANG, startups)
- [ ] Mobile app (React Native)
- [ ] Interview scheduling with calendar integration
- [ ] Leaderboards and community challenges

---

## 👨‍💻 Author

**Sai Kiran Prudhvi**  
*Full-Stack & AI Engineer*

> Building intelligent systems that solve real-world problems.

- GitHub: [@prudhivisaikiran](https://github.com/prudhivisaikiran)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenRouter for AI API access
- MongoDB Atlas for database hosting
- Netlify & Render for deployment
- React & Node.js communities

---

**⭐ If this project helped you, please give it a star!**
