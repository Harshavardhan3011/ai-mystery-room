# AI Mystery Room

A full-stack AI mystery-solving game based on the uploaded **Build Your AI Mystery Room — Guide Doc.pdf**.

## Requirement labels used in this project

- **[GUIDE REQUIREMENT]** — explicitly specified by the guide.
- **[ADDITIONAL RECOMMENDATION]** — implementation choice added for reliability or usability.
- **[OPEN DECISION]** — the guide leaves this behavior unspecified.

## Stack

- React + Vite + Tailwind CSS
- React Router DOM + Axios
- Node.js + Express
- MongoDB + Mongoose
- Gemini via `@google/genai`
- Zod validation
- Node.js built-in test runner

## Requirements

- Node.js 20.19+ (or a compatible current LTS release)
- npm
- MongoDB local instance or MongoDB Atlas connection string
- Gemini API key

## Quick start

### 1. Configure the backend

```bash
cd server
cp .env.example .env
```

On Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

Edit `server/.env` and set `MONGODB_URI` and a newly rotated `GEMINI_API_KEY`. Keep the API key on the server only. `GEMINI_MODEL` defaults to `gemini-2.5-flash`.

The backend normalizes accidental surrounding quotes in `GEMINI_MODEL`. If the configured model is unavailable to the account, generation makes one bounded fallback attempt with the catalog-verified `gemini-3.1-flash-lite` model. Gemini requests have a 90-second timeout and no SDK-level retries; malformed output is retried once by the application.

```bash
npm install
npm run dev
```

The API starts at `http://localhost:5000`. Test `http://localhost:5000/api/health`.

### 2. Configure the frontend

Open another terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`).

### 3. Run backend unit tests

```bash
cd server
npm test
```

These tests cover scoring, difficulty counts, and generated-case validation. They do not require MongoDB or a Gemini API key.

### 4. Live integration verification

With MongoDB and Gemini configured in the private `server/.env`:

```bash
cd server
npm start
```

In another terminal, the API is available at `http://localhost:5000`. Verify the health endpoint at `http://localhost:5000/api/health`, then use the frontend at `http://localhost:5173` after starting Vite:

```bash
cd client
npm run dev
```

The live verification flow should create Easy, Medium, and Hard cases, confirm the required 3/5/2, 4/7/3, and 5/9/3 counts, discover clues, exhaust hints, submit one accusation, and retrieve results. It should also verify that active-case responses omit the solution, repeated clue discovery does not add points, exhausted hints return a conflict, invalid accusations are rejected, and repeated accusations cannot change a completed case.

### 5. Production build check

```bash
cd client
npm run build
```

The frontend includes `client/vercel.json` so React Router routes resolve correctly on Vercel. Configure `VITE_API_BASE_URL` in the Vercel project settings without a trailing slash.

## Guide requirements implemented

- Five main screens: Home, Create Mystery, Investigation Room, Accusation, Results.
- Easy / Medium / Hard case sizes: 3/5/2, 4/7/3, 5/9/3 (suspects/clues/hints).
- Gemini case generation and validation on the backend.
- MongoDB persistence.
- Clue discovery, hint use, accusation, and results APIs.
- Server-side scoring.
- Culprit/solution fields excluded from active-case API responses.
- Frontend and backend environment configuration.

## Explicitly documented recommendation

The guide does **not** define incorrect-accusation scoring or retry behavior. This starter uses one final accusation. If the accusation is wrong, no base points are awarded; unique clue points and hint deductions still apply, with a minimum score of zero. Change this policy only after deciding the rule for your project.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/cases` | Generate and save a mystery |
| GET | `/api/cases/:id` | Retrieve public active/completed case state |
| POST | `/api/cases/:id/clues/:clueId/discover` | Discover a clue |
| POST | `/api/cases/:id/hints` | Use the next hint |
| POST | `/api/cases/:id/accuse` | Finalize an accusation |
| GET | `/api/cases/:id/result` | Retrieve result after accusation |

## Deployment outline

1. Create a MongoDB Atlas cluster and database user.
2. Deploy `server/` to a Node-compatible host.
3. Set `MONGODB_URI`, `GEMINI_API_KEY`, `CLIENT_URL`, and `PORT` in backend environment settings.
4. Deploy `client/` to Vercel.
5. Set `VITE_API_BASE_URL` to the deployed backend URL (no trailing slash).
6. Set backend CORS `CLIENT_URL` to the deployed frontend origin.
7. Run a complete case on the deployed website before submitting both URLs.

The backend `server/.env.example` contains placeholders only. If a Gemini key has ever been pasted into chat, a file, or logs, revoke it and create a replacement before local or production use.

## Security notes

- Never put `GEMINI_API_KEY` in client-side code or `VITE_*` variables.
- Do not commit `.env` files.
- Active-case API responses omit the culprit and explanation.
- The app currently has no user accounts; case IDs are unguessable MongoDB ObjectIds but are not an authentication system. **[ADDITIONAL RECOMMENDATION]** Add ownership/authentication if this becomes a multi-user production service.
