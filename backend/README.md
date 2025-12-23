# Backend - AI Interview Simulator

## Setup

1.  **Install Dependencies**
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in the values.
    ```bash
    cp .env.example .env
    ```

3.  **Run Locally**
    ```bash
    # Development mode (nodemon)
    npm run dev

    # Production mode
    npm start
    ```

## API Endpoints

-   `POST /api/auth/register` - Create account
-   `POST /api/auth/login` - Login
-   `POST /api/auth/refresh` - Refresh access token
-   `POST /api/auth/logout` - Logout
-   `GET /api/auth/me` - Get current user info

## Health Check
-   `GET /health`
