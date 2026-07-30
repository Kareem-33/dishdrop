# DishDrop

DishDrop turns cooking videos from TikTok, Instagram, Facebook, and YouTube into structured, editable recipes - ingredients, steps, servings, estimated time/cost, and tags - so you can save, organize, and cook from the videos you already save and forget about.

## How it works

1. Paste a video URL.
2. YouTube links are handed straight to Gemini as a file URI. TikTok/Instagram/Facebook links are downloaded server-side with `yt-dlp`, then uploaded to Gemini.
3. Gemini extracts a structured recipe (title, ingredients, steps, servings, estimated time/cost, difficulty, tags) tied back to the source video (platform, author, thumbnail).
4. The recipe is saved to your account, where it can be edited, organized into collections, and searched.

## Tech stack

**Frontend** (`/frontend`)
- React 19 + TypeScript, built with Vite
- Tailwind CSS 4
- Zustand for state
- React Router 7
- `@hello-pangea/dnd` for drag-and-drop, `react-hot-toast` for notifications, `react-error-boundary` for error boundaries

**Backend** (`/backend`)
- Node.js + Express 5 + TypeScript
- MongoDB with Mongoose
- JWT auth via httpOnly cookies
- Google Gemini for recipe extraction, with OpenRouter as a fallback provider
- `yt-dlp` (via `youtube-dl-exec`) for downloading non-YouTube source videos
- Cloudinary for media storage, Resend for transactional email (verification, password reset)

## Project structure

```
dishdrop/
├── frontend/   # React app (Vite)
├── backend/    # Express API
│   ├── bin/    # Bundled yt-dlp binary used for video downloads
│   └── src/
└── vercel.json
```

## Getting started

### Prerequisites
- Node.js 20+
- A MongoDB connection string (e.g. MongoDB Atlas)
- API keys for Gemini, Cloudinary, Resend, and Google OAuth (see below)

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

There's no `.env.example` in the repo yet - create `backend/.env` yourself using the variable list below before running.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the frontend calls the deployed API (`https://dishdrop-api.vercel.app/api/v1`). To point it at your local backend instead, set `VITE_API_URL=http://localhost:2525/api/v1` in `frontend/.env`.

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port for the local Express server (default `2525`) |
| `NODE_ENV` | `development` or `production` - also controls cookie `secure`/`sameSite` behavior |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth JWTs |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `API_URL` | Public URL of this API (used in generated links, e.g. email verification) |
| `GEMINI_API_KEY` | Google Gemini API key (recipe extraction) |
| `OPENROUTER_API_KEY` | OpenRouter API key (recipe extraction fallback) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `CLOUD_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET` | Cloudinary credentials |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_FROM` | Sender address for outgoing email |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for API requests (defaults to the deployed API URL - see above) |

## Deployment

Frontend and backend are deployed as **two separate Vercel projects** (`frontend/` and `backend/`), on different subdomains. Because of that, auth cookies are set cross-origin (`sameSite: "none"; secure: true` in production), so the frontend's deployed URL must be an allowed `CLIENT_URL` on the backend for CORS/cookies to work.

> `vercel.json` at the repo root still defines a single-project [Vercel Services](https://vercel.com/docs/services) setup (frontend + backend on one domain). That's not what's currently deployed - if you want to consolidate to one domain instead of two separate projects, that config is the starting point, but it needs the project's Framework Preset set to **Services** in Vercel's dashboard to take effect, and the frontend's API base URL switched back to a relative path.

**Video downloads on Vercel:** the backend bundles a Linux `yt-dlp` binary directly (`backend/bin/yt-dlp_linux`) so it can shell out to it in a serverless function. This works for short videos but is still constrained by function execution time limits and ephemeral `/tmp` storage - a `flyio-new-files` branch in this repo explores moving the backend to Fly.io (Dockerfile + `fly.toml`) as a longer-running alternative for this specific piece.

## Scripts

| Location | Command | Description |
|---|---|---|
| `backend` | `npm run dev` | Run the API with nodemon |
| `backend` | `npm run build` | Compile TypeScript to `dist/` |
| `backend` | `npm start` | Run the compiled API |
| `frontend` | `npm run dev` | Run the Vite dev server |
| `frontend` | `npm run build` | Type-check and build for production |
| `frontend` | `npm run lint` | Run ESLint |
| `frontend` | `npm run preview` | Preview the production build locally |

## License

ISC
