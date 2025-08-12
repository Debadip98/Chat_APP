# Chat App Ready (Minimal)

This is a minimal React + Vite project with Supabase Google OAuth (auth wiring present) and a simple echo chatbot.
A floating Google Maps button is included.

## Run locally
1. Install:
   npm install
2. Start dev server:
   npm run dev
3. Open http://localhost:3000

## Env
An .env.local file is included with keys. When deploying to Vercel, add the same values to Vercel's Environment Variables.
Variables used:
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_GOOGLE_CLIENT_ID
VITE_GOOGLE_CLIENT_SECRET
VITE_OPENROUTER_API_KEY (not used for echo bot but included)

## Notes
- This chatbot is a placeholder echo bot. You can later replace the Chat component to call OpenRouter or another AI API.
- Do NOT commit .env.local to a public repo.

## Deploy to Vercel (with OpenRouter AI)

- Connect this repo to Vercel via "Import Git Repository".
- In Vercel Project Settings → Environment Variables, add:
  - `OPENROUTER_API_KEY` = your OpenRouter key
- Deploy. The frontend is built with Vite, and the serverless proxy is available at `/api/openrouter`.
- The chat UI posts to `/api/openrouter` with model `openai/gpt-4o-mini`.

### Local testing of the API route
- The Vite dev server does not serve the `/api` function. To test the proxy locally, use `vercel dev` (requires `vercel` CLI) or deploy to Vercel.
