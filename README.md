# LunaJoy

LunaJoy is a mental health progress tracker built with React, Fastify, TypeScript, Tailwind CSS and SQLite.

## Project structure

```text
LunaJoy/
├── client/         React, Vite, and Tailwind frontend
├── server/         Fastify API
│   └── data/       SQLite database created at runtime
├── .env.example    Environment variable template
└── package.json    npm workspace scripts
```

## Requirements

- Node.js 20 or newer
- npm
- A Google OAuth 2.0 Web application client

## Google OAuth setup

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Configure the OAuth consent screen under **Google Auth Platform**. If the app is in testing, add your Google account as a test user.
4. Open **Google Auth Platform → Clients** and create an **OAuth client ID** with the application type **Web application**.
5. Add this authorized redirect URI:

   ```text
   http://localhost:4000/api/auth/google/callback
   ```

6. Copy the generated client ID and client secret into `server/.env` as described below.

## Run locally

From the repository root:

```bash
cp .env.example server/.env
npm install
```

Open `server/.env` and replace these values with the credentials from Google Cloud:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=a-long-random-secret
```

You can generate a JWT secret with:

```bash
openssl rand -base64 32
```

Start both applications:

```bash
npm run dev
```

- Client: `http://localhost:5173`
- API: `http://localhost:4000`
- SQLite database: `server/data/lunajoy.db`

The database and its tables are created automatically. The root `npm install` installs dependencies for both workspaces; do not run a separate install inside `client` or `server`.

The example environment enables `SEED_SAMPLE_DATA=true`. After a user signs in with Google, the server inserts seven sample historical logs for assessment purposes. It uses `INSERT OR IGNORE`, so existing dates are never overwritten, and today is left available for a real check-in. Set this variable to `false` for normal use.

## API endpoints

All log and session endpoints use the `lunajoy_session` HTTP-only cookie. Unauthenticated requests return `401 Unauthorized`.

| Method | Endpoint                    | Purpose                                          |
| ------ | --------------------------- | ------------------------------------------------ |
| `GET`  | `/api/auth/google`          | Start Google OAuth                               |
| `GET`  | `/api/auth/google/callback` | Complete Google OAuth and create the session     |
| `GET`  | `/api/auth/session`         | Return the authenticated user                    |
| `POST` | `/api/auth/logout`          | Clear the session cookie                         |
| `POST` | `/api/log`                  | Create or update one log for the supplied date   |
| `GET`  | `/api/logs?period=week`     | Return the last 7 days of logs                   |
| `GET`  | `/api/logs?period=month`    | Return the last 30 days of logs                  |
| `GET`  | `/api/updates`              | Upgrade to an authenticated WebSocket connection |

Example `POST /api/log` body:

```json
{
  "date": "2026-08-18",
  "mood": 4,
  "anxiety": 2,
  "sleepHours": 7.5,
  "sleepQuality": 4,
  "sleepDisturbances": "",
  "activityType": "Walking",
  "activityMinutes": 30,
  "socialInteractions": 3,
  "stress": 2,
  "symptoms": [{ "name": "Low energy", "severity": 2 }],
  "notes": "Felt better after getting outside."
}
```

`POST /api/log` uses the user ID and date as a unique pair. Sending another log for the same date updates the existing database row.

The WebSocket broadcasts `log.updated` after a log has been stored successfully. It keeps other open sessions current; it does not replace API or SQLite persistence.

## Production build

Set production values in `server/.env`. `WEB_ORIGIN` and `GOOGLE_CALLBACK_URL` must use the deployed URLs, and the deployed callback must also be registered in Google Cloud.

```bash
npm run build
NODE_ENV=production npm start
```

In production mode, Fastify serves the built React application from `client/dist`.
