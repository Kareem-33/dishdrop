# DishDrop

DishDrop turns cooking videos from TikTok, Instagram, and YouTube into structured, editable recipes - ingredients, steps, and all - with smart collections, search, and meal planning.

## Tech stack

**Frontend** (`/frontend`)
- React 19 + TypeScript, built with Vite
- Tailwind CSS 4
- Zustand for state, TanStack-style data fetching via Axios
- React Router
- `@hello-pangea/dnd` for drag-and-drop (meal planning / collections)

**Backend** (`/backend`)
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- JWT auth via httpOnly cookies
- Google Gemini / OpenRouter for AI recipe extraction from video
- Cloudinary for media storage, Resend for transactional email

## Project structure

```
dishdrop/
├── frontend/   # React app (Vite)
├── backend/    # Express API
└── vercel.json # Deploys both as Vercel Services on one domain
```

## Getting started

### Prerequisites
- Node.js 20+
- A MongoDB connection string (e.g. MongoDB Atlas)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies API calls to `VITE_API_URL` (defaults to `/api/v1`, which works once both services run behind the same origin - see Deployment below).

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port for the local Express server (default `2525`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth JWTs |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `GEMINI_API_KEY` | Google Gemini API key (recipe extraction) |
| `OPENROUTER_API_KEY` | OpenRouter API key (recipe extraction fallback) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `CLOUD_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET` | Cloudinary credentials |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_FROM` | Sender address for outgoing email |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for API requests (defaults to `/api/v1`) |

## Deployment

This repo deploys as a single [Vercel Services](https://vercel.com/docs/services) project - the frontend and backend build separately but are served from one domain, which keeps auth cookies same-origin. See `vercel.json` at the repo root.

**Important:** In the Vercel project's Build & Deployment settings, the Framework Preset must be set to **Services** or the `services` config in `vercel.json` is ignored.

> **Note on video downloading:** the recipe-extraction pipeline shells out to `yt-dlp` to download source videos. Vercel's serverless functions have limited execution time and no persistent filesystem, which doesn't fit long video downloads well - see the project notes for options (a small always-on worker service, or a hosted video-download API) before relying on this in production.

## Scripts

| Location | Command | Description |
|---|---|---|
| `backend` | `npm run dev` | Run the API with nodemon |
| `backend` | `npm run build` | Compile TypeScript to `dist/` |
| `backend` | `npm start` | Run the compiled API |
| `frontend` | `npm run dev` | Run the Vite dev server |
| `frontend` | `npm run build` | Type-check and build for production |
| `frontend` | `npm run preview` | Preview the production build locally |

## License

ISC
