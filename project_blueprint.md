# AI Interview Simulator + Skill Gap Coach - Project Blueprint

## A) Folder Structure

```text
ai-interview-simulator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Database connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── interviewController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT verification
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── Interview.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── interviewRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   └── aiService.js        # AI integration logic (placeholder)
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   ├── app.js                  # App setup
│   │   └── server.js               # Entry point
│   ├── .env                        # Environment variables (gitignored)
│   ├── .gitignore
│   ├── package.json
│   └── render.yaml                 # Render deployment config
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   └── RadarChart.jsx  # Recharts implementation
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Input.jsx
│   │   │   └── layout/
│   │   │       ├── Navbar.jsx
│   │   │       └── footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── InterviewSession.jsx
│   │   │   ├── InterviewSetup.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Result.jsx
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance
│   │   │   └── authService.js
│   │   ├── App.jsx
│   │   ├── index.css               # Tailwind directives
│   │   └── main.jsx
│   ├── .env                        # Environment variables (gitignored)
│   ├── .gitignore
│   ├── index.html
│   ├── netlify.toml                # Netlify deployment config
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## B) Environment Variables

### Backend (`/backend/.env`)
```properties
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ai-interview-db
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
# Example: 15m for access, 7d for refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
# OpenAI or other AI Key (for future use)
AI_API_KEY=sk-placeholder-key
```

### Frontend (`/frontend/.env`)
```properties
# URL of the backend API
VITE_API_URL=http://localhost:5000/api
```

## C) API Endpoint List

### Auth
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user & get tokens
- `POST /api/auth/refresh` - Get new access token using refresh token

### Interviews
- `POST /api/interviews/start` - Initialize a new interview session (topic, difficulty)
- `POST /api/interviews/:id/answer` - Submit user answer, get AI response/next question
- `POST /api/interviews/:id/finish` - End interview and generate final feedback
- `GET /api/interviews/:id` - Get specific interview details
- `GET /api/interviews/history` - Get list of past interviews for user

### Users
- `GET /api/users/profile` - Get user stats and info

## D) Core Pages (Frontend Routes)

1.  **Landing Page** (`/`): Public page with "Get Started" / Login.
2.  **Auth Pages** (`/login`, `/register`): User authentication.
3.  **Dashboard** (`/dashboard`): User overview, "Start New Interview" button, recent stats.
4.  **Interview Setup** (`/interview/setup`): Select topic (e.g., React, Node) and difficulty.
5.  **Interview Session** (`/interview/:id`): Chat interface.
    -   *Features*: Text input, chat history, "End Interview" button.
6.  **Result & Feedback** (`/interview/:id/result`):
    -   *Features*: Detailed feedback, 5-point radar chart (Technical, Communication, Problem Solving, etc.), Skill Gap analysis.
7.  **History** (`/history`): List of all past interviews with scores.
