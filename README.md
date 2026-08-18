# LunaJoy

LunaJoy is a mental health progress tracker built with React, Fastify, TypeScript, WebSockets, and SQLite.

## Project structure

```text
LunaJoy/
├── client/   React and Vite frontend
├── server/   Fastify API and SQLite database
└── package.json
```

## Features

- Google OAuth sign-in with secure HTTP-only session cookies
- Guided daily check-in for mood, anxiety, sleep, activity, social connection, stress, and symptoms
- Weekly and monthly trend charts for mood, anxiety, stress, and sleep
- Real-time dashboard updates over WebSockets
- One editable or deletable check-in per user per day
- Responsive, accessible interface with supportive language and metric tooltips

## Run locally

Requirements: Node.js 20 or newer.

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:4000`.

## Google authentication

1. Create an OAuth 2.0 Client ID for a Web application in Google Cloud.
2. Add `http://localhost:4000/api/auth/google/callback` as an authorized redirect URI.
3. Copy `.env.example` to `.env`.
4. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and a long random `JWT_SECRET`.
5. Restart the development server and select **Continue with Google**.

For production, use the deployed callback URL in both Google Cloud and `GOOGLE_CALLBACK_URL`. Set `WEB_ORIGIN` to the deployed client origin.

## Production build

```bash
npm run build
npm start
```

The server serves the built React application from `client/dist` in production.

## API

- `GET /api/auth/google` starts Google OAuth
- `GET /api/auth/session` returns the signed-in user
- `POST /api/auth/logout` clears the session
- `POST /api/log` creates or updates today's check-in
- `DELETE /api/log/:date` deletes a check-in
- `GET /api/logs?period=week|month` returns trend data
- `GET /api/updates` upgrades to a WebSocket for live updates
